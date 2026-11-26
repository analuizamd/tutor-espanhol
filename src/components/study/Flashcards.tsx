import { useState } from "react";
import { ArrowRight, Check, RotateCcw, Rotate3D } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Flashcard } from "@/data/enem";

export function Flashcards({ cards, onComplete }: { cards: Flashcard[]; onComplete: () => void }) {
  const [deck, setDeck] = useState(cards);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const card = deck[0];
  function advance(review: boolean) {
    setDeck((d) => { const [first, ...rest] = d; return review && first ? [...rest, first] : rest; });
    if (!review) setKnown((n) => n + 1);
    setFlipped(false);
  }
  if (!card) return <div className="py-8 text-center"><Check className="mx-auto size-10 text-success" /><h2 className="mt-3 text-2xl font-bold">Cartões concluídos!</h2><Button variant="hero" className="mt-5" onClick={onComplete}>Continuar <ArrowRight /></Button></div>;
  return <section>
    <div className="mb-3 flex items-center justify-between text-sm text-muted-foreground"><span>Cartão {Math.min(known + 1, cards.length)} de {cards.length}</span><span>{deck.length} para revisar</span></div>
    <Button variant="outline" aria-label="Virar cartão" aria-pressed={flipped} onClick={() => setFlipped(!flipped)} className="h-auto min-h-64 w-full flex-col gap-4 whitespace-normal rounded-lg border-2 p-6 text-center shadow-card">
      <Rotate3D className="size-5 text-muted-foreground" />
      <span className="font-display text-3xl font-bold" lang={flipped ? "pt-BR" : "es"}>{flipped ? card.back : card.front}</span>
      {flipped && <><span lang="es" className="text-base font-normal">{card.example}</span>{card.falseFriend && <span className="rounded-md bg-warning-soft px-3 py-2 text-sm text-warning">Falso amigo · {card.falseFriend}</span>}</>}
    </Button>
    <div className="mt-4 grid grid-cols-2 gap-3"><Button variant="outline" disabled={!flipped} onClick={() => advance(true)}><RotateCcw /> Revisar</Button><Button variant="olive" disabled={!flipped} onClick={() => advance(false)}><Check /> Já sei</Button></div>
  </section>;
}
