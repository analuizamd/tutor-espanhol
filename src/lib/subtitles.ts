/**
 * Tempos das legendas — funções puras.
 * - parseVtt: lê o arquivo WebVTT entregue junto com o vídeo (uma legenda por fala, na mesma ordem do roteiro).
 * - estimateTimings: tempos aproximados para o player de prévia (enquanto o vídeo não existe).
 * - lineAt: qual fala está ativa num instante.
 */

export interface Cue {
  start: number;
  end: number;
  text: string;
}

/** "00:01:02.500" ou "01:02.500" → segundos. */
export function parseTimestamp(ts: string): number {
  const parts = ts.trim().replace(",", ".").split(":");
  let total = 0;
  for (const p of parts) total = total * 60 + Number(p);
  return Number.isFinite(total) ? total : 0;
}

/** Lê um WebVTT simples. Ignora cabeçalho, notas, estilos e tags de voz (<v Lucía>). */
export function parseVtt(source: string): Cue[] {
  const text = source.replace(/\r\n?/g, "\n");
  if (!text.trimStart().startsWith("WEBVTT")) return [];
  const cues: Cue[] = [];
  for (const block of text.split(/\n{2,}/)) {
    const lines = block.split("\n").filter((l) => l.trim() !== "");
    const timeIdx = lines.findIndex((l) => l.includes("-->"));
    if (timeIdx === -1) continue;
    const [startRaw, rest] = lines[timeIdx]!.split("-->");
    const endRaw = (rest ?? "").trim().split(/\s+/)[0] ?? "";
    const body = lines
      .slice(timeIdx + 1)
      .join(" ")
      .replace(/<[^>]+>/g, "")
      .trim();
    cues.push({ start: parseTimestamp(startRaw ?? "0"), end: parseTimestamp(endRaw), text: body });
  }
  return cues;
}

/** Tempo estimado de fala (ritmo lento, para A1/A2): 0,45 s por palavra + 1 s de pausa. */
export function estimateLineSeconds(es: string): number {
  const words = es.split(/\s+/).filter(Boolean).length;
  return Math.round((1 + words * 0.45) * 10) / 10;
}

/** Tempos estimados de início/fim de cada fala, a partir de um pequeno respiro inicial. */
export function estimateTimings(lines: { es: string }[], lead = 0.5): Cue[] {
  let t = lead;
  return lines.map((l) => {
    const start = t;
    t += estimateLineSeconds(l.es);
    return { start, end: t - 0.3, text: l.es };
  });
}

/**
 * Junta os tempos do VTT com as falas do roteiro.
 * Se o número de legendas não bater com o de falas, usa os tempos estimados (e avisa no console).
 */
export function timingsFor(lines: { es: string }[], cues: Cue[] | null): { timings: Cue[]; fromVideo: boolean } {
  if (cues && cues.length === lines.length) {
    return { timings: cues.map((c, i) => ({ ...c, text: lines[i]!.es })), fromVideo: true };
  }
  if (cues && cues.length > 0 && typeof console !== "undefined") {
    console.warn(`Legenda com ${cues.length} falas, roteiro com ${lines.length}. Usando tempos estimados.`);
  }
  return { timings: estimateTimings(lines), fromVideo: false };
}

/** Índice da fala ativa no instante t (a última que já começou), ou -1 antes da primeira. */
export function lineAt(timings: Cue[], t: number): number {
  let idx = -1;
  for (let i = 0; i < timings.length; i++) if (timings[i]!.start <= t + 0.05) idx = i;
  return idx;
}

/** Duração total (fim da última fala + 1 s). */
export function totalDuration(timings: Cue[]): number {
  const last = timings[timings.length - 1];
  return last ? Math.ceil(last.end + 1) : 0;
}
