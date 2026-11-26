import { useState } from "react";
import { Check, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LETTERS, type EnemQuestion as Question } from "@/data/enem";
import { cn } from "@/lib/utils";
import type { Activity } from "@/state/StudySession";

export function EnemQuestion({ question, activity, onConfirm, onNext }: { question: Question; activity: Activity; onConfirm: (i: number) => void; onNext: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  return <section>
    <p className="mb-3 text-xs font-semibold text-muted-foreground">Questão {activity.qIndex + 1} de {activity.questionIds.length}</p>
    {question.text && <p lang="es" className="mb-4 whitespace-pre-line rounded-lg bg-secondary p-4 leading-relaxed">{question.text}</p>}
    <h2 lang="es" className="text-xl font-bold leading-snug">{question.prompt}</h2>
    <div className="mt-4 flex flex-col gap-2" role="radiogroup" aria-label="Alternativas">
      {question.options.map((opt, i) => {
        const wrong = activity.eliminated.includes(i);
        const correct = (activity.resolved || activity.hintStep === 4) && i === question.correctIndex;
        return <Button key={i} variant="outline" role="radio" aria-checked={selected === i} disabled={activity.resolved || wrong} onClick={() => setSelected(i)} className={cn("h-auto min-h-12 justify-start gap-3 whitespace-normal rounded-lg border-2 px-3 py-3 text-left", selected === i && "border-primary bg-primary-soft", correct && "border-success bg-success-soft text-success", wrong && "border-destructive bg-primary-soft text-destructive opacity-80")}><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary font-bold">{LETTERS[i]}</span><span className="flex-1">{opt}</span>{correct && <Check className="shrink-0" />}{wrong && <X className="shrink-0" />}</Button>;
      })}
    </div>
    {activity.resolved ? <Button variant="hero" className="mt-4 w-full" onClick={onNext}>Continuar <ArrowRight /></Button> : <Button variant="hero" className="mt-4 w-full" disabled={selected === null || activity.eliminated.includes(selected)} onClick={() => { if (selected === null) return; onConfirm(selected); setSelected(null); }}>Confirmar <Check /></Button>}
    {activity.lastCorrect === false && !activity.resolved && <p className="mt-2 text-sm text-destructive" role="status">Resposta incorreta. Escolha outra alternativa.</p>}
    {activity.resolved && <p className="mt-2 text-sm font-semibold text-success" role="status">{activity.lastCorrect ? "Resposta correta!" : "A alternativa correta está destacada."}</p>}
  </section>;
}
