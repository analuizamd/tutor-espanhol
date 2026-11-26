/**
 * Cena 2D do quarto feita só com CSS (parede, janela, prateleira, mesa, chão).
 * Os objetos comprados aparecem nos espaços pré-definidos (ROOM_SLOTS).
 * Em modo editável, cada espaço pode receber/trocar/remover um objeto.
 */
import { Plus, X } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ROOM_SLOTS, type Placements, type RoomSlot } from "@/data/room";
import { SHOP_BY_ID } from "@/data/shop";
import { cn } from "@/lib/utils";

interface RoomSceneProps {
  placements: Placements;
  editable?: boolean;
  owned?: string[];
  onPlace?: (slotId: string, itemId: string | undefined) => void;
  className?: string;
}

export function RoomScene({ placements, editable = false, owned = [], onPlace, className }: RoomSceneProps) {
  return (
    <div className={cn("@container relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border shadow-card", className)}>
      {/* Parede */}
      <div className="absolute inset-x-0 top-0 h-[67%] bg-room-wall" />
      <div
        className="absolute inset-x-0 top-0 h-[67%] opacity-40"
        style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent 0 46px, var(--room-wall-trim) 46px 48px)" }}
      />
      {/* Rodapé */}
      <div className="absolute inset-x-0 top-[66%] h-[2.5%] bg-room-wall-trim" />
      {/* Chão com tábuas */}
      <div
        className="absolute inset-x-0 bottom-0 h-[31.5%] bg-room-floor"
        style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent 0 11%, var(--room-floor-line) 11% 11.4%)" }}
      />
      {/* Tapete */}
      <div className="absolute left-[30%] top-[80%] h-[14%] w-[44%] rounded-[50%] bg-primary/70 ring-[0.8cqw] ring-coin/70" />

      {/* Janela */}
      <div className="absolute left-[20%] top-[9%] h-[34%] w-[24%] rounded-t-[40%] border-[1cqw] border-room-wood bg-room-sky">
        <div className="absolute right-[18%] top-[20%] size-[22%] rounded-full bg-coin" />
        <div className="absolute inset-y-0 left-1/2 w-[0.7cqw] -translate-x-1/2 bg-room-wood" />
        <div className="absolute inset-x-0 top-[55%] h-[0.7cqw] bg-room-wood" />
      </div>
      <div className="absolute left-[18%] top-[42%] h-[2%] w-[28%] rounded-full bg-room-wood-dark" />

      {/* Prateleira */}
      <div className="absolute left-[57%] top-[38%] h-[2.5%] w-[32%] rounded-sm bg-room-wood shadow-soft" />
      <div className="absolute left-[60%] top-[40.5%] h-[4%] w-[1.2%] bg-room-wood-dark" />
      <div className="absolute left-[85%] top-[40.5%] h-[4%] w-[1.2%] bg-room-wood-dark" />

      {/* Mesa */}
      <div className="absolute left-[45%] top-[63%] h-[3.5%] w-[34%] rounded-md bg-room-wood shadow-card" />
      <div className="absolute left-[47%] top-[66.5%] h-[14%] w-[1.6%] bg-room-wood-dark" />
      <div className="absolute left-[75.5%] top-[66.5%] h-[14%] w-[1.6%] bg-room-wood-dark" />

      {/* Espaços / objetos */}
      {ROOM_SLOTS.map((slot) => (
        <Slot
          key={slot.id}
          slot={slot}
          itemId={placements[slot.id]}
          editable={editable}
          owned={owned}
          placements={placements}
          onPlace={onPlace}
        />
      ))}
    </div>
  );
}

function Slot({
  slot,
  itemId,
  editable,
  owned,
  placements,
  onPlace,
}: {
  slot: RoomSlot;
  itemId?: string | undefined;
  editable: boolean;
  owned: string[];
  placements: Placements;
  onPlace?: ((slotId: string, itemId: string | undefined) => void) | undefined;
}) {
  const item = itemId ? SHOP_BY_ID[itemId] : undefined;
  if (!editable && !item) return null;

  const style = { left: `${slot.left}%`, top: `${slot.top}%` };
  const content = item ? (
    <span
      className={cn(
        "block select-none leading-none drop-shadow-md transition-transform",
        slot.kind === "parede" && "rounded-full bg-card/70 p-[0.8cqw] ring-[0.4cqw] ring-room-wood/60",
        editable && "hover:scale-110",
      )}
      style={{ fontSize: `${slot.size}cqw` }}
      title={item.name}
    >
      {item.emoji}
    </span>
  ) : (
    <span
      className="flex items-center justify-center rounded-full border-2 border-dashed border-foreground/25 bg-card/40 text-foreground/40 transition hover:border-primary hover:text-primary"
      style={{ width: `${slot.size * 0.9}cqw`, height: `${slot.size * 0.9}cqw` }}
    >
      <Plus className="size-[45%]" />
    </span>
  );

  if (!editable) {
    return (
      <div className="absolute -translate-x-1/2 -translate-y-1/2" style={style} aria-label={item?.name}>
        {content}
      </div>
    );
  }

  const options = owned
    .map((id) => SHOP_BY_ID[id])
    .filter((i): i is NonNullable<typeof i> => !!i && i.kinds.includes(slot.kind));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="absolute -translate-x-1/2 -translate-y-1/2" style={style} aria-label={item ? `${item.name} — ${slot.label}` : `Espaço vazio — ${slot.label}`}>
          {content}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 rounded-2xl p-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{slot.label}</p>
        {options.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">Nenhum objeto seu cabe aqui ainda. Que tal visitar a Loja cultural?</p>
        ) : (
          <ul className="mt-2 flex flex-col gap-1">
            {options.map((opt) => {
              const elsewhere = Object.entries(placements).find(([s, id]) => id === opt.id && s !== slot.id);
              return (
                <li key={opt.id}>
                  <button
                    onClick={() => onPlace?.(slot.id, opt.id)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left text-sm hover:bg-secondary",
                      opt.id === itemId && "bg-primary-soft font-semibold",
                    )}
                  >
                    <span className="text-xl">{opt.emoji}</span>
                    <span className="flex-1">{opt.name}</span>
                    {elsewhere && <span className="text-[0.65rem] text-muted-foreground">mover</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        {item && (
          <button
            onClick={() => onPlace?.(slot.id, undefined)}
            className="mt-2 flex w-full items-center justify-center gap-1 rounded-xl border border-border py-1.5 text-sm text-muted-foreground hover:bg-secondary"
          >
            <X className="size-4" /> Tirar daqui
          </button>
        )}
      </PopoverContent>
    </Popover>
  );
}
