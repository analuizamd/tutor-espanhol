import { describe, expect, it } from "vitest";

import { CONCEPT_BY_CODE, CONCEPTS } from "@/data/concepts";
import { normalizeWord, lookupWord } from "@/data/dictionary";
import { CAST, LESSON_BY_CONCEPT, VIDEO_LESSONS } from "@/data/videos";
import { getExplanation, getFeedback, getHint, getTeaching, translateWord } from "./tutorService";

const lesson = VIDEO_LESSONS[0]!;
const question = lesson.questions[0]!;
const concept = CONCEPT_BY_CODE[lesson.conceptCode];

describe("tutor simulado", () => {
  it("explicação em português no Básico e em espanhol no Avançado", () => {
    expect(getExplanation(concept, 10).language).toBe("pt");
    expect(getExplanation(concept, 80).language).toBe("es");
  });
  it("degrau 3 mostra o trecho do vídeo e o degrau 4 a resposta", () => {
    expect(getHint(3, question.main, question, lesson, concept, 10).text).toContain(lesson.lines[question.lineIndex]!.es);
    expect(getHint(4, question.main, question, lesson, concept, 10).text).toContain(question.main.options[question.main.correctIndex]!);
  });
  it("mini-aula traz o trecho do vídeo e cita a alternativa errada", () => {
    const t = getTeaching(question, lesson, "Lucía");
    expect(t.line?.es).toBe(lesson.lines[question.lineIndex]!.es);
    expect(t.intro).toContain("Lucía");
  });
  it("feedback sempre mostra a forma correta quando a re-verificação falha", () => {
    expect(getFeedback(false, "Diego", 10, "retry").text).toContain("Diego");
  });
  it("traduz palavra da legenda e sempre devolve a frase", async () => {
    const line = lesson.lines[3]!;
    const t = await translateWord("llamo.", line);
    expect(t.meaning).toContain("chamo");
    expect(t.sentencePt).toBe(line.pt);
  });
});

describe("conteúdo dos vídeos", () => {
  it("toda aula tem um vídeo", () => {
    for (const c of CONCEPTS) expect(LESSON_BY_CONCEPT[c.code], c.code).toBeDefined();
  });
  it("perguntas apontam para falas que existem e têm alternativa correta válida", () => {
    for (const l of VIDEO_LESSONS) {
      expect(l.questions.length, l.id).toBeGreaterThanOrEqual(3);
      for (const q of l.questions) {
        expect(l.lines[q.lineIndex], q.id).toBeDefined();
        for (const item of [q.main, q.retry]) {
          expect(item.options[item.correctIndex], q.id).toBeDefined();
          expect(new Set(item.options).size, `${q.id} alternativas repetidas`).toBe(item.options.length);
        }
      }
    }
  });
  it("todos os personagens estão no elenco", () => {
    for (const l of VIDEO_LESSONS) for (const line of l.lines) expect(CAST[line.speaker], `${l.id}: ${line.speaker}`).toBeDefined();
  });
  it("toda palavra das legendas tem tradução no dicionário", () => {
    const missing = new Set<string>();
    for (const l of VIDEO_LESSONS)
      for (const line of l.lines)
        for (const w of line.es.split(/\s+/)) {
          const n = normalizeWord(w);
          if (n && !lookupWord(n)) missing.add(n);
        }
    expect([...missing]).toEqual([]);
  });
});
