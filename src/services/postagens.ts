import type {
  ComentarioResponse,
  Page,
  PostagemApi,
  PostagemResponse,
  ReacaoResponse,
} from "@/data/types";
import { mockFeed } from "@/data/mocks";
import { apiFetch, apiFetchMultipart, authHeaders, BASE_URL } from "./api";

interface FetchFeedParams {
  categoriaId?: number;
  status?: string;
  localizacao?: string;
  page?: number;
  size?: number;
}

/**
 * Converte o DTO plano do backend (`PostagemApi`) no view-model aninhado
 * (`PostagemResponse`) que os componentes consomem.
 *
 * Limitações conhecidas do feed: o backend não envia o ícone da categoria
 * (fica vazio), nem o logo/status de verificação da instituição — por isso
 * `logoUrl` é `null` (cai no avatar fallback) e `statusVerificacao` assume
 * "pendente" para não exibir selo de verificado indevidamente.
 */
export function mapPostagem(api: PostagemApi): PostagemResponse {
  return {
    id: api.id,
    titulo: api.titulo,
    descricao: api.descricao,
    categoria: { id: api.categoriaId, nome: api.categoriaNome, icone: "" },
    tipoPostagem: api.tipoPostagem,
    fotoUrl: api.fotoUrl,
    localizacao: api.localizacao,
    dataPostagem: api.dataPostagem,
    status: api.status,
    instituicao: {
      id: api.instituicaoId,
      razaoSocial: api.instituicaoRazaoSocial,
      logoUrl: null,
      statusVerificacao: "pendente",
    },
    curtidasCount: api.curtidasCount,
    comentariosCount: api.comentariosCount,
    compartilhamentosCount: api.compartilhamentosCount,
    criadoEm: api.criadoEm,
  };
}

/**
 * Monta uma página de feed a partir dos dados mockados, respeitando o
 * filtro de categoria e a paginação. Usado como fallback quando o backend
 * não está disponível (ex.: desenvolvimento sem a API Spring Boot no ar).
 */
function mockFeedPage(params: FetchFeedParams): Page<PostagemResponse> {
  const page = params.page ?? 0;
  const size = params.size ?? 10;

  const filtradas = mockFeed.filter(
    (p) => params.categoriaId == null || p.categoria.id === params.categoriaId,
  );

  const inicio = page * size;
  const content = filtradas.slice(inicio, inicio + size);

  return {
    content,
    totalElements: filtradas.length,
    totalPages: Math.max(1, Math.ceil(filtradas.length / size)),
    number: page,
  };
}

export async function fetchFeed(params: FetchFeedParams = {}): Promise<Page<PostagemResponse>> {
  const query = new URLSearchParams();
  if (params.categoriaId != null) query.set("categoriaId", String(params.categoriaId));
  if (params.status) query.set("status", params.status);
  if (params.localizacao) query.set("localizacao", params.localizacao);
  query.set("page", String(params.page ?? 0));
  query.set("size", String(params.size ?? 10));

  try {
    const pagina = await apiFetch<Page<PostagemApi>>(`/api/postagens/feed?${query.toString()}`);
    return { ...pagina, content: pagina.content.map(mapPostagem) };
  } catch {
    // Backend indisponível: serve o feed mockado para manter a UI utilizável.
    return mockFeedPage(params);
  }
}

export async function fetchPostagem(id: number): Promise<PostagemResponse> {
  return mapPostagem(await apiFetch<PostagemApi>(`/api/postagens/${id}`));
}

export function toggleCurtida(id: number): Promise<ReacaoResponse> {
  return apiFetch<ReacaoResponse>(`/api/postagens/${id}/reacoes`, { method: "POST" });
}

export function fetchComentarios(id: number, page = 0): Promise<Page<ComentarioResponse>> {
  return apiFetch<Page<ComentarioResponse>>(`/api/postagens/${id}/comentarios?page=${page}`);
}

export function comentar(id: number, conteudo: string): Promise<ComentarioResponse> {
  return apiFetch<ComentarioResponse>(`/api/postagens/${id}/comentarios`, {
    method: "POST",
    body: JSON.stringify({ conteudo }),
  });
}

export async function compartilhar(id: number): Promise<void> {
  // O endpoint responde 201 sem corpo — não tentamos parsear JSON.
  const res = await fetch(`${BASE_URL}/api/postagens/${id}/compartilhamentos`, {
    method: "POST",
    headers: { ...authHeaders() },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Erro ${res.status}`);
  }
}

export function criarPostagem(data: FormData): Promise<PostagemResponse> {
  return apiFetchMultipart<PostagemApi>("/api/postagens", data).then(mapPostagem);
}
