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

// --- DTOs do backend: postagens, categorias e interações ---

export interface CategoriaAPI {
  id: number;
  nome: string;
  icone: string;
}

export type TipoPostagem = "presencial" | "arrecadacao";
export type StatusPostagem = "ativo" | "em_andamento" | "encerrado";
export type StatusVerificacao = "pendente" | "verificada" | "rejeitada";

export interface InstituicaoResumo {
  id: number;
  razaoSocial: string;
  logoUrl: string | null;
  statusVerificacao: StatusVerificacao;
}

/**
 * DTO **plano** exatamente como o backend devolve uma postagem
 * (`PostagemResponse` no Spring). Use o mapper `mapPostagem` em
 * `services/postagens.ts` para converter em `PostagemResponse` (view-model
 * aninhado consumido pela UI).
 */
export interface PostagemApi {
  id: number;
  titulo: string;
  descricao: string;
  categoriaId: number;
  categoriaNome: string;
  instituicaoId: number;
  instituicaoRazaoSocial: string;
  tipoPostagem: TipoPostagem;
  fotoUrl: string | null;
  localizacao: string | null;
  latitude: number | null;
  longitude: number | null;
  dataPostagem: string | null;
  status: StatusPostagem;
  curtidasCount: number;
  comentariosCount: number;
  compartilhamentosCount: number;
  criadoEm: string;
}

/**
 * View-model aninhado usado pelos componentes (cards, perfil, publicar).
 * É produzido a partir de `PostagemApi` pelo mapper do serviço.
 */
export interface PostagemResponse {
  id: number;
  titulo: string;
  descricao: string;
  categoria: CategoriaAPI;
  tipoPostagem: TipoPostagem;
  fotoUrl: string | null;
  localizacao: string | null;
  dataPostagem: string | null;
  status: StatusPostagem;
  instituicao: InstituicaoResumo;
  curtidasCount: number;
  comentariosCount: number;
  compartilhamentosCount: number;
  criadoEm: string;
}

/** Resposta do toggle de curtida (`ReacaoResponse` no backend). */
export interface ReacaoResponse {
  curtiu: boolean;
  curtidasCount: number;
}

/** Comentário como o backend devolve (`ComentarioResponse`). */
export interface ComentarioResponse {
  id: number;
  usuarioId: number;
  usuarioEmail: string;
  conteudo: string;
  criadoEm: string;
}

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // página atual (0-based)
}

// --- Gamificação: leaderboard (exclusivo do colaborador) ---

export interface LeaderboardEntry {
  id: string;
  nome: string;
  avatarUrl: string;
  pontos_total: number;
  ofensiva_atual: number;
  posicao: number;
}

export interface LeaderboardData {
  top5: LeaderboardEntry[];
  colaboradorLogado: LeaderboardEntry | null;
}

// --- DTOs de gamificação (backend) ---

export interface LeaderboardEntryApi {
  colaboradorId: number;
  nome: string;
  pontosTotal: number;
  ofensivaAtual: number;
  posicao: number;
}

export interface LeaderboardApiResponse {
  top: LeaderboardEntryApi[];
  eu: LeaderboardEntryApi | null;
}

export interface MissaoResponse {
  tipo: string;
  progresso: number;
  meta: number;
  concluida: boolean;
}

export interface GamificacaoPerfilResponse {
  pontosTotal: number;
  ofensivaAtual: number;
  ofensivaRecorde: number;
  posicaoRanking: number;
  missoesDiarias: MissaoResponse[];
  bonusDiarioConcluido: boolean;
}

// --- DTOs de instituição (backend) ---

export interface InstituicaoPerfilResponse {
  id: number;
  email: string;
  razaoSocial: string;
  documento: string;
  areaAtuacao: string | null;
  localizacao: string | null;
  statusVerificacao: StatusVerificacao;
  totalSeguidores: number;
}

// --- DTOs de mensagens (backend) ---

export interface MensagemResponse {
  id: number;
  remetenteId: number;
  remetenteEmail: string;
  instituicaoId: number;
  instituicaoNome: string;
  postagemId: number | null;
  conteudo: string;
  lida: boolean;
  criadoEm: string;
}

export interface MensagemRequest {
  instituicaoId: number;
  postagemId?: number | null;
  conteudo: string;
}
