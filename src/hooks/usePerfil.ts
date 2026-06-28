import { useUser } from "@/contexts/UserContext";

export function usePerfil() {
  const { perfil } = useUser();

  return {
    isInstituicao: perfil === "instituicao",
    isColaborador: perfil === "pessoa_fisica",
    perfil,
  };
}
