import { describe, expect, it } from "vitest";

import {
  applyScoreEvent,
  chooseActivity,
  classifyMissionSteps,
  computeSessionCoins,
  eventForAnswer,
  getLevel,
  initialScores,
  isExtraPhaseUnlocked,
  scoresFromDiagnostic,
  selectNextConcept,
  selectNextConceptForGoal,
  updateConceptScore,
} from "./studentModel";

describe("regras de pontuação", () => {
  it("acerto no diagnóstico vale +25 e erro vale 0", () => {
    const s = scoresFromDiagnostic([
      { conceptCode: "V1", correct: true },
      { conceptCode: "G1", correct: false },
    ]);
    expect(s.V1).toBe(25);
    expect(s.G1).toBe(0);
    expect(s.L6).toBe(0);
  });
  it("correta de primeira +15, após dica +7, parcial +3", () => {
    expect(applyScoreEvent(40, "correta_primeira")).toBe(55);
    expect(applyScoreEvent(40, "correta_apos_dica")).toBe(47);
    expect(applyScoreEvent(40, "parcial")).toBe(43);
  });
  it("errada após dica −5; ajuda e explicação 0", () => {
    expect(applyScoreEvent(40, "errada_apos_dica")).toBe(35);
    expect(applyScoreEvent(40, "pedido_ajuda")).toBe(40);
    expect(applyScoreEvent(40, "pedido_explicacao")).toBe(40);
  });
  it("erro sem ajuda não tem evento (0); erro após ajuda é −5", () => {
    expect(eventForAnswer("errada", false)).toBeNull();
    expect(eventForAnswer("errada", true)).toBe("errada_apos_dica");
    expect(eventForAnswer("correta", true)).toBe("correta_apos_dica");
  });
  it("pontuação fica sempre entre 0 e 100", () => {
    expect(applyScoreEvent(2, "errada_apos_dica")).toBe(0);
    expect(applyScoreEvent(95, "correta_primeira")).toBe(100);
    const { delta } = updateConceptScore({ ...initialScores(), V1: 98 }, "V1", "correta_primeira");
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

describe("seleção do próximo conceito", () => {
  it("escolhe o menor nível, depois menor pontuação, depois ordem do código", () => {
    const s = { ...initialScores(), V1: 20, G1: 10, T1: 10 };
    expect(selectNextConcept(s)).toBe("G1");
  });
  it("só libera conceitos com todos os pré-requisitos ≥ 50", () => {
    const s = { ...initialScores(), V1: 80, G1: 80, T1: 49 };
    // V4 precisa de V1 e T1; T1 ainda não dominado vem antes (nível 0)
    expect(selectNextConcept(s)).toBe("T1");
    const s2 = { ...s, T1: 80 };
    expect(selectNextConcept(s2)).toBe("V2");
  });
  it("meta de área aplica a regra só dentro da área", () => {
    const s = { ...initialScores(), V1: 80, G1: 80, T1: 80 };
    expect(selectNextConceptForGoal(s, "gramatica")).toEqual({ code: "G2", fallback: false });
    expect(selectNextConceptForGoal(s, "leitura")).toEqual({ code: "V2", fallback: true });
  });
  it("sem conceito disponível na área, volta para a regra geral com aviso", () => {
    const s = initialScores();
    expect(selectNextConceptForGoal(s, "variedades")).toEqual({ code: "V1", fallback: true });
  });
});

describe("atividades", () => {
  it("V → cartões, G → missão, T/L/C → vídeo", () => {
    expect(chooseActivity({ area: "V" })).toBe("flashcards");
    expect(chooseActivity({ area: "G" })).toBe("mission");
    expect(chooseActivity({ area: "T" })).toBe("video");
    expect(chooseActivity({ area: "L" })).toBe("video");
    expect(chooseActivity({ area: "C" })).toBe("video");
  });
  it("missão: tudo certo = correta, alguns = parcial, maioria errada = errada", () => {
    expect(classifyMissionSteps([true, true, true])).toBe("correta");
    expect(classifyMissionSteps([true, false, true])).toBe("parcial");
    expect(classifyMissionSteps([false, false, true])).toBe("errada");
  });
  it("fase extra libera com C1 e V3 ≥ 50", () => {
    expect(isExtraPhaseUnlocked({ ...initialScores(), C1: 50, V3: 49 })).toBe(false);
    expect(isExtraPhaseUnlocked({ ...initialScores(), C1: 50, V3: 50 })).toBe(true);
  });
});

describe("moedas", () => {
  it("floor(pontos/5) + 1 por 10 min, máx. 3", () => {
    expect(computeSessionCoins(23, 0).total).toBe(4);
    expect(computeSessionCoins(10, 25 * 60 * 1000).total).toBe(4);
    expect(computeSessionCoins(0, 90 * 60 * 1000).fromTime).toBe(3);
  });
});
