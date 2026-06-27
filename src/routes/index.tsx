import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Image, MapPin, Send } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { AtoCard } from "@/components/AtoCard";
import { Avatar } from "@/components/ui/ReuniAvatar";
import { Button } from "@/components/ui/ReuniButton";
import { CategoryPill } from "@/components/ui/ReuniCategoryPill";
import { ApenasInstituicao } from "@/components/guards/ApenasInstituicao";
import { atos, CATEGORIAS, usuarioLogado } from "@/data/mocks";
import type { Categoria } from "@/data/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Feed — reuni" },
      { name: "description", content: "Feed de atos sociais da comunidade reuni." },
      { property: "og:title", content: "Feed — reuni" },
      { property: "og:description", content: "Feed de atos sociais da comunidade reuni." },
    ],
  }),
  component: FeedPage,
});

function FeedPage() {
  const [filtro, setFiltro] = useState<Categoria | null>(null);

  const categorias = useMemo(() => {
    const usadas = new Set(atos.map((a) => a.categoria));
    return CATEGORIAS.filter((c) => usadas.has(c));
  }, []);

  const lista = useMemo(
    () => (filtro ? atos.filter((a) => a.categoria === filtro) : atos),
    [filtro],
  );

  return (
    <AppShell>
      <div className="space-y-4">
        <ApenasInstituicao>
          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              <Avatar src={usuarioLogado.avatar_url} alt={usuarioLogado.nome} size={44} />
              <div className="flex-1 min-w-0">
                <textarea
                  placeholder="Publicar um ato... O que sua comunidade precisa hoje?"
                  aria-label="Publicar um ato"
                  rows={2}
                  className="block w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                  <div className="flex items-center gap-1">
                    <button
                      aria-label="Adicionar foto"
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                      <Image size={14} aria-hidden /> Foto
                    </button>
                    <button
                      aria-label="Adicionar localização"
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                      <MapPin size={14} aria-hidden /> Local
                    </button>
                  </div>
                  <Button size="sm">
                    <Send size={14} aria-hidden /> Publicar
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </ApenasInstituicao>

        {/* Filtros */}
        <section className="-mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setFiltro(null)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                filtro === null
                  ? "bg-foreground text-background"
                  : "bg-surface border border-border text-foreground/80 hover:text-foreground"
              }`}
            >
              Todas
            </button>
            {categorias.map((c) => (
              <CategoryPill
                key={c}
                categoria={c}
                active={filtro === c}
                onClick={() => setFiltro(filtro === c ? null : c)}
              />
            ))}
          </div>
        </section>

        {/* Lista */}
        <section className="space-y-4">
          {lista.map((ato) => (
            <AtoCard key={ato.id} ato={ato} />
          ))}
          {lista.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
              Nenhum ato nesta categoria ainda.
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
