/**
 * Legenda clicável: cada palavra abre um balão com o significado (tutorService.translateWord),
 * a tradução da frase inteira e um botão para ouvir a palavra.
 */
import { Volume2 } from "lucide-react";
import { useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { normalizeWord } from "@/data/dictionary";
import { CAST, type VideoLine } from "@/data/videos";
import { canSpeak, speak } from "@/lib/speech";
import { cn } from "@/lib/utils";
import { translateWord, type WordTranslation } from "@/services/tutorService";

function Word({ word, line, onOpen }: { word: string; line: VideoLine; onOpen?: (() => void) | undefined }) {
  const [info, setInfo] = useState<WordTranslation | null>(null);
  const clean = normalizeWord(word);
  if (!clean) return <span>{word}</span>;
  return (
    <Popover
      onOpenChange={(open) => {
        if (!open) return;
        onOpen?.();
        translateWord(word, line).then(setInfo);
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          lang="es"
          className="rounded px-0.5 underline decoration-foreground/25 decoration-dotted underline-offset-[5px] transition hover:bg-coin-soft hover:decoration-coin-foreground focus-visible:bg-coin-soft focus-visible:outline-none"
        >
          {word}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 rounded-2xl p-4 text-sm">
        <div className="flex items-start justify-between gap-2">
          <strong lang="es" className="font-display text-xl font-extrabold">
            {clean}
          </strong>
          {canSpeak() && (
            <button
              type="button"
              onClick={() => speak(clean, { rate: 0.75 })}
              aria-label={`Ouvir «${clean}»`}
              className="flex size-8 items-center justify-center rounded-full bg-secondary text-foreground hover:bg-primary-soft"
            >
              <Volume2 className="size-4" />
            </button>
          )}
        </div>
        {!info ? (
          <p className="mt-1 text-muted-foreground">Traduzindo…</p>
        ) : info.meaning ? (
          <p className="mt-1 text-base font-semibold text-ocean">{info.meaning}</p>
        ) : (
          <p className="mt-1 text-muted-foreground">Essa palavra ainda não está no dicionário — veja a frase inteira abaixo.</p>
        )}
        <p className="mt-3 rounded-xl bg-secondary p-2.5 text-xs leading-relaxed">
          <span className="font-bold">Frase:</span> {line.pt}
        </p>
      </PopoverContent>
    </Popover>
  );
}

export function speakerLabel(line: VideoLine): string {
  return CAST[line.speaker]?.name ?? line.speaker;
}

export function ClickableLine({
  line,
  showPt = false,
  showSpeaker = true,
  onWordOpen,
  className,
}: {
  line: VideoLine;
  showPt?: boolean;
  showSpeaker?: boolean;
  onWordOpen?: (() => void) | undefined;
  className?: string;
}) {
  return (
    <div className={cn("leading-loose", className)}>
      {showSpeaker && <span className="mr-2 text-xs font-bold uppercase tracking-wide text-ocean">{speakerLabel(line)}</span>}
      <span className="text-lg">
        {line.es.split(/\s+/).map((w, i) => (
          <span key={`${w}-${i}`}>
            <Word word={w} line={line} onOpen={onWordOpen} />{" "}
          </span>
        ))}
      </span>
      {showPt && <p className="text-sm leading-snug text-muted-foreground">{line.pt}</p>}
    </div>
  );
}

/** Transcrição completa do vídeo, com palavras clicáveis e botão de ouvir cada fala. */
export function Transcript({ lines, onWordOpen, showPt = false }: { lines: VideoLine[]; onWordOpen?: (() => void) | undefined; showPt?: boolean }) {
  return (
    <ol className="flex flex-col gap-2">
      {lines.map((line, i) => (
        <li key={i} className="flex items-start gap-2 rounded-xl px-2 py-1 hover:bg-secondary/60">
          {canSpeak() && (
            <button
              type="button"
              onClick={() => speak(line.es)}
              aria-label="Ouvir a fala"
              className="mt-2 flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground"
            >
              <Volume2 className="size-3.5" />
            </button>
          )}
          <ClickableLine line={line} showPt={showPt} onWordOpen={onWordOpen} className="min-w-0 flex-1" />
        </li>
      ))}
    </ol>
  );
}
