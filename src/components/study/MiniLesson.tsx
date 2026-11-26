/** Mini-aula: aparece quando o aluno erra a primeira verificação. Ensina com o trecho do vídeo e chama a nova verificação. */
import { ArrowRight, GraduationCap } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CheckItem, CheckQuestion, VideoLesson } from "@/data/videos";
import { getTeaching } from "@/services/tutorService";
import type { LessonRun } from "@/state/StudySession";
import { ClipPlayer } from "./ClipPlayer";

export function MiniLesson({
  lesson,
  question,
  item,
  run,
  onRetry,
  onWordOpen,
}: {
  lesson: VideoLesson;
  question: CheckQuestion;
  item: CheckItem;
  run: LessonRun;
  onRetry: () => void;
  onWordOpen?: () => void;
}) {
  const wrong = run.lastPick !== null ? item.options[run.lastPick] ?? null : null;
  const teaching = getTeaching(question, lesson, wrong);
  return (
    <section className="animate-pop-in rounded-2xl border-2 border-olive/40 bg-olive-soft/60 p-4 sm:p-5">
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent-foreground">
        <GraduationCap className="size-4" /> Mini-aula
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{teaching.intro}</p>
      <p className="mt-3 text-base leading-relaxed">{teaching.text}</p>
      <p className="mt-3 rounded-xl bg-card px-3 py-2 text-sm">
        Na pergunta «<span lang="es">{item.prompt}</span>», a resposta era{" "}
        <strong className="text-success">«{item.options[item.correctIndex]}»</strong>.
      </p>
      {teaching.line && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-bold text-muted-foreground">Reveja o trecho do vídeo que ensina isso:</p>
          <ClipPlayer lesson={lesson} lineIndex={question.lineIndex} {...(onWordOpen ? { onWordOpen } : {})} />
        </div>
      )}
      <Button variant="hero" size="xl" className="mt-5 w-full" onClick={onRetry}>
        Entendi, quero tentar de novo <ArrowRight />
      </Button>
    </section>
  );
}
