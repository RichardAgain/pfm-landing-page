import { WP_API_URL } from "../config/api";
import { ApiError } from "./api";

export type PublicacionTipo = "galeria" | "evento";

export interface PublicacionImagen {
  id: number;
  url: string;
  caption: string | null;
  width: number | null;
  height: number | null;
}

export interface Publicacion {
  id: number;
  titulo: string;
  slug: string;
  tipo: PublicacionTipo;
  descripcion: string | null;
  contenido: string;
  ubicacion: string | null;
  fecha_evento: string | null;
  portada_url: string | null;
  imagenes: PublicacionImagen[];
  imagenes_count: number;
  created_at: string;
}

export interface Paginated<T> {
  data: T[];
  meta: { last_page: number };
}

export interface ListPublicacionesParams {
  tipo: PublicacionTipo;
  upcoming?: boolean;
  per_page?: number;
  page?: number;
}

interface WpPost {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  content: { rendered: string };
  acf?: Record<string, string>;
  _embedded?: { "wp:featuredmedia"?: { source_url?: string }[] };
}

const ENDPOINTS: Record<PublicacionTipo, string> = {
  evento: "/academia-evento",
  galeria: "/academia-album",
};

const MAX_PER_PAGE = 100;

const decodeEntities = (text: string) => new DOMParser().parseFromString(text, "text/html").body.textContent ?? "";

// ACF returns dates as Ymd and times as H:i:s. They are wall-clock values, serialized with
// a +00:00 offset to match the UTC-based formatters below.
const toIso = (date?: string, time = "00:00:00") =>
  date && /^\d{8}$/.test(date) ? `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6)}T${time}+00:00` : null;

// Album photos and event media are not fields: they are the <img> tags of the post content.
function parseContent(html: string, stripMedia: boolean) {
  const body = new DOMParser().parseFromString(html, "text/html").body;

  const imagenes = Array.from(body.querySelectorAll("img"), (img, index): PublicacionImagen => ({
    id: index,
    url: img.getAttribute("src") ?? "",
    caption: img.closest("figure")?.querySelector("figcaption")?.textContent?.trim() || img.alt || null,
    width: Number(img.getAttribute("width")) || null,
    height: Number(img.getAttribute("height")) || null,
  }));

  if (stripMedia) body.querySelectorAll("figure, img, .wp-block-gallery").forEach((node) => node.remove());

  return { imagenes, contenido: stripMedia && !body.textContent?.trim() ? "" : body.innerHTML.trim() };
}

function toPublicacion(post: WpPost, tipo: PublicacionTipo): Publicacion {
  const acf = post.acf ?? {};
  const { imagenes, contenido } = parseContent(post.content.rendered, tipo === "galeria");

  return {
    id: post.id,
    titulo: decodeEntities(post.title.rendered),
    slug: post.slug,
    tipo,
    descripcion: acf.event_description || null,
    contenido,
    ubicacion: acf.event_venue || null,
    fecha_evento: tipo === "evento" ? toIso(acf.event_date, acf.event_time) : toIso(acf.date_taken),
    portada_url: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? imagenes[0]?.url ?? null,
    imagenes,
    imagenes_count: imagenes.length,
    created_at: post.date,
  };
}

async function request(tipo: PublicacionTipo, params: Record<string, string | number>, signal?: AbortSignal) {
  const url = new URL(`${WP_API_URL}${ENDPOINTS[tipo]}`);
  Object.entries({ _embed: 1, ...params }).forEach(([key, value]) => url.searchParams.set(key, String(value)));

  const response = await fetch(url, { headers: { Accept: "application/json" }, signal });

  if (!response.ok) {
    const data = await response.json().catch(() => undefined);
    throw new ApiError(data?.message || `HTTP error! status: ${response.status}`, response.status, data);
  }

  return {
    posts: (await response.json()) as WpPost[],
    totalPages: Number(response.headers.get("X-WP-TotalPages")) || 1,
  };
}

export const publicacionesApi = {
  list: async (
    { tipo, upcoming, per_page = 9, page = 1 }: ListPublicacionesParams,
    signal?: AbortSignal,
  ): Promise<Paginated<Publicacion>> => {
    if (upcoming) {
      const { posts } = await request(tipo, { per_page: MAX_PER_PAGE }, signal);
      const today = new Date().toLocaleDateString("sv-SE");
      const data = posts
        .map((post) => toPublicacion(post, tipo))
        .filter((item) => item.fecha_evento && item.fecha_evento.slice(0, 10) >= today)
        .sort((a, b) => a.fecha_evento!.localeCompare(b.fecha_evento!))
        .slice(0, per_page);
      return { data, meta: { last_page: 1 } };
    }

    const order: Record<string, string> = tipo === "galeria" ? { orderby: "date_taken", order: "desc" } : {};
    const { posts, totalPages } = await request(tipo, { per_page, page, ...order }, signal);
    return { data: posts.map((post) => toPublicacion(post, tipo)), meta: { last_page: totalPages } };
  },

  get: async (tipo: PublicacionTipo, slug: string, signal?: AbortSignal) => {
    const { posts } = await request(tipo, { slug }, signal);
    if (posts.length === 0) throw new ApiError("Not found", 404);
    return toPublicacion(posts[0], tipo);
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

// Event times are local wall-clock values serialized with a +00:00 offset, so format in UTC.
const formatUtc = (iso: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("es-VE", { timeZone: "UTC", ...options }).format(new Date(iso));

export const formatCardDate = (iso: string) =>
  formatUtc(iso, { day: "2-digit", month: "2-digit", year: "numeric" });

export const formatLongDate = (iso: string) =>
  formatUtc(iso, { weekday: "long", day: "numeric", month: "long", year: "numeric" });

export const formatHour = (iso: string) =>
  `${formatUtc(iso, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" })} hrs`;
