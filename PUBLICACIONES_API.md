# Publicaciones API — Landing Page Integration

Public, read-only endpoints that feed the landing page with galleries, events and announcements managed from the admin panel (`/publicaciones`).

- **Base URL:** `{API_URL}/api/publicaciones` (no authentication)
- **Rate limit:** 60 requests/minute per IP (`429` when exceeded)
- **CORS:** any origin is allowed (`*`), so no backend configuration is needed for the landing page.
- **Visibility:** only publications with `publicado = true` are returned. Unpublished or missing slugs return `404`.
- **Format:** JSON, Laravel API Resources (`data`, plus `links`/`meta` on paginated responses). Always send `Accept: application/json`, otherwise errors may come back as HTML.

## Setup

1. Add the API URL to the landing env, e.g. `PUBLIC_API_URL=https://api.example.com` (no trailing slash).
2. Images are served from `{APP_URL}/storage/...`, so the backend needs `php artisan storage:link` and a correct `APP_URL`.

## Types (`tipo`)

Every publication has one `tipo`. The landing sections are the same endpoint filtered by it:

| `tipo` | Landing section |
| --- | --- |
| `galeria` | Gallery |
| `evento` | Events |
| `anuncio` | Announcements |

Any other value is rejected with a `422` (see [Errors](#errors)).

## Data model

| Field | Type | Notes |
| --- | --- | --- |
| `id` | number | |
| `titulo` | string | |
| `slug` | string | Public identifier. Set on creation and **never changes** when the title is edited. |
| `tipo` | `"galeria"` \| `"evento"` \| `"anuncio"` | |
| `descripcion` | string \| null | Plain text, up to 5000 chars. |
| `ubicacion` | string \| null | |
| `fecha_evento` | string \| null | Date only, serialized as ISO 8601 at midnight (e.g. `2026-11-05T00:00:00+00:00`). See [Dates](#dates). |
| `publicado` | boolean | Always `true` in this API. |
| `portada_url` | string \| null | Absolute URL of the cover (the first image by `orden`). `null` if the publication has no images. |
| `imagenes_count` | number | |
| `imagenes` | array | **Detail endpoint only**, see below. |
| `created_at` | string | ISO 8601 |

Each entry of `imagenes`, already sorted by `orden` (the first one is the cover):

| Field | Type | Notes |
| --- | --- | --- |
| `id` | number | |
| `url` | string | Absolute URL. Always WebP, max 1920px on the longest side. |
| `caption` | string \| null | |
| `orden` | number | |
| `width`, `height` | number \| null | Use them for `width`/`height` attributes to avoid layout shift. |
| `size_bytes` | number \| null | |

## Endpoints

### `GET /api/publicaciones`

Paginated list. The `imagenes` array is **not** included; use `portada_url` and `imagenes_count`.

| Query param | Default | Description |
| --- | --- | --- |
| `tipo` | — | `galeria`, `evento` or `anuncio`. Omit it to get every type. |
| `upcoming` | `false` | `1`/`true` keeps only items with `fecha_evento >= now`. Items without a date are excluded. |
| `per_page` | `12` | Clamped to 1–50. |
| `page` | `1` | |

**Ordering**
- Default: newest first by `fecha_evento` (falling back to `created_at`).
- With `upcoming=1`: soonest first, so `data[0]` is the next event.

**Response**

```json
{
  "data": [
    {
      "id": 7,
      "titulo": "Concierto de Gala",
      "slug": "concierto-de-gala",
      "tipo": "evento",
      "descripcion": "Texto...",
      "ubicacion": "Teatro Municipal",
      "fecha_evento": "2026-11-05T00:00:00+00:00",
      "publicado": true,
      "portada_url": "https://api.example.com/storage/publicaciones/7/8f1c...webp",
      "imagenes_count": 12,
      "created_at": "2026-10-17T16:30:00+00:00"
    }
  ],
  "links": { "first": "...", "last": "...", "prev": null, "next": "...?page=2" },
  "meta": { "current_page": 1, "last_page": 3, "per_page": 12, "total": 30 }
}
```

### `GET /api/publicaciones/{slug}`

Single publication with its full gallery. `404` if the slug doesn't exist or isn't published.

```json
{
  "data": {
    "id": 7,
    "titulo": "Concierto de Gala",
    "slug": "concierto-de-gala",
    "tipo": "evento",
    "descripcion": "Texto...",
    "ubicacion": "Teatro Municipal",
    "fecha_evento": "2026-11-05T00:00:00+00:00",
    "publicado": true,
    "portada_url": "https://api.example.com/storage/publicaciones/7/8f1c...webp",
    "imagenes_count": 2,
    "imagenes": [
      { "id": 31, "url": "https://api.example.com/storage/publicaciones/7/8f1c...webp", "caption": null, "orden": 0, "width": 1920, "height": 1280, "size_bytes": 184233 },
      { "id": 32, "url": "https://api.example.com/storage/publicaciones/7/a42d...webp", "caption": "Ensayo general", "orden": 1, "width": 1280, "height": 1920, "size_bytes": 201554 }
    ],
    "created_at": "2026-10-17T16:30:00+00:00"
  }
}
```

## Errors

| Status | When | Body |
| --- | --- | --- |
| `404` | Slug doesn't exist or the publication isn't published | `{ "message": "..." }` |
| `422` | Invalid `tipo` (e.g. `?tipo=eventos`) | `{ "message": "...", "errors": { "tipo": ["..."] } }` |
| `429` | More than 60 requests/minute | `{ "message": "Too Many Attempts." }` |

The `message` texts depend on the backend locale, so don't match on them; switch on the status code.

## Dates

`fecha_evento` is a calendar date with no time. Don't pass it to `new Date(iso)` and then format it: in timezones behind UTC (like Venezuela) midnight UTC renders as the previous day. Use the first 10 characters instead:

```ts
export function formatEventDate(iso: string | null): string {
  if (!iso) return ""
  const [year, month, day] = iso.slice(0, 10).split("-").map(Number)
  return new Date(year, month - 1, day).toLocaleDateString("es-VE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
```

## Client example (TypeScript)

```ts
const API_URL = import.meta.env.PUBLIC_API_URL // adapt to your framework

export type PublicacionTipo = "galeria" | "evento" | "anuncio"

export interface PublicacionImagen {
  id: number
  url: string
  caption: string | null
  orden: number
  width: number | null
  height: number | null
  size_bytes: number | null
}

export interface Publicacion {
  id: number
  titulo: string
  slug: string
  tipo: PublicacionTipo
  descripcion: string | null
  ubicacion: string | null
  fecha_evento: string | null
  publicado: boolean
  portada_url: string | null
  imagenes_count: number
  imagenes?: PublicacionImagen[] // detail endpoint only
  created_at: string
}

export interface Paginated<T> {
  data: T[]
  links: { first: string | null; last: string | null; prev: string | null; next: string | null }
  meta: { current_page: number; last_page: number; per_page: number; total: number }
}

async function request<T>(path: string, params: Record<string, string | number | boolean> = {}): Promise<T> {
  const url = new URL(`${API_URL}/api/publicaciones${path}`)
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, String(value)))

  const response = await fetch(url, { headers: { Accept: "application/json" } })
  if (!response.ok) throw new Error(`Publicaciones API ${response.status}`)

  return response.json()
}

export const listPublicaciones = (
  params: { tipo?: PublicacionTipo; upcoming?: boolean; per_page?: number; page?: number } = {},
) => request<Paginated<Publicacion>>("", params as Record<string, string | number | boolean>)

export const getPublicacion = async (slug: string) =>
  (await request<{ data: Publicacion }>(`/${encodeURIComponent(slug)}`)).data
```

## Typical landing sections

| Section | Call |
| --- | --- |
| Next events strip | `listPublicaciones({ tipo: "evento", upcoming: true, per_page: 3 })` |
| Past events | `listPublicaciones({ tipo: "evento", page })` |
| Announcements | `listPublicaciones({ tipo: "anuncio", per_page: 5 })` |
| Gallery index (paginated) | `listPublicaciones({ tipo: "galeria", page })` |
| Detail page `/publicaciones/[slug]` | `getPublicacion(slug)`, then render `imagenes` as a grid or lightbox |

Fetch the sections in parallel when they live on the same page:

```ts
const [eventos, anuncios, galerias] = await Promise.all([
  listPublicaciones({ tipo: "evento", upcoming: true, per_page: 3 }),
  listPublicaciones({ tipo: "anuncio", per_page: 5 }),
  listPublicaciones({ tipo: "galeria", per_page: 6 }),
])
```

Three requests count toward the 60/min per-IP limit, which is fine for visitors but worth remembering if the build or SSR renders many pages from one server IP.

Render images with explicit dimensions and lazy loading:

```html
<img src={imagen.url} width={imagen.width} height={imagen.height} alt={imagen.caption ?? publicacion.titulo} loading="lazy" />
```

## Caching and freshness

- The API sends no cache headers. For static builds (e.g. Astro `getStaticPaths`), content only updates on rebuild, so either render on demand (SSR) or trigger a rebuild when an admin publishes. Slugs are stable, so existing links keep working after edits.
- If a publication is unpublished or deleted, its detail URL starts returning `404`. Handle that with a not-found page.
- Image URLs are immutable (each upload gets a new UUID filename), so they are safe to cache aggressively.
