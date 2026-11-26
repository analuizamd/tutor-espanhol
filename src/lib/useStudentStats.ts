import { computeStreak, weekKey } from "@/lib/stats";
import { useAppState } from "@/state/AppState";

/** Constância e crescimento do próprio aluno. */
export function useStudentStats() {
  const { data } = useAppState();
  return {
    constancia: computeStreak(data.studyDays),
    crescimento: data.weeklyGains[weekKey()] ?? 0,
  };
}
