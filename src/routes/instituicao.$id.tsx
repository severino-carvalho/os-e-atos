import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MapPin } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PostagemCard } from "@/components/PostagemCard";
import { Avatar } from "@/components/ui/ReuniAvatar";
import { Button } from "@/components/ui/ReuniButton";
import { VerifiedBadge } from "@/components/ui/ReuniVerifiedBadge";
import { ApenasColaborador } from "@/components/guards/ApenasColaborador";
import { EnviarMensagem } from "@/components/EnviarMensagem";
import {
  desseguir,
  fetchInstituicao,
  fetchPostagensInstituicao,
  getStatusSeguindo,
  seguir,
} from "@/services/instituicoes";

export const Route = createFileRoute("/instituicao/$id")({
  head: () => ({
    meta: [{ title: "Instituição — Caritatis" }],
  }),
  component: PerfilInstituicao,
});

const AVATAR_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='104' height='104'%3E%3Crect width='104' height='104' fill='%23e2e8f0'/%3E%3C/svg%3E";

function PerfilInstituicao() {
  const { id } = Route.useParams();
  const instId = Number(id);
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"atos" | "colab">("atos");

  const perfilQuery = useQuery({
    queryKey: ["instituicao", instId],
    queryFn: () => fetchInstituicao(instId),
    enabled: Number.isFinite(instId),
  });

  const postagensQuery = useQuery({
    queryKey: ["instituicao", instId, "postagens"],
    queryFn: () => fetchPostagensInstituicao(instId),
    enabled: Number.isFinite(instId),
  });

  const seguindoQuery = useQuery({
    queryKey: ["instituicao", instId, "seguindo"],
    queryFn: () => getStatusSeguindo(instId),
    enabled: Number.isFinite(instId),
  });

  const seguindo = seguindoQuery.data ?? false;

  const alternarSeguir = useMutation({
    mutationFn: () => (seguindo ? desseguir(instId) : seguir(instId)),
    onSuccess: (novoEstado) => {
      queryClient.setQueryData(["instituicao", instId, "seguindo"], novoEstado);
      queryClient.invalidateQueries({ queryKey: ["instituicao", instId] });
    },
  });

  if (perfilQuery.isLoading) {
    return (
      <AppShell rightRail={false}>
        <div className="animate-pulse rounded-2xl bg-muted h-64" />
      </AppShell>
    );
  }

  if (perfilQuery.isError || !perfilQuery.data) {
    return (
      <AppShell rightRail={false}>
        <p className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
          Instituição não encontrada.
        </p>
      </AppShell>
    );
  }

  const inst = perfilQuery.data;
  const verificada = inst.statusVerificacao === "verificada";
  const postagens = postagensQuery.data?.content ?? [];
  const totalPostagens = postagensQuery.data?.totalElements ?? 0;

  return (
    <AppShell rightRail={false}>
      <div className="space-y-6">
        {/* Header */}
        <section className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="h-32 sm:h-40 bg-gradient-to-br from-primary to-amber-600" />
          <div className="px-5 sm:px-8 pb-6">
            <div className="-mt-12 sm:-mt-14 flex flex-col sm:flex-row sm:items-end sm:gap-5">
              <Avatar
                src={AVATAR_FALLBACK}
                alt={inst.razaoSocial}
                size={104}
                shape="rounded"
                ring
              />
              <div className="mt-4 sm:mt-0 sm:pb-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-2xl font-bold text-foreground">
                    {inst.razaoSocial}
                  </h1>
                  {verificada && <VerifiedBadge />}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {inst.areaAtuacao || "Instituição"}
                </p>
                {inst.localizacao && (
                  <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin size={12} aria-hidden /> {inst.localizacao}
                  </p>
                )}
              </div>
              <ApenasColaborador>
                <div className="mt-4 flex flex-wrap gap-2 sm:mt-0 sm:pb-2">
                  <Button
                    variant={seguindo ? "outline" : "primary"}
                    disabled={alternarSeguir.isPending || seguindoQuery.isLoading}
                    onClick={() => alternarSeguir.mutate()}
                  >
                    {seguindo ? "Seguindo" : "Seguir"}
                  </Button>
                  <EnviarMensagem instituicaoId={inst.id} instituicaoNome={inst.razaoSocial} />
                </div>
              </ApenasColaborador>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-4">
              <Stat label="Atos publicados" value={totalPostagens} />
              <Stat label="Seguidores" value={inst.totalSeguidores} />
            </dl>
          </div>
        </section>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border">
          <TabBtn active={tab === "atos"} onClick={() => setTab("atos")}>
            Atos Publicados
          </TabBtn>
          <TabBtn active={tab === "colab"} onClick={() => setTab("colab")}>
            Colaborações
          </TabBtn>
        </div>

        {tab === "atos" ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {postagens.map((p) => (
              <PostagemCard key={p.id} postagem={p} compact />
            ))}
            {postagensQuery.isLoading &&
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-muted rounded-2xl h-40" />
              ))}
            {!postagensQuery.isLoading && postagens.length === 0 && (
              <div className="md:col-span-2 rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
                Nenhum ato publicado ainda.
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
            Em breve: colaborações com outras instituições aparecerão aqui.
          </div>
        )}
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="font-display text-xl font-bold text-foreground tabular-nums">
        {value.toLocaleString("pt-BR")}
      </dd>
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-3 text-sm font-medium transition-colors ${
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
      {active && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary" />}
    </button>
  );
}
