import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { usePerfil } from "@/hooks/usePerfil";
import { LeaderboardCard } from "@/components/leaderboard/LeaderboardCard";
import { fetchFeed } from "@/services/postagens";

export function RightRail() {
  const { isColaborador } = usePerfil();

  const { data } = useQuery({
    queryKey: ["feed", "recentes"],
    queryFn: () => fetchFeed({ size: 4 }),
  });

  const recentes = data?.content ?? [];

  return (
    <aside className="hidden xl:block w-72 shrink-0">
      <div className="sticky top-20 space-y-4">
        {isColaborador && <LeaderboardCard />}

        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-display text-sm font-bold text-foreground">Atos recentes</h3>
          <ul className="mt-4 space-y-4">
            {recentes.map((p) => (
              <li key={p.id} className="space-y-1.5">
                <Link
                  to="/instituicao/$id"
                  params={{ id: String(p.instituicao.id) }}
                  className="block text-sm font-semibold text-foreground line-clamp-2 hover:text-primary"
                >
                  {p.titulo}
                </Link>
                {p.localizacao && (
                  <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin size={12} aria-hidden /> {p.localizacao}
                  </div>
                )}
              </li>
            ))}
            {recentes.length === 0 && (
              <li className="text-xs text-muted-foreground">Nenhum ato recente.</li>
            )}
          </ul>
        </div>

        <p className="px-4 text-[11px] text-muted-foreground">
          © Caritatis · Comunidade brasileira de impacto social
        </p>
      </div>
    </aside>
  );
}
