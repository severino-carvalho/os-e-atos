// --- DTOs do backend ---

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface UsuarioResponse {
  id: number;
  email: string;
  tipo: "instituicao" | "colaborador";
  papel: "comum" | "administrador";
  ativo: boolean;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  expiraEmMs: number;
  usuario: UsuarioResponse;
}

// --- Tipos do domínio frontend ---

export type Categoria =
  | "Doação de Alimentos"
  | "Saúde"
  | "Abrigo"
  | "Arrecadação Financeira"
  | "Educação"
  | "Vestuário"
  | "Meio Ambiente";

export type TipoAto = "presencial" | "arrecadacao";
export type StatusAto = "Ativo" | "Em andamento" | "Encerrado";
export type TipoUsuario = "pessoa_fisica" | "instituicao";

export interface Usuario {
  id: string;
  nome: string;
  tipo: TipoUsuario;
  avatar_url: string;
  papel: string;
  verificado?: boolean;
}

export interface Instituicao extends Usuario {
  tipo: "instituicao";
  razao_social: string;
  area_atuacao: string;
  status_verificacao: "verificada" | "pendente" | "nao_verificada";
  seguidores_count: number;
  atos_count: number;
  colaboracoes_count: number;
  capa_url: string;
  descricao: string;
}

export interface Ato {
  id: string;
  titulo: string;
  descricao: string;
  categoria: Categoria;
  tipo_ato: TipoAto;
  foto_url: string;
  localizacao: string;
  data_ato: string; // ISO
  status: StatusAto;
  autor: Usuario | Instituicao;
  curtidas_count: number;
  comentarios_count: number;
  compartilhamentos_count: number;
}

export interface Mensagem {
  id: string;
  autor_id: string;
  texto: string;
  timestamp: string;
}

export interface Conversa {
  id: string;
  participante: Instituicao;
  ultima_mensagem: string;
  timestamp: string;
  nao_lidas: number;
  ato_referencia?: Ato;
  mensagens: Mensagem[];
}

export interface RegistroColaboradorRequest {
  nomeCompleto: string;
  cpf: string;
  email: string;
  senha: string;
  localizacao?: string;
}

export interface RegistroInstituicaoRequest {
  razaoSocial: string;
  documento: string;
  areaAtuacao?: string;
  email: string;
  senha: string;
  localizacao?: string;
}
