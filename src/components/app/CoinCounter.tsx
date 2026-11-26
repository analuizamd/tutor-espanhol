import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/** Moeda desenhada em CSS. */
export function Coin({ className }: { className?: string | undefined }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-coin-gradient text-[0.6rem] font-black text-coin-foreground ring-1 ring-coin-foreground/20",
        className,
      )}
    >
      $
    </span>
  );
}

/** Contador de moedas que "pula" quando o valor muda. */
export function CoinCounter({ coins }: { coins: number }) {
  const prev = useRef(coins);
  const [bump, setBump] = useState(0);
  useEffect(() => {
    if (coins !== prev.current) {
      prev.current = coins;
      setBump((b) => b + 1);
    }
  }, [coins]);
  return (
    <div
      className="flex items-center gap-1.5 rounded-full border border-coin/40 bg-coin-soft py-1 pl-1.5 pr-3 shadow-soft"
      aria-label={`${coins} moedas`}
    >
      <Coin key={bump} className={bump ? "animate-coin-bump" : undefined} />
      <span className="font-display text-sm font-bold tabular-nums text-coin-foreground">{coins}</span>
      <span className="hidden text-xs font-medium text-coin-foreground/80 sm:inline">moedas</span>
    </div>
  );
}
