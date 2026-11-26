import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Flame, TrendingUp } from "lucide-react";

import { RoomScene } from "@/components/room/RoomScene";
import { APP_NAME } from "@/config/app";
import { FRIEND_BY_ID } from "@/data/friends";
import { cn } from "@/lib/utils";
import { useStudentStats } from "@/lib/useStudentStats";

export const Route = createFileRoute("/amigos/$friendId")({
  loader: ({ params }) => {
    const friend = FRIEND_BY_ID[params.friendId];
    if (!friend) throw notFound();
    return { friend };
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `Quarto de ${loaderData.friend.name} · ${APP_NAME}` : `Amigo · ${APP_NAME}`;
    const description = loaderData
      ? `Visite o quarto de ${loaderData.friend.name} e compare constância e crescimento.`
      : "Visite o quarto de um amigo.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="p-8 text-center">
      <p className="font-display text-xl font-bold">Amigo não encontrado</p>
      <Link to="/amigos" className="mt-3 inline-block text-primary underline">Voltar para Amigos</Link>
    </div>
  ),
  component: FriendRoomPage,
});

function encouragement(me: { constancia: number; crescimento: number }, friend: { name: string; constancia: number; crescimento: number }) {
  if (me.constancia >= friend.constancia && me.crescimento >= friend.crescimento)
    return `Você está mandando muito bem! Que tal chamar ${friend.name} para estudar junto hoje?`;
  if (me.constancia < friend.constancia)
    return `${friend.name} estuda há ${friend.constancia} dias seguidos. Uma sessão curta hoje já começa a sua sequência! 🌱`;
  return `${friend.name} cresceu bastante esta semana. Cada acerto seu também conta — ¡vamos!`;
}

function FriendRoomPage() {
  const { friend } = Route.useLoaderData();
  const me = useStudentStats();
  const maxC = Math.max(me.constancia, friend.constancia, 1);
  const maxG = Math.max(me.crescimento, friend.crescimento, 1);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <Link to="/amigos" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Amigos
      </Link>
      <div className="mt-3 flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-sand text-2xl">{friend.avatar}</div>
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">Quarto de {friend.name}</h1>
          <p className="text-sm text-muted-foreground">{friend.city} · só para olhar</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <RoomScene placements={friend.placements} />
        <aside className="surface-card flex flex-col gap-5 p-5">
          <h2 className="text-lg font-extrabold">Você e {friend.name}</h2>
          <Compare
            icon={<Flame className="size-4 text-primary" />}
            label="Constância"
            unit="dias"
            me={me.constancia}
            them={friend.constancia}
            max={maxC}
            name={friend.name}
            barClass="bg-primary"
          />
          <Compare
            icon={<TrendingUp className="size-4 text-olive" />}
            label="Crescimento"
            unit="pts"
            me={me.crescimento}
            them={friend.crescimento}
            max={maxG}
            name={friend.name}
            barClass="bg-olive"
          />
          <p className="rounded-2xl bg-coin-soft p-4 text-sm font-medium text-coin-foreground">{encouragement(me, friend)}</p>
        </aside>
      </div>
    </div>
  );
}

function Compare(props: { icon: React.ReactNode; label: string; unit: string; me: number; them: number; max: number; name: string; barClass: string }) {
  const rows = [
    { who: "Você", value: props.me, cls: "bg-ocean" },
    { who: props.name, value: props.them, cls: props.barClass },
  ];
  return (
    <div>
      <p className="flex items-center gap-1.5 text-sm font-bold">{props.icon} {props.label}</p>
      <div className="mt-2 flex flex-col gap-2">
        {rows.map((r) => (
          <div key={r.who} className="flex items-center gap-2 text-xs">
            <span className="w-16 shrink-0 truncate font-semibold">{r.who}</span>
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
              <div className={cn("h-full rounded-full transition-all duration-700", r.cls)} style={{ width: `${(r.value / props.max) * 100}%` }} />
            </div>
            <span className="w-14 shrink-0 text-right font-display font-bold tabular-nums">{r.value} {props.unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
