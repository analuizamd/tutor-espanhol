/**
 * Sessão de estudo: meta do dia, atividade atual (cartões, vídeo ou missão), questões,
 * dicas e cronômetro de foco. Fica na raiz do app para não se perder ao trocar de aba.
 * Toda a fala do tutor vem de src/services/tutorService.ts.
 */
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

import { SESSION_STORAGE_KEY } from "@/config/app";
import { CONCEPTS, CONCEPT_BY_CODE, type ConceptCode } from "@/data/concepts";
import { SLANG_DIALOGUES, dialogueFor } from "@/data/dialogues";
import type { EnemQuestion, Mission } from "@/data/enem";
import { MISSIONS, missionFor } from "@/data/missions";
import { DIALOGUE_BY_ID, QUESTION_BY_ID } from "@/data/questionBank";
import { vocabQuestionsFor } from "@/data/questions";
import { isFocusActive } from "@/lib/focusTimer";
import {
  chooseActivity,
  computeSessionCoins,
  eventForAnswer,
  GOAL_AREAS,
  selectNextConceptForGoal,
  updateConceptScore,
  type ActivityKind,
  type MissionResult,
  type Scores,
  type StudyGoal,
} from "@/lib/studentModel";
import {
  classifyAnswer,
  getActivityIntro,
  getExplanation,
  getFeedback,
  getHint,
  getMissionHint,
  getMissionLines,
  type HintStep,
} from "@/services/tutorService";
import { isExtraPhaseUnlocked } from "@/lib/studentModel";
import type { Country } from "@/data/slang";
import { useAppState } from "./AppState";

export interface TutorBubble {
  id: string;
  kind: "info" | "feedback" | "hint" | "explanation";
  text: string;
  language?: "pt" | "es";
  hintStep?: HintStep;
  delta?: number;
}

export interface Activity {
  id: string;
  kind: ActivityKind;
  conceptCode: ConceptCode;
  /** learn = cartões ou vídeo; questions = questões; mission = missão em passos. */
  phase: "learn" | "questions" | "mission";
  dialogueId: string | null;
  missionId: string | null;
  questionIds: string[];
  qIndex: number;
  hintStep: 0 | HintStep;
  afterHint: boolean;
  /** Alternativas já marcadas erradas no item atual. */
  eliminated: number[];
  /** O item atual já foi resolvido (mostra "Continuar"). */
  resolved: boolean;
  lastPick: number | null;
  lastCorrect: boolean | null;
  missionStep: number;
  missionFirstTry: boolean[];
  missionResult: MissionResult | null;
}

export interface SessionSummary {
  gained: number;
  activeMs: number;
  coins: ReturnType<typeof computeSessionCoins>;
}

interface SessionData {
  status: "idle" | "goal" | "active" | "ended";
  goal: StudyGoal | null;
  activity: Activity | null;
  bubbles: TutorBubble[];
  notice: string | null;
  round: number;
  gained: number;
  answered: number;
  activeMs: number;
  summary: SessionSummary | null;
}

function emptySession(): SessionData {
  return { status: "idle", goal: null, activity: null, bubbles: [], notice: null, round: 0, gained: 0, answered: 0, activeMs: 0, summary: null };
}

const FALLBACK_NOTICE = "Ainda não dá para estudar isso, vamos reforçar outra base primeiro.";

interface StudySessionValue {
  session: SessionData;
  question: EnemQuestion | null;
  mission: Mission | null;
  focusActive: boolean;
  lastDelta: { id: string; value: number } | null;
  open: () => void;
  chooseGoal: (goal: StudyGoal) => void;
  changeGoal: () => void;
  startExtra: (country: Country) => void;
  goToQuestions: () => void;
  confirmAnswer: (index: number) => void;
  pickMissionLine: (index: number) => void;
  next: () => void;
  askHint: () => void;
  askExplanation: () => void;
  /** Consulta durante as questões (reabrir cartões, traduzir legenda) conta como ajuda. */
  markHelpUsed: (what: string) => void;
  finish: () => void;
  closeSummary: () => void;
  notifyInteraction: () => void;
  setVideoPlaying: (playing: boolean) => void;
  setStudyVisible: (visible: boolean) => void;
}

const StudySessionContext = createContext<StudySessionValue | null>(null);

/** Conceito de menor pontuação dentro da meta (quando tudo já foi dominado). */
function lowestScoreConcept(scores: Scores, goal: StudyGoal): ConceptCode {
  const areas = GOAL_AREAS[goal];
  const pool = areas ? CONCEPTS.filter((c) => areas.includes(c.area)) : CONCEPTS;
  return [...pool].sort((a, b) => scores[a.code] - scores[b.code])[0]?.code ?? "V1";
}

