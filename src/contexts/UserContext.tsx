import { createContext, type ReactNode, useContext, useState } from "react";
import type { Instituicao, Usuario, UsuarioResponse } from "@/data/types";
import { instituicoes, usuarioLogado } from "@/data/mocks";
import { getUsuarioSalvo } from "@/services/auth";

const PERFIL_KEY = "reuni_perfil";

interface UserContextValue {
  perfil: "pessoa_fisica" | "instituicao";
  setPerfil: (p: "pessoa_fisica" | "instituicao") => void;
  usuarioAtual: Usuario | Instituicao;
  usuarioBackend: UsuarioResponse | null;
}

const UserContext = createContext<UserContextValue | null>(null);

function perfilFromBackend(u: UsuarioResponse): "pessoa_fisica" | "instituicao" {
  return u.tipo === "instituicao" ? "instituicao" : "pessoa_fisica";
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [perfil, setPerfilState] = useState<"pessoa_fisica" | "instituicao">(() => {
    const usuarioBackend = getUsuarioSalvo();
    if (usuarioBackend) return perfilFromBackend(usuarioBackend);

    const stored = typeof window !== "undefined" ? sessionStorage.getItem(PERFIL_KEY) : null;
    return stored === "instituicao" ? "instituicao" : "pessoa_fisica";
  });

  const setPerfil = (p: "pessoa_fisica" | "instituicao") => {
    sessionStorage.setItem(PERFIL_KEY, p);
    setPerfilState(p);
  };

  const usuarioBackend = getUsuarioSalvo();

  const usuarioAtual: Usuario | Instituicao =
    perfil === "pessoa_fisica" ? usuarioLogado : instituicoes[0];

  return (
    <UserContext.Provider value={{ perfil, setPerfil, usuarioAtual, usuarioBackend }}>
      {children}
    </UserContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser deve ser usado dentro de <UserProvider>");
  return ctx;
}
