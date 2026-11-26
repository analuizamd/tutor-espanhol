/**
 * Mapa das aulas A1/A2 como grafo (SVG): colunas por nível, setas dos pré-requisitos
 * para as aulas, nós coloridos por nível do quadro europeu, com selo de domínio.
 */
import { CONCEPTS, CONCEPT_BY_CODE, type ConceptCode } from "@/data/concepts";
import { getLevel, PREREQ_THRESHOLD, type Scores } from "@/lib/studentModel";
import { cn } from "@/lib/utils";
import { AREA_CLASS, LevelBadge } from "@/components/app/LevelIcon";

const NODE_W = 230;
const NODE_H = 92;
const COL_GAP = 294;
const ROW_GAP = 120;
const PAD = 28;

/** Ordem vertical dentro de cada nível (reduz cruzamentos de setas). */
const COLUMN_ORDER: ConceptCode[][] = [
  ["A1.1"],
  ["A1.2", "A1.3"],
  ["A1.4", "A1.5"],
  ["A2.1", "A2.2", "A2.3"],
  ["A2.5", "A2.4", "A2.6"],
];
const MAX_ROWS = Math.max(...COLUMN_ORDER.map((c) => c.length));
export const GRAPH_WIDTH = PAD * 2 + COL_GAP * 4 + NODE_W;
const GRAPH_HEIGHT = PAD * 2 + 36 + (MAX_ROWS - 1) * ROW_GAP + NODE_H;

const POS: Record<ConceptCode, { x: number; y: number }> = (() => {
  const out = {} as Record<ConceptCode, { x: number; y: number }>;
  COLUMN_ORDER.forEach((col, level) => {
    const offset = ((MAX_ROWS - col.length) * ROW_GAP) / 2;
    col.forEach((code, row) => {
      out[code] = { x: PAD + level * COL_GAP, y: PAD + 36 + offset + row * ROW_GAP };
    });
  });
  return out;
})();

export function ConceptGraph({
  scores,
  nextCode,
  onSelect,
  selected,
}: {
  scores: Scores;
  nextCode: ConceptCode | null;
  onSelect: (code: ConceptCode) => void;
  selected: ConceptCode | null;
}) {
  return (
    <svg viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`} className="h-auto w-full" role="group" aria-label="Mapa das aulas">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" className="fill-muted-foreground/60" />
        </marker>
      </defs>

      {/* Rótulos das colunas */}
      {COLUMN_ORDER.map((_, level) => (
        <text
          key={level}
          x={PAD + level * COL_GAP + NODE_W / 2}
          y={PAD + 8}
          textAnchor="middle"
          className="fill-muted-foreground font-display text-[13px] font-bold uppercase tracking-widest"
        >
          Nível {level}
        </text>
      ))}

      {/* Setas */}
      {CONCEPTS.flatMap((c) =>
        c.prereqs.map((p) => {
          const a = POS[p];
          const b = POS[c.code];
          const x1 = a.x + NODE_W;
          const y1 = a.y + NODE_H / 2;
          const x2 = b.x - 4;
          const y2 = b.y + NODE_H / 2;
          const mx = (x1 + x2) / 2;
          const unlocked = (scores[p] ?? 0) >= PREREQ_THRESHOLD;
          return (
            <path
              key={`${p}-${c.code}`}
              d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
              fill="none"
              markerEnd="url(#arrow)"
              strokeWidth={unlocked ? 2.25 : 1.5}
              strokeDasharray={unlocked ? undefined : "5 5"}
              className={unlocked ? "stroke-level-avancado/60" : "stroke-muted-foreground/40"}
            />
          );
        }),
      )}

      {/* Nós */}
      {CONCEPTS.map((c) => {
        const { x, y } = POS[c.code];
        const score = scores[c.code] ?? 0;
        const level = getLevel(score);
        const isNext = c.code === nextCode;
        const isSelected = c.code === selected;
        return (
          <g
            key={c.code}
            role="button"
            tabIndex={0}
            aria-label={`${c.code} ${c.name}, ${score} pontos`}
            onClick={() => onSelect(c.code)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(c.code); } }}
            className="cursor-pointer outline-none [&:focus-visible>rect]:stroke-ring"
          >
            {isNext && (
              <rect x={x - 6} y={y - 6} width={NODE_W + 12} height={NODE_H + 12} rx={22} className="animate-pulse fill-primary/15" />
            )}
            <rect
              x={x}
              y={y}
              width={NODE_W}
              height={NODE_H}
              rx={8}
              strokeWidth={isNext || isSelected ? 3 : 1.5}
              className={cn(AREA_CLASS[c.area].fill, isNext && "stroke-primary", "transition-all")}
            />
            <foreignObject x={x} y={y} width={NODE_W} height={NODE_H} className="pointer-events-none">
              <div className="flex h-full items-center gap-2 px-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display text-[13px] font-extrabold text-foreground">{c.code}</span>
                    <LevelBadge level={level} />
                  </div>
                  <div className="text-[11.5px] font-medium leading-tight text-foreground/80">{c.name}</div>
                </div>
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-card font-display text-[13px] font-extrabold tabular-nums text-foreground shadow-soft">
                  {score}
                </div>
              </div>
            </foreignObject>
            {isNext && (
              <g>
                <rect x={x + NODE_W - 74} y={y - 14} width={70} height={22} rx={11} className="fill-primary" />
                <text x={x + NODE_W - 39} y={y + 1} textAnchor="middle" className="fill-primary-foreground text-[11px] font-bold">
                  Próximo
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export { CONCEPT_BY_CODE };
