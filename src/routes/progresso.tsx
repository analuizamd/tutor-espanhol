import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Check, Lock, PlayCircle } from "lucide-react";
import { useState } from "react";

import { AREA_CLASS, LevelBadge, LevelPill, ScoreBar } from "@/components/app/LevelIcon";
import { ConceptGraph, GRAPH_WIDTH } from "@/components/progress/ConceptGraph";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { APP_NAME } from "@/config/app";
import { CONCEPTS, CONCEPT_BY_CODE, AREA_LABEL, type Area, type ConceptCode } from "@/data/concepts";
import { getLevel, isUnlocked, PREREQ_THRESHOLD, selectNextConcept } from "@/lib/studentModel";
import { Button } from "@/components/ui/button";
import { LESSON_BY_CONCEPT } from "@/data/videos";
import { useAppState } from "@/state/AppState";
import { useStudySession } from "@/state/StudySession";

export const Route = createFileRoute("/progresso")({
  head: () => ({
    meta: [
      { title: `Progresso · ${APP_NAME}` },
      { name: "description", content: "Mapa das aulas de espanhol A1 e A2: acompanhe seu domínio e os próximos passos." },
      { property: "og:title", content: `Progresso · ${APP_NAME}` },
      { property: "og:description", content: "Mapa das aulas de espanhol A1 e A2: acompanhe seu domínio e os próximos passos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  const { data } = useAppState();
  const [selected, setSelected] = useState<ConceptCode | null>(null);
  const next = selectNextConcept(data.scores);
  const counts = { basico: 0, medio: 0, avancado: 0 };
  CONCEPTS.forEach((c) => counts[getLevel(data.scores[c.code])]++);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <h1 className="text-3xl font-extrabold">Progresso</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        As setas mostram os pré-requisitos. Uma aula é liberada quando as aulas anteriores chegam a {PREREQ_THRESHOLD} pontos.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Legend level="basico" label="Básico (< 30)" count={counts.basico} />
        <Legend level="medio" label="Médio (30–69)" count={counts.medio} />
        <Legend level="avancado" label="Avançado (≥ 70)" count={counts.avancado} />
        {next && (
          <Button variant="hero"
            onClick={() => setSelected(next)}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-lift"
          >
            Próximo: {next} · {CONCEPT_BY_CODE[next].name} <ArrowRight className="size-3.5" />
          </Button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {(Object.keys(AREA_LABEL) as Area[]).map((area) => <span key={area} className="flex items-center gap-1.5 text-xs"><span className={`size-2.5 rounded-full ${AREA_CLASS[area].solid}`} />{AREA_LABEL[area]}</span>)}
      </div>
      <div className="mt-5 overflow-x-auto p-3 sm:p-5">
        <div style={{ minWidth: GRAPH_WIDTH * 0.82 }}>
          <ConceptGraph scores={data.scores} nextCode={next} onSelect={setSelected} selected={selected} />
        </div>
      </div>


      <ConceptDrawer code={selected} onClose={() => setSelected(null)} isNext={selected === next} />
    </div>
  );
}

function Legend({ level, label, count }: { level: "basico" | "medio" | "avancado"; label: string; count: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold">
      <LevelBadge level={level} /> {label} · {count}
    </span>
  );
}

function ConceptDrawer({ code, onClose, isNext }: { code: ConceptCode | null; onClose: () => void; isNext: boolean }) {
  const { data } = useAppState();
  const study = useStudySession();
  const navigate = useNavigate();
  const concept = code ? CONCEPT_BY_CODE[code] : null;
  const lesson = concept ? LESSON_BY_CONCEPT[concept.code] : null;
  const unlocked = concept ? isUnlocked(concept, data.scores) : false;
  const dependents = concept ? CONCEPTS.filter((c) => c.prereqs.includes(concept.code)) : [];
  return (
    <Sheet open={!!concept} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        {concept && (
          <>
            <SheetHeader>
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-ocean px-2 py-1 font-display text-sm font-extrabold text-ocean-foreground">{concept.code}</span>
                <span className="text-xs font-semibold text-muted-foreground">{AREA_LABEL[concept.area]}</span>
                {isNext && <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">Próximo</span>}
              </div>
              <SheetTitle className="font-display text-2xl">{concept.name}</SheetTitle>
              <SheetDescription>
                {lesson && <span lang="es" className="font-semibold text-foreground">Vídeo: {lesson.title}. </span>}
                {unlocked ? "Aula liberada." : "Ainda bloqueada: fortaleça as aulas anteriores."}
              </SheetDescription>
            </SheetHeader>

            <div className="mt-5 rounded-2xl bg-secondary p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Sua pontuação</span>
                <span className="font-display text-2xl font-extrabold tabular-nums">{data.scores[concept.code]}/100</span>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <ScoreBar score={data.scores[concept.code]} />
                <LevelPill score={data.scores[concept.code]} />
              </div>
            </div>

            <h3 className="mt-6 text-sm font-bold">Pré-requisitos</h3>
            {concept.prereqs.length === 0 ? (
              <p className="mt-1 text-sm text-muted-foreground">Nenhum — é um ponto de partida.</p>
            ) : (
              <ul className="mt-2 flex flex-col gap-2">
                {concept.prereqs.map((p) => {
                  const s = data.scores[p];
                  const ok = s >= PREREQ_THRESHOLD;
                  return (
                    <li key={p} className="flex items-center gap-2 rounded-xl border border-border p-2.5 text-sm">
                      {ok ? <Check className="size-4 text-success" /> : <Lock className="size-4 text-muted-foreground" />}
                      <span className="font-bold">{p}</span>
                      <span className="flex-1 truncate text-muted-foreground">{CONCEPT_BY_CODE[p].name}</span>
                      <span className="font-display font-bold tabular-nums">{s}</span>
                    </li>
                  );
                })}
              </ul>
            )}

            {dependents.length > 0 && (
              <>
                <h3 className="mt-6 text-sm font-bold">Abre caminho para</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {dependents.map((d) => (
                    <span key={d.code} className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold">
                      {d.code} · {d.name}
                    </span>
                  ))}
                </div>
              </>
            )}

            <h3 className="mt-6 text-sm font-bold">Resumo</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{concept.explanationPt}</p>

            <Button
              variant="hero"
              size="xl"
              className="mt-6 w-full"
              disabled={!unlocked || study.session.status === "ended"}
              onClick={() => {
                study.startLesson(concept.code);
                onClose();
                void navigate({ to: "/" });
              }}
            >
              <PlayCircle /> Estudar esta aula
            </Button>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
