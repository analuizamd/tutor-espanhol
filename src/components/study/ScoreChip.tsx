import { cn } from "@/lib/utils";

/** Texto formatado da variação: "+15", "−5" ou "0". */
export function formatDelta(value: number): string {
  if (value > 0) return `+${value}`;
  if (value < 0) return `−${Math.abs(value)}`;
  return "0";
}

/** Chip com a variação de pontos. `floating` anima subindo e sumindo. */
export function ScoreChip({ value, floating = false, className }: { value: number; floating?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 font-display text-xs font-extrabold tabular-nums shadow-soft",
        value > 0 && "bg-success-soft text-success",
        value < 0 && "bg-primary-soft text-destructive",
        value === 0 && "bg-muted text-muted-foreground",
        floating ? "animate-float-up" : "animate-pop-in",
        className,
      )}
    >
      {formatDelta(value)}
    </span>
  );
}
