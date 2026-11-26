/**
 * Espaços pré-definidos do quarto onde os objetos podem ser colocados.
 * Posições em % relativas à cena (left/top = centro do objeto).
 */
export type SlotKind = "parede" | "prateleira" | "mesa" | "chao";

export interface RoomSlot {
  id: string;
  kind: SlotKind;
  label: string;
  left: number;
  top: number;
  size: number; // tamanho do emoji em % da largura da cena
}

export const ROOM_SLOTS: RoomSlot[] = [
  { id: "parede-1", kind: "parede", label: "Parede (esquerda)", left: 12, top: 26, size: 9 },
  { id: "parede-2", kind: "parede", label: "Parede (centro)", left: 51, top: 19, size: 8 },
  { id: "parede-3", kind: "parede", label: "Parede (direita)", left: 88, top: 22, size: 8 },
  { id: "prateleira-1", kind: "prateleira", label: "Prateleira 1", left: 64, top: 33.5, size: 6.5 },
  { id: "prateleira-2", kind: "prateleira", label: "Prateleira 2", left: 73, top: 33.5, size: 6.5 },
  { id: "prateleira-3", kind: "prateleira", label: "Prateleira 3", left: 82, top: 33.5, size: 6.5 },
  { id: "mesa-1", kind: "mesa", label: "Mesa (esquerda)", left: 52, top: 59, size: 7 },
  { id: "mesa-2", kind: "mesa", label: "Mesa (centro)", left: 62, top: 59, size: 7 },
  { id: "mesa-3", kind: "mesa", label: "Mesa (direita)", left: 72, top: 59, size: 7 },
  { id: "chao-1", kind: "chao", label: "Chão (esquerda)", left: 16, top: 78, size: 12 },
  { id: "chao-2", kind: "chao", label: "Chão (direita)", left: 90, top: 80, size: 12 },
];

export type Placements = Record<string, string | undefined>; // slotId -> itemId
