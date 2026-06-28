import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Image, MapPin, Send } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PostagemCard } from "@/components/PostagemCard";
import { Avatar } from "@/components/ui/ReuniAvatar";
import { Button } from "@/components/ui/ReuniButton";
import { ApenasInstituicao } from "@/components/guards/ApenasInstituicao";
import { fetchCategorias } from "@/services/categorias";
import { fetchFeed } from "@/services/postagens";
import { useUsuarioInfo } from "@/hooks/useUsuarioInfo";

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
  const navigate = useNavigate();
  const info = useUsuarioInfo();
  const [filtroCategoria, setFiltroCategoria] = useState<number | null>(null);

  const { data: categorias = [] } = useQuery({
    queryKey: ["categorias"],
    queryFn: fetchCategorias,
  });

  const {
    data: feedData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["feed", filtroCategoria],
    queryFn: () => fetchFeed({ categoriaId: filtroCategoria ?? undefined }),
  });

  const postagens = feedData?.content ?? [];

  return (
    <AppShell>
      <div className="space-y-4">
        <ApenasInstituicao>
          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              <Avatar src={info.avatarUrl} alt={info.nome} size={44} />
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
                  <Button size="sm" onClick={() => navigate({ to: "/publicar" })}>
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
              onClick={() => setFiltroCategoria(null)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                filtroCategoria === null
                  ? "bg-foreground text-background"
                  : "bg-surface border border-border text-foreground/80 hover:text-foreground"
              }`}
            >
              Todas
            </button>
            {categorias.map((c) => {
              const active = filtroCategoria === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setFiltroCategoria(active ? null : c.id)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                    active
                      ? "bg-foreground text-background"
                      : "bg-surface border border-border text-foreground/80 hover:text-foreground"
                  }`}
                >
                  {c.icone && <span aria-hidden>{c.icone}</span>}
                  {c.nome}
                </button>
              );
            })}
          </div>
        </section>

        {/* Lista */}
        <section className="space-y-4">
          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-muted rounded-2xl h-48" />
            ))}

          {!isLoading && isError && (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
              Não foi possível carregar o feed.
              {error instanceof Error && error.message ? ` (${error.message})` : ""}
            </div>
          )}

          {!isLoading &&
            !isError &&
            postagens.map((postagem) => <PostagemCard key={postagem.id} postagem={postagem} />)}

          {!isLoading && !isError && postagens.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
              Nenhum ato nesta categoria ainda.
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
