import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar, Heart, MapPin, MessageCircle, Send, Share2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { PostagemResponse, StatusPostagem } from "@/data/types";
import { comentar, compartilhar, fetchComentarios, toggleCurtida } from "@/services/postagens";
import { Avatar } from "./ui/ReuniAvatar";
import { VerifiedBadge } from "./ui/ReuniVerifiedBadge";
import { ApenasColaborador } from "./guards/ApenasColaborador";
import { cn } from "@/lib/utils";

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

const statusLabel: Record<StatusPostagem, string> = {
  ativo: "Ativo",
  em_andamento: "Em andamento",
  encerrado: "Encerrado",
};

const statusStyles: Record<StatusPostagem, string> = {
  ativo: "bg-secondary-soft text-secondary",
  em_andamento: "bg-primary-soft text-primary",
  encerrado: "bg-muted text-muted-foreground",
};

const AVATAR_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%23e2e8f0'/%3E%3C/svg%3E";

interface Props {
  postagem: PostagemResponse;
  compact?: boolean;
}

export function PostagemCard({ postagem, compact }: Props) {
  const queryClient = useQueryClient();
  const isPresencial = postagem.tipoPostagem === "presencial";
  const inst = postagem.instituicao;
  const verificada = inst.statusVerificacao === "verificada";

  const [curtido, setCurtido] = useState(false);
  const [curtidas, setCurtidas] = useState(postagem.curtidasCount);
  const [compartilhamentos, setCompartilhamentos] = useState(postagem.compartilhamentosCount);
  const [mostrarComentarios, setMostrarComentarios] = useState(false);
  const [comentarios, setComentarios] = useState(postagem.comentariosCount);
  const [novoComentario, setNovoComentario] = useState("");

  const comentariosQuery = useQuery({
    queryKey: ["comentarios", postagem.id],
    queryFn: () => fetchComentarios(postagem.id),
    enabled: mostrarComentarios,
  });

  const enviarComentario = useMutation({
    mutationFn: () => comentar(postagem.id, novoComentario.trim()),
    onSuccess: () => {
      setNovoComentario("");
      setComentarios((n) => n + 1);
      comentariosQuery.refetch();
    },
  });

  const curtir = useMutation({
    mutationFn: () => toggleCurtida(postagem.id),
    onSuccess: (res) => {
      setCurtido(res.curtiu);
      setCurtidas(res.curtidasCount);
    },
  });

  const partilhar = useMutation({
    mutationFn: () => compartilhar(postagem.id),
    onSuccess: () => {
      setCompartilhamentos((n) => n + 1);
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });

  return (
    <article className="overflow-hidden rounded-2xl bg-card text-card-foreground border border-border">
      {/* Tipo + Status row */}
      <div className="flex items-center justify-between gap-2 px-5 pt-5">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
            isPresencial ? "bg-secondary-soft text-secondary" : "bg-primary-soft text-primary",
          )}
        >
          <span
            aria-hidden
            className={cn("h-1.5 w-1.5 rounded-full", isPresencial ? "bg-secondary" : "bg-primary")}
          />
          {isPresencial ? "Presencial" : "Arrecadação"}
        </span>

        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[11px] font-medium",
            statusStyles[postagem.status],
          )}
        >
          {statusLabel[postagem.status]}
        </span>
      </div>

      {/* Image */}
      {postagem.fotoUrl && (
        <div className="px-5 pt-4">
          <div className="overflow-hidden rounded-xl aspect-[16/9] bg-muted">
            <img
              src={postagem.fotoUrl}
              alt={postagem.titulo}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}

      <div className="px-5 pt-4 pb-5">
        <div className="mb-3">
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-foreground/80">
            {postagem.categoria.icone && <span aria-hidden>{postagem.categoria.icone}</span>}
            {postagem.categoria.nome}
          </span>
        </div>

        <h3
          className={cn(
            "font-display font-bold text-foreground leading-snug",
            compact ? "text-base" : "text-lg",
          )}
        >
          {postagem.titulo}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{postagem.descricao}</p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {postagem.localizacao && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={13} aria-hidden /> {postagem.localizacao}
            </span>
          )}
          {postagem.dataPostagem && (
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={13} aria-hidden /> {formatDate(postagem.dataPostagem)}
            </span>
          )}
        </div>

        {/* Author */}
        <div className="mt-4 flex items-center gap-3 pt-4 border-t border-border">
          <Link to="/instituicao/$id" params={{ id: String(inst.id) }}>
            <Avatar
              src={inst.logoUrl ?? AVATAR_FALLBACK}
              alt={inst.razaoSocial}
              size={36}
              shape="rounded"
            />
          </Link>
          <div className="min-w-0 flex-1">
            <Link
              to="/instituicao/$id"
              params={{ id: String(inst.id) }}
              className="flex items-center gap-1.5 hover:text-primary"
            >
              <span className="truncate text-sm font-semibold text-foreground">
                {inst.razaoSocial}
              </span>
              {verificada && <VerifiedBadge />}
            </Link>
          </div>
        </div>

        {/* Actions */}
        <ApenasColaborador>
          <div className="mt-4 flex items-center gap-1 border-t border-border pt-3 -mb-1">
            <ActionBtn
              icon={
                <Heart
                  size={16}
                  aria-hidden
                  className={cn(curtido && "fill-current text-primary")}
                />
              }
              label="Curtir"
              count={curtidas}
              active={curtido}
              disabled={curtir.isPending}
              onClick={() => curtir.mutate()}
            />
            <ActionBtn
              icon={<MessageCircle size={16} aria-hidden />}
              label="Comentar"
              count={comentarios}
              active={mostrarComentarios}
              onClick={() => setMostrarComentarios((v) => !v)}
            />
            <ActionBtn
              icon={<Share2 size={16} aria-hidden />}
              label="Compartilhar"
              count={compartilhamentos}
              disabled={partilhar.isPending}
              onClick={() => partilhar.mutate()}
            />
          </div>

          {mostrarComentarios && (
            <div className="mt-3 space-y-3 border-t border-border pt-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (novoComentario.trim()) enviarComentario.mutate();
                }}
                className="flex items-center gap-2"
              >
                <input
                  value={novoComentario}
                  onChange={(e) => setNovoComentario(e.target.value.slice(0, 500))}
                  placeholder="Escreva um comentário..."
                  className="h-10 flex-1 rounded-full border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <button
                  type="submit"
                  aria-label="Enviar comentário"
                  disabled={novoComentario.trim() === "" || enviarComentario.isPending}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  <Send size={16} aria-hidden />
                </button>
              </form>

              {comentariosQuery.isLoading && (
                <p className="text-xs text-muted-foreground">Carregando comentários...</p>
              )}

              <ul className="space-y-3">
                {(comentariosQuery.data?.content ?? []).map((c) => (
                  <li key={c.id} className="text-sm">
                    <span className="font-semibold text-foreground">{c.usuarioEmail}</span>
                    <span className="ml-2 text-foreground/90">{c.conteudo}</span>
                  </li>
                ))}
                {comentariosQuery.data && comentariosQuery.data.content.length === 0 && (
                  <li className="text-xs text-muted-foreground">Seja o primeiro a comentar.</li>
                )}
              </ul>
            </div>
          )}
        </ApenasColaborador>
      </div>
    </article>
  );
}

function ActionBtn({
  icon,
  label,
  count,
  active,
  disabled,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-2 text-xs font-medium transition-colors hover:bg-accent hover:text-foreground disabled:opacity-60",
        active ? "text-primary" : "text-muted-foreground",
      )}
    >
      {icon}
      <span>{label}</span>
      <span className="text-foreground/70 tabular-nums">{count}</span>
    </button>
  );
}
