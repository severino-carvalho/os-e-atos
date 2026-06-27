import type {
  AuthResponse,
  LoginRequest,
  RegistroColaboradorRequest,
  RegistroInstituicaoRequest,
  UsuarioResponse,
} from "@/data/types";

const BASE_URL = "http://localhost:8080/api/auth";
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

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (res.status !== 200) throw new Error(await extrairMensagemErro(res));
  const json: AuthResponse = await res.json();
  salvarSessao(json);
  return json;
}

export async function registrarColaborador(
  data: RegistroColaboradorRequest,
): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/registro/colaborador`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (res.status !== 201) throw new Error(await extrairMensagemErro(res));
  const json: AuthResponse = await res.json();
  salvarSessao(json);
  return json;
}

export async function registrarInstituicao(
  data: RegistroInstituicaoRequest,
): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/registro/instituicao`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (res.status !== 201) throw new Error(await extrairMensagemErro(res));
  const json: AuthResponse = await res.json();
  salvarSessao(json);
  return json;
}
