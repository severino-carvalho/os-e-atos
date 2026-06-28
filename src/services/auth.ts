import type {
  AuthResponse,
  LoginRequest,
  RegistroColaboradorRequest,
  RegistroInstituicaoRequest,
  UsuarioResponse,
} from "@/data/types";
import { BASE_URL } from "./api";

const TOKEN_KEY = "reuni_token";
const USER_KEY = "reuni_user";
const isBrowser = typeof window !== "undefined";

export function salvarSessao(response: AuthResponse): void {
  if (!isBrowser) return;
  sessionStorage.setItem(TOKEN_KEY, response.token);
  sessionStorage.setItem(USER_KEY, JSON.stringify(response.usuario));
}

export function logout(): void {
  if (!isBrowser) return;
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

export function isAutenticado(): boolean {
  return isBrowser && sessionStorage.getItem(TOKEN_KEY) !== null;
}

export function getUsuarioSalvo(): UsuarioResponse | null {
  if (!isBrowser) return null;
  const raw = sessionStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as UsuarioResponse) : null;
}

export function getToken(): string | null {
  if (!isBrowser) return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

async function extrairMensagemErro(res: Response): Promise<string> {
  try {
    const body = await res.json();
    if (body.erros && typeof body.erros === "object") {
      const msgs = Object.values(body.erros as Record<string, string>).filter(Boolean);
      if (msgs.length > 0) return msgs.join(" • ");
    }
    if (typeof body.message === "string" && body.message) return body.message;
  } catch {
    // body vazio ou não é JSON
  }
  if (res.status === 401) return "E-mail ou senha incorretos.";
  if (res.status === 409) return "Este e-mail já está cadastrado.";
  return "Erro inesperado. Tente novamente.";
}

/**
 * As rotas de autenticação não passam por `apiFetch` porque precisam de
 * tratamento de erro próprio (mensagens amigáveis por status) e não enviam
 * token. Os caminhos incluem o prefixo `/api`, como os demais serviços.
 */
async function postAuth(
  path: string,
  data: unknown,
  statusEsperado: number,
): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (res.status !== statusEsperado) throw new Error(await extrairMensagemErro(res));
  const json: AuthResponse = await res.json();
  salvarSessao(json);
  return json;
}

async function postAuthMultipart(
  path: string,
  fields: Record<string, string | undefined>,
  file: File | null,
  fileParamName: string,
  statusEsperado: number,
): Promise<AuthResponse> {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) formData.append(key, value);
  }
  if (file) formData.append(fileParamName, file);

  const res = await fetch(`${BASE_URL}/auth${path}`, {
    method: "POST",
    body: formData,
  });
  if (res.status !== statusEsperado) throw new Error(await extrairMensagemErro(res));
  const json: AuthResponse = await res.json();
  salvarSessao(json);
  return json;
}

export function login(data: LoginRequest): Promise<AuthResponse> {
  return postAuth("/login", data, 200);
}

export function registrarColaborador(
  data: RegistroColaboradorRequest,
  foto?: File | null,
): Promise<AuthResponse> {
  return postAuthMultipart(
    "/registro/colaborador",
    {
      nomeCompleto: data.nomeCompleto,
      cpf: data.cpf,
      email: data.email,
      senha: data.senha,
      localizacao: data.localizacao,
    },
    foto ?? null,
    "foto",
    201,
  );
}

export function registrarInstituicao(
  data: RegistroInstituicaoRequest,
  logo?: File | null,
): Promise<AuthResponse> {
  return postAuthMultipart(
    "/registro/instituicao",
    {
      razaoSocial: data.razaoSocial,
      documento: data.documento,
      areaAtuacao: data.areaAtuacao,
      email: data.email,
      senha: data.senha,
      localizacao: data.localizacao,
    },
    logo ?? null,
    "logo",
    201,
  );
}
