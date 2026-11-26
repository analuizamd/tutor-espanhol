/**
 * Serviço do tutor — SIMULADO.
 *
 * Toda a "fala" do tutor passa por este arquivo. Hoje os textos são roteirizados.
 * Futuramente, um LLM real substituirá estas funções mantendo as mesmas assinaturas,
 * sem precisar mexer na interface.
 *
 * A correção das questões de alternativa é determinística e fica no app (compara com a
 * alternativa correta). classifyAnswer só é usado nas missões (correta / parcial / errada).
 *
 * Princípio pedagógico: o tutor NÃO é socrático — nunca esconde a resposta.
 * Escada de dicas: lembrete da regra → sugestão → exemplo parecido → forma correta destacada.
 */
import { CONCEPT_BY_CODE, type Concept, type ConceptCode } from "@/data/concepts";
import { LETTERS, type EnemQuestion, type Flashcard, type Mission, type MissionStep } from "@/data/enem";
import { SLANG_CARDS, type Country } from "@/data/slang";
import { classifyMissionSteps, isMastered, type MissionResult } from "@/lib/studentModel";

export type HintStep = 1 | 2 | 3 | 4;

export const HINT_STEP_LABEL: Record<HintStep, string> = {
  1: "Lembrete da regra",
  2: "Sugestão",
  3: "Exemplo parecido",
  4: "Forma correta",
};

export interface TutorText {
  text: string;
  language: "pt" | "es";
}

/** No nível Avançado o tutor fala curto e em espanhol; abaixo disso, em português. */
function speaksSpanish(score: number) {
  return isMastered(score);
}

/**
 * Dica do degrau pedido para uma questão de alternativas.
 * LLM futuro: dica personalizada a partir da alternativa marcada pelo aluno.
 */
export function getHint(step: HintStep, question: EnemQuestion, conceptCode: ConceptCode, score = 0): TutorText {
  const c = CONCEPT_BY_CODE[conceptCode];
  const es = speaksSpanish(score);
  const letter = LETTERS[question.correctIndex];
  const correct = question.options[question.correctIndex];
  const texts: Record<HintStep, string> = es
    ? { 1: c.ruleEs, 2: question.tipEs, 3: `Ejemplo: ${c.exampleEs}`, 4: `Es la ${letter}: «${correct}».` }
    : { 1: c.rulePt, 2: question.tipPt, 3: `Exemplo: ${c.examplePt}`, 4: `A alternativa correta é a ${letter}: «${correct}». Ela está destacada.` };
  return { text: texts[step], language: es ? "es" : "pt" };
}

/** Dica para um passo de missão. LLM futuro: dica conforme a fala escolhida. */
export function getMissionHint(step: HintStep, missionStep: MissionStep, conceptCode: ConceptCode, score = 0): TutorText {
  const c = CONCEPT_BY_CODE[conceptCode];
  const es = speaksSpanish(score);
  const correct = missionStep.options[missionStep.correctIndex];
  const texts: Record<HintStep, string> = es
    ? { 1: c.ruleEs, 2: missionStep.tipPt, 3: `Ejemplo: ${c.exampleEs}`, 4: `Lo mejor es: «${correct}».` }
    : { 1: c.rulePt, 2: missionStep.tipPt, 3: `Exemplo: ${c.examplePt}`, 4: `A melhor fala é: «${correct}». Ela está destacada.` };
  return { text: texts[step], language: es ? "es" : "pt" };
}

/**
 * Explicação do conceito: completa e em português no nível Básico/Médio; curta e em espanhol no Avançado.
 * LLM futuro: explicação adaptada às dúvidas do aluno.
 */
export function getExplanation(concept: Concept, score: number): TutorText {
  if (speaksSpanish(score)) return { text: concept.explanationEs, language: "es" };
  return { text: concept.explanationPt, language: "pt" };
}

/** Falas da missão (hoje vêm prontas dos dados). LLM futuro: gerar falas novas por situação. */
export function getMissionLines(mission: Mission): MissionStep[] {
  return mission.steps;
}

/** Cartões de gírias por país. LLM futuro: ampliar com exemplos atuais. */
export function getSlangCards(country: Country): Flashcard[] {
  return SLANG_CARDS[country];
}

/** Classifica o resultado de uma missão a partir dos acertos de primeira em cada passo. */
export function classifyAnswer(firstTryCorrect: boolean[]): MissionResult {
  return classifyMissionSteps(firstTryCorrect);
}

/** Feedback curto depois de uma resposta (sempre mostra a forma correta). */
export function getFeedback(result: MissionResult, correctText: string, score: number): TutorText {
  const es = speaksSpanish(score);
  if (result === "correta") {
    return es ? { text: `¡Muy bien! «${correctText}» es correcto.`, language: "es" } : { text: `Isso mesmo! «${correctText}». 🎉`, language: "pt" };
  }
  if (result === "parcial") {
    return es ? { text: "¡Casi! Algunas respuestas estaban bien.", language: "es" } : { text: "Quase! Você acertou parte da missão de primeira.", language: "pt" };
  }
  return es ? { text: `No es correcto. Era «${correctText}».`, language: "es" } : { text: `Ainda não. A resposta certa era «${correctText}».`, language: "pt" };
}

/** Mensagem de abertura de cada atividade. */
export function getActivityIntro(concept: Concept, kind: "flashcards" | "video" | "mission"): string {
  if (kind === "flashcards") return `Vamos aprender: ${concept.name}. Vire os cartões e depois responda às questões.`;
  if (kind === "video") return `Assista ao diálogo sobre ${concept.name}. Toque em qualquer palavra da legenda para ver a tradução.`;
  return `Missão de ${concept.name}: escolha a melhor fala em cada passo.`;
}
