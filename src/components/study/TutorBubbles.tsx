import { Lightbulb, BookOpenText } from "lucide-react";
import type { TutorBubble } from "@/state/StudySession";
import { HINT_STEP_LABEL } from "@/services/tutorService";
import { ScoreChip } from "./ScoreChip";

export function TutorBubbles({ bubbles }: { bubbles: TutorBubble[] }) {
  return <div className="space-y-3" aria-live="polite">{bubbles.map((b) => <div key={b.id} className="flex items-start gap-2 animate-bubble-in"><span aria-hidden className="flex size-8 shrink-0 items-center justify-center rounded-full bg-warm-gradient font-display text-xs font-black text-primary-foreground">¡H</span><div className="bubble-tutor min-w-0 flex-1 px-4 py-3">{b.hintStep && <p className="mb-2 flex items-center gap-1 text-xs font-bold text-coin-foreground"><Lightbulb className="size-3" />Dica {b.hintStep} de 4 · {HINT_STEP_LABEL[b.hintStep]}</p>}{b.kind === "explanation" && <p className="mb-2 flex items-center gap-1 text-xs font-bold text-olive"><BookOpenText className="size-3" />Explicação</p>}<p lang={b.language === "es" ? "es" : "pt-BR"} className={b.hintStep === 4 ? "font-bold" : ""}>{b.text}</p>{b.delta !== undefined && <ScoreChip className="mt-2" value={b.delta} />}</div></div>)}</div>;
}
