/**
 * Serviço do tutor — SIMULADO.
 *
 * Toda a "fala" do tutor passa por este arquivo. Hoje os textos são roteirizados (src/data/videos.ts
 * e src/data/concepts.ts) e a tradução de palavras usa o dicionário local.
 * Futuramente, um LLM real substituirá estas funções mantendo as mesmas assinaturas,
 * sem precisar mexer na interface (translateWord já é assíncrona por isso).
 *
 * A correção das perguntas é determinística e fica no app (compara com a alternativa correta).
 *
 * Método depois do vídeo: verificar → ensinar (mini-aula com o trecho do vídeo) → verificar de novo.
 * Princípio pedagógico: o tutor NÃO é socrático — nunca esconde a resposta.
 * Escada de dicas: lembrete da regra → sugestão → trecho do vídeo → resposta destacada.
 */
import type { Concept } from "@/data/concepts";
import { lookupWord, normalizeWord } from "@/data/dictionary";
import { CAST, type CheckItem, type CheckQuestion, type VideoLesson, type VideoLine } from "@/data/videos";
import { isMastered } from "@/lib/studentModel";

export type HintStep = 1 | 2 | 3 | 4;

export const HINT_STEP_LABEL: Record<HintStep, string> = {
  1: "Lembrete da regra",
  2: "Sugestão",
  3: "Trecho do vídeo",
  4: "Resposta",
};

export const LETTERS = ["A", "B", "C", "D", "E", "F"] as const;

export interface TutorText {
  text: string;
  language: "pt" | "es";
}

/** No nível Avançado o tutor fala curto e em espanhol; abaixo disso, em português. */
function speaksSpanish(score: number) {
  return isMastered(score);
}

function speakerName(line: VideoLine) {
  return CAST[line.speaker]?.name ?? line.speaker;
}

/**
 * Dica do degrau pedido para uma pergunta.
 * LLM futuro: dica personalizada a partir da alternativa marcada pelo aluno.
 */
export function getHint(step: HintStep, item: CheckItem, question: CheckQuestion, lesson: VideoLesson, concept: Concept, score = 0): TutorText {
  const es = speaksSpanish(score);
  const line = lesson.lines[question.lineIndex];
  const correct = item.options[item.correctIndex] ?? "";
  const letter = LETTERS[item.correctIndex] ?? "";
  if (step === 1) return es ? { text: concept.ruleEs, language: "es" } : { text: concept.rulePt, language: "pt" };
  if (step === 2) return { text: question.tipPt, language: "pt" };
  if (step === 3) {
    return line
      ? { text: `No vídeo, ${speakerName(line)} diz: «${line.es}» (${line.pt})`, language: "pt" }
      : { text: question.tipPt, language: "pt" };
  }
  return es
    ? { text: `Es la ${letter}: «${correct}».`, language: "es" }
    : { text: `A resposta certa é a ${letter}: «${correct}». Ela está destacada.`, language: "pt" };
}

/**
 * Mini-aula mostrada quando o aluno erra a primeira verificação.
 * LLM futuro: explicar a partir do erro específico do aluno.
 */
export function getTeaching(question: CheckQuestion, lesson: VideoLesson, wrongOption: string | null): { intro: string; text: string; line: VideoLine | null } {
  const intro = wrongOption
    ? `Você marcou «${wrongOption}». Tudo bem errar — vamos aprender esse ponto juntos.`
    : "Vamos aprender esse ponto juntos.";
  return { intro, text: question.teachPt, line: lesson.lines[question.lineIndex] ?? null };
}

/**
 * Explicação da aula: completa e em português no nível Básico/Médio; curta e em espanhol no Avançado.
 * LLM futuro: explicação adaptada às dúvidas do aluno.
 */
export function getExplanation(concept: Concept, score: number): TutorText {
  if (speaksSpanish(score)) return { text: concept.explanationEs, language: "es" };
  return { text: concept.explanationPt, language: "pt" };
}

/** Feedback curto depois de uma resposta (sempre mostra a forma correta). */
export function getFeedback(correct: boolean, correctText: string, score: number, attempt: "main" | "retry"): TutorText {
  const es = speaksSpanish(score);
  if (correct) {
    if (attempt === "retry") {
      return es ? { text: `¡Eso es! Ahora sí: «${correctText}».`, language: "es" } : { text: `Isso! Agora você aprendeu: «${correctText}». 🎉`, language: "pt" };
    }
    return es ? { text: `¡Muy bien! «${correctText}» es correcto.`, language: "es" } : { text: `Isso mesmo! «${correctText}». 🎉`, language: "pt" };
  }
  if (attempt === "retry") {
    return es
      ? { text: `Todavía no. Era «${correctText}». Vamos a repasarlo en la próxima clase.`, language: "es" }
      : { text: `Ainda não. A resposta certa era «${correctText}». Esse ponto volta na revisão da próxima aula.`, language: "pt" };
  }
  return es ? { text: "No es correcto. Vamos a verlo juntos.", language: "es" } : { text: "Ainda não é essa. Vamos ver juntos o que o vídeo ensinou 👇", language: "pt" };
}

/** Mensagem de abertura da aula. */
export function getLessonIntro(concept: Concept, lesson: VideoLesson, replay: boolean): string {
  if (replay) return `Vamos reforçar «${concept.name}». Você pode rever o vídeo ou ir direto para a verificação.`;
  return `Aula ${concept.code}: ${lesson.goalPt} Assista ao vídeo — toque em qualquer palavra da legenda para ver o que ela significa.`;
}

/** Mensagem quando o aluno termina o vídeo e começa a verificação. */
export function getCheckIntro(): string {
  return "Agora vamos ver o que você aprendeu! Se errar, eu te explico e você tenta de novo. Consultar a legenda a partir daqui conta como ajuda.";
}

export interface WordTranslation {
  word: string;
  /** Significado da palavra, ou null se não estiver no dicionário. */
  meaning: string | null;
  /** Tradução da frase inteira (sempre disponível). */
  sentencePt: string;
  source: "dicionario" | "frase";
}

/**
 * Tradução de uma palavra tocada na legenda, no contexto da frase.
 * Hoje: dicionário local. LLM futuro: traduzir considerando a frase (ex.: «queda» em «me queda grande»).
 */
export async function translateWord(word: string, line: Pick<VideoLine, "es" | "pt">): Promise<WordTranslation> {
  const clean = normalizeWord(word);
  const meaning = lookupWord(clean);
  return { word: clean, meaning, sentencePt: line.pt, source: meaning ? "dicionario" : "frase" };
}
