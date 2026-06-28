import { useQuery } from "@tanstack/react-query";
import type { LeaderboardData, LeaderboardEntry, LeaderboardEntryApi } from "@/data/types";
import { mockLeaderboard } from "@/data/mocks";
import { fetchLeaderboard } from "@/services/gamificacao";

function mapEntry(e: LeaderboardEntryApi): LeaderboardEntry {
  return {
    id: String(e.colaboradorId),
    nome: e.nome,
    avatarUrl: `https://i.pravatar.cc/40?u=${e.colaboradorId}`,
    pontos_total: e.pontosTotal,
    ofensiva_atual: e.ofensivaAtual,
    posicao: e.posicao,
  };
}

export function useLeaderboard() {
  return useQuery<LeaderboardData>({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      try {
        const data = await fetchLeaderboard();
        return {
          top5: data.top.map(mapEntry),
          colaboradorLogado: data.eu ? mapEntry(data.eu) : null,
        };
      } catch {
        // Backend indisponível: mantém o card de ranking utilizável.
        return mockLeaderboard;
      }
    },
  });
}
