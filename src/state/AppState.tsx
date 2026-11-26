/**
 * Estado global do aluno (perfil, pontuações, moedas, quarto), persistido no localStorage.
 * O carregamento acontece só no navegador (useEffect) para não quebrar a renderização no servidor.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { STORAGE_KEY, SESSION_STORAGE_KEY } from "@/config/app";
import type { ConceptCode } from "@/data/concepts";
import { ROOM_SLOTS, type Placements } from "@/data/room";
import { SHOP_BY_ID } from "@/data/shop";
import { clampScore, initialScores, scoresFromDiagnostic, type Scores } from "@/lib/studentModel";
import { dayKey, weekKey } from "@/lib/stats";

export interface DiagnosticResult {
  conceptCode: ConceptCode;
  correct: boolean;
}

export interface AppData {
  diagnosticDone: boolean;
  diagnosticResults: DiagnosticResult[];
  scores: Scores;
  coins: number;
  owned: string[];
  placements: Placements;
  studyDays: string[];
  weeklyGains: Record<string, number>;
  /** Pontos ganhos por dia (meta do dia). */
  dailyGains: Record<string, number>;
  /** Quantas vezes cada aula foi concluída (na revisão, as perguntas trocam pela variante). */
  lessonRuns: Partial<Record<ConceptCode, number>>;
}

export function defaultAppData(): AppData {
  return {
    diagnosticDone: false,
    diagnosticResults: [],
    scores: initialScores(),
    coins: 0,
    owned: [],
    placements: {},
    studyDays: [],
    weeklyGains: {},
    dailyGains: {},
    lessonRuns: {},
  };
}

interface AppStateValue {
  data: AppData;
  hydrated: boolean;
  completeDiagnostic: (results: DiagnosticResult[]) => void;
  setScores: (scores: Scores) => void;
  setScore: (code: ConceptCode, value: number) => void;
  addCoins: (amount: number) => void;
  buyItem: (itemId: string) => boolean;
  placeItem: (slotId: string, itemId: string | undefined) => void;
  recordStudy: (scoreGained: number) => void;
  completeLesson: (code: ConceptCode) => void;
  redoDiagnostic: () => void;
  resetApp: () => void;
}

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(defaultAppData);
  const [hydrated, setHydrated] = useState(false);

  // Carrega do localStorage uma vez, no navegador.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<AppData>;
        setData({ ...defaultAppData(), ...parsed, scores: { ...initialScores(), ...(parsed.scores ?? {}) } });
      }
    } catch {
      // dados corrompidos: começa do zero
    }
    setHydrated(true);
  }, []);

  // Salva a cada mudança (depois de carregado).
  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, hydrated]);

  const completeDiagnostic = useCallback((results: DiagnosticResult[]) => {
    setData((d) => ({ ...d, diagnosticDone: true, diagnosticResults: results, scores: scoresFromDiagnostic(results) }));
  }, []);

  const setScores = useCallback((scores: Scores) => setData((d) => ({ ...d, scores })), []);

  const setScore = useCallback(
    (code: ConceptCode, value: number) =>
      setData((d) => ({ ...d, scores: { ...d.scores, [code]: clampScore(value) } })),
    [],
  );

  const addCoins = useCallback((amount: number) => setData((d) => ({ ...d, coins: Math.max(0, d.coins + amount) })), []);

  const buyItem = useCallback(
    (itemId: string) => {
      const item = SHOP_BY_ID[itemId];
      if (!item || data.owned.includes(itemId) || data.coins < item.price) return false;
      setData((d) => {
        // Coloca automaticamente no primeiro espaço livre compatível.
        const free = ROOM_SLOTS.find((s) => item.kinds.includes(s.kind) && !d.placements[s.id]);
        return {
          ...d,
          coins: d.coins - item.price,
          owned: [...d.owned, itemId],
          placements: free ? { ...d.placements, [free.id]: itemId } : d.placements,
        };
      });
      return true;
    },
    [data.owned, data.coins],
  );

  const placeItem = useCallback((slotId: string, itemId: string | undefined) => {
    setData((d) => {
      const next: Placements = {};
      for (const [slot, id] of Object.entries(d.placements)) {
        if (id && id !== itemId && slot !== slotId) next[slot] = id;
      }
      if (itemId) next[slotId] = itemId;
      return { ...d, placements: next };
    });
  }, []);

  const recordStudy = useCallback((scoreGained: number) => {
    const today = dayKey();
    const week = weekKey();
    setData((d) => ({
      ...d,
      studyDays: d.studyDays.includes(today) ? d.studyDays : [...d.studyDays, today],
      weeklyGains: { ...d.weeklyGains, [week]: (d.weeklyGains[week] ?? 0) + Math.max(0, scoreGained) },
      dailyGains: { ...d.dailyGains, [today]: (d.dailyGains[today] ?? 0) + Math.max(0, scoreGained) },
    }));
  }, []);

  const completeLesson = useCallback((code: ConceptCode) => {
    setData((d) => ({ ...d, lessonRuns: { ...d.lessonRuns, [code]: (d.lessonRuns[code] ?? 0) + 1 } }));
  }, []);

  const redoDiagnostic = useCallback(() => {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    setData((d) => ({ ...d, diagnosticDone: false, diagnosticResults: [], scores: initialScores(), lessonRuns: {} }));
  }, []);

  const resetApp = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    setData(defaultAppData());
  }, []);

  const value = useMemo<AppStateValue>(
    () => ({ data, hydrated, completeDiagnostic, setScores, setScore, addCoins, buyItem, placeItem, recordStudy, completeLesson, redoDiagnostic, resetApp }),
    [data, hydrated, completeDiagnostic, setScores, setScore, addCoins, buyItem, placeItem, recordStudy, completeLesson, redoDiagnostic, resetApp],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used inside AppStateProvider");
  return ctx;
}
