import { useEffect, useState } from "react";
import { Play, Pause, RotateCcw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Dialogue, SubtitleLine } from "@/data/enem";
import { translateWord } from "@/data/dictionary";
import still from "@/assets/dialogue-still.asset.json";

export function Subtitle({ line, onTranslate }: { line: SubtitleLine; onTranslate: () => void }) {
  return <div className="text-base leading-loose"><span className="mr-2 text-xs font-bold text-ocean">{line.speaker}</span>{line.es.split(/\s+/).map((word, i) => <Popover key={`${word}-${i}`}><PopoverTrigger asChild><Button variant="ghost" lang="es" className="h-auto px-1 py-0 text-base font-normal underline decoration-border underline-offset-4" onClick={onTranslate}>{word}</Button></PopoverTrigger><PopoverContent className="w-64 text-sm"><strong>{word}</strong><p className="mt-1">{translateWord(word) ?? line.pt}</p></PopoverContent></Popover>)}</div>;
}

export function VideoDialogue({ dialogue, onComplete, onPlaying, onTranslate }: { dialogue: Dialogue; onComplete: () => void; onPlaying: (v: boolean) => void; onTranslate: () => void }) {
  const [seconds, setSeconds] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => { onPlaying(playing); return () => onPlaying(false); }, [playing]);
  useEffect(() => {
    if (!playing) return;
    const t = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      setSeconds((s) => { const next = s + 1; if (next >= dialogue.durationSec) setPlaying(false); return Math.min(next, dialogue.durationSec); });
    }, 1000);
    return () => window.clearInterval(t);
  }, [playing, dialogue.durationSec]);
  const line = [...dialogue.lines].reverse().find((l) => l.at <= seconds) ?? dialogue.lines[0];
  return <section>
    <h2 className="mb-3 text-xl font-bold">{dialogue.title}</h2>
    <div className="relative aspect-video overflow-hidden rounded-lg bg-ocean">
      {dialogue.videoUrl ? <video src={dialogue.videoUrl} controls className="h-full w-full" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => { setPlaying(false); setSeconds(dialogue.durationSec); }} /> : <><img src={still.url} alt="Dois amigos conversando em um café" className="h-full w-full object-cover" /><div className="absolute inset-x-0 bottom-0 bg-ocean/90 px-4 py-2 text-xs text-ocean-foreground">{dialogue.speakers.map((s) => `${s.name} · ${s.from}`).join(" / ")}</div><Button variant="hero" size="icon" className="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-full" aria-label={playing ? "Pausar diálogo" : "Reproduzir diálogo"} onClick={() => { if (seconds >= dialogue.durationSec) setSeconds(0); setPlaying(!playing); }}>{playing ? <Pause /> : <Play />}</Button></>}
    </div>
    <div className="mt-3 flex items-center gap-3"><Button variant="ghost" size="icon" aria-label="Repetir diálogo" title="Repetir" onClick={() => { setSeconds(0); setPlaying(true); }}><RotateCcw /></Button><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"><div className="h-full bg-ocean" style={{ width: `${seconds / dialogue.durationSec * 100}%` }} /></div><span className="text-xs tabular-nums text-muted-foreground">{seconds}s / {dialogue.durationSec}s</span></div>
    <div className="mt-3 min-h-24 rounded-lg bg-secondary p-3" aria-live="polite">{line && <Subtitle line={line} onTranslate={onTranslate} />}</div>
    <Button variant="hero" className="mt-4 w-full" onClick={() => { setPlaying(false); onComplete(); }}>Ir para as perguntas <ArrowRight /></Button>
  </section>;
}
