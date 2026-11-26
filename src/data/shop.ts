/**
 * Loja cultural: objetos de Argentina, Uruguai e Espanha que podem decorar o quarto.
 * `kinds` diz em quais tipos de espaço do quarto o objeto pode ficar.
 */
import type { SlotKind } from "./room";

export interface ShopItem {
  id: string;
  name: string;
  country: "Argentina" | "Uruguai" | "Espanha";
  flag: string;
  emoji: string;
  price: number;
  kinds: SlotKind[];
  description: string;
}

export const SHOP_ITEMS: ShopItem[] = [
  { id: "mate", name: "Mate e bombilla", country: "Argentina", flag: "🇦🇷", emoji: "🧉", price: 8, kinds: ["mesa", "prateleira"], description: "A bebida que se compartilha entre amigos." },
  { id: "bandoneon", name: "Bandoneón", country: "Argentina", flag: "🇦🇷", emoji: "🪗", price: 15, kinds: ["prateleira", "chao"], description: "A alma do tango portenho." },
  { id: "alfajores", name: "Alfajores", country: "Argentina", flag: "🇦🇷", emoji: "🍪", price: 5, kinds: ["mesa", "prateleira"], description: "Com doce de leite, claro." },
  { id: "poncho", name: "Poncho", country: "Argentina", flag: "🇦🇷", emoji: "🧣", price: 9, kinds: ["parede"], description: "Tecido tradicional do norte argentino." },
  { id: "candombe", name: "Tambor de candombe", country: "Uruguai", flag: "🇺🇾", emoji: "🥁", price: 12, kinds: ["chao"], description: "O ritmo das ruas de Montevidéu." },
  { id: "sol", name: "Sol de Mayo", country: "Uruguai", flag: "🇺🇾", emoji: "🌞", price: 7, kinds: ["parede"], description: "Símbolo que brilha na bandeira uruguaia." },
  { id: "abanico", name: "Leque (abanico)", country: "Espanha", flag: "🇪🇸", emoji: "🪭", price: 6, kinds: ["parede", "prateleira"], description: "Clássico do verão andaluz." },
  { id: "paella", name: "Paella", country: "Espanha", flag: "🇪🇸", emoji: "🥘", price: 10, kinds: ["mesa"], description: "Arroz valenciano para dividir." },
  { id: "guitarra", name: "Guitarra espanhola", country: "Espanha", flag: "🇪🇸", emoji: "🎸", price: 18, kinds: ["chao"], description: "Cordas de nylon e muito flamenco." },
  { id: "azulejo", name: "Azulejo andaluz", country: "Espanha", flag: "🇪🇸", emoji: "🔷", price: 6, kinds: ["parede", "prateleira"], description: "Cerâmica pintada à mão." },
];

export const SHOP_BY_ID: Record<string, ShopItem> = Object.fromEntries(SHOP_ITEMS.map((i) => [i.id, i]));
