/**
 * Modelo do aluno — funções puras, fáceis de ler e testar.
 * Nenhuma função aqui acessa React, localStorage ou o tutor.
 */
import { CONCEPTS, CONCEPT_ORDER, type Area, type ConceptCode, type Concept } from "@/data/concepts";

export type Scores = Record<ConceptCode, number>;

/** Eventos que alteram (ou não) a pontuação de um conceito. */
export type ScoreEvent =
  | "diagnostico_correta"
  | "diagnostico_errada"
  | "correta_primeira"
  | "correta_apos_dica"
  | "parcial"
  | "errada_apos_dica"
  | "pedido_ajuda"
  | "pedido_explicacao";

/** Tabela de variação de pontos por evento. */
export const SCORE_DELTAS: Record<ScoreEvent, number> = {
  diagnostico_correta: 25,
  diagnostico_errada: 0,
  correta_primeira: 15,
  correta_apos_dica: 7,
  parcial: 3,
  errada_apos_dica: -5,
  pedido_ajuda: 0,
  pedido_explicacao: 0,
};

export const MIN_SCORE = 0;
export const MAX_SCORE = 100;
/** Pontuação mínima dos pré-requisitos para liberar um conceito. */
export const PREREQ_THRESHOLD = 50;

export type Level = "basico" | "medio" | "avancado";

export function clampScore(value: number): number {
  return Math.min(MAX_SCORE, Math.max(MIN_SCORE, Math.round(value)));
}

/** Aplica um evento à pontuação e devolve a nova pontuação (sempre entre 0 e 100). */
export function applyScoreEvent(score: number, event: ScoreEvent): number {
  return clampScore(score + SCORE_DELTAS[event]);
}

/** Atualiza o mapa de pontuações para um conceito e devolve { scores, delta } com a variação real. */
export function updateConceptScore(
  scores: Scores,
  code: ConceptCode,
  event: ScoreEvent,
): { scores: Scores; delta: number } {
  const before = scores[code] ?? 0;
  const after = applyScoreEvent(before, event);
  return { scores: { ...scores, [code]: after }, delta: after - before };
}

/** Pontuação a partir da qual o conceito é considerado dominado (Avançado). */
export const MASTERY_THRESHOLD = 70;

/** Básico (< 30), Médio (30–69), Avançado (≥ 70, dominado). */
export function getLevel(score: number): Level {
  if (score >= MASTERY_THRESHOLD) return "avancado";
  if (score >= 30) return "medio";
  return "basico";
}

export function isMastered(score: number): boolean {
  return getLevel(score) === "avancado";
}

export const LEVEL_LABEL: Record<Level, string> = {
  basico: "Básico",
  medio: "Médio",
  avancado: "Avançado",
};

/** Todas as pontuações começam em 0. */
export function initialScores(): Scores {
  return Object.fromEntries(CONCEPT_ORDER.map((c) => [c, 0])) as Scores;
}

/** Calcula as pontuações após o diagnóstico (acerto +25, erro 0). */
export function scoresFromDiagnostic(
  results: { conceptCode: ConceptCode; correct: boolean }[],
  base: Scores = initialScores(),
): Scores {
  return results.reduce<Scores>(
    (acc, r) =>
      updateConceptScore(acc, r.conceptCode, r.correct ? "diagnostico_correta" : "diagnostico_errada").scores,
    { ...base },
  );
}

/** Um conceito está disponível se todos os pré-requisitos diretos têm pontuação ≥ 50. */
export function isUnlocked(concept: Concept, scores: Scores): boolean {
  return concept.prereqs.every((p) => (scores[p] ?? 0) >= PREREQ_THRESHOLD);
}

/**
 * Próximo conceito a ensinar:
 * entre os não dominados e liberados, o de menor nível no grafo;
 * desempate pela menor pontuação e depois pela ordem dos códigos.
 * Retorna null se não houver nenhum candidato.
 */