export function StudySessionProvider({ children }: { children: ReactNode }) {
  const { data, hydrated, setScores } = useAppState();
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
      if (raw) setSession({ ...emptySession(), ...(JSON.parse(raw) as Partial<SessionData>) });
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
  const activity = session.activity;
  const question =
    activity && activity.phase === "questions" ? QUESTION_BY_ID[activity.questionIds[activity.qIndex] ?? ""] ?? null : null;
  const mission = activity?.missionId ? MISSIONS.find((m) => m.id === activity.missionId) ?? null : null;

  /** Monta a próxima atividade a partir das pontuações e da meta. */
  function buildActivity(scores: Scores, goal: StudyGoal, round: number) {
    videoPlaying.current = false;
    const pick = selectNextConceptForGoal(scores, goal);
    const code = pick.code ?? lowestScoreConcept(scores, goal);
    const concept = CONCEPT_BY_CODE[code];
    const kind = chooseActivity(concept);
    let act: Activity = {
      id: newId(), kind, conceptCode: code, phase: "learn", dialogueId: null, missionId: null, questionIds: [], qIndex: 0,
      hintStep: 0, afterHint: false, eliminated: [], resolved: false, lastPick: null, lastCorrect: null,
      missionStep: 0, missionFirstTry: [], missionResult: null,
    };
    if (kind === "flashcards") act = { ...act, questionIds: vocabQuestionsFor(code).map((q) => q.id) };
    if (kind === "video") {
      const d = dialogueFor(code, round);
      act = { ...act, dialogueId: d.id, questionIds: d.questions.map((q) => q.id) };
    }
    if (kind === "mission") act = { ...act, phase: "mission", missionId: missionFor(code, round).id };
    lastActivityAt.current = Date.now();
    const notice = pick.fallback ? FALLBACK_NOTICE : null;
    return { act, notice, intro: bubble("info", getActivityIntro(concept, kind)) };
  }

  function applyEvent(code: ConceptCode, result: MissionResult, afterHint: boolean) {
    const event = eventForAnswer(result, afterHint);
    const { scores, delta } = event ? updateConceptScore(data.scores, code, event) : { scores: data.scores, delta: 0 };
    if (event) setScores(scores);
    setLastDelta({ id: newId(), value: delta });
    return { scores, delta };
  }

  function update(fn: (a: Activity) => Partial<Activity>, extraBubbles: TutorBubble[] = [], sessionPatch: Partial<SessionData> = {}) {
    setSession((s) =>
      s.activity ? { ...s, ...sessionPatch, activity: { ...s.activity, ...fn(s.activity) }, bubbles: [...s.bubbles, ...extraBubbles] } : s,
    );
  }

  // ---------- Ações ----------
  function open() {
    lastInteractionAt.current = Date.now();
    lastActivityAt.current = Date.now();
    setSession({ ...emptySession(), status: "goal" });
  }

  function chooseGoal(goal: StudyGoal) {
    // Trocar a meta no meio da sessão mantém pontos e tempo e começa uma nova atividade.
    const { act, notice, intro } = buildActivity(data.scores, goal, session.round);
    setSession((s) => ({ ...s, status: "active", goal, activity: act, bubbles: [intro], notice, round: s.round + 1 }));
  }

  function startExtra(country: Country) {
    if (!isExtraPhaseUnlocked(data.scores)) return;
    const d = SLANG_DIALOGUES[country];
    const { act, intro } = buildActivity(data.scores, "variedades", session.round);
    setSession((s) => ({ ...s, status: "active", goal: "variedades", notice: null,
      activity: { ...act, conceptCode: "C2", kind: "video", phase: "learn", dialogueId: d.id, missionId: null, questionIds: d.questions.map((q) => q.id) },
      bubbles: [intro], round: s.round + 1 }));
  }

  function changeGoal() {
    setSession((s) => ({ ...s, status: "goal" }));
  }

  function goToQuestions() {
    if (!activity || activity.phase !== "learn") return;
    lastActivityAt.current = Date.now();
    update(() => ({ phase: "questions" }), [bubble("info", "Agora, as questões! Consultar os cartões ou a legenda a partir daqui conta como ajuda.")]);
  }

  function confirmAnswer(index: number) {
    if (session.status !== "active" || !activity || !question || activity.resolved) return;
    const code = activity.conceptCode;
    const correct = index === question.correctIndex;
    const correctText = question.options[question.correctIndex];
    const score = data.scores[code];
    if (correct) {
      const { delta, scores } = applyEvent(code, "correta", activity.afterHint);
      const fb = getFeedback("correta", correctText, scores[code]);
      update(
        () => ({ resolved: true, lastPick: index, lastCorrect: true }),
        [bubble("feedback", fb.text, { language: fb.language, delta })],
        { gained: session.gained + delta, answered: session.answered + 1 },
      );
      return;
    }
    const { delta, scores } = applyEvent(code, "errada", activity.afterHint);
    const patch = { gained: session.gained + delta, answered: session.answered + 1 };
    if (activity.hintStep >= 4) {
      const fb = getFeedback("errada", correctText, scores[code]);
      update(() => ({ resolved: true, lastPick: index, lastCorrect: false, eliminated: [...activity.eliminated, index] }), [
        bubble("feedback", fb.text, { language: fb.language, delta }),
      ], patch);
      return;
    }
    const step = (activity.hintStep + 1) as HintStep;
    const hint = getHint(step, question, code, score);
    update(
      () => ({ hintStep: step, afterHint: true, lastPick: index, lastCorrect: false, eliminated: [...activity.eliminated, index] }),
      [
        bubble("feedback", score >= 70 ? "No es correcto. Inténtalo otra vez." : "Ainda não é essa. Tente de novo com esta dica:", { delta }),
        bubble("hint", hint.text, { language: hint.language, hintStep: step }),
      ],
      patch,
    );
  }

  function pickMissionLine(index: number) {
    if (session.status !== "active" || !activity || !mission || activity.missionResult) return;
    const steps = getMissionLines(mission);
    const step = steps[activity.missionStep];
    if (!step) return;
    if (index !== step.correctIndex) {
      update(() => ({ eliminated: [...activity.eliminated, index], afterHint: true, lastPick: index, lastCorrect: false }), [
        bubble("feedback", `Essa fala não combina. ${step.tipPt}`),
      ]);
      return;
    }
    const firstTry = activity.eliminated.length === 0;
    const results = [...activity.missionFirstTry, firstTry];
    const isLast = activity.missionStep + 1 >= steps.length;
    if (!isLast) {
      update(() => ({ missionFirstTry: results, missionStep: activity.missionStep + 1, eliminated: [], hintStep: 0, lastPick: null, lastCorrect: null }));
      return;
    }
    const result = classifyAnswer(results);
    const code = activity.conceptCode;
    const { delta, scores } = applyEvent(code, result, activity.afterHint);
    const fb = getFeedback(result, step.options[step.correctIndex], scores[code]);
    const okCount = results.filter(Boolean).length;
    update(
      () => ({ missionFirstTry: results, missionResult: result, resolved: true, lastPick: index, lastCorrect: true }),
      [bubble("feedback", `${fb.text} Você acertou ${okCount} de ${results.length} passos de primeira.`, { language: fb.language, delta })],
      { gained: session.gained + delta, answered: session.answered + 1 },
    );
  }

  /** Continua: próxima questão ou próxima atividade. */
  function next() {
    if (session.status !== "active" || !activity || !activity.resolved) return;
    if (activity.phase === "questions" && activity.qIndex + 1 < activity.questionIds.length) {
      update(() => ({ qIndex: activity.qIndex + 1, hintStep: 0, afterHint: false, eliminated: [], resolved: false, lastPick: null, lastCorrect: null }), [], {
        bubbles: [],
      });
      setSession((s) => ({ ...s, bubbles: [] }));
      return;
    }
    lastActivityAt.current = Date.now();
    const goal = session.goal ?? "auto";
    const { act, notice, intro } = buildActivity(data.scores, goal, session.round);
    const changed = act.conceptCode !== activity.conceptCode;
    const c = CONCEPT_BY_CODE[act.conceptCode];
    setSession((s) => ({
      ...s,
      activity: act,
      notice,
      round: s.round + 1,
      bubbles: [bubble("info", changed ? `Novo conceito: ${c.code} · ${c.name}.` : `Vamos reforçar: ${c.name}.`), intro],
    }));
  }

  function askHint() {
    if (session.status !== "active" || !activity || activity.resolved) return;
    const code = activity.conceptCode;
    if (activity.hintStep >= 4) return;
    const step = (activity.hintStep + 1) as HintStep;
    if (activity.phase === "questions" && question) {
      const hint = getHint(step, question, code, data.scores[code]);
      update(() => ({ hintStep: step, afterHint: true }), [bubble("hint", hint.text, { language: hint.language, hintStep: step, delta: 0 })]);
    } else if (activity.phase === "mission" && mission) {
      const ms = getMissionLines(mission)[activity.missionStep];
      if (!ms) return;
      const hint = getMissionHint(step, ms, code, data.scores[code]);
      update(() => ({ hintStep: step, afterHint: true }), [bubble("hint", hint.text, { language: hint.language, hintStep: step, delta: 0 })]);
    }
  }

  function askExplanation() {
    if (session.status !== "active" || !activity) return;
    const concept = CONCEPT_BY_CODE[activity.conceptCode];
    const exp = getExplanation(concept, data.scores[concept.code]);
    const counts = activity.phase !== "learn" && !activity.resolved;
    update(() => (counts ? { afterHint: true } : {}), [bubble("explanation", exp.text, { language: exp.language, ...(counts ? { delta: 0 } : {}) })]);
  }

  function markHelpUsed(what: string) {
    if (session.status !== "active" || !activity || activity.phase === "learn" || activity.resolved) return;
    if (activity.afterHint) return;
    update(() => ({ afterHint: true }), [bubble("info", `${what} conta como ajuda: a próxima resposta vale como “após dica”.`, { delta: 0 })]);
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
    session, question, mission, focusActive, lastDelta,
    open, chooseGoal, changeGoal, startExtra, goToQuestions, confirmAnswer, pickMissionLine, next, askHint, askExplanation, markHelpUsed,
    finish, closeSummary,
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

export { DIALOGUE_BY_ID };
