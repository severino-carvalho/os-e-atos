import { Link } from "@tanstack/react-router";
import { Home, MessageSquare, PlusCircle, User } from "lucide-react";
import { ApenasInstituicao } from "@/components/guards/ApenasInstituicao";
import { useUser } from "@/contexts/UserContext";

function NavItem({
  to,
  params,
  label,
  icon: Icon,
  exact,
}: {
  to: string;
  params?: { id: string };
  label: string;
  icon: typeof Home;
  exact: boolean;
}) {
  return (
    <Link
      to={to}
      params={params}
      activeOptions={{ exact }}
      className="flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium text-muted-foreground data-[status=active]:text-primary"
    >
      <Icon size={20} aria-hidden />
      {label}
    </Link>
  );
}

export function BottomNav() {
  const { usuarioBackend, perfil } = useUser();
  const isInstituicao = perfil === "instituicao";

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-border bg-background/95 backdrop-blur lg:hidden"
    >
      <NavItem to="/" label="Feed" icon={Home} exact />
      <ApenasInstituicao>
        <NavItem to="/publicar" label="Publicar" icon={PlusCircle} exact={false} />
      </ApenasInstituicao>
      <NavItem to="/mensagens" label="Mensagens" icon={MessageSquare} exact={false} />
      {isInstituicao && usuarioBackend && (
        <NavItem
          to="/instituicao/$id"
          params={{ id: String(usuarioBackend.id) }}
          label="Perfil"
          icon={User}
          exact={false}
        />
      )}
    </nav>
  );
}
