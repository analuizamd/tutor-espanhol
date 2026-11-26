import { LevelPill, ScoreBar } from "@/components/app/LevelIcon";
import type { Concept } from "@/data/concepts";
import { ScoreChip } from "./ScoreChip";

/** Selo do conceito atual: código, nome, pontuação e nível, com chip animado de variação. */
export function ConceptBadge({
  concept,
  score,
  lastDelta,
}: {
  concept: Concept;
  score: number;
  lastDelta: { id: string; value: number } | null;
}) {
  return (
    <div className="relative flex items-center gap-3 rounded-2xl border border-border bg-card px-3 py-2 shadow-soft">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-ocean font-display text-sm font-extrabold text-ocean-foreground">
        {concept.code}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold leading-tight">{concept.name}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <ScoreBar score={score} className="max-w-40" />
          <span className="font-display text-xs font-bold tabular-nums">{score}/100</span>
        </div>
      </div>
      <LevelPill score={score} className="hidden sm:inline-flex" />
      {lastDelta && (
        <span className="pointer-events-none absolute -top-3 right-3">
          <ScoreChip key={lastDelta.id} value={lastDelta.value} floating />
        </span>
      )}
    </div>
  );
}
