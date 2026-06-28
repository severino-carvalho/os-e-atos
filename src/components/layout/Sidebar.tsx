import { Link } from "@tanstack/react-router";
import { Bookmark, Compass, Home, MessageSquare, User } from "lucide-react";
import { Avatar } from "@/components/ui/ReuniAvatar";
import { usePerfil } from "@/hooks/usePerfil";
import { useUsuarioInfo } from "@/hooks/useUsuarioInfo";
import { useUser } from "@/contexts/UserContext";
import { ApenasInstituicao } from "@/components/guards/ApenasInstituicao";
import { ApenasColaborador } from "@/components/guards/ApenasColaborador";

type NavItem = {
  to: string;
  params?: { id: string };
  hash?: string;
  label: string;
  icon: typeof Home;
};

function NavLink({ item }: { item: NavItem }) {
  const Icon = item.icon;
  const isInstituicaoLink = item.to === "/instituicao/$id";
  return (
    <Link
      to={item.to}
      params={item.params}
      hash={item.hash}
      activeOptions={{
        exact: item.to === "/" || isInstituicaoLink,
        includeHash: isInstituicaoLink,
      }}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground data-[status=active]:bg-primary-soft data-[status=active]:text-primary"
    >
      <Icon size={18} aria-hidden />
      {item.label}
    </Link>
  );
}

export function Sidebar() {
  const { isInstituicao } = usePerfil();
  const { usuarioBackend } = useUser();
  const info = useUsuarioInfo();

  // Link de perfil próprio (instituição) só faz sentido com o id do backend.
  const meuPerfil: NavItem | null =
    isInstituicao && usuarioBackend
      ? {
          to: "/instituicao/$id",
          params: { id: String(usuarioBackend.id) },
          label: "Meu perfil",
          icon: User,
        }
      : null;

  return (
    <aside className="hidden lg:block w-60 shrink-0">
      <div className="sticky top-20 space-y-4">
        {/* Profile card */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex flex-col items-center text-center">
            <Avatar src={info.avatarUrl} alt={info.nome} size={72} ring />
            <h2 className="mt-3 max-w-full truncate font-display text-base font-bold text-foreground">
              {info.nome}
            </h2>
            <p className="mt-0.5 max-w-full truncate text-xs text-muted-foreground">{info.email}</p>
            <span className="mt-2 inline-flex items-center rounded-full bg-secondary-soft px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-secondary">
              {info.tipoLabel}
            </span>
          </div>
          <div className="mt-5 grid grid-cols-2 divide-x divide-border border-t border-border pt-4 text-center">
            {isInstituicao ? (
              <>
                <Stat valor={info.atosCount} rotulo="Atos" />
                <Stat valor={info.instituicao?.totalSeguidores ?? 0} rotulo="Seguidores" />
              </>
            ) : (
              <>
                <Stat valor={info.gamificacao?.pontosTotal ?? 0} rotulo="Pontos" />
                <Stat valor={info.gamificacao?.ofensivaAtual ?? 0} rotulo="Ofensiva" />
              </>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="rounded-2xl border border-border bg-card p-2">
          <NavLink item={{ to: "/", label: "Feed", icon: Home }} />
          <ApenasInstituicao>
            <NavLink item={{ to: "/publicar", label: "Publicar", icon: Compass }} />
          </ApenasInstituicao>
          <NavLink item={{ to: "/mensagens", label: "Mensagens", icon: MessageSquare }} />
          <ApenasColaborador>
            <NavLink item={{ to: "/", hash: "salvos", label: "Salvos", icon: Bookmark }} />
          </ApenasColaborador>
          {meuPerfil && <NavLink item={meuPerfil} />}
        </nav>
      </div>
    </aside>
  );
}

function Stat({ valor, rotulo }: { valor: number; rotulo: string }) {
  return (
    <div>
      <div className="font-display text-lg font-bold text-foreground tabular-nums">
        {valor.toLocaleString("pt-BR")}
      </div>
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{rotulo}</div>
    </div>
  );
}
