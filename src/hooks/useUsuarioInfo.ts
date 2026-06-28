import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/contexts/UserContext";
import { fetchInstituicao, fetchPostagensInstituicao } from "@/services/instituicoes";
import { fetchGamificacaoPerfil } from "@/services/gamificacao";

/**
 * Informações de exibição do usuário logado, derivadas do token e
 * complementadas pela API:
 * - Instituição: razão social, total de seguidores e nº de postagens (perfil
 *   e postagens via `/instituicoes/{uid}`).
 * - Colaborador: pontos e ofensiva (`/gamificacao/me`). O token não traz o
 *   nome do colaborador, então o e-mail é usado como nome de exibição.
 */
export function useUsuarioInfo() {
  const { usuarioBackend, perfil } = useUser();
  const isInstituicao = perfil === "instituicao";
  const uid = usuarioBackend?.id;

  const instituicaoQuery = useQuery({
    queryKey: ["instituicao", uid],
    queryFn: () => fetchInstituicao(uid as number),
    enabled: isInstituicao && uid != null,
  });

  const postagensQuery = useQuery({
    queryKey: ["instituicao", uid, "postagens"],
    queryFn: () => fetchPostagensInstituicao(uid as number),
    enabled: isInstituicao && uid != null,
  });

  const gamificacaoQuery = useQuery({
    queryKey: ["gamificacao", "me"],
    queryFn: fetchGamificacaoPerfil,
    enabled: !isInstituicao && uid != null,
  });

  const email = usuarioBackend?.email ?? "";
  const nome = isInstituicao ? (instituicaoQuery.data?.razaoSocial ?? email) : email;

  return {
    isInstituicao,
    email,
    nome,
    avatarUrl: undefined,
    papel: usuarioBackend?.papel ?? "comum",
    tipoLabel: isInstituicao ? "Instituição" : "Pessoa Física",
    instituicao: instituicaoQuery.data,
    atosCount: postagensQuery.data?.totalElements ?? 0,
    gamificacao: gamificacaoQuery.data,
  };
}
