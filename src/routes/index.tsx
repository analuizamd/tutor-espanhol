import { createFileRoute } from "@tanstack/react-router";
import { BookOpenText, Flag, Lightbulb, GraduationCap, Timer, ArrowRight, Target, Pencil, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { ConceptBadge } from "@/components/study/ConceptBadge";
import { SessionEndModal } from "@/components/study/SessionEndModal";
import { Flashcards } from "@/components/study/Flashcards";
import { VideoDialogue, Subtitle } from "@/components/study/VideoDialogue";
import { EnemQuestion } from "@/components/study/EnemQuestion";
import { Mission } from "@/components/study/Mission";
import { TutorBubbles } from "@/components/study/TutorBubbles";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/config/app";
import { CONCEPT_BY_CODE } from "@/data/concepts";
import { FLASHCARD_DECKS } from "@/data/flashcards";
import { COUNTRY_LABEL, type Country } from "@/data/slang";
import { formatMmSs } from "@/lib/focusTimer";
import { dayKey } from "@/lib/stats";
import { DAILY_POINTS_GOAL, GOAL_LABEL, isExtraPhaseUnlocked, type StudyGoal } from "@/lib/studentModel";
import { getSlangCards } from "@/services/tutorService";
import { useAppState } from "@/state/AppState";
import { DIALOGUE_BY_ID, useStudySession } from "@/state/StudySession";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: `Espanhol para o ENEM · ${APP_NAME}` },
    { name: "description", content: "Aprenda espanhol para o ENEM com cartões, diálogos, missões e questões de alternativa." },
    { property: "og:title", content: `Espanhol para o ENEM · ${APP_NAME}` },
    { property: "og:description", content: "Aprenda espanhol para o ENEM com cartões, diálogos, missões e questões de alternativa." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: StudyPage,
});

