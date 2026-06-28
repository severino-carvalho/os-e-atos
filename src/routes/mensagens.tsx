import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Mail, MailOpen } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/ReuniButton";
import { usePerfil } from "@/hooks/usePerfil";
import type { MensagemResponse } from "@/data/types";
import {
  fetchMensagensEnviadas,
  fetchMensagensRecebidas,
  marcarComoLida,
} from "@/services/mensagens";

export const Route = createFileRoute("/mensagens")({
  head: () => ({
    meta: [{ title: "Mensagens — Caritatis" }],
  }),
  component: MensagensPage,
});

type Aba = "recebidas" | "enviadas";

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MensagensPage() {
  const { isInstituicao } = usePerfil();
  const queryClient = useQueryClient();
  const [aba, setAba] = useState<Aba>(isInstituicao ? "recebidas" : "enviadas");

  const recebidasQuery = useQuery({
    queryKey: ["mensagens", "recebidas"],
    queryFn: () => fetchMensagensRecebidas(),
    enabled: aba === "recebidas",
  });

  const enviadasQuery = useQuery({
    queryKey: ["mensagens", "enviadas"],
    queryFn: () => fetchMensagensEnviadas(),
    enabled: aba === "enviadas",
  });

  const marcar = useMutation({
    mutationFn: (id: number) => marcarComoLida(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mensagens", "recebidas"] });
      queryClient.invalidateQueries({ queryKey: ["mensagens", "nao-lidas"] });
    },
  });

  const query = aba === "recebidas" ? recebidasQuery : enviadasQuery;
  const mensagens = query.data?.content ?? [];

  return (
    <AppShell rightRail={false}>
      <div className="mx-auto max-w-2xl">
        <header className="mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">Mensagens</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Mensagens avulsas trocadas com instituições.
          </p>
        </header>

        {/* Abas */}
        <div className="mb-4 flex gap-1 border-b border-border">
          {isInstituicao && (
            <TabBtn active={aba === "recebidas"} onClick={() => setAba("recebidas")}>
              Recebidas
            </TabBtn>
          )}
          <TabBtn active={aba === "enviadas"} onClick={() => setAba("enviadas")}>
            Enviadas
          </TabBtn>
        </div>

        {query.isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl bg-muted h-24" />
            ))}
          </div>
        )}

        {query.isError && (
          <p className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
            Não foi possível carregar as mensagens.
          </p>
        )}

        {!query.isLoading && !query.isError && (
          <ul className="space-y-3">
            {mensagens.map((m) => (
              <MensagemCard
                key={m.id}
                mensagem={m}
                aba={aba}
                podeMarcarLida={aba === "recebidas" && !m.lida}
                marcandoId={marcar.isPending ? marcar.variables : undefined}
                onMarcarLida={() => marcar.mutate(m.id)}
              />
            ))}
            {mensagens.length === 0 && (
              <li className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
                Nenhuma mensagem por aqui ainda.
              </li>
            )}
          </ul>
        )}
      </div>
    </AppShell>
  );
}

function MensagemCard({
  mensagem,
  aba,
  podeMarcarLida,
  marcandoId,
  onMarcarLida,
}: {
  mensagem: MensagemResponse;
  aba: Aba;
  podeMarcarLida: boolean;
  marcandoId: number | undefined;
  onMarcarLida: () => void;
}) {
  const titulo =
    aba === "recebidas" ? `De: ${mensagem.remetenteEmail}` : `Para: ${mensagem.instituicaoNome}`;
  const naoLida = aba === "recebidas" && !mensagem.lida;

  return (
    <li className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {naoLida ? (
              <Mail size={15} aria-hidden className="text-primary" />
            ) : (
              <MailOpen size={15} aria-hidden className="text-muted-foreground" />
            )}
            <span className="truncate text-sm font-semibold text-foreground">{titulo}</span>
            {naoLida && (
              <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
                Nova
              </span>
            )}
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm text-foreground/90">{mensagem.conteudo}</p>
          <p className="mt-2 text-xs text-muted-foreground">{formatDate(mensagem.criadoEm)}</p>
        </div>
        {podeMarcarLida && (
          <Button
            size="sm"
            variant="outline"
            disabled={marcandoId === mensagem.id}
            onClick={onMarcarLida}
          >
            <Check size={14} aria-hidden /> Lida
          </Button>
        )}
      </div>
    </li>
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
