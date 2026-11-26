/**
 * Loja cultural: objetos da Argentina, do Uruguai e da Espanha para decorar o quarto.
 * Cada objeto tem uma ilustração própria em public/room/<id>.svg (nada de emoji).
 * `kinds` diz em quais tipos de espaço do quarto o objeto pode ficar.
 */
import type { SlotKind } from "./room";

export interface ShopItem {
  id: string;
  name: string;
  country: "Argentina" | "Uruguai" | "Espanha";
  /** Ilustração do objeto (caminho público). */
  image: string;
  price: number;
  kinds: SlotKind[];
  description: string;
}

const img = (id: string) => `/room/${id}.svg`;

export const SHOP_ITEMS: ShopItem[] = [
  // Argentina
  { id: "poster-albiceleste", name: "Pôster da camisa 10 albiceleste", country: "Argentina", image: img("poster-albiceleste"), price: 20, kinds: ["parede"], description: "A camisa listrada da seleção argentina, tricampeã do mundo." },
  { id: "poster-obelisco", name: "Pôster do Obelisco", country: "Argentina", image: img("poster-obelisco"), price: 14, kinds: ["parede"], description: "O símbolo de Buenos Aires, na Avenida 9 de Julio." },
  { id: "mate", name: "Mate com bombilla", country: "Argentina", image: img("mate"), price: 8, kinds: ["mesa", "prateleira"], description: "A bebida que se compartilha entre amigos." },
  { id: "alfajores", name: "Alfajores", country: "Argentina", image: img("alfajores"), price: 5, kinds: ["mesa", "prateleira"], description: "Com doce de leite, claro." },
  { id: "bandoneon", name: "Bandoneón", country: "Argentina", image: img("bandoneon"), price: 16, kinds: ["prateleira", "chao"], description: "A alma do tango portenho." },
  // Uruguai
  { id: "bandeira-uruguai", name: "Bandeira do Uruguai", country: "Uruguai", image: img("bandeira-uruguai"), price: 9, kinds: ["parede"], description: "Listras azuis e o Sol de Mayo." },
  { id: "poster-palacio-salvo", name: "Pôster do Palacio Salvo", country: "Uruguai", image: img("poster-palacio-salvo"), price: 12, kinds: ["parede"], description: "O prédio mais famoso de Montevidéu, na Plaza Independencia." },
  { id: "candombe", name: "Tambor de candombe", country: "Uruguai", image: img("candombe"), price: 12, kinds: ["chao"], description: "O ritmo das ruas de Montevidéu." },
  // Espanha
  { id: "abanico", name: "Leque flamenco (abanico)", country: "Espanha", image: img("abanico"), price: 7, kinds: ["parede", "prateleira"], description: "Clássico do verão andaluz." },
  { id: "paella", name: "Paella", country: "Espanha", image: img("paella"), price: 10, kinds: ["mesa"], description: "Arroz valenciano para dividir." },
  { id: "guitarra", name: "Guitarra espanhola", country: "Espanha", image: img("guitarra"), price: 18, kinds: ["chao"], description: "Cordas de nylon e muito flamenco." },
  { id: "azulejo", name: "Azulejo andaluz", country: "Espanha", image: img("azulejo"), price: 6, kinds: ["parede", "prateleira"], description: "Cerâmica pintada à mão." },
];

export const COUNTRY_FLAG_LABEL: Record<ShopItem["country"], string> = {
  Argentina: "AR",
  Uruguai: "UY",
  Espanha: "ES",
};

export const SHOP_BY_ID: Record<string, ShopItem> = Object.fromEntries(SHOP_ITEMS.map((i) => [i.id, i]));
