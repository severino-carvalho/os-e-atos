import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { login } from "@/services/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Entrar — reuni" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      await login({ email, senha });
      navigate({ to: "/" });
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao entrar. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-primary to-amber-600 p-12 text-white">
        <div className="font-display text-2xl font-bold">Reuni</div>
        <div>
          <h1 className="font-display text-4xl font-bold leading-tight">
            Conecte-se a ações que transformam vidas
          </h1>
          <ul className="mt-8 space-y-4">
            {[
              "Descubra ações perto de você",
              "Apoie ONGs e instituições",
              "Publique e divulgue seus atos sociais",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-white/90">
                <span className="h-2 w-2 shrink-0 rounded-full bg-white/70" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-white/60">© {new Date().getFullYear()} Reuni</p>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="grid h-9 w-9 place-items-center rounded-[12px] bg-primary font-display text-lg font-bold text-primary-foreground">
              r
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              reuni
            </span>
          </div>

          <h2 className="font-display text-2xl font-bold text-foreground">Entrar</h2>
          <p className="mt-1 text-sm text-muted-foreground">Bem-vindo de volta</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-foreground">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                disabled={carregando}
                placeholder="seu@email.com"
                className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              />
            </div>

            <div>
              <label htmlFor="senha" className="mb-1.5 block text-sm font-semibold text-foreground">
                Senha
              </label>
              <div className="relative">
                <input
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  autoComplete="current-password"
                  required
                  disabled={carregando}
                  placeholder="••••••••"
                  className="h-11 w-full rounded-xl border border-border bg-surface px-4 pr-11 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {erro && <p className="text-sm text-destructive">{erro}</p>}

            <button
              type="submit"
              disabled={carregando}
              className="h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-60"
            >
              {carregando ? "Entrando…" : "Entrar"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Não tem conta?{" "}
            <Link to="/registro" className="font-semibold text-primary hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
