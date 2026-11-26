/**
 * Regras do cronômetro de foco (puras):
 * - conta enquanto o aluno interage (toques, marcar respostas, virar cartões) ou um vídeo está tocando
 * - e por até ACTIVITY_WINDOW_MS (3 min) depois que uma nova atividade aparece
 * - fora disso, pausa após IDLE_MS (60 s) sem interação
 * - pausa sempre que a aba/app estiver escondida (Page Visibility API)
 */
export const ACTIVITY_WINDOW_MS = 3 * 60 * 1000;
export const IDLE_MS = 60 * 1000;

export interface FocusInput {
  now: number;
  visible: boolean;
  lastInteractionAt: number | null;
  lastActivityAt: number | null;
  videoPlaying: boolean;
}

export function isFocusActive({ now, visible, lastInteractionAt, lastActivityAt, videoPlaying }: FocusInput): boolean {
  if (!visible) return false;
  if (videoPlaying) return true;
  const interacting = lastInteractionAt !== null && now - lastInteractionAt < IDLE_MS;
  const newActivity = lastActivityAt !== null && now - lastActivityAt < ACTIVITY_WINDOW_MS;
  return interacting || newActivity;
}

/** Formata milissegundos como mm:ss. */
export function formatMmSs(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
