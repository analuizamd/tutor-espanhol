/**
 * Sessão de estudo: meta do dia, aula atual (vídeo → verificação → mini-aula → nova verificação),
 * dicas e cronômetro de foco. Fica na raiz do app para não se perder ao trocar de aba.
 * Toda a fala do tutor vem de src/services/tutorService.ts.
 *
 * Fluxo de cada pergunta depois do vídeo:
 *   1. verificar: pergunta principal (pode pedir dica a qualquer momento)
 *   2. acertou → próxima pergunta · errou → mini-aula (ensina com o trecho do vídeo)
 *   3. verificar de novo: variante da pergunta, para ver se aprendeu
 */
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

import { SESSION_STORAGE_KEY } from "@/config/app";
import { CONCEPTS, CONCEPT_BY_CODE, type ConceptCode } from "@/data/concepts";
import { LESSON_BY_CONCEPT, LESSON_BY_ID, type CheckItem, type CheckQuestion, type VideoLesson } from "@/data/videos";
import { isFocusActive } from "@/lib/focusTimer";
import {
  computeSessionCoins,
  eventForAnswer,
  GOAL_AREAS,
  selectNextConceptForGoal,
  updateConceptScore,
  type AnswerResult,
  type QuestionOutcome,
  type Scores,
  type StudyGoal,
} from "@/lib/studentModel";
import {
  getCheckIntro,
  getExplanation,
  getFeedback,
  getHint,
  getLessonIntro,
  type HintStep,
} from "@/services/tutorService";
import { useAppState } from "./AppState";

export interface TutorBubble {
  id: string;
  kind: "info" | "feedback" | "hint" | "explanation";
  text: string;
  language?: "pt" | "es";
  hintStep?: HintStep;
  delta?: number;
}

export type LessonPhase = "video" | "check" | "teach" | "done";

export interface LessonRun {
  id: string;
  conceptCode: ConceptCode;
  lessonId: string;
  phase: LessonPhase;
  /** A aula já foi feita antes (pode pular o vídeo). */
  replay: boolean;
  /** Na revisão, a principal e a variante trocam de lugar. */
  swap: boolean;
  qIndex: number;
  /** main = primeira verificação; retry = verificação depois da mini-aula. */
  attempt: "main" | "retry";
  hintStep: 0 | HintStep;
  /** Usou alguma ajuda (dica, explicação, legenda) nesta pergunta. */
  afterHint: boolean;
  /** Alternativas já marcadas erradas na pergunta atual. */
  eliminated: number[];
  /** A pergunta atual já foi resolvida (mostra "Continuar"). */
  resolved: boolean;
  lastPick: number | null;
  lastCorrect: boolean | null;
  outcomes: QuestionOutcome[];
  /** Pontos ganhos nesta aula. */
  gained: number;
}

export interface SessionSummary {
  gained: number;
  activeMs: number;
  coins: ReturnType<typeof computeSessionCoins>;
}

interface SessionData {
  status: "idle" | "goal" | "active" | "ended";
  goal: StudyGoal | null;
  lesson: LessonRun | null;
  bubbles: TutorBubble[];
  notice: string | null;
  gained: number;
  answered: number;
  activeMs: number;
  summary: SessionSummary | null;
}

function emptySession(): SessionData {
  return { status: "idle", goal: null, lesson: null, bubbles: [], notice: null, gained: 0, answered: 0, activeMs: 0, summary: null };
}

const FALLBACK_NOTICE = "Ainda não dá para estudar esse nível: vamos reforçar uma aula anterior primeiro.";

/** Pergunta que o aluno está vendo agora (principal ou variante). */
export function currentItem(run: LessonRun, question: CheckQuestion): CheckItem {
  const useRetry = (run.attempt === "retry") !== run.swap;
  return useRetry ? question.retry : question.main;
}

interface StudySessionValue {
  session: SessionData;
  lesson: VideoLesson | null;
  question: CheckQuestion | null;
  item: CheckItem | null;
  focusActive: boolean;
  lastDelta: { id: string; value: number } | null;
  open: () => void;
  chooseGoal: (goal: StudyGoal) => void;
  changeGoal: () => void;
  /** Começa uma aula específica (ex.: pelo mapa de Progresso). */
  startLesson: (code: ConceptCode) => void;
  finishVideo: () => void;
  confirmAnswer: (index: number) => void;
  startRetry: () => void;
  next: () => void;
  nextLesson: () => void;
  askHint: () => void;
  askExplanation: () => void;
  /** Consulta durante a verificação (legenda, tradução) conta como ajuda. */
  markHelpUsed: (what: string) => void;
  finish: () => void;
  closeSummary: () => void;
  notifyInteraction: () => void;
  setVideoPlaying: (playing: boolean) => void;
  setStudyVisible: (visible: boolean) => void;
}

