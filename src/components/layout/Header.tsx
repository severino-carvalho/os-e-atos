import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, LogOut, Moon, Search, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useUser } from "@/contexts/UserContext";
import { logout } from "@/services/auth";

export function Header() {
  const { theme, toggle } = useTheme();
  const { perfil, setPerfil } = useUser();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate({ to: "/login" });
  }
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-4 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span
            aria-hidden
            className="grid h-9 w-9 place-items-center rounded-[12px] bg-primary text-primary-foreground font-display text-lg font-bold"
          >
            r
          </span>
          <span className="hidden font-display text-lg font-bold tracking-tight text-foreground sm:inline">
            reuni
          </span>
        </Link>

        <div className="flex-1 max-w-md relative hidden md:block">
          <Search
            size={16}
            aria-hidden
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Buscar atos, instituições, causas..."
            aria-label="Buscar"
            className="h-10 w-full rounded-full border border-border bg-surface pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div className="ml-auto flex items-center gap-1">
          {import.meta.env.DEV && (
            <button
              title="Trocar perfil (dev)"
              onClick={() =>
                setPerfil(perfil === "pessoa_fisica" ? "instituicao" : "pessoa_fisica")
              }
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                perfil === "pessoa_fisica"
                  ? "bg-secondary-soft text-secondary"
                  : "bg-primary-soft text-primary"
              }`}
            >
              {perfil === "pessoa_fisica" ? "PF" : "ONG"}
            </button>
          )}
          <button
            aria-label="Notificações"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <Bell size={18} aria-hidden />
          </button>
          <button
            aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
            onClick={toggle}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            {theme === "dark" ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
          </button>
          <button
            onClick={handleLogout}
            aria-label="Sair"
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full px-3 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <LogOut size={16} aria-hidden />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
}
