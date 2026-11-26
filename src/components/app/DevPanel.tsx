/**
 * Painel escondido de desenvolvimento (ícone de engrenagem):
 * ajustar pontuações, simular cenários e resetar o app para demonstrações.
 */
import { Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { CONCEPTS } from "@/data/concepts";
import type { Scores } from "@/lib/studentModel";
import { useAppState } from "@/state/AppState";
import { LevelBadge } from "./LevelIcon";
import { getLevel } from "@/lib/studentModel";

const MIXED: number[] = [85, 72, 60, 55, 40, 20, 35, 10, 0, 0, 0];

export function DevPanel() {
  const { data, setScores, setScore, addCoins, redoDiagnostic, resetApp } = useAppState();

  const preset = (fn: (i: number) => number) =>
    setScores(Object.fromEntries(CONCEPTS.map((c, i) => [c.code, fn(i)])) as Scores);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Painel do desenvolvedor" className="text-muted-foreground/60">
          <Settings2 />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display">Painel do desenvolvedor</SheetTitle>
          <SheetDescription>Ajuste pontuações para demonstrar cenários.</SheetDescription>
        </SheetHeader>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <Button variant="olive" size="sm" onClick={() => preset(() => 85)}>Tudo certo</Button>
          <Button variant="outline" size="sm" onClick={() => preset(() => 0)}>Tudo errado</Button>
          <Button variant="ocean" size="sm" onClick={() => preset((i) => MIXED[i] ?? 0)}>Misto</Button>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Button variant="soft" size="sm" onClick={() => addCoins(20)}>+20 moedas</Button>
          <Button variant="soft" size="sm" onClick={redoDiagnostic}>Refazer diagnóstico</Button>
        </div>

        <ul className="mt-6 flex flex-col gap-4">
          {CONCEPTS.map((c) => {
            const score = data.scores[c.code];
            return (
              <li key={c.code}>
                <div className="mb-1.5 flex items-start justify-between gap-2 text-xs">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <LevelBadge level={getLevel(score)} className="shrink-0" />
                    {c.code} · <span className="font-normal text-muted-foreground">{c.name}</span>
                  </span>
                  <span className="font-display font-bold tabular-nums">{score}</span>
                </div>
                <Slider value={[score]} min={0} max={100} step={1} onValueChange={([v]) => setScore(c.code, v ?? 0)} />
              </li>
            );
          })}
        </ul>

        <Button
          variant="destructive"
          className="mt-8 w-full"
          onClick={() => {
            if (window.confirm("Apagar todo o progresso e recomeçar?")) resetApp();
          }}
        >
          Resetar app
        </Button>
      </SheetContent>
    </Sheet>
  );
}
