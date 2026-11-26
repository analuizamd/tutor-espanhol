/**
 * Player do vídeo de conversa com legenda clicável sincronizada.
 * - Se public/videos/<id>.mp4 existir, toca o vídeo real (tempos das falas vêm do .vtt).
 * - Senão, mostra uma PRÉVIA: cena com quem está falando e a voz do navegador lendo cada fala.
 * Tocar numa palavra pausa o vídeo e mostra o significado.
 */
import { Captions, Pause, Play, RotateCcw, SkipBack, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import still from "@/assets/dialogue-still.asset.json";
import { Button } from "@/components/ui/button";
import { CAST, type VideoLesson } from "@/data/videos";
import { canSpeak, speak, stopSpeaking } from "@/lib/speech";
import { lineAt } from "@/lib/subtitles";
import { useLessonMedia } from "@/lib/useLessonMedia";
import { cn } from "@/lib/utils";
import { ClickableLine, speakerLabel } from "./ClickableLine";

const SPEAKER_COLORS = ["bg-primary", "bg-ocean", "bg-olive", "bg-area-l", "bg-area-c", "bg-area-g", "bg-area-t"];

function speakerColor(key: string) {
  const i = Object.keys(CAST).indexOf(key);
  return SPEAKER_COLORS[(i < 0 ? 0 : i) % SPEAKER_COLORS.length];
}

function fmt(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function VideoPlayer({
  lesson,
  onPlayingChange,
  onWatched,
  onWordOpen,
}: {
  lesson: VideoLesson;
  onPlayingChange?: (playing: boolean) => void;
  onWatched?: () => void;
  onWordOpen?: () => void;
}) {
  const media = useLessonMedia(lesson);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showPt, setShowPt] = useState(false);
  const [voice, setVoice] = useState(true);
  const watchedRef = useRef(false);
  const spokenRef = useRef(-1);

  const real = !!media.videoUrl && !videoFailed;
  const [realDuration, setRealDuration] = useState(0);
  const duration = real && realDuration ? realDuration : media.duration;
  const idx = lineAt(media.timings, t);
  const line = idx >= 0 ? lesson.lines[idx] : undefined;

  // Callbacks do pai em ref: mudam de identidade a cada render e não devem reiniciar efeitos.
  const cb = useRef({ onPlayingChange, onWatched, onWordOpen });
  cb.current = { onPlayingChange, onWatched, onWordOpen };

  useEffect(() => {
    cb.current.onPlayingChange?.(playing);
  }, [playing]);
  useEffect(
    () => () => {
      cb.current.onPlayingChange?.(false);
      stopSpeaking();
    },
    [],
  );

  function markWatched() {
    if (watchedRef.current) return;
    watchedRef.current = true;
    cb.current.onWatched?.();
  }

  // Relógio da prévia.
  useEffect(() => {
    if (real || !playing) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      setT((prev) => {
        const nextT = prev + 0.2;
        if (nextT >= duration) {
          setPlaying(false);
          markWatched();
          return duration;
        }
        return nextT;
      });
    }, 200);
    return () => window.clearInterval(timer);
  }, [real, playing, duration]);

  // Voz da prévia: lê cada fala quando ela começa.
  useEffect(() => {
    if (real || !playing || !voice || idx < 0 || spokenRef.current === idx) return;
    spokenRef.current = idx;
    const l = lesson.lines[idx];
    if (l) speak(l.es, { rate: 0.9 });
  }, [real, playing, voice, idx, lesson.lines]);

  function play() {
    if (real) {
      void videoRef.current?.play();
      return;
    }
    if (t >= duration) {
      setT(0);
      spokenRef.current = -1;
    }
    setPlaying(true);
  }

  function pause() {
    if (real) videoRef.current?.pause();
    else {
      setPlaying(false);
      stopSpeaking();
    }
  }

  function seek(sec: number) {
    spokenRef.current = -1;
    if (real && videoRef.current) videoRef.current.currentTime = sec;
    setT(sec);
  }

  function restart() {
    seek(0);
    play();
  }

  function repeatLine() {
    const start = media.timings[Math.max(0, idx)]?.start ?? 0;
    seek(start);
    play();
  }

  const speaker = line ? CAST[line.speaker] : undefined;

  return (
    <section>
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-ocean shadow-card">
        {real ? (
          <video
            ref={videoRef}
            src={media.videoUrl ?? undefined}
            poster={media.posterUrl ?? undefined}
            playsInline
            className="h-full w-full bg-black object-contain"
            onClick={() => (playing ? pause() : play())}
            onTimeUpdate={(e) => setT(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setRealDuration(e.currentTarget.duration || 0)}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => {
              setPlaying(false);
              markWatched();
            }}
            onError={() => setVideoFailed(true)}
          />
        ) : (
          <>
            <img src={still.url} alt="" className="h-full w-full object-cover opacity-60" onError={(e) => (e.currentTarget.style.display = "none")} />
            <div className="absolute inset-0 bg-gradient-to-t from-ocean/95 via-ocean/40 to-transparent" />
            <span className="absolute left-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-[0.7rem] font-bold text-foreground">
              Prévia · vídeo em produção
            </span>
            <div className="absolute inset-x-0 bottom-0 flex items-end gap-3 p-4 text-ocean-foreground">
              {speaker && line ? (
                <>
                  <span className={cn("flex size-14 shrink-0 items-center justify-center rounded-2xl font-display text-2xl font-black text-white shadow-lift", speakerColor(line.speaker), playing && "animate-pulse")}>
                    {speaker.name.replace("Profe ", "").charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-lg font-extrabold leading-tight">{speaker.name}</p>
                    <p className="text-xs opacity-80">{speaker.from}</p>
                  </div>
                </>
              ) : (
                <div>
                  <p className="font-display text-xl font-extrabold">{lesson.title}</p>
                  <p className="text-xs opacity-80">{lesson.setting}</p>
                </div>
              )}
            </div>
          </>
        )}
        {!playing && (
          <Button
            variant="hero"
            size="icon"
            className="absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full"
            aria-label="Reproduzir vídeo"
            onClick={play}
          >
            <Play className="size-7" />
          </Button>
        )}
      </div>

      {/* Controles */}
      <div className="mt-3 flex items-center gap-1.5">
        <Button variant="ghost" size="icon" aria-label={playing ? "Pausar" : "Reproduzir"} onClick={() => (playing ? pause() : play())}>
          {playing ? <Pause /> : <Play />}
        </Button>
        <Button variant="ghost" size="icon" aria-label="Repetir a fala atual" title="Repetir a fala" onClick={repeatLine}>
          <SkipBack />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Recomeçar o vídeo" title="Recomeçar" onClick={restart}>
          <RotateCcw />
        </Button>
        <button
          type="button"
          className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted"
          aria-label="Linha do tempo"
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            seek(((e.clientX - r.left) / r.width) * duration);
          }}
        >
          <span className="absolute inset-y-0 left-0 bg-ocean" style={{ width: `${duration ? Math.min(100, (t / duration) * 100) : 0}%` }} />
        </button>
        <span className="w-20 text-right text-xs tabular-nums text-muted-foreground">
          {fmt(t)} / {fmt(duration)}
        </span>
        <Button variant={showPt ? "soft" : "ghost"} size="icon" aria-pressed={showPt} aria-label="Mostrar tradução" title="Tradução" onClick={() => setShowPt(!showPt)}>
          <Captions />
        </Button>
        {!real && canSpeak() && (
          <Button variant="ghost" size="icon" aria-pressed={voice} aria-label="Voz da prévia" title="Voz da prévia" onClick={() => { setVoice(!voice); stopSpeaking(); }}>
            {voice ? <Volume2 /> : <VolumeX />}
          </Button>
        )}
      </div>

      {/* Legenda clicável */}
      <div className="mt-2 min-h-28 rounded-2xl border border-border bg-card p-4 shadow-soft" aria-live="polite">
        {line ? (
          <ClickableLine
            key={idx}
            line={line}
            showPt={showPt}
            onWordOpen={() => {
              pause();
              cb.current.onWordOpen?.();
            }}
          />
        ) : (
          <p className="text-sm text-muted-foreground">Aperte play. A legenda aparece aqui — toque em qualquer palavra que você não entendeu.</p>
        )}
      </div>
      {line && <p className="mt-1.5 text-right text-[0.7rem] text-muted-foreground">Fala {idx + 1} de {lesson.lines.length} · {speakerLabel(line)}</p>}
    </section>
  );
}
