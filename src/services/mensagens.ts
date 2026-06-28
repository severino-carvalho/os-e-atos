import type { MensagemRequest, MensagemResponse, Page } from "@/data/types";
import { apiFetch } from "./api";

export function enviarMensagem(req: MensagemRequest): Promise<MensagemResponse> {
  return apiFetch<MensagemResponse>("/mensagens", {
    method: "POST",
    body: JSON.stringify(req),
  });
}

export function fetchMensagensRecebidas(page = 0): Promise<Page<MensagemResponse>> {
  return apiFetch<Page<MensagemResponse>>(`/mensagens/recebidas?page=${page}`);
}

export function fetchMensagensEnviadas(page = 0): Promise<Page<MensagemResponse>> {
  return apiFetch<Page<MensagemResponse>>(`/mensagens/enviadas?page=${page}`);
}

export async function countNaoLidas(): Promise<number> {
  const res = await apiFetch<{ total: number }>("/mensagens/nao-lidas/count");
  return res.total;
}

export function marcarComoLida(id: number): Promise<MensagemResponse> {
  return apiFetch<MensagemResponse>(`/mensagens/${id}/lida`, { method: "PATCH" });
}
