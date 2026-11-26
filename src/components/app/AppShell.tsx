/**
 * Moldura do app: barra lateral (desktop), barra superior com moedas e barra de abas (celular).
 * Mostra o diagnóstico inicial no primeiro acesso.
 */
import { Link, useRouterState } from "@tanstack/react-router";
import { BedDouble, Flame, GraduationCap, Users, Waypoints, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { APP_NAME, APP_TAGLINE } from "@/config/app";
import { cn } from "@/lib/utils";
import { useAppState } from "@/state/AppState";
import { computeStreak } from "@/lib/stats";
import { CoinCounter } from "./CoinCounter";
import { DevPanel } from "./DevPanel";
import { Diagnostic } from "./Diagnostic";

interface NavItem {
  to: "/" | "/quarto" | "/amigos" | "/progresso";
  label: string;
  icon: LucideIcon;
}

const NAV: NavItem[] = [
  { to: "/", label: "Estudar", icon: GraduationCap },
  { to: "/quarto", label: "Meu quarto", icon: BedDouble },
  { to: "/amigos", label: "Amigos", icon: Users },
  { to: "/progresso", label: "Progresso", icon: Waypoints },
];

function useIsActive() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));
}

export function BrandMark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="flex size-9 items-center justify-center rounded-xl bg-warm-gradient font-display text-lg font-black text-primary-foreground shadow-lift">
        ¡H
      </div>
      <span className="font-display text-lg font-extrabold tracking-tight">{APP_NAME}</span>
    </div>
  );
}

function Sidebar() {
  const isActive = useIsActive();
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-4 py-5 md:flex">
      <BrandMark className="px-2" />
      <p className="mt-2 px-2 text-xs text-muted-foreground">{APP_TAGLINE}</p>
      <nav className="mt-8 flex flex-col gap-1.5">
        {NAV.map(({ to, label, icon: Icon }) => {
          const active = isActive(to);
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all",
                active
                  ? "bg-primary text-primary-foreground shadow-lift"
                  : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
            >
              <Icon className="size-5" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-2xl bg-olive-soft p-4 text-sm text-accent-foreground">
        <p className="font-display font-bold">¡Poco a poco!</p>
        <p className="mt-1 text-xs opacity-80">Pouquinho todo dia vale mais que muito de uma vez.</p>
      </div>
    </aside>
  );
}

function BottomNav() {
  const isActive = useIsActive();
  return (
    <nav className="grid shrink-0 grid-cols-4 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = isActive(to);
        return (
          <Link
            key={to}
            to={to}
            className={cn(
              "flex flex-col items-center gap-1 py-2.5 text-[0.7rem] font-semibold transition-colors",
              active ? "text-primary" : "text-muted-foreground",
            )}
          >
            <span className={cn("flex h-8 w-14 items-center justify-center rounded-full transition-all", active && "bg-primary-soft")}>
              <Icon className="size-5" />
            </span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function TopBar() {
  const { data } = useAppState();
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-background/80 px-4 backdrop-blur md:px-6">
      <BrandMark className="md:hidden" />
      <div className="hidden md:block" />
      <div className="flex items-center gap-2">
        <StreakCounter days={computeStreak(data.studyDays)} />
        <CoinCounter coins={data.coins} />
        <DevPanel />
      </div>
    </header>
  );
}

/** Constância: dias seguidos de estudo. */
function StreakCounter({ days }: { days: number }) {
  return (
    <div
      className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary-soft py-1 pl-2 pr-3 shadow-soft"
      aria-label={`Constância: ${days} ${days === 1 ? "dia seguido" : "dias seguidos"}`}
      title="Constância: dias seguidos de estudo"
    >
      <Flame className="size-4 text-primary" />
      <span className="font-display text-sm font-bold tabular-nums">{days}</span>
      <span className="hidden text-xs font-medium text-muted-foreground sm:inline">{days === 1 ? "dia" : "dias"}</span>
    </div>
  );
}

function Splash() {
  return (
    <div className="flex h-dvh items-center justify-center">
      <div className="animate-pulse">
        <BrandMark />
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { data, hydrated } = useAppState();
  if (!hydrated) return <Splash />;
  if (!data.diagnosticDone) return <Diagnostic />;
  return (
    <div className="flex h-dvh overflow-hidden">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
