import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "../../lib/api";
import { publicacionesApi, type ListPublicacionesParams, type Publicacion } from "../../lib/publicaciones";

const TIMEOUT_MS = 15000;
const PAGE_PARAM = "page";

export type ListError = "rate-limit" | "general";

function readPageFromUrl() {
  if (typeof window === "undefined") return 1;
  const page = Number(new URLSearchParams(window.location.search).get(PAGE_PARAM));
  return Number.isInteger(page) && page > 1 ? page : 1;
}

// replaceState, so going back leaves the list instead of undoing each "Cargar más".
function writePageToUrl(page: number) {
  const url = new URL(window.location.href);
  if (page > 1) url.searchParams.set(PAGE_PARAM, String(page));
  else url.searchParams.delete(PAGE_PARAM);
  if (url.href !== window.location.href) window.history.replaceState(window.history.state, "", url);
}

// Items shift between pages when something is published mid-browse, so a page can repeat earlier ones.
function appendNew(existing: Publicacion[], incoming: Publicacion[]) {
  const seen = new Set(existing.map((item) => item.id));
  const added = incoming.filter((item) => !seen.has(item.id) && seen.add(item.id));
  return [...existing, ...added];
}

// A paginated publicaciones list. The retry and load-more buttons stay mounted while
// loading, and when one goes away focus moves into the results so keyboard users keep
// their place. Attach resultsRef to the element that wraps the result links.
// With syncPageToUrl the loaded page is kept in ?page=N, and opening such a URL loads
// pages 1 to N, so a reload or the back button returns to the same list.
export function usePublicacionesList(
  params: Omit<ListPublicacionesParams, "page">,
  { syncPageToUrl = false }: { syncPageToUrl?: boolean } = {},
) {
  const [items, setItems] = useState<Publicacion[]>([]);
  const [targetPage, setTargetPage] = useState(() => (syncPageToUrl ? readPageFromUrl() : 1));
  const [loadedPage, setLoadedPage] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ListError | null>(null);
  const [attempt, setAttempt] = useState(0);

  const resultsRef = useRef<HTMLDivElement>(null);
  // Index of the result link to focus after the load finishes, if the user's button is gone.
  const focusLink = useRef<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    setLoading(true);

    const fetchPage = (page: number) => publicacionesApi.list({ ...params, page }, controller.signal);

    const loadPages = async () => {
      const nextPage = loadedPage + 1;
      const first = await fetchPage(nextPage);
      // The first response gives last_page, which caps a URL like ?page=999.
      const reachedPage = Math.max(nextPage, Math.min(targetPage, first.meta.last_page));
      const rest = await Promise.all(
        Array.from({ length: reachedPage - nextPage }, (_, i) => fetchPage(nextPage + 1 + i)),
      );
      return { responses: [first, ...rest], reachedPage };
    };

    loadPages()
      .then(({ responses, reachedPage }) => {
        if (cancelled) return;
        setItems((prev) => appendNew(prev, responses.flatMap((res) => res.data)));
        setLoadedPage(reachedPage);
        setLastPage(responses[responses.length - 1].meta.last_page);
        setError(null);
        setLoading(false);
        if (syncPageToUrl) writePageToUrl(reachedPage);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof ApiError && err.status === 429 ? "rate-limit" : "general");
        setLoading(false);
      })
      .finally(() => clearTimeout(timer));

    return () => {
      cancelled = true;
      clearTimeout(timer);
      controller.abort();
    };
    // params are fixed for the life of the component, and loadedPage only changes along with a load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetPage, attempt]);

  useEffect(() => {
    if (loading || error || focusLink.current === null) return;
    const links = resultsRef.current?.querySelectorAll<HTMLElement>("a");
    (links?.[focusLink.current] ?? links?.[0])?.focus();
    focusLink.current = null;
  }, [loading, error]);

  const retry = useCallback(() => {
    if (loading) return;
    focusLink.current = 0;
    setAttempt((n) => n + 1);
  }, [loading]);

  const loadMore = useCallback(() => {
    if (loading) return;
    // Only the last page removes the button, which is when focus needs a new home.
    if (loadedPage + 1 >= lastPage) {
      focusLink.current = resultsRef.current?.querySelectorAll("a").length ?? 0;
    }
    setTargetPage(loadedPage + 1);
  }, [loading, loadedPage, lastPage]);

  return { items, loading, error, hasMore: loadedPage < lastPage, retry, loadMore, resultsRef };
}
