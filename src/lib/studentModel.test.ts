import { describe, expect, it } from "vitest";

import {
  applyScoreEvent,
  computeSessionCoins,
  eventForAnswer,
  getLevel,
  initialScores,
  lessonLearned,
  scoresFromDiagnostic,
  selectNextConcept,
  selectNextConceptForGoal,
  updateConceptScore,
} from "./studentModel";

describe("regras de pontuação", () => {
  it("acerto no diagnóstico vale +25 e erro vale 0", () => {
    const s = scoresFromDiagnostic([
      { conceptCode: "A1.1", correct: true },
      { conceptCode: "A1.2", correct: false },
    ]);
    expect(s["A1.1"]).toBe(25);
    expect(s["A1.2"]).toBe(0);
    expect(s["A2.6"]).toBe(0);
  });
  it("correta de primeira +15, após ajuda +7, errada após ajuda −5", () => {
    expect(applyScoreEvent(40, "correta_primeira")).toBe(55);
    expect(applyScoreEvent(40, "correta_apos_dica")).toBe(47);
    expect(applyScoreEvent(40, "errada_apos_dica")).toBe(35);
    expect(applyScoreEvent(40, "pedido_ajuda")).toBe(40);
  });
  it("erro sem ajuda não tem evento; depois da ajuda/mini-aula é −5", () => {
    expect(eventForAnswer("errada", false)).toBeNull();
    expect(eventForAnswer("errada", true)).toBe("errada_apos_dica");
    expect(eventForAnswer("correta", true)).toBe("correta_apos_dica");
    expect(eventForAnswer("correta", false)).toBe("correta_primeira");
  });
  it("pontuação fica sempre entre 0 e 100", () => {
    expect(applyScoreEvent(2, "errada_apos_dica")).toBe(0);
    expect(applyScoreEvent(95, "correta_primeira")).toBe(100);
    const { delta } = updateConceptScore({ ...initialScores(), "A1.1": 98 }, "A1.1", "correta_primeira");
    expect(delta).toBe(2);
  });
});

describe("níveis", () => {
  it("Básico < 30, Médio 30–69, Avançado ≥ 70", () => {
    expect(getLevel(29)).toBe("basico");
    expect(getLevel(30)).toBe("medio");
    expect(getLevel(69)).toBe("medio");
    expect(getLevel(70)).toBe("avancado");
  });
});

describe("seleção da próxima aula", () => {
  it("começa pela A1.1", () => {
    expect(selectNextConcept(initialScores())).toBe("A1.1");
  });
  it("só libera aulas com todos os pré-requisitos ≥ 50; menor nível primeiro, depois menor pontuação", () => {
    const s = { ...initialScores(), "A1.1": 80, "A1.2": 40 };
    // A1.2 e A1.3 (nível 1) estão liberadas; A1.3 tem menor pontuação
    expect(selectNextConcept(s)).toBe("A1.3");
    // A1.5 precisa de A1.2 e A1.3 ≥ 50
    const s2 = { ...s, "A1.2": 80, "A1.3": 49 };
    expect(selectNextConcept(s2)).toBe("A1.3");
    const s3 = { ...s2, "A1.3": 80 };
    expect(selectNextConcept(s3)).toBe("A1.4");
  });
  it("meta A2 sem aula A2 liberada volta para a regra geral com aviso", () => {
    expect(selectNextConceptForGoal(initialScores(), "a2")).toEqual({ code: "A1.1", fallback: true });
    expect(selectNextConceptForGoal(initialScores(), "a1")).toEqual({ code: "A1.1", fallback: false });
  });
  it("meta A2 escolhe dentro do A2 quando possível", () => {
    const s = { ...initialScores(), "A1.1": 80, "A1.2": 80, "A1.3": 80, "A1.4": 80, "A1.5": 80 };
    expect(selectNextConceptForGoal(s, "a2")).toEqual({ code: "A2.1", fallback: false });
  });
});

describe("aula", () => {
  it("aprendida quando nenhuma pergunta termina em erro", () => {
    expect(lessonLearned(["primeira", "ensinado", "com_ajuda"])).toBe(true);
    expect(lessonLearned(["primeira", "errou"])).toBe(false);
    expect(lessonLearned([])).toBe(false);
  });
});

describe("moedas", () => {
  it("floor(pontos/5) + 1 por 10 min, máx. 3", () => {
    expect(computeSessionCoins(23, 0).total).toBe(4);
    expect(computeSessionCoins(10, 25 * 60 * 1000).total).toBe(4);
    expect(computeSessionCoins(0, 90 * 60 * 1000).fromTime).toBe(3);
  });
});
