import { Avatar } from "@/components/ui/ReuniAvatar";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import type { LeaderboardEntry } from "@/data/types";
import { cn } from "@/lib/utils";

const MEDALHAS: Record<number, string> = {
  1: "🥇",
  2: "🥈",
  3: "🥉",
};

interface LinhaProps {
  entry: LeaderboardEntry;
  destaque?: boolean;
}

function LinhaRanking({ entry, destaque = false }: LinhaProps) {
  return (
    <li
      className={cn(
        "flex items-center gap-3 rounded-xl px-2 py-1.5",
        destaque && "bg-primary-soft",
      )}
    >
      <span className="w-6 shrink-0 text-center text-sm font-bold tabular-nums text-foreground">
        {MEDALHAS[entry.posicao] ?? entry.posicao}
      </span>
      <Avatar src={entry.avatarUrl} alt={entry.nome} size={32} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-medium text-foreground">{entry.nome}</span>
          {destaque && (
            <span className="shrink-0 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
              Você
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <span aria-hidden>🔥</span>
          {entry.ofensiva_atual} dias
        </div>
      </div>
      <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
        {entry.pontos_total}
      </span>
    </li>
  );
}

export function LeaderboardCard() {
  const { data } = useLeaderboard();

  if (!data) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h3 className="font-display text-sm font-semibold text-foreground">🏆 Ranking</h3>
      <ul className="mt-4 space-y-1">
        {data.top5.map((entry) => (
          <LinhaRanking key={entry.id} entry={entry} />
        ))}
        {data.colaboradorLogado && (
          <>
            <li className="select-none px-2 py-0.5 text-center text-sm leading-none text-muted-foreground">
              …
            </li>
            <LinhaRanking entry={data.colaboradorLogado} destaque />
          </>
        )}
      </ul>
    </div>
  );
}
