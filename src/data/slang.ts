/**
 * Fase extra — gírias regionais. DADOS A REVISAR PELO GRUPO antes de uso real.
 */
import type { Flashcard } from "./enem";

export type Country = "es" | "ar" | "uy";

export const COUNTRY_LABEL: Record<Country, string> = { es: "Espanha", ar: "Argentina", uy: "Uruguai" };

export const SLANG_CARDS: Record<Country, Flashcard[]> = {
  es: [
    { id: "es-guay", front: "guay", back: "legal, genial", example: "¡Qué guay tu mochila!" },
    { id: "es-vale", front: "vale", back: "ok, combinado", example: "—¿Quedamos a las seis? —¡Vale!" },
    { id: "es-mola", front: "mola", back: "curto, gosto (é legal)", example: "Me mola esta canción." },
    { id: "es-currar", front: "currar", back: "trabalhar", example: "Mañana curro todo el día." },
  ],
  ar: [
    { id: "ar-che", front: "che", back: "ei, cara", example: "Che, ¿venís al partido?" },
    { id: "ar-laburo", front: "laburo", back: "trabalho", example: "Conseguí un laburo nuevo." },
    { id: "ar-pibe", front: "pibe", back: "garoto", example: "Ese pibe juega muy bien al fútbol." },
    { id: "ar-quilombo", front: "quilombo", back: "bagunça", example: "¡Qué quilombo es tu pieza!" },
  ],
  uy: [
    { id: "uy-bo", front: "bo", back: "ei (chamar alguém)", example: "Bo, ¿todo bien?" },
    { id: "uy-ta", front: "ta", back: "ok, tá", example: "—¿Vamos? —Ta." },
    { id: "uy-guri", front: "gurí", back: "criança, menino", example: "El gurí está en la escuela." },
    { id: "uy-pila", front: "pila", back: "muito", example: "Tengo pila de deberes." },
  ],
};
