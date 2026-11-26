/**
 * Espaços pré-definidos do quarto onde os objetos podem ser colocados.
 * left/top em % da cena. Na parede, (left, top) é o centro do objeto;
 * na prateleira, na mesa e no chão é o ponto de apoio (meio da base do objeto).
 * w/h = caixa máxima do objeto, em % da largura da cena (cqw).
 */
export type SlotKind = "parede" | "prateleira" | "mesa" | "chao";

export interface RoomSlot {
  id: string;
  kind: SlotKind;
  label: string;
  left: number;
  top: number;
  w: number;
  h: number;
}

export const ROOM_SLOTS: RoomSlot[] = [
  { id: "parede-1", kind: "parede", label: "Parede (esquerda)", left: 10, top: 25, w: 13, h: 17 },
  { id: "parede-2", kind: "parede", label: "Parede (centro)", left: 51, top: 20, w: 12, h: 16 },
  { id: "parede-3", kind: "parede", label: "Parede (direita)", left: 91, top: 24, w: 12, h: 16 },
  { id: "prateleira-1", kind: "prateleira", label: "Prateleira 1", left: 63, top: 38, w: 9, h: 11 },
  { id: "prateleira-2", kind: "prateleira", label: "Prateleira 2", left: 73, top: 38, w: 9, h: 11 },
  { id: "prateleira-3", kind: "prateleira", label: "Prateleira 3", left: 83, top: 38, w: 9, h: 11 },
  { id: "mesa-1", kind: "mesa", label: "Mesa (esquerda)", left: 51, top: 63, w: 11, h: 11 },
  { id: "mesa-2", kind: "mesa", label: "Mesa (centro)", left: 62, top: 63, w: 11, h: 11 },
  { id: "mesa-3", kind: "mesa", label: "Mesa (direita)", left: 73, top: 63, w: 11, h: 11 },
  { id: "chao-1", kind: "chao", label: "Chão (esquerda)", left: 13, top: 94, w: 16, h: 30 },
  { id: "chao-2", kind: "chao", label: "Chão (direita)", left: 88, top: 95, w: 16, h: 30 },
];

export type Placements = Record<string, string | undefined>; // slotId -> itemId
