import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, BookOpenText, CheckCircle2, Flag, GraduationCap, Lightbulb, Pencil, PlayCircle, Target, Timer, X } from "lucide-react";
import { useEffect, useState } from "react";

import { CheckQuestion } from "@/components/study/CheckQuestion";
import { Transcript } from "@/components/study/ClickableLine";
import { ConceptBadge } from "@/components/study/ConceptBadge";
import { LessonSummary } from "@/components/study/LessonSummary";
import { MiniLesson } from "@/components/study/MiniLesson";
import { SessionEndModal } from "@/components/study/SessionEndModal";
import { TutorBubbles } from "@/components/study/TutorBubbles";
import { VideoPlayer } from "@/components/study/VideoPlayer";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/config/app";
import { CONCEPT_BY_CODE } from "@/data/concepts";
import { formatMmSs } from "@/lib/focusTimer";
import { dayKey } from "@/lib/stats";
import { DAILY_POINTS_GOAL, GOAL_LABEL, type StudyGoal } from "@/lib/studentModel";
import { cn } from "@/lib/utils";
import { useAppState } from "@/state/AppState";
import { useStudySession, type LessonPhase } from "@/state/StudySession";

const DESCRIPTION = "Aprenda espanhol A1 e A2 com vídeos de conversa, legendas clicáveis e mini-aulas quando você erra.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `Espanhol A1 e A2 · ${APP_NAME}` },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: `Espanhol A1 e A2 · ${APP_NAME}` },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StudyPage,
});

const STEPS: { phase: LessonPhase[]; label: string }[] = [
  { phase: ["video"], label: "Vídeo" },
  { phase: ["check", "teach"], label: "Verificação" },
  { phase: ["done"], label: "Resumo" },
];