const StudySessionContext = createContext<StudySessionValue | null>(null);

/** Aula de menor pontuação dentro da meta (quando tudo já foi dominado). */
function lowestScoreConcept(scores: Scores, goal: StudyGoal): ConceptCode {
  const areas = GOAL_AREAS[goal];
  const pool = areas ? CONCEPTS.filter((c) => areas.includes(c.area)) : CONCEPTS;
  return [...pool].sort((a, b) => scores[a.code] - scores[b.code])[0]?.code ?? "A1.1";
}

export function StudySessionProvider({ children }: { children: ReactNode }) {
  const { data, hydrated, setScores, completeLesson } = useAppState();
  const [session, setSession] = useState<SessionData>(emptySession);
  const [loaded, setLoaded] = useState(false);
  const [focusActive, setFocusActive] = useState(false);
  const [lastDelta, setLastDelta] = useState<{ id: string; value: number } | null>(null);

  const idCounter = useRef(0);
  const lastInteractionAt = useRef<number | null>(null);
  const lastActivityAt = useRef<number | null>(null);
  const videoPlaying = useRef(false);
  const pageVisible = useRef(true);
  const studyVisible = useRef(false);

  const newId = () => `b${Date.now().toString(36)}${(idCounter.current++).toString(36)}`;
  const bubble = (kind: TutorBubble["kind"], text: string, extra: Partial<TutorBubble> = {}): TutorBubble => ({ id: newId(), kind, text, ...extra });

  // ---------- Persistência ----------
  useEffect(() => {
    if (!hydrated) return;
    try {
      const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
      if (raw) {
        const parsed = { ...emptySession(), ...(JSON.parse(raw) as Partial<SessionData>) };
        // Aula salva que não existe mais (conteúdo mudou): volta para a escolha da meta.
        if (parsed.lesson && !LESSON_BY_ID[parsed.lesson.lessonId]) parsed.lesson = null;
        if (parsed.status === "active" && !parsed.lesson) parsed.status = "goal";
        setSession(parsed);
      }
    } catch {
      /* ignora */
    }
    setLoaded(true);
  }, [hydrated]);

  useEffect(() => {
    if (loaded) window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  }, [session, loaded]);

  // ---------- Cronômetro de foco ----------
  useEffect(() => {
    const onVisibility = () => {
      pageVisible.current = document.visibilityState === "visible";
    };
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const counting = session.status === "active" || session.status === "goal";
  useEffect(() => {
    if (!counting) {
      setFocusActive(false);
      return;
    }
    let lastTick = Date.now();
    const interval = window.setInterval(() => {
      const now = Date.now();
      const dt = Math.min(now - lastTick, 2000);
      lastTick = now;
      const active = isFocusActive({
        now,
        visible: pageVisible.current && studyVisible.current,
        lastInteractionAt: lastInteractionAt.current,
        lastActivityAt: lastActivityAt.current,
        videoPlaying: videoPlaying.current,
      });
      setFocusActive(active);
      if (active) setSession((s) => (s.status === "active" || s.status === "goal" ? { ...s, activeMs: s.activeMs + dt } : s));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [counting]);

  // ---------- Helpers ----------
  const run = session.lesson;
  const lesson = run ? LESSON_BY_ID[run.lessonId] ?? null : null;
  const question = run && lesson && (run.phase === "check" || run.phase === "teach") ? lesson.questions[run.qIndex] ?? null : null;
  const item = run && question ? currentItem(run, question) : null;

  /** Monta uma aula nova para a pontuação/meta atuais (ou para uma aula escolhida). */
  function buildRun(goal: StudyGoal, forced?: ConceptCode) {
    videoPlaying.current = false;
    const pick = forced ? { code: forced, fallback: false } : selectNextConceptForGoal(data.scores, goal);
    const code = pick.code ?? lowestScoreConcept(data.scores, goal);
    const concept = CONCEPT_BY_CODE[code];
    const l = LESSON_BY_CONCEPT[code];
    const runs = data.lessonRuns[code] ?? 0;
    const lessonRun: LessonRun = {
      id: newId(), conceptCode: code, lessonId: l.id, phase: "video", replay: runs > 0, swap: runs % 2 === 1,
      qIndex: 0, attempt: "main", hintStep: 0, afterHint: false, eliminated: [], resolved: false,
      lastPick: null, lastCorrect: null, outcomes: [], gained: 0,
    };
    lastActivityAt.current = Date.now();
    return { lessonRun, notice: pick.fallback ? FALLBACK_NOTICE : null, intro: bubble("info", getLessonIntro(concept, l, runs > 0)) };
  }

  function applyEvent(code: ConceptCode, result: AnswerResult, afterHelp: boolean) {
    const event = eventForAnswer(result, afterHelp);
    const { scores, delta } = event ? updateConceptScore(data.scores, code, event) : { scores: data.scores, delta: 0 };
    if (event) setScores(scores);
    setLastDelta({ id: newId(), value: delta });
    return { scores, delta };
  }

  function update(fn: (r: LessonRun) => Partial<LessonRun>, extraBubbles: TutorBubble[] = [], sessionPatch: Partial<SessionData> = {}) {
    setSession((s) =>
      s.lesson ? { ...s, ...sessionPatch, lesson: { ...s.lesson, ...fn(s.lesson) }, bubbles: [...s.bubbles, ...extraBubbles] } : s,
    );
  }

  const canAnswer = () => session.status === "active" && run && lesson && question && item && run.phase === "check" && !run.resolved;

  // ---------- Ações ----------
  function open() {
    lastInteractionAt.current = Date.now();
    lastActivityAt.current = Date.now();
    setSession({ ...emptySession(), status: "goal" });
  }

  function chooseGoal(goal: StudyGoal) {
    // Trocar a meta no meio da sessão mantém pontos e tempo e começa uma nova aula.
    const { lessonRun, notice, intro } = buildRun(goal);
    setSession((s) => ({ ...s, status: "active", goal, lesson: lessonRun, bubbles: [intro], notice }));
  }

  function startLesson(code: ConceptCode) {
    if (session.status === "ended") return; // primeiro guardar as moedas do resumo
    lastInteractionAt.current = Date.now();
    const { lessonRun, intro } = buildRun("auto", code);
    setSession((s) => ({
      ...(s.status === "active" || s.status === "goal" ? s : emptySession()),
      status: "active", goal: s.goal ?? "auto", lesson: lessonRun, bubbles: [intro], notice: null, summary: null,
    }));
  }

  function changeGoal() {
    setSession((s) => ({ ...s, status: "goal" }));
  }

  function finishVideo() {
    if (!run || run.phase !== "video") return;
    videoPlaying.current = false;
    lastActivityAt.current = Date.now();
    update(() => ({ phase: "check" }), [bubble("info", getCheckIntro())]);
  }

  function confirmAnswer(index: number) {
    if (!canAnswer() || !run || !lesson || !item) return;
    const code = run.conceptCode;
    const correct = index === item.correctIndex;
    const correctText = item.options[item.correctIndex] ?? "";
    const helped = run.afterHint || run.attempt === "retry";
    const { delta, scores } = applyEvent(code, correct ? "correta" : "errada", helped);
    const fb = getFeedback(correct, correctText, scores[code], run.attempt);
    const counters = { gained: session.gained + delta, answered: session.answered + 1 };
    const fbBubble = bubble("feedback", fb.text, { language: fb.language, delta });

    if (correct) {
      const outcome: QuestionOutcome = run.attempt === "retry" ? "ensinado" : run.afterHint ? "com_ajuda" : "primeira";
      update((r) => ({ resolved: true, lastPick: index, lastCorrect: true, outcomes: [...r.outcomes, outcome], gained: r.gained + delta }), [fbBubble], counters);
      return;
    }
    if (run.attempt === "main") {
      // Errou a primeira verificação → mini-aula.
      update((r) => ({ phase: "teach", lastPick: index, lastCorrect: false, eliminated: [...r.eliminated, index], gained: r.gained + delta }), [fbBubble], counters);
      return;
    }
    // Errou também depois da mini-aula → mostra a resposta e segue (o ponto volta na revisão).
    update(
      (r) => ({ resolved: true, lastPick: index, lastCorrect: false, eliminated: [...r.eliminated, index], outcomes: [...r.outcomes, "errou"], gained: r.gained + delta }),
      [fbBubble],
      counters,
    );
  }

  function startRetry() {
    if (!run || run.phase !== "teach") return;
    lastActivityAt.current = Date.now();
    setSession((s) =>
      s.lesson
        ? {
            ...s,
            lesson: { ...s.lesson, phase: "check", attempt: "retry", hintStep: 0, afterHint: true, eliminated: [], resolved: false, lastPick: null, lastCorrect: null },
            bubbles: [bubble("info", "Agora tente esta parecida, para ver se ficou claro.")],
          }
        : s,
    );
  }

  /** Continua: próxima pergunta ou resumo da aula. */
  function next() {
    if (session.status !== "active" || !run || !lesson || run.phase !== "check" || !run.resolved) return;
    lastActivityAt.current = Date.now();
    if (run.qIndex + 1 < lesson.questions.length) {
      setSession((s) =>
        s.lesson
          ? {
              ...s,
              lesson: { ...s.lesson, qIndex: s.lesson.qIndex + 1, attempt: "main", hintStep: 0, afterHint: false, eliminated: [], resolved: false, lastPick: null, lastCorrect: null },
              bubbles: [],
            }
          : s,
      );
      return;
    }
    completeLesson(run.conceptCode);
    setSession((s) => (s.lesson ? { ...s, lesson: { ...s.lesson, phase: "done" }, bubbles: [] } : s));
  }

  function nextLesson() {
    if (session.status !== "active" || !run || run.phase !== "done") return;
    const goal = session.goal ?? "auto";
    const { lessonRun, notice, intro } = buildRun(goal);
    const same = lessonRun.conceptCode === run.conceptCode;
    const c = CONCEPT_BY_CODE[lessonRun.conceptCode];
    setSession((s) => ({
      ...s,
      lesson: lessonRun,
      notice,
      bubbles: [bubble("info", same ? `Vamos fixar melhor: ${c.name}. As perguntas agora são outras.` : `Nova aula: ${c.code} · ${c.name}.`), intro],
    }));
  }

  function askHint() {
    if (!canAnswer() || !run || !lesson || !question || !item) return;
    if (run.hintStep >= 4) return;
    const step = (run.hintStep + 1) as HintStep;
    const concept = CONCEPT_BY_CODE[run.conceptCode];
    const hint = getHint(step, item, question, lesson, concept, data.scores[run.conceptCode]);
    update(() => ({ hintStep: step, afterHint: true }), [bubble("hint", hint.text, { language: hint.language, hintStep: step, delta: 0 })]);
  }

  function askExplanation() {
    if (session.status !== "active" || !run) return;
    const concept = CONCEPT_BY_CODE[run.conceptCode];
    const exp = getExplanation(concept, data.scores[concept.code]);
    const counts = run.phase === "check" && !run.resolved;
    update(() => (counts ? { afterHint: true } : {}), [bubble("explanation", exp.text, { language: exp.language, ...(counts ? { delta: 0 } : {}) })]);
  }

  function markHelpUsed(what: string) {
    if (session.status !== "active" || !run || run.phase !== "check" || run.resolved || run.afterHint) return;
    update(() => ({ afterHint: true }), [bubble("info", `${what} conta como ajuda: a próxima resposta vale como «com ajuda».`, { delta: 0 })]);
  }

  function finish() {
    if (session.status !== "active" && session.status !== "goal") return;
    const coins = computeSessionCoins(Math.max(0, session.gained), session.activeMs);
    videoPlaying.current = false;
    setSession((s) => ({ ...s, status: "ended", summary: { gained: s.gained, activeMs: s.activeMs, coins } }));
  }

  function closeSummary() {
    setSession(emptySession());
    setLastDelta(null);
  }

  const value: StudySessionValue = {
    session, lesson, question, item, focusActive, lastDelta,
    open, chooseGoal, changeGoal, startLesson, finishVideo, confirmAnswer, startRetry, next, nextLesson,
    askHint, askExplanation, markHelpUsed, finish, closeSummary,
    notifyInteraction: () => {
      lastInteractionAt.current = Date.now();
    },
    setVideoPlaying: (p) => {
      videoPlaying.current = p;
    },
    setStudyVisible: (v) => {
      studyVisible.current = v;
    },
  };

  return <StudySessionContext.Provider value={value}>{children}</StudySessionContext.Provider>;
}

export function useStudySession() {
  const ctx = useContext(StudySessionContext);
  if (!ctx) throw new Error("useStudySession must be used inside StudySessionProvider");
  return ctx;
}