function StudyPage() {
  const { data, addCoins, recordStudy } = useAppState();
  const s = useStudySession();
  const { session } = s;
  const a = session.activity;
  const [review, setReview] = useState(false);
  const [country, setCountry] = useState<Country>("es");
  useEffect(() => { s.setStudyVisible(true); return () => s.setStudyVisible(false); }, []);
  useEffect(() => { setReview(false); }, [a?.id, a?.qIndex]);
  const today = (data.dailyGains[dayKey()] ?? 0) + session.gained;
  const dialogue = a?.dialogueId ? DIALOGUE_BY_ID[a.dialogueId] : null;
  const cards = a?.conceptCode === "C2" ? getSlangCards(country) : a ? FLASHCARD_DECKS[a.conceptCode] ?? [] : [];
  const closeSummary = () => { if (session.summary) { addCoins(session.summary.coins.total); if (session.answered > 0) recordStudy(session.summary.gained); } s.closeSummary(); };
  return <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6" onPointerDown={s.notifyInteraction} onKeyDown={s.notifyInteraction}>
    {session.status === "idle" ? <>
      <div className="py-6"><GraduationCap className="size-12 text-ocean" /><h1 className="mt-4 text-3xl font-extrabold">Espanhol para o ENEM</h1><div className="mt-6"><DailyGoal points={today} /></div><Button variant="hero" size="xl" className="mt-6 w-full sm:w-auto" onClick={s.open}>Iniciar estudo <ArrowRight /></Button></div>
      {isExtraPhaseUnlocked(data.scores) && <div className="mt-5 rounded-lg border-2 border-dashed border-area-c bg-area-c-soft p-5"><h2 className="text-xl font-bold">Fase extra · Gírias regionais</h2><div className="mt-4 flex flex-wrap gap-2">{(Object.keys(COUNTRY_LABEL) as Country[]).map((c) => <Button key={c} variant="outline" onClick={() => { setCountry(c); s.startExtra(c); }}>{COUNTRY_LABEL[c]} <ArrowRight /></Button>)}</div></div>}
    </> : <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3"><span className="flex items-center gap-2 text-sm"><Timer className="size-4" /><span className="tabular-nums">{formatMmSs(session.activeMs)}</span><span className={s.focusActive ? "text-success" : "text-muted-foreground"}>{s.focusActive ? "Foco ativo" : "Pausado"}</span></span><Button variant="outline" size="sm" disabled={session.status === "ended"} onClick={s.finish}><Flag /> Finalizar</Button></div>
      <DailyGoal points={today} />
      {session.status === "goal" ? <div className="py-6"><p className="text-xs font-bold text-primary">Meta do dia</p><h1 className="mt-2 text-2xl font-bold">O que você quer aprender hoje?</h1><div className="mt-5 grid gap-3">{(Object.keys(GOAL_LABEL) as StudyGoal[]).map((g) => <Button variant="outline" key={g} className="h-auto min-h-16 justify-between whitespace-normal rounded-lg px-5 text-left" onClick={() => s.chooseGoal(g)}>{GOAL_LABEL[g]} <ArrowRight /></Button>)}</div></div> : a && <>
        <div className="my-4"><Button variant="soft" size="sm" onClick={s.changeGoal}><Target />{GOAL_LABEL[session.goal ?? "auto"]}<Pencil className="size-3" /></Button></div>
        {session.notice && <p className="mb-4 rounded-lg bg-warning-soft p-3 text-sm text-warning" role="status">{session.notice}</p>}
        <ConceptBadge concept={CONCEPT_BY_CODE[a.conceptCode]} score={data.scores[a.conceptCode]} lastDelta={s.lastDelta} />
        {a.conceptCode === "C2" && <><div role="tablist" aria-label="País" className="mt-4 grid grid-cols-3 gap-2">{(Object.keys(COUNTRY_LABEL) as Country[]).map((c) => <Button key={c} role="tab" aria-selected={country === c} variant={country === c ? "ocean" : "outline"} onClick={() => { setCountry(c); s.startExtra(c); }}>{COUNTRY_LABEL[c]}</Button>)}</div><p className="mt-2 text-xs text-muted-foreground">Dados a revisar pelo grupo.</p>{a.phase === "learn" && <div className="mt-4"><Flashcards key={`slang-${country}`} cards={cards} onComplete={() => setReview(false)} /></div>}</>}
        <div className="mt-5 space-y-5">
          {a.phase === "learn" && a.kind === "flashcards" && <Flashcards key={a.id} cards={cards} onComplete={s.goToQuestions} />}
          {a.phase === "learn" && dialogue && <VideoDialogue key={a.id} dialogue={dialogue} onComplete={s.goToQuestions} onPlaying={s.setVideoPlaying} onTranslate={() => {}} />}
          {a.phase === "mission" && s.mission && <Mission mission={s.mission} activity={a} onPick={s.pickMissionLine} onNext={s.next} />}
          {a.phase === "questions" && s.question && <>
            {dialogue && <p className="rounded-lg bg-secondary p-4 text-sm leading-relaxed">{dialogue.summary}</p>}
            <Button variant="outline" size="sm" onClick={() => { setReview(!review); if (!review) s.markHelpUsed(dialogue ? "Consultar a legenda" : "Reabrir cartões"); }}><BookOpenText />{dialogue ? "Consultar legenda" : "Revisar cartões"}</Button>
            {review && <div className="rounded-lg border border-border p-4">{dialogue ? dialogue.lines.map((line, i) => <Subtitle key={i} line={line} onTranslate={() => s.markHelpUsed("Traduzir palavras")} />) : <Flashcards key={`review-${a.id}`} cards={cards} onComplete={() => setReview(false)} />}<Button variant="ghost" className="mt-2" onClick={() => setReview(false)}><ArrowLeft />Voltar à questão</Button></div>}
            <EnemQuestion key={s.question.id} question={s.question} activity={a} onConfirm={s.confirmAnswer} onNext={s.next} />
          </>}
          <div className="flex flex-wrap gap-2">{a.phase !== "learn" && <Button variant="tile" disabled={a.resolved || a.hintStep >= 4} onClick={s.askHint}><Lightbulb />Pedir dica</Button>}<Button variant="tile" onClick={s.askExplanation}><BookOpenText />Pedir explicação</Button></div>
          <TutorBubbles bubbles={session.bubbles.slice(-5)} />
        </div>
      </>}
      <SessionEndModal summary={session.status === "ended" ? session.summary : null} onClose={closeSummary} />
    </>}
  </div>;
}

function DailyGoal({ points }: { points: number }) {
  const progress = Math.max(0, Math.min(points, DAILY_POINTS_GOAL));
  return <div><div className="mb-2 flex justify-between text-xs font-semibold"><span>Meta do dia · {DAILY_POINTS_GOAL} pontos</span><span>{Math.max(0, points)} / {DAILY_POINTS_GOAL}</span></div><div role="progressbar" aria-label="Meta do dia" aria-valuemin={0} aria-valuemax={DAILY_POINTS_GOAL} aria-valuenow={progress} className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-olive transition-all" style={{ width: `${progress / DAILY_POINTS_GOAL * 100}%` }} /></div></div>;
}
