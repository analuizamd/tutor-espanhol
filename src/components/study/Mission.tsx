import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Mission as MissionData } from "@/data/enem";
import type { Activity } from "@/state/StudySession";
import { getMissionLines } from "@/services/tutorService";
import { cn } from "@/lib/utils";

export function Mission({ mission, activity, onPick, onNext }: { mission: MissionData; activity: Activity; onPick: (i: number) => void; onNext: () => void }) {
  const steps = getMissionLines(mission);
  const step = steps[activity.missionStep];
  if (!step) return null;
  return <section><h2 className="text-2xl font-bold">{mission.title}</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{mission.situation}</p>
    <div className="my-4 flex gap-2">{steps.map((_, i) => <span key={i} className={cn("h-1.5 flex-1 rounded-full", i <= activity.missionStep ? "bg-ocean" : "bg-muted")} />)}</div>
    <p className="text-xs font-bold text-muted-foreground">Passo {activity.missionStep + 1} de {steps.length} · {mission.npcName}</p><p lang="es" className="bubble-tutor my-3 px-4 py-4 text-lg">{step.npc}</p>
    <div className="space-y-3">{step.options.map((opt, i) => <Button variant="outline" key={i} lang="es" disabled={activity.resolved || activity.eliminated.includes(i)} onClick={() => onPick(i)} className={cn("h-auto min-h-14 w-full justify-start whitespace-normal rounded-lg border-2 p-3 text-left", activity.eliminated.includes(i) && "border-destructive bg-primary-soft", (activity.hintStep === 4 || activity.resolved) && i === step.correctIndex && "border-success bg-success-soft")}>{opt}{activity.resolved && i === step.correctIndex && <Check />}</Button>)}</div>
    {activity.missionResult && <Button variant="hero" className="mt-5 w-full" onClick={onNext}>Continuar <ArrowRight /></Button>}
  </section>;
}
