import { Check } from "lucide-react";
import { toast } from "sonner";

import { Coin } from "@/components/app/CoinCounter";
import { Button } from "@/components/ui/button";
import { SHOP_ITEMS } from "@/data/shop";
import { useAppState } from "@/state/AppState";

/** Cards da Loja cultural (Argentina, Uruguai, Espanha). */
export function ShopList() {
  const { data, buyItem } = useAppState();
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
      {SHOP_ITEMS.map((item) => {
        const owned = data.owned.includes(item.id);
        const affordable = data.coins >= item.price;
        return (
          <li key={item.id} className="flex flex-col rounded-2xl border border-border bg-card p-3 shadow-soft">
            <div className="flex items-start gap-3">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-sand text-3xl">{item.emoji}</div>
              <div className="min-w-0 flex-1">
                <p className="font-display font-bold leading-tight">{item.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {item.flag} {item.country}
                </p>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{item.description}</p>
            <div className="mt-3 flex items-center justify-between gap-2">
              <span className="flex items-center gap-1 font-display font-bold tabular-nums">
                <Coin className="size-4 text-[0.5rem]" /> {item.price}
              </span>
              {owned ? (
                <span className="inline-flex h-9 items-center gap-1 rounded-xl bg-olive-soft px-3 text-sm font-semibold text-accent-foreground">
                  <Check className="size-4" /> Comprado
                </span>
              ) : (
                <Button
                  variant="hero"
                  size="touch"
                  disabled={!affordable}
                  onClick={() => {
                    if (buyItem(item.id)) toast.success(`${item.emoji} ${item.name} chegou ao seu quarto!`);
                  }}
                  title={affordable ? undefined : `Faltam ${item.price - data.coins} moedas`}
                >
                  Comprar
                </Button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
