import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Flame, TrendingUp } from "lucide-react";

import { APP_NAME } from "@/config/app";
import { FRIENDS } from "@/data/friends";
import { useStudentStats } from "@/lib/useStudentStats";

export const Route = createFileRoute("/amigos/")({
  head: () => ({
    meta: [
      { title: `Amigos · ${APP_NAME}` },
      { name: "description", content: "Veja a constância e o crescimento dos seus amigos e visite os quartos deles." },
      { property: "og:title", content: `Amigos · ${APP_NAME}` },
      { property: "og:description", content: "Veja a constância e o crescimento dos seus amigos e visite os quartos deles." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FriendsPage,
});

function FriendsPage() {
  const me = useStudentStats();
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <h1 className="text-3xl font-extrabold">Amigos</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Aqui ninguém compara notas — só o hábito e a evolução. Toque num amigo para visitar o quarto.
      </p>

      <div className="mt-5 flex flex-wrap gap-3 rounded-2xl bg-ocean p-4 text-ocean-foreground shadow-card">
        <span className="font-display font-bold">Você</span>
        <span className="inline-flex items-center gap-1 text-sm"><Flame className="size-4" /> {me.constancia} dias seguidos</span>
        <span className="inline-flex items-center gap-1 text-sm"><TrendingUp className="size-4" /> +{me.crescimento} pts na semana</span>
      </div>

      <ul className="mt-5 flex flex-col gap-3">
        {FRIENDS.map((f) => (
          <li key={f.id}>
            <Link
              to="/amigos/$friendId"
              params={{ friendId: f.id }}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
            >
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-sand text-3xl">{f.avatar}</div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-lg font-bold leading-tight">{f.name}</p>
                <p className="text-xs text-muted-foreground">{f.city}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-xs font-semibold text-primary">
                    <Flame className="size-3.5" /> Constância: {f.constancia} dias
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-olive-soft px-2 py-0.5 text-xs font-semibold text-accent-foreground">
                    <TrendingUp className="size-3.5" /> Crescimento: +{f.crescimento} pts
                  </span>
                </div>
              </div>
              <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
