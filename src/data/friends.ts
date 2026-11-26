/**
 * Amigos SIMULADOS (dados falsos). Nunca exibimos notas ou pontuações dos amigos —
 * apenas constância (dias seguidos) e crescimento (pontos ganhos na semana).
 */
import type { Placements } from "./room";

export interface Friend {
  id: string;
  name: string;
  avatar: string; // emoji
  city: string;
  constancia: number;
  crescimento: number;
  placements: Placements;
}

export const FRIENDS: Friend[] = [
  {
    id: "camila", name: "Camila", avatar: "🦊", city: "Recife",
    constancia: 12, crescimento: 86,
    placements: { "parede-1": "poster-albiceleste", "prateleira-1": "mate", "mesa-2": "paella", "chao-1": "guitarra", "parede-3": "bandeira-uruguai" },
  },
  {
    id: "joao", name: "João", avatar: "🐢", city: "Porto Alegre",
    constancia: 5, crescimento: 42,
    placements: { "mesa-1": "mate", "mesa-3": "alfajores", "chao-2": "candombe", "parede-2": "poster-palacio-salvo" },
  },
  {
    id: "bia", name: "Beatriz", avatar: "🦉", city: "Belo Horizonte",
    constancia: 21, crescimento: 63,
    placements: { "parede-2": "abanico", "prateleira-2": "azulejo", "prateleira-3": "bandoneon", "mesa-2": "paella", "chao-1": "guitarra", "parede-1": "poster-obelisco" },
  },
  {
    id: "rafa", name: "Rafael", avatar: "🐙", city: "Manaus",
    constancia: 2, crescimento: 18,
    placements: { "mesa-2": "alfajores" },
  },
];

export const FRIEND_BY_ID: Record<string, Friend> = Object.fromEntries(FRIENDS.map((f) => [f.id, f]));
