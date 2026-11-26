/**
 * Descobre se o vídeo real de uma aula já foi colocado em public/videos/ e carrega os tempos da legenda.
 * - /videos/<id>.mp4 → vídeo (se não existir, o app usa o player de prévia)
 * - /videos/<id>.vtt → tempos de cada fala (se não existir, usa tempos estimados)
 * - /videos/<id>.jpg → capa (opcional)
 */
import { useEffect, useState } from "react";

import { VIDEO_BASE_PATH } from "@/config/app";
import type { VideoLesson } from "@/data/videos";
import { parseVtt, timingsFor, totalDuration, type Cue } from "@/lib/subtitles";

export interface LessonMedia {
  ready: boolean;
  videoUrl: string | null;
  posterUrl: string | null;
  timings: Cue[];
  /** true quando os tempos vieram do .vtt do vídeo. */
  timedFromVideo: boolean;
  duration: number;
}

const cache = new Map<string, LessonMedia>();

async function probe(url: string, accept: (type: string) => boolean): Promise<boolean> {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok && accept(res.headers.get("content-type") ?? "");
  } catch {
    return false;
  }
}

async function loadMedia(lesson: VideoLesson): Promise<LessonMedia> {
  const base = `${VIDEO_BASE_PATH}/${lesson.id}`;
  const [hasVideo, hasPoster, vttText] = await Promise.all([
    probe(`${base}.mp4`, (t) => t.startsWith("video/") || t === "application/octet-stream"),
    probe(`${base}.jpg`, (t) => t.startsWith("image/")),
    fetch(`${base}.vtt`)
      .then((r) => (r.ok ? r.text() : ""))
      .catch(() => ""),
  ]);
  const cues = parseVtt(vttText);
  const { timings, fromVideo } = timingsFor(lesson.lines, cues.length ? cues : null);
  return {
    ready: true,
    videoUrl: hasVideo ? `${base}.mp4` : null,
    posterUrl: hasPoster ? `${base}.jpg` : null,
    timings,
    timedFromVideo: fromVideo,
    duration: totalDuration(timings),
  };
}

function initial(lesson: VideoLesson): LessonMedia {
  const { timings } = timingsFor(lesson.lines, null);
  return { ready: false, videoUrl: null, posterUrl: null, timings, timedFromVideo: false, duration: totalDuration(timings) };
}

export function useLessonMedia(lesson: VideoLesson): LessonMedia {
  const [media, setMedia] = useState<LessonMedia>(() => cache.get(lesson.id) ?? initial(lesson));
  useEffect(() => {
    const cached = cache.get(lesson.id);
    if (cached) {
      setMedia(cached);
      return;
    }
    let alive = true;
    setMedia(initial(lesson));
    loadMedia(lesson).then((m) => {
      cache.set(lesson.id, m);
      if (alive) setMedia(m);
    });
    return () => {
      alive = false;
    };
  }, [lesson]);
  return media;
}
