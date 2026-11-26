/** Pergunta de verificação depois do vídeo (principal ou variante depois da mini-aula). */
import { ArrowRight, Check, RotateCcw, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { CHECK_KIND_LABEL, type CheckItem, type CheckQuestion as Question } from "@/data/videos";
import { cn } from "@/lib/utils";
import { LETTERS } from "@/services/tutorService";
import type { LessonRun } from "@/state/StudySession";

export function CheckQuestion({
  question,
  item,
  run,
  total,
  onConfirm,
  onNext,
}: {
  question: Question;
  item: CheckItem;
  run: LessonRun;
  total: number;
  onConfirm: (i: number) => void;
  onNext: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const retry = run.attempt === "retry";
  return (
    <section className={cn("rounded-2xl border-2 bg-card p-4 shadow-soft sm:p-5", retry ? "border-ocean/40" : "border-border")}>
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-muted-foreground">
        <span>Pergunta {run.qIndex + 1} de {total}</span>
        <span className="rounded-full bg-secondary px-2 py-0.5">{CHECK_KIND_LABEL[question.kind]}</span>
        {retry && (
          <span className="inline-flex items-center gap-1 rounded-full bg-ocean-soft px-2 py-0.5 text-ocean">
            <RotateCcw className="size-3" /> Nova verificação
          </span>
        )}
      </div>
      <h2 lang="es" className="text-xl font-bold leading-snug">{item.prompt}</h2>
      <div className="mt-4 flex flex-col gap-2" role="radiogroup" aria-label="Alternativas">
        {item.options.map((opt, i) => {
          const wrong = run.eliminated.includes(i);
          const correct = (run.resolved || run.hintStep === 4) && i === item.correctIndex;
          return (
            <Button
              key={i}
              variant="outline"
              role="radio"
              aria-checked={selected === i}
              disabled={run.resolved || wrong}
              onClick={() => setSelected(i)}
              className={cn(
                "h-auto min-h-12 justify-start gap-3 whitespace-normal rounded-xl border-2 px-3 py-3 text-left text-base font-medium",
                selected === i && "border-primary bg-primary-soft",
                correct && "border-success bg-success-soft text-success",
                wrong && "border-destructive bg-primary-soft text-destructive opacity-80",
              )}
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary font-bold">{LETTERS[i]}</span>
              <span className="flex-1">{opt}</span>
              {correct && <Check className="shrink-0" />}
              {wrong && <X className="shrink-0" />}
            </Button>
          );
        })}
      </div>
      {run.resolved ? (
        <Button variant="hero" className="mt-4 w-full" onClick={onNext}>
          Continuar <ArrowRight />
        </Button>
      ) : (
        <Button
          variant="hero"
          className="mt-4 w-full"
          disabled={selected === null || run.eliminated.includes(selected)}
          onClick={() => {
            if (selected === null) return;
            onConfirm(selected);
            setSelected(null);
          }}
        >
          Confirmar <Check />
        </Button>
      )}
      {run.resolved && (
        <p className={cn("mt-2 text-sm font-semibold", run.lastCorrect ? "text-success" : "text-destructive")} role="status">
          {run.lastCorrect ? "Resposta correta!" : "A resposta correta está destacada. Esse ponto volta na revisão."}
        </p>
      )}
    </section>
  );
}
