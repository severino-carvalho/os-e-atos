import type { GamificacaoPerfilResponse, LeaderboardApiResponse } from "@/data/types";
import { apiFetch } from "./api";

/**
 * Painel de gamificação do colaborador logado (pontos, ofensiva, missões).
 * Endpoint restrito a ROLE_COLABORADOR no backend.
 */
export function fetchGamificacaoPerfil(): Promise<GamificacaoPerfilResponse> {
  return apiFetch<GamificacaoPerfilResponse>("/api/gamificacao/me");
}

/** Top do ranking + posição do colaborador logado. */
export function fetchLeaderboard(): Promise<LeaderboardApiResponse> {
  return apiFetch<LeaderboardApiResponse>("/api/gamificacao/leaderboard");
}
