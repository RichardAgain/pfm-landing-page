import { API_BASE_URL } from "../config/api";
import { ApiError } from "./api";

export type PublicacionTipo = "galeria" | "evento" | "anuncio";

export interface PublicacionImagen {
  id: number;
  url: string;
  caption: string | null;
  orden: number;
  width: number | null;
  height: number | null;
  size_bytes: number | null;
}

export interface Publicacion {
  id: number;
  titulo: string;
  slug: string;
  tipo: PublicacionTipo;
  descripcion: string | null;
  ubicacion: string | null;
  fecha_evento: string | null;
  publicado: boolean;
  portada_url: string | null;
  imagenes_count: number;
  imagenes?: PublicacionImagen[]; // detail endpoint only
  created_at: string;
}

export interface Paginated<T> {
  data: T[];
  links: { first: string | null; last: string | null; prev: string | null; next: string | null };
  meta: { current_page: number; last_page: number; per_page: number; total: number };
}

export interface ListPublicacionesParams {
  tipo?: PublicacionTipo;
  upcoming?: boolean;
  per_page?: number;
  page?: number;
}

async function request<T>(path: string, params: object = {}, signal?: AbortSignal): Promise<T> {
  const url = new URL(`${API_BASE_URL}/publicaciones${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) url.searchParams.set(key, String(value));
  });

  const response = await fetch(url, { headers: { Accept: "application/json" }, signal });

  if (!response.ok) {
    const data = await response.json().catch(() => undefined);
    throw new ApiError(data?.message || `HTTP error! status: ${response.status}`, response.status, data);
  }

  return response.json();
}

export const publicacionesApi = {
  list: (params: ListPublicacionesParams = {}, signal?: AbortSignal) =>
    request<Paginated<Publicacion>>("", params, signal),

  // The guide documents a { data } wrapper, but the backend may return the resource unwrapped.
  get: async (slug: string, signal?: AbortSignal) => {
    const res = await request<{ data: Publicacion } | Publicacion>(`/${encodeURIComponent(slug)}`, {}, signal);
    return "data" in res ? res.data : res;
  },
};

// fecha_evento is a calendar date serialized at midnight UTC; parsing it with
// new Date(iso) would show the previous day in Venezuela (UTC-4).
export function formatEventDate(iso: string | null): string {
  if (!iso) return "";
  const [year, month, day] = iso.slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("es-VE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
