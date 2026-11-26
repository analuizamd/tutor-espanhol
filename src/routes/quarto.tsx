import { createFileRoute } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";

import { RoomScene } from "@/components/room/RoomScene";
import { ShopList } from "@/components/room/ShopList";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { APP_NAME } from "@/config/app";
import { useAppState } from "@/state/AppState";

export const Route = createFileRoute("/quarto")({
  head: () => ({
    meta: [
      { title: `Meu quarto · ${APP_NAME}` },
      { name: "description", content: "Decore seu quarto com objetos culturais da Argentina, do Uruguai e da Espanha." },
      { property: "og:title", content: `Meu quarto · ${APP_NAME}` },
      { property: "og:description", content: "Decore seu quarto com objetos culturais da Argentina, do Uruguai e da Espanha." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RoomPage,
});

function RoomPage() {
  const { data, placeItem } = useAppState();
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold">Meu quarto</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Toque num espaço para colocar, trocar ou tirar um objeto. {data.owned.length} de 10 objetos.
          </p>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="hero" size="touch" className="lg:hidden">
              <ShoppingBag /> Loja cultural
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto rounded-t-3xl">
            <SheetHeader>
              <SheetTitle className="font-display text-2xl">Loja cultural</SheetTitle>
              <SheetDescription>Use suas moedas para trazer um pouco da Argentina, do Uruguai e da Espanha.</SheetDescription>
            </SheetHeader>
            <div className="mt-4">
              <ShopList />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <RoomScene placements={data.placements} editable owned={data.owned} onPlace={placeItem} />
        <aside className="hidden lg:block">
          <div className="surface-card p-4">
            <h2 className="flex items-center gap-2 text-xl font-extrabold">
              <ShoppingBag className="size-5 text-primary" /> Loja cultural
            </h2>
            <p className="mb-4 mt-1 text-sm text-muted-foreground">Ganhe moedas estudando e decore seu cantinho.</p>
            <div className="max-h-[calc(100dvh-16rem)] overflow-y-auto pr-1">
              <ShopList />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
