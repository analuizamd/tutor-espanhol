/** Tipos compartilhados pelo conteúdo ENEM (questões, cartões, diálogos, missões). */
import type { ConceptCode } from "./concepts";

export type OptionLetter = "A" | "B" | "C" | "D" | "E";
export const LETTERS: OptionLetter[] = ["A", "B", "C", "D", "E"];

/** Questão no estilo ENEM: texto de apoio, enunciado em espanhol e 5 alternativas. */
export interface EnemQuestion {
  id: string;
  conceptCode?: ConceptCode;
  /** Texto de apoio (opcional). */
  text?: string;
  /** Fonte/gênero do texto de apoio, ex.: "Tirinha", "Notícia". */
  source?: string;
  prompt: string;
  options: [string, string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3 | 4;
  /** Sugestão (degrau 2 da escada de dicas). */
  tipPt: string;
  tipEs: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  example: string;
  /** Nota quando é falso amigo. */
  falseFriend?: string;
}

export interface SubtitleLine {
  /** Segundo em que a fala começa. */
  at: number;
  speaker: string;
  es: string;
  pt: string;
}

export interface Dialogue {
  id: string;
  title: string;
  /** Pessoas e de onde são (aparece no player). */
  speakers: { name: string; from: string }[];
  /** URL de vídeo real — vazio por enquanto (player simulado). */
  videoUrl: string;
  durationSec: number;
  lines: SubtitleLine[];
  summary: string;
  questions: EnemQuestion[];
}

export interface MissionStep {
  /** Fala do outro personagem. */
  npc: string;
  options: [string, string, string];
  correctIndex: 0 | 1 | 2;
  tipPt: string;
}

export interface Mission {
  id: string;
  conceptCode: ConceptCode;
  title: string;
  situation: string;
  npcName: string;
  steps: MissionStep[];
}
