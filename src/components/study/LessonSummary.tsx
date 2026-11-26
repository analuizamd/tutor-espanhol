/** Resumo da aula: o que o aluno aprendeu, como foi em cada pergunta e o que revisar. */
import { ArrowRight, Check, Lightbulb, PlayCircle, RotateCcw, Sparkles, TriangleAlert } from "lucide-react";
import { useState } from "react";

import { ScoreBar } from "@/components/app/LevelIcon";
import { Button } from "@/components/ui/button";
import type { Concept } from "@/data/concepts";
import type { VideoLesson } from "@/data/videos";
import { lessonLearned, OUTCOME_LABEL, type QuestionOutcome } from "@/lib/studentModel";
import { cn } from "@/lib/utils";
import type { LessonRun } from "@/state/StudySession";
import { formatDelta } from "./ScoreChip";
import { VideoPlayer } from "./VideoPlayer";

const OUTCOME_ICON: Record<QuestionOutcome, { icon: typeof Check; cls: string }> = {
  primeira: { icon: Check, cls: "bg-success-soft text-success" },
  com_ajuda: { icon: Lightbulb, cls: "bg-coin-soft text-coin-foreground" },
  ensinado: { icon: RotateCcw, cls: "bg-ocean-soft text-ocean" },
  errou: { icon: TriangleAlert, cls: "bg-primary-soft text-destructive" },
};

export function LessonSummary({
  lesson,
  concept,
  run,
  score,
  onNext,
}: {
  lesson: VideoLesson;
  concept: Concept;
  run: LessonRun;
  score: number;
  onNext: () => void;
}) {
  const [rewatch, setRewatch] = useState(false);
  const learned = lessonLearned(run.outcomes);
  const toReview = lesson.questions.filter((_, i) => run.outcomes[i] === "errou");
  return (
    <section className="animate-pop-in flex flex-col gap-5">
      <div className="rounded-2xl bg-ocean p-5 text-ocean-foreground shadow-card">
        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider opacity-80">
          <Sparkles className="size-4" /> Aula concluída
        </p>
        <h2 className="mt-1 font-display text-2xl font-extrabold">{learned ? "¡Muy bien! Você aprendeu:" : "Bom trabalho! Hoje você viu:"}</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {lesson.teaches.map((t) => (
            <li key={t.es} className="rounded-xl bg-white/10 px-3 py-2">
              <p lang="es" className="font-semibold">{t.es}</p>
              <p className="text-xs opacity-80">{t.pt}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold">{concept.code} · {concept.name}</span>
          <span className="font-display font-bold tabular-nums">{formatDelta(run.gained)} pts</span>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <ScoreBar score={score} />
          <span className="font-display text-sm font-bold tabular-nums">{score}/100</span>
        </div>
        <ul className="mt-4 flex flex-col gap-2">
          {lesson.questions.map((q, i) => {
            const o = run.outcomes[i];
            if (!o) return null;
            const { icon: Icon, cls } = OUTCOME_ICON[o];
            return (
              <li key={q.id} className="flex items-center gap-2 text-sm">
                <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-full", cls)}>
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0 flex-1 truncate" lang="es">{(run.swap ? q.retry : q.main).prompt}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{OUTCOME_LABEL[o]}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {toReview.length > 0 && (
        <div className="rounded-2xl border-2 border-dashed border-primary/40 bg-primary-soft/50 p-4">
          <p className="text-sm font-bold">Para revisar</p>
          {toReview.map((q) => (
            <p key={q.id} className="mt-2 text-sm leading-relaxed">{q.teachPt}</p>
          ))}
          <p className="mt-2 text-xs text-muted-foreground">Essa aula volta para você com perguntas novas até ficar firme.</p>
        </div>
      )}

      {rewatch ? (
        <VideoPlayer lesson={lesson} />
      ) : (
        <Button variant="outline" onClick={() => setRewatch(true)}>
          <PlayCircle /> Rever o vídeo
        </Button>
      )}

      <Button variant="hero" size="xl" className="w-full" onClick={onNext}>
        Próxima aula <ArrowRight />
      </Button>
    </section>
  );
}
