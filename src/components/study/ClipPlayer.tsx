/**
 * "Rever trecho": toca só a fala do vídeo que ensina o ponto da pergunta.
 * Com vídeo real, toca o trecho (início/fim pelo .vtt); na prévia, lê a fala com a voz do navegador.
 */
import { Play, Volume2 } from "lucide-react";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import type { VideoLesson } from "@/data/videos";
import { speak } from "@/lib/speech";
import { useLessonMedia } from "@/lib/useLessonMedia";
import { ClickableLine } from "./ClickableLine";

export function ClipPlayer({ lesson, lineIndex, onWordOpen }: { lesson: VideoLesson; lineIndex: number; onWordOpen?: () => void }) {
  const media = useLessonMedia(lesson);
  const ref = useRef<HTMLVideoElement>(null);
  const line = lesson.lines[lineIndex];
  const cue = media.timings[lineIndex];
  if (!line) return null;

  function playClip() {
    const v = ref.current;
    if (!v || !cue) {
      speak(line!.es);
      return;
    }
    v.currentTime = cue.start;
    void v.play();
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      {media.videoUrl && (
        <video
          ref={ref}
          src={media.videoUrl}
          playsInline
          preload="metadata"
          className="mb-3 aspect-video w-full rounded-xl bg-black object-contain"
          onTimeUpdate={(e) => {
            if (cue && e.currentTarget.currentTime >= cue.end + 0.2) e.currentTarget.pause();
          }}
        />
      )}
      <div className="flex items-start gap-2">
        <Button variant="ocean" size="sm" onClick={playClip} className="mt-1.5 shrink-0">
          {media.videoUrl ? <Play /> : <Volume2 />} {media.videoUrl ? "Rever trecho" : "Ouvir"}
        </Button>
        <ClickableLine line={line} showPt onWordOpen={onWordOpen} className="min-w-0 flex-1" />
      </div>
    </div>
  );
}
