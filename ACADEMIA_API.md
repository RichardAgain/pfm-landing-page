# Consuming the academia endpoints

**Base URL:** `${WP_DOMAIN}/wp-json/wp/v2` (`apiBase` in `src/config/wp-client.ts`).

| Content | Endpoint | Single item |
|---|---|---|
| Academia events | `/academia-evento` | `/academia-evento?slug=<slug>` |
| Academia gallery | `/academia-album` | `/academia-album?slug=<slug>` |

They use the same query params and response shape as `/evento` and `/album`. Fields come back under `acf`: `event_date`, `event_time`, `event_venue`, `event_price`, `event_description` for events, and `date_taken` for albums.

## Raw requests

```
GET /academia-evento?_embed&status=publish&per_page=9&page=1
GET /academia-album?_embed=1&per_page=9&orderby=date_taken&order=desc
GET /academia-album?album_category=Conciertos&date_taken_after=2026-01-01&date_taken_before=2026-12-31&search=foo
HEAD /academia-album?per_page=9      # X-WP-Total, X-WP-TotalPages headers for pagination
```

- `_embed` adds the cover image (`wp:featuredmedia`), the category (`wp:term`) and the author.
- Album `per_page` is capped at 9 in `wp-albums.ts` (`MAX_ALBUMS_PER_PAGE`). The REST maximum is 100.
- Dates in filters must be `YYYY-MM-DD`.
- `orderby=date_taken` is valid only on albums. Albums with no date go last.
- Album photos are not a field. They are the `<img>` tags inside `content.rendered`, which `extractImagesFromContent` pulls out.

## From Astro

The existing helpers hardcode their endpoints (`/evento` in `wp-eventos.ts`, `ALBUM_ENDPOINTS` in `wp-albums.ts`). To serve academia, give each function an optional endpoint argument that defaults to the current one:

```ts
export const getEventos = async (perPage = 9, page = 1, endpoint = "/evento") => { ... }
const albums = await getAlbums(1, 9, "date_taken", "desc", {}, "/academia-album");
```

The academia page then calls the same helpers with `"/academia-evento"` or `"/academia-album"`. The `fetchAPI` and `HEAD` pagination calls inside them must also take the endpoint instead of the literal string.

## Troubleshooting

- 404 on `/wp-json/wp/v2/academia-evento`: the types didn't register. Re-save Ajustes > Enlaces permanentes.
- Empty `acf` object: the ACF plugin is inactive, or the field group isn't linked to the new type.
- Drafts don't appear: unauthenticated requests only get published posts.