function StudyPage() {
  const { data, addCoins, recordStudy } = useAppState();
  const s = useStudySession();
  const { session, lesson, question, item } = s;
  const run = session.lesson;
  const [transcript, setTranscript] = useState(false);
  const [watched, setWatched] = useState(false);

  useEffect(() => {
    s.setStudyVisible(true);
    return () => s.setStudyVisible(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => setTranscript(false), [run?.id, run?.qIndex, run?.attempt]);
  useEffect(() => setWatched(false), [run?.id]);

  const today = (data.dailyGains[dayKey()] ?? 0) + session.gained;
  const concept = run ? CONCEPT_BY_CODE[run.conceptCode] : null;
  const closeSummary = () => {
    if (session.summary) {
      addCoins(session.summary.coins.total);
      if (session.answered > 0) recordStudy(session.summary.gained);
    }
    s.closeSummary();
  };
  const helpWord = () => s.markHelpUsed("Traduzir palavras");

  return (
    <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6" onPointerDown={s.notifyInteraction} onKeyDown={s.notifyInteraction}>
      {session.status === "idle" ? (
        <Welcome points={today} onStart={s.open} />
      ) : (
        <>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
            <span className="flex items-center gap-2 text-sm">
              <Timer className="size-4" />
              <span className="tabular-nums">{formatMmSs(session.activeMs)}</span>
              <span className={s.focusActive ? "text-success" : "text-muted-foreground"}>{s.focusActive ? "Foco ativo" : "Pausado"}</span>
            </span>
            <Button variant="outline" size="sm" disabled={session.status === "ended"} onClick={s.finish}>
              <Flag /> Finalizar
            </Button>
          </div>
          <DailyGoal points={today} />

          {session.status === "goal" ? (
            <div className="py-6">
              <p className="text-xs font-bold text-primary">Meta do dia</p>
              <h1 className="mt-2 text-2xl font-bold">O que você quer estudar hoje?</h1>
              <div className="mt-5 grid gap-3">
                {(Object.keys(GOAL_LABEL) as StudyGoal[]).map((g) => (
                  <Button variant="outline" key={g} className="h-auto min-h-16 justify-between whitespace-normal rounded-xl px-5 text-left text-base" onClick={() => s.chooseGoal(g)}>
                    {GOAL_LABEL[g]} <ArrowRight />
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            run &&
            lesson &&
            concept && (
              <>
                <div className="my-4 flex flex-wrap items-center justify-between gap-2">
                  <Button variant="soft" size="sm" onClick={s.changeGoal}>
                    <Target />
                    {GOAL_LABEL[session.goal ?? "auto"]}
                    <Pencil className="size-3" />
                  </Button>
                  <Stepper phase={run.phase} />
                </div>
                {session.notice && (
                  <p className="mb-4 rounded-xl bg-warning-soft p-3 text-sm text-warning" role="status">
                    {session.notice}
                  </p>
                )}
                <ConceptBadge concept={concept} score={data.scores[concept.code]} lastDelta={s.lastDelta} />
                <h1 lang="es" className="mt-5 font-display text-2xl font-extrabold">{lesson.title}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{lesson.goalPt}</p>

                <div className="mt-5 space-y-5">
                  {run.phase === "video" && (
                    <>
                      <VideoPlayer key={run.id} lesson={lesson} onPlayingChange={s.setVideoPlaying} onWatched={() => setWatched(true)} />
                      <WatchGate replay={run.replay} watched={watched} onContinue={s.finishVideo} lessonId={run.id} />
                    </>
                  )}

                  {run.phase === "check" && question && item && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (!transcript) s.markHelpUsed("Consultar a legenda");
                          setTranscript(!transcript);
                        }}
                      >
                        {transcript ? <X /> : <BookOpenText />}
                        {transcript ? "Fechar legenda" : "Consultar a legenda do vídeo"}
                      </Button>
                      {transcript && (
                        <div className="rounded-2xl border border-border bg-card p-3">
                          <Transcript lines={lesson.lines} onWordOpen={helpWord} />
                        </div>
                      )}
                      <CheckQuestion
                        key={`${run.id}-${run.qIndex}-${run.attempt}`}
                        question={question}
                        item={item}
                        run={run}
                        total={lesson.questions.length}
                        onConfirm={s.confirmAnswer}
                        onNext={s.next}
                      />
                    </>
                  )}

                  {run.phase === "teach" && question && item && (
                    <MiniLesson lesson={lesson} question={question} item={item} run={run} onRetry={s.startRetry} />
                  )}

                  {run.phase === "done" && (
                    <LessonSummary lesson={lesson} concept={concept} run={run} score={data.scores[concept.code]} onNext={s.nextLesson} />
                  )}

                  {run.phase !== "done" && (
                    <div className="flex flex-wrap gap-2">
                      {run.phase === "check" && (
                        <Button variant="tile" disabled={run.resolved || run.hintStep >= 4} onClick={s.askHint}>
                          <Lightbulb />
                          Pedir dica {run.hintStep > 0 && `(${run.hintStep}/4)`}
                        </Button>
                      )}
                      <Button variant="tile" onClick={s.askExplanation}>
                        <BookOpenText />
                        Pedir explicação
                      </Button>
                    </div>
                  )}
                  <TutorBubbles bubbles={session.bubbles.slice(-5)} />
                </div>
              </>
            )
          )}
          <SessionEndModal summary={session.status === "ended" ? session.summary : null} onClose={closeSummary} />
        </>
      )}
    </div>
  );
}

/** "Ir para a verificação": liberado depois de assistir (ou na revisão de uma aula já feita). */
function WatchGate({ replay, watched, onContinue, lessonId }: { replay: boolean; watched: boolean; onContinue: () => void; lessonId: string }) {
  const [timeUp, setTimeUp] = useState(false);
  useEffect(() => {
    setTimeUp(false);
    // Libera depois de 20 s mesmo sem terminar (o aluno pode já ter entendido).
    const t = window.setTimeout(() => setTimeUp(true), 20_000);
    return () => window.clearTimeout(t);
  }, [lessonId]);
  const unlocked = replay || watched || timeUp;
  return (
    <div>
      <Button variant="hero" size="xl" className="w-full" disabled={!unlocked} onClick={onContinue}>
        <CheckCircle2 /> {replay ? "Ir direto para a verificação" : "Já assisti — verificar o que aprendi"}
      </Button>
      {!unlocked && <p className="mt-2 text-center text-xs text-muted-foreground">Assista ao vídeo primeiro. Toque nas palavras da legenda que você não conhece.</p>}
    </div>
  );
}

function Stepper({ phase }: { phase: LessonPhase }) {
  const current = STEPS.findIndex((st) => st.phase.includes(phase));
  return (
    <ol className="flex items-center gap-1 text-[0.7rem] font-semibold">
      {STEPS.map((st, i) => (
        <li key={st.label} className="flex items-center gap-1">
          <span className={cn("rounded-full px-2 py-0.5", i === current ? "bg-ocean text-ocean-foreground" : i < current ? "bg-success-soft text-success" : "bg-muted text-muted-foreground")}>
            {st.label}
          </span>
          {i < STEPS.length - 1 && <span className="text-muted-foreground">›</span>}
        </li>
      ))}
    </ol>
  );
}

function Welcome({ points, onStart }: { points: number; onStart: () => void }) {
  const steps = [
    { icon: PlayCircle, title: "Assista", text: "Um vídeo curto de conversa. Toque em qualquer palavra da legenda para ver o que significa." },
    { icon: CheckCircle2, title: "Verifique", text: "Três perguntas rápidas para ver o que você entendeu." },
    { icon: GraduationCap, title: "Aprenda", text: "Errou? Uma mini-aula explica com o trecho do vídeo e você tenta de novo." },
  ];
  return (
    <div className="py-6">
      <GraduationCap className="size-12 text-ocean" />
      <h1 className="mt-4 text-3xl font-extrabold">Espanhol A1 e A2</h1>
      <p className="mt-1 text-muted-foreground">Aprenda com conversas de verdade entre pessoas da Espanha, do México, da Argentina e do Uruguai.</p>
      <div className="mt-6">
        <DailyGoal points={points} />
      </div>
      <ol className="mt-6 grid gap-3 sm:grid-cols-3">
        {steps.map(({ icon: Icon, title, text }, i) => (
          <li key={title} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <span className="flex items-center gap-2 font-display font-bold">
              <Icon className="size-5 text-primary" /> {i + 1}. {title}
            </span>
            <p className="mt-1 text-sm text-muted-foreground">{text}</p>
          </li>
        ))}
      </ol>
      <Button variant="hero" size="xl" className="mt-6 w-full sm:w-auto" onClick={onStart}>
        Iniciar estudo <ArrowRight />
      </Button>
    </div>
  );
}

function DailyGoal({ points }: { points: number }) {
  const progress = Math.max(0, Math.min(points, DAILY_POINTS_GOAL));
  return (
    <div>
      <div className="mb-2 flex justify-between text-xs font-semibold">
        <span>Meta do dia · {DAILY_POINTS_GOAL} pontos</span>
        <span>
          {Math.max(0, points)} / {DAILY_POINTS_GOAL}
        </span>
      </div>
      <div role="progressbar" aria-label="Meta do dia" aria-valuemin={0} aria-valuemax={DAILY_POINTS_GOAL} aria-valuenow={progress} className="h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-olive transition-all" style={{ width: `${(progress / DAILY_POINTS_GOAL) * 100}%` }} />
      </div>
    </div>
  );
}
