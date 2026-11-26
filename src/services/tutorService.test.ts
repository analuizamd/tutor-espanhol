import { describe, expect, it } from "vitest";

import { DIALOGUES } from "@/data/dialogues";
import { MISSIONS } from "@/data/missions";
import { classifyAnswer, getExplanation, getHint } from "./tutorService";
import { CONCEPT_BY_CODE } from "@/data/concepts";

const q = DIALOGUES[0]!.questions[0]!;

describe("tutor simulado", () => {
  it("missão: correta, parcial e errada", () => {
    expect(classifyAnswer([true, true, true])).toBe("correta");
    expect(classifyAnswer([true, true, false])).toBe("parcial");
    expect(classifyAnswer([false, false, true])).toBe("errada");
  });
  it("explicação em português no Básico e em espanhol no Avançado", () => {
    expect(getExplanation(CONCEPT_BY_CODE.G1, 10).language).toBe("pt");
    expect(getExplanation(CONCEPT_BY_CODE.G1, 80).language).toBe("es");
  });
  it("o degrau 4 da dica mostra a alternativa correta", () => {
    expect(getHint(4, q, "L1", 10).text).toContain(q.options[q.correctIndex]);
  });
  it("toda missão tem 3 ou 4 passos com 3 falas", () => {
    for (const m of MISSIONS) {
      expect(m.steps.length).toBeGreaterThanOrEqual(3);
      expect(m.steps.length).toBeLessThanOrEqual(4);
      for (const s of m.steps) expect(s.options).toHaveLength(3);
    }
  });
});
