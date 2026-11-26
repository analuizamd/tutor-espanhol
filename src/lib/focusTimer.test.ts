import { describe, expect, it } from "vitest";

import { formatMmSs, isFocusActive } from "./focusTimer";

const base = { now: 1_000_000, visible: true, lastInteractionAt: null, lastActivityAt: null, videoPlaying: false };

describe("cronômetro de foco", () => {
  it("conta com interação nos últimos 60 s e pausa depois", () => {
    expect(isFocusActive({ ...base, lastInteractionAt: base.now - 59_000 })).toBe(true);
    expect(isFocusActive({ ...base, lastInteractionAt: base.now - 61_000 })).toBe(false);
  });
  it("conta até 3 min depois de uma nova atividade", () => {
    expect(isFocusActive({ ...base, lastActivityAt: base.now - 179_000 })).toBe(true);
    expect(isFocusActive({ ...base, lastActivityAt: base.now - 181_000 })).toBe(false);
  });
  it("conta enquanto o vídeo toca e pausa com a aba escondida", () => {
    expect(isFocusActive({ ...base, videoPlaying: true })).toBe(true);
    expect(isFocusActive({ ...base, videoPlaying: true, visible: false })).toBe(false);
  });
  it("formata mm:ss", () => {
    expect(formatMmSs(65_000)).toBe("01:05");
  });
});
