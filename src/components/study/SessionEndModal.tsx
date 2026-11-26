import { Clock, TrendingUp } from "lucide-react";

import { Coin } from "@/components/app/CoinCounter";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatMmSs } from "@/lib/focusTimer";
import type { SessionSummary } from "@/state/StudySession";
import { formatDelta } from "./ScoreChip";

/** Modal "Fim da sessão": pontos ganhos, tempo ativo e moedas com animação. */
export function SessionEndModal({ summary, onClose }: { summary: SessionSummary | null; onClose: () => void }) {
  const coins = summary?.coins;
  const visibleCoins = Math.min(coins?.total ?? 0, 8);
  return (
    <Dialog open={!!summary} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md rounded-3xl">
        {summary && coins && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl font-extrabold">Fim da sessão</DialogTitle>
              <DialogDescription>¡Buen trabajo! Veja o que você conquistou hoje.</DialogDescription>
            </DialogHeader>

            <div className="relative mx-auto flex h-24 items-end justify-center gap-1" aria-hidden>
              {visibleCoins === 0 ? (
                <Coin className="size-12 text-lg opacity-40" />
              ) : (
                Array.from({ length: visibleCoins }).map((_, i) => (
                  <span key={i} className="animate-coin-drop" style={{ animationDelay: `${i * 0.12}s` }}>
                    <Coin className="size-11 text-base" />
                  </span>
                ))
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <Stat icon={<TrendingUp className="size-4" />} label="Pontos" value={formatDelta(summary.gained)} />
              <Stat icon={<Clock className="size-4" />} label="Tempo ativo" value={formatMmSs(summary.activeMs)} />
              <Stat icon={<Coin className="size-4 text-[0.5rem]" />} label="Moedas" value={`+${coins.total}`} highlight />
            </div>
            <p className="text-center text-xs text-muted-foreground">
              {coins.fromScore} por pontos (1 a cada 5) + {coins.fromTime} por foco (1 a cada 10 min, máx. 3)
            </p>
            <Button variant="hero" size="xl" className="w-full" onClick={onClose}>
              Guardar moedas
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Stat({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) {
  return (
    <div className={highlight ? "rounded-2xl bg-coin-soft p-3" : "rounded-2xl bg-secondary p-3"}>
      <div className="flex items-center justify-center gap-1 text-xs font-semibold text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-1 font-display text-xl font-extrabold tabular-nums">{value}</div>
    </div>
  );
}
