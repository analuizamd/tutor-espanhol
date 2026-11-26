/**
 * Indicadores sociais do aluno: constância (dias seguidos) e crescimento (pontos na semana).
 */
export function dayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Segunda-feira da semana da data, como chave AAAA-MM-DD. */
export function weekKey(d: Date = new Date()): string {
  const copy = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const offset = (copy.getDay() + 6) % 7;
  copy.setDate(copy.getDate() - offset);
  return dayKey(copy);
}

/** Dias seguidos de estudo terminando hoje (ou ontem, se ainda não estudou hoje). */
export function computeStreak(studyDays: string[], today: Date = new Date()): number {
  const set = new Set(studyDays);
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (!set.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (set.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
