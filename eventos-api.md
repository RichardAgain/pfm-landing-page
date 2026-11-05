# Events API (public landing)

Events are `publicaciones` with `tipo = "evento"`. They are managed in the admin panel under **Publicaciones → Eventos** and exposed through the same public API used by galleries.

Only publications marked **Visible en página** (`publicado = true`) are returned.

## Endpoints

Base: `{APP_URL}/api/publicaciones`. CORS is open for `api/*`. Rate limit: 60 requests/min per IP.

| Use | Request |
| --- | --- |
| Upcoming events (home carousel) | `GET /api/publicaciones?tipo=evento&upcoming=1&per_page=6` |
| All events ("Ver todos") | `GET /api/publicaciones?tipo=evento&page=1` |
| Event detail | `GET /api/publicaciones/{slug}` |

### Query params (`index`)

| Param | Values | Notes |
| --- | --- | --- |
| `tipo` | `galeria` \| `evento` \| `anuncio` | Invalid value returns `422`. |
| `upcoming` | `1` / `true` | Only `fecha_evento >= now()`, sorted ascending (soonest first). |
| `per_page` | `1`–`50` | Default `12`. |
| `page` | integer | Standard Laravel pagination. |

Without `upcoming`, results are sorted by `fecha_evento` (or `created_at`) descending.

## Response shape

### List

```json
{
  "data": [
    {
      "id": 1,
      "titulo": "Concierto 50 Aniversario de la Orquesta Sinfónica de Carabobo",
      "slug": "concierto-50-aniversario-de-la-orquesta-sinfonica-de-carabobo",
      "tipo": "evento",
      "descripcion": "Texto plano...",
      "ubicacion": "Teatro Dr. Alfredo Celis Pérez",
      "fecha_evento": "2026-10-31T15:00:00+00:00",
      "publicado": true,
      "portada_url": "https://.../storage/publicaciones/1/abc.webp",
      "imagenes_count": 2,
      "created_at": "2026-10-20T12:00:00+00:00"
    }
  ],
  "links": { "first": "...", "last": "...", "prev": null, "next": "..." },
  "meta": { "current_page": 1, "last_page": 3, "per_page": 6, "total": 14 }
}
```

### Detail

Wrapped in `data`. Same fields plus `imagenes`:

```json
{
  "data": {
    "...": "same fields as list",
    "imagenes": [
      { "id": 10, "url": "https://...", "caption": null, "orden": 0, "width": 1920, "height": 1080, "size_bytes": 254000 },
      { "id": 11, "url": "https://...", "caption": null, "orden": 1, "width": 1080, "height": 1350, "size_bytes": 198000 }
    ]
  }
}
```

Unknown or unpublished slug returns `404`.

## Field mapping

| UI element | Field |
| --- | --- |
| Card image / detail hero banner | `portada_url` (equals `imagenes[0].url`) |
| Title | `titulo` |
| Date (card + "Fecha") | `fecha_evento` |
| Hour ("Hora") | `fecha_evento` |
| Location ("Lugar") | `ubicacion` |
| Body content | `descripcion` (plain text, keep line breaks) |
| Images inside content (flyer, etc.) | `imagenes.slice(1)` |
| Detail link | `/eventos/{slug}` |

`portada_url`, `ubicacion` and `descripcion` can be `null`. Render a placeholder or hide the element.

## Dates: important

`fecha_evento` stores the **local wall-clock time** entered in the admin, but it is serialized with a `+00:00` offset. Always format it with `timeZone: "UTC"`. Otherwise the browser shifts it (e.g. `15:00` becomes `11:00` in Venezuela).

```ts
const fmt = (iso: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("es-VE", { timeZone: "UTC", ...options }).format(new Date(iso))

// Card: 31/10/2026
export const formatCardDate = (iso: string) =>
  fmt(iso, { day: "2-digit", month: "2-digit", year: "numeric" })

// Detail "Fecha": sábado, 31 de octubre de 2026
export const formatLongDate = (iso: string) =>
  fmt(iso, { weekday: "long", day: "numeric", month: "long", year: "numeric" })

// Detail "Hora": 15:00 hrs
export const formatHour = (iso: string) =>
  `${fmt(iso, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" })} hrs`
```

Capitalize the long date with CSS (`text-transform: capitalize`) if needed.

## Example client

```ts
export interface Evento {
  id: number
  titulo: string
  slug: string
  tipo: "evento"
  descripcion: string | null
  ubicacion: string | null
  fecha_evento: string
  portada_url: string | null
  imagenes_count: number
  imagenes?: { id: number; url: string; caption: string | null; width: number | null; height: number | null }[]
}

interface Paginated<T> {
  data: T[]
  meta: { current_page: number; last_page: number; per_page: number; total: number }
}

const API = `${import.meta.env.VITE_API_URL}/api/publicaciones`

export async function getUpcomingEventos(limit = 6): Promise<Evento[]> {
  const res = await fetch(`${API}?tipo=evento&upcoming=1&per_page=${limit}`)
  if (!res.ok) throw new Error(`Failed to load events: ${res.status}`)
  return ((await res.json()) as Paginated<Evento>).data
}

export async function getEventos(page = 1): Promise<Paginated<Evento>> {
  const res = await fetch(`${API}?tipo=evento&page=${page}`)
  if (!res.ok) throw new Error(`Failed to load events: ${res.status}`)
  return res.json()
}

export async function getEvento(slug: string): Promise<Evento | null> {
  const res = await fetch(`${API}/${encodeURIComponent(slug)}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Failed to load event: ${res.status}`)
  return (await res.json()).data
}
```

## Views

### "Próximos eventos" (carousel)

- Data: `getUpcomingEventos()`.
- Card: image `portada_url` (cover, ~16:10), `titulo`, calendar icon + `formatCardDate(fecha_evento)`, pin icon + `ubicacion` (truncate with ellipsis), "Más información" linking to `/eventos/{slug}`.
- Hide the section when the list is empty.
- "Ver todos" links to `/eventos`.

### Events list (`/eventos`)

- Data: `getEventos(page)`. Paginate with `meta.current_page` / `meta.last_page`.
- Same card as the carousel.

### Event detail (`/eventos/{slug}`)

- Data: `getEvento(slug)`. Show a 404 page on `null`.
- Hero: `portada_url` as background with dark overlay, "← Volver a eventos" link, `titulo`.
- Main column: `descripcion` with `white-space: pre-line`, then `imagenes.slice(1)` (full width, `loading="lazy"`, `alt={caption ?? titulo}`).
- Sidebar card "Detalles del evento":
  - Fecha: `formatLongDate(fecha_evento)`
  - Hora: `formatHour(fecha_evento)`
  - Lugar: `ubicacion`
  - "Contáctanos" button linking to the contact page.

## Caveat: `upcoming` cutoff

`upcoming=1` compares `fecha_evento` against the server's current **UTC** time, while the stored value is local time (UTC-4). An event drops out of the upcoming list about 4 hours before its start time. Changing this needs a backend change (app timezone or the `upcoming` query).
