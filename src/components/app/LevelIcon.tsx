import { cn } from "@/lib/utils";
import type { Area } from "@/data/concepts";
import { getLevel, LEVEL_LABEL, type Level } from "@/lib/studentModel";

export const LEVEL_TEXT_CLASS: Record<Level, string> = {
  basico: "text-level-basico",
  medio: "text-level-medio",
  avancado: "text-level-avancado",
};
export const LEVEL_BG_SOFT_CLASS: Record<Level, string> = {
  basico: "bg-level-basico-soft",
  medio: "bg-level-medio-soft",
  avancado: "bg-level-avancado-soft",
};
export const LEVEL_BAR_CLASS: Record<Level, string> = {
  basico: "bg-level-basico",
  medio: "bg-level-medio",
  avancado: "bg-level-avancado",
};

/** Classes de cor por nível do quadro europeu (A1 laranja, A2 azul). */
export const AREA_CLASS: Record<Area, { solid: string; soft: string; text: string; fill: string }> = {
  A1: { solid: "bg-area-v", soft: "bg-area-v-soft", text: "text-area-v", fill: "fill-area-v-soft stroke-area-v" },
  A2: { solid: "bg-area-g", soft: "bg-area-g-soft", text: "text-area-g", fill: "fill-area-g-soft stroke-area-g" },
};

/** Selo pequeno do nível (Básico cinza, Médio azul, Avançado verde). */
export function LevelBadge({ level, className }: { level: Level; className?: string | undefined }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[0.7rem] font-bold leading-tight",
        LEVEL_BG_SOFT_CLASS[level],
        LEVEL_TEXT_CLASS[level],
        className,
      )}
    >
      {LEVEL_LABEL[level]}
    </span>
  );
}

/** Selo do nível a partir da pontuação. */
export function LevelPill({ score, className }: { score: number; className?: string }) {
  return <LevelBadge level={getLevel(score)} className={className} />;
}

/** Barra de pontuação 0–100 colorida pelo nível. */
export function ScoreBar({ score, className }: { score: number; className?: string }) {
  const level = getLevel(score);
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", className)}>
      <div
        className={cn("h-full rounded-full transition-all duration-700", LEVEL_BAR_CLASS[level])}
        style={{ width: `${score}%` }}
      />
    </div>
  );
}