export function selectNextConcept(scores: Scores, concepts: Concept[] = CONCEPTS): ConceptCode | null {
  const order = (code: ConceptCode) => CONCEPT_ORDER.indexOf(code);
  const candidates = concepts
    .filter((c) => !isMastered(scores[c.code] ?? 0) && isUnlocked(c, scores))
    .sort(
      (a, b) =>
        a.level - b.level ||
        (scores[a.code] ?? 0) - (scores[b.code] ?? 0) ||
        order(a.code) - order(b.code),
    );
  return candidates[0]?.code ?? null;
}

/** Meta do dia escolhida pelo aluno. "auto" = o app escolhe. */
export type StudyGoal = "vocabulario" | "gramatica" | "leitura" | "variedades" | "auto";

export const GOAL_LABEL: Record<StudyGoal, string> = {
  vocabulario: "Vocabulário",
  gramatica: "Gramática em contexto",
  leitura: "Leitura de textos",
  variedades: "Variedades e gírias",
  auto: "O app escolhe por mim",
};

/** Áreas do grafo cobertas por cada meta (null = todas). */
export const GOAL_AREAS: Record<StudyGoal, Area[] | null> = {
  vocabulario: ["V"],
  gramatica: ["G"],
  leitura: ["T", "L"],
  variedades: ["C"],
  auto: null,
};

/**
 * Próximo conceito respeitando a meta do dia: aplica a regra geral só dentro das áreas da meta.
 * Se nenhum conceito da área estiver disponível, usa a regra geral e marca fallback = true.
 */
export function selectNextConceptForGoal(
  scores: Scores,
  goal: StudyGoal,
  concepts: Concept[] = CONCEPTS,
): { code: ConceptCode | null; fallback: boolean } {
  const areas = GOAL_AREAS[goal];
  if (!areas) return { code: selectNextConcept(scores, concepts), fallback: false };
  const inArea = selectNextConcept(scores, concepts.filter((c) => areas.includes(c.area)));
  if (inArea) return { code: inArea, fallback: false };
  return { code: selectNextConcept(scores, concepts), fallback: true };
}

export type ActivityKind = "flashcards" | "video" | "mission";

/** Tipo de atividade pela área: V → cartões; T, L e C → vídeo com diálogo; G → missão. */
export function chooseActivity(concept: Pick<Concept, "area">): ActivityKind {
  if (concept.area === "V") return "flashcards";
  if (concept.area === "G") return "mission";
  return "video";
}

/** Resultado de uma missão: todos os passos certos de primeira = correta; maioria errada = errada; senão parcial. */
export type MissionResult = "correta" | "parcial" | "errada";
export function classifyMissionSteps(firstTryCorrect: boolean[]): MissionResult {
  const ok = firstTryCorrect.filter(Boolean).length;
  const wrong = firstTryCorrect.length - ok;
  if (firstTryCorrect.length > 0 && wrong === 0) return "correta";
  if (wrong > firstTryCorrect.length / 2) return "errada";
  return "parcial";
}

/**
 * Evento de pontuação para uma resposta.
 * Erro sem nenhuma ajuda antes = 0 (sem evento); erro depois de ajuda = −5.
 */
export function eventForAnswer(result: MissionResult, afterHint: boolean): ScoreEvent | null {
  if (result === "correta") return afterHint ? "correta_apos_dica" : "correta_primeira";
  if (result === "parcial") return "parcial";
  return afterHint ? "errada_apos_dica" : null;
}

/** A fase extra (C2) aparece quando C1 e V3 chegam a 50. */
export function isExtraPhaseUnlocked(scores: Scores): boolean {
  return (scores.C1 ?? 0) >= PREREQ_THRESHOLD && (scores.V3 ?? 0) >= PREREQ_THRESHOLD;
}

/** Meta diária de pontos. */
export const DAILY_POINTS_GOAL = 20;

/** Moedas da sessão: floor(pontos ganhos / 5) + 1 moeda a cada 10 min de foco (máx. 3). */
export function computeSessionCoins(scoreGained: number, activeMs: number): {
  fromScore: number;
  fromTime: number;
  total: number;
} {
  const fromScore = Math.max(0, Math.floor(scoreGained / 5));
  const fromTime = Math.min(3, Math.floor(activeMs / (10 * 60 * 1000)));
  return { fromScore, fromTime, total: fromScore + fromTime };
}
