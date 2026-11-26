/**
 * Diagnóstico inicial: 10 perguntas de múltipla escolha, uma por tela,
 * e no fim um resumo com a pontuação inicial de cada conceito.
 */
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/config/app";
import { CONCEPTS, CONCEPT_BY_CODE } from "@/data/concepts";
import { DIAGNOSTIC_QUESTIONS } from "@/data/diagnostic";
import { cn } from "@/lib/utils";
import { scoresFromDiagnostic } from "@/lib/studentModel";
import { useAppState, type DiagnosticResult } from "@/state/AppState";
import { BrandMark } from "./AppShell";
import { LevelPill, ScoreBar } from "./LevelIcon";

export function Diagnostic() {
  const { completeDiagnostic } = useAppState();
  const [step, setStep] = useState<"intro" | "quiz" | "summary">("intro");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [results, setResults] = useState<DiagnosticResult[]>([]);

  const total = DIAGNOSTIC_QUESTIONS.length;
  const current = DIAGNOSTIC_QUESTIONS[index] ?? DIAGNOSTIC_QUESTIONS[0];

  function answer() {
    if (selected === null || !current) return;
    const next = [...results, { conceptCode: current.conceptCode, correct: selected === current.correctIndex }];
    setResults(next);
    setSelected(null);
    if (index + 1 < total) setIndex(index + 1);
    else setStep("summary");
  }

  if (!current) return null;

  return (
    <div className="min-h-dvh px-4 py-6 sm:py-10">
      <div className="mx-auto flex max-w-xl flex-col gap-6">
        <BrandMark />

        {step === "intro" && (
          <section className="surface-card animate-pop-in p-6 sm:p-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-olive-soft px-3 py-1 text-xs font-semibold text-accent-foreground">
              <Sparkles className="size-3.5" /> Diagnóstico inicial
            </span>
            <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">¡Bienvenido! Vamos ver o que você já sabe.</h1>
            <p className="mt-3 text-muted-foreground">
              São {total} questões de espanhol no estilo ENEM de múltipla escolha. Não vale nota: o {APP_NAME} usa suas respostas para
              escolher por onde começar.
            </p>
            <Button variant="hero" size="xl" className="mt-6 w-full sm:w-auto" onClick={() => setStep("quiz")}>
              Começar diagnóstico <ArrowRight />
            </Button>
          </section>
        )}

        {step === "quiz" && (
          <section key={index} className="surface-card animate-bubble-in p-6 sm:p-8">
            <div className="flex items-center justify-between text-sm font-semibold text-muted-foreground">
              <span>
                Pergunta {index + 1} de {total}
              </span>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">{CONCEPT_BY_CODE[current.conceptCode].name}</span>
            </div>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-warm-gradient transition-all duration-500"
                style={{ width: `${((index + 1) / total) * 100}%` }}
              />
            </div>
            <p className="mt-5 whitespace-pre-line rounded-lg bg-secondary p-4 text-base leading-relaxed" lang="es">{current.text}</p>
            <h2 lang="es" className="mt-6 text-2xl font-bold leading-snug">{current.prompt}</h2>
            <div className="mt-5 flex flex-col gap-3" role="radiogroup">
              {current.options.map((opt, i) => {
                const active = selected === i;
                return (
                  <Button variant="outline"
                    key={opt}
                    role="radio"
                    aria-checked={active}
                    onClick={() => setSelected(i)}
                    className={cn(
                      "h-auto whitespace-normal flex min-h-14 items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-base font-medium transition-all",
                      active
                        ? "border-primary bg-primary-soft shadow-soft"
                        : "border-border bg-card hover:border-primary/40",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold",
                        active ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
                      )}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </Button>
                );
              })}
            </div>
            <Button variant="hero" size="xl" className="mt-6 w-full" disabled={selected === null} onClick={answer}>
              Responder
            </Button>
          </section>
        )}

        {step === "summary" && <Summary results={results} onStart={() => completeDiagnostic(results)} />}
      </div>
    </div>
  );
}

function Summary({ results, onStart }: { results: DiagnosticResult[]; onStart: () => void }) {
  const scores = scoresFromDiagnostic(results);
  const correct = results.filter((r) => r.correct).length;
  return (
    <section className="surface-card animate-pop-in p-6 sm:p-8">
      <h1 className="text-3xl font-extrabold">¡Listo! Seu ponto de partida</h1>
      <p className="mt-2 text-muted-foreground">
        Você acertou <strong className="text-foreground">{correct} de {results.length}</strong>. Cada acerto vale 25 pontos
        no conceito.
      </p>
      <ul className="mt-6 flex flex-col gap-3">
        {CONCEPTS.map((c) => {
          const r = results.find((result) => result.conceptCode === c.code);
          const score = scores[c.code];
          return (
            <li key={c.code} className="rounded-2xl border border-border bg-background/60 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="rounded-md bg-ocean-soft px-1.5 py-0.5 font-display text-xs font-bold text-ocean">{c.code}</span>
                  <span className="truncate text-sm font-semibold">{c.name}</span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {r?.correct && <Check className="size-4 text-success" />}
                  <span className="font-display text-sm font-bold tabular-nums">{score}</span>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <ScoreBar score={score} />
                <LevelPill score={score} />
              </div>
            </li>
          );
        })}
      </ul>
      <Button variant="hero" size="xl" className="mt-6 w-full" onClick={onStart}>
        Começar a estudar <ArrowRight />
      </Button>
    </section>
  );
}
