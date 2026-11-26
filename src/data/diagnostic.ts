/**
 * Diagnóstico inicial: 8 perguntas rápidas de A1/A2 (4 alternativas), uma por aula avaliada.
 * Cada acerto vale +25 na aula correspondente.
 */
import type { ConceptCode } from "./concepts";

export interface DiagnosticQuestion {
  id: string;
  conceptCode: ConceptCode;
  /** Situação ou texto curto (opcional). */
  text?: string;
  prompt: string;
  options: string[];
  correctIndex: number;
}

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: "D-A1.1", conceptCode: "A1.1",
    text: "— ¡Hola! ¿Cómo te llamas?",
    prompt: "Qual é a melhor resposta?",
    options: ["Me llamo Ana.", "Tengo diez años.", "Soy de Brasil.", "Muy bien."], correctIndex: 0,
  },
  {
    id: "D-A1.2", conceptCode: "A1.2",
    prompt: "Como se diz «Eu tenho 18 anos»?",
    options: ["Soy dieciocho años.", "Tengo dieciocho años.", "Estoy dieciocho años.", "Hay dieciocho años."], correctIndex: 1,
  },
  {
    id: "D-A1.3", conceptCode: "A1.3",
    text: "La madre de mi madre es mi…",
    prompt: "Complete a frase:",
    options: ["hermana.", "tía.", "abuela.", "prima."], correctIndex: 2,
  },
  {
    id: "D-A1.4", conceptCode: "A1.4",
    prompt: "Na cafeteria, você quer saber o preço. Você pergunta:",
    options: ["¿Qué hora es?", "¿Cuánto es?", "¿Dónde está?", "¿Cómo te llamas?"], correctIndex: 1,
  },
  {
    id: "D-A1.5", conceptCode: "A1.5",
    prompt: "«Son las tres y media» é:",
    options: ["3:15", "3:30", "2:30", "3:45"], correctIndex: 1,
  },
  {
    id: "D-A2.1", conceptCode: "A2.1",
    text: "La chaqueta me queda grande.",
    prompt: "O que a pessoa quer dizer?",
    options: ["A jaqueta ficou grande nela.", "A jaqueta ficou em casa.", "A jaqueta é muito cara.", "Ela quer uma jaqueta grande."], correctIndex: 0,
  },
  {
    id: "D-A2.3", conceptCode: "A2.3",
    prompt: "Complete: «Ayer ___ al cine con mis amigos.»",
    options: ["voy", "fui", "voy a", "iré"], correctIndex: 1,
  },
  {
    id: "D-A2.6", conceptCode: "A2.6",
    text: "— Che, ¿vos sos de Buenos Aires?",
    prompt: "«Vos sos» equivale a:",
    options: ["tú eres", "usted es", "yo soy", "vosotros sois"], correctIndex: 0,
  },
];
