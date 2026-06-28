import type { CategoriaAPI } from "@/data/types";
import { categoriasAPI } from "@/data/mocks";
import { apiFetch } from "./api";

export async function fetchCategorias(): Promise<CategoriaAPI[]> {
  try {
    return await apiFetch<CategoriaAPI[]>("/categorias");
  } catch {
    // Backend indisponível: usa as categorias mockadas como fallback.
    return categoriasAPI;
  }
}
