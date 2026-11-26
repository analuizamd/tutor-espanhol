import { describe, expect, it } from "vitest";

import { estimateTimings, lineAt, parseTimestamp, parseVtt, timingsFor } from "./subtitles";

const VTT = `WEBVTT

1
00:00:00.500 --> 00:00:04.000
<v Profe Carmen>¡Hola! Soy Carmen.

2
00:00:04.600 --> 00:00:06.100
<v Diego>¡Hola! Buenos días.
`;

describe("legendas", () => {
  it("lê timestamps com e sem hora", () => {
    expect(parseTimestamp("00:01:02.500")).toBe(62.5);
    expect(parseTimestamp("01:02,5")).toBe(62.5);
  });
  it("lê WebVTT e remove a tag de voz", () => {
    const cues = parseVtt(VTT);
    expect(cues).toHaveLength(2);
    expect(cues[0]).toEqual({ start: 0.5, end: 4, text: "¡Hola! Soy Carmen." });
    expect(cues[1]!.start).toBe(4.6);
  });
  it("arquivo que não é VTT (ex.: página 404) vira lista vazia", () => {
    expect(parseVtt("<!doctype html><html>")).toEqual([]);
  });
  it("usa os tempos do vídeo só se o número de falas bater", () => {
    const lines = [{ es: "¡Hola! Soy Carmen." }, { es: "¡Hola! Buenos días." }];
    expect(timingsFor(lines, parseVtt(VTT)).fromVideo).toBe(true);
    expect(timingsFor([...lines, { es: "Extra" }], parseVtt(VTT)).fromVideo).toBe(false);
  });
  it("tempos estimados crescem e lineAt acha a fala ativa", () => {
    const t = estimateTimings([{ es: "uno dos tres" }, { es: "cuatro" }]);
    expect(t[1]!.start).toBeGreaterThan(t[0]!.start);
    expect(lineAt(t, 0)).toBe(-1);
    expect(lineAt(t, t[1]!.start + 0.1)).toBe(1);
  });
});
