import type { InstituicaoPerfilResponse, Page, PostagemApi, PostagemResponse } from "@/data/types";
import { apiFetch } from "./api";
import { mapPostagem } from "./postagens";

export function fetchInstituicao(id: number): Promise<InstituicaoPerfilResponse> {
  return apiFetch<InstituicaoPerfilResponse>(`/instituicoes/${id}`);
}

export async function fetchPostagensInstituicao(
  id: number,
  page = 0,
): Promise<Page<PostagemResponse>> {
  const pagina = await apiFetch<Page<PostagemApi>>(
    `/instituicoes/${id}/postagens?page=${page}`,
  );
  return { ...pagina, content: pagina.content.map(mapPostagem) };
}

export async function getStatusSeguindo(id: number): Promise<boolean> {
  const res = await apiFetch<{ seguindo: boolean }>(`/instituicoes/${id}/seguindo`);
  return res.seguindo;
}

export async function seguir(id: number): Promise<boolean> {
  const res = await apiFetch<{ seguindo: boolean }>(`/instituicoes/${id}/seguir`, {
    method: "POST",
  });
  return res.seguindo;
}

export async function desseguir(id: number): Promise<boolean> {
  const res = await apiFetch<{ seguindo: boolean }>(`/instituicoes/${id}/seguir`, {
    method: "DELETE",
  });
  return res.seguindo;
}
