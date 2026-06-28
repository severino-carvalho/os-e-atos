import type { InstituicaoPerfilResponse, Page, PostagemApi, PostagemResponse } from "@/data/types";
import { apiFetch } from "./api";
import { mapPostagem } from "./postagens";

export function fetchInstituicao(id: number): Promise<InstituicaoPerfilResponse> {
  return apiFetch<InstituicaoPerfilResponse>(`/api/instituicoes/${id}`);
}

export async function fetchPostagensInstituicao(
  id: number,
  page = 0,
): Promise<Page<PostagemResponse>> {
  const pagina = await apiFetch<Page<PostagemApi>>(
    `/api/instituicoes/${id}/postagens?page=${page}`,
  );
  return { ...pagina, content: pagina.content.map(mapPostagem) };
}

export async function getStatusSeguindo(id: number): Promise<boolean> {
  const res = await apiFetch<{ seguindo: boolean }>(`/api/instituicoes/${id}/seguindo`);
  return res.seguindo;
}

export async function seguir(id: number): Promise<boolean> {
  const res = await apiFetch<{ seguindo: boolean }>(`/api/instituicoes/${id}/seguir`, {
    method: "POST",
  });
  return res.seguindo;
}

export async function desseguir(id: number): Promise<boolean> {
  const res = await apiFetch<{ seguindo: boolean }>(`/api/instituicoes/${id}/seguir`, {
    method: "DELETE",
  });
  return res.seguindo;
}
