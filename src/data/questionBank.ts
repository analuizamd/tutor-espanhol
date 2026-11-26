/** Índice de todas as questões de alternativa (vocabulário + diálogos) por id. */
import { DIALOGUES, SLANG_DIALOGUES } from "./dialogues";
import type { Dialogue, EnemQuestion } from "./enem";
import { VOCAB_QUESTIONS } from "./questions";

export const ALL_DIALOGUES: Dialogue[] = [...DIALOGUES, ...Object.values(SLANG_DIALOGUES)];
export const DIALOGUE_BY_ID = Object.fromEntries(ALL_DIALOGUES.map((d) => [d.id, d])) as Record<string, Dialogue>;

export const QUESTION_BY_ID: Record<string, EnemQuestion> = Object.fromEntries(
  [...VOCAB_QUESTIONS, ...ALL_DIALOGUES.flatMap((d) => d.questions)].map((q) => [q.id, q]),
);
