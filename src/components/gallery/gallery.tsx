import { useCallback, useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import {
    formatEventDate,
    publicacionesApi,
    type Publicacion,
} from "../../lib/publicaciones";

const PER_PAGE = 12;

function Divider() {
    return (
        <div className="flex flex-col gap-1">
            <hr className="w-[85%] md:w-[75%] border-2 border-[#F4B400] rounded-full mx-auto" />
            <hr className="w-[85%] md:w-[75%] border-2 border-[#7A1F1F] rounded-full mx-auto" />
            <hr className="w-[85%] md:w-[75%] border-2 border-[#F4B400] rounded-full mx-auto" />
        </div>
    );
}

function AlbumCard({ album, onOpen }: { album: Publicacion; onOpen: () => void }) {
    const fecha = formatEventDate(album.fecha_evento);

    return (
        <button
            type="button"
            onClick={onOpen}
            className="bg-white text-left transition duration-500 transform cursor-pointer hover:-translate-y-2 hover:shadow-lg"
        >
            <div className="relative group h-48 md:h-[20rem] bg-gray-200">
                {album.portada_url && (
                    <img
                        src={album.portada_url}
                        alt={album.titulo}
                        loading="lazy"
                        className="w-full h-full object-cover"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent group-hover:via-transparent duration-300 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <h3 className="text-lg font-semibold leading-tight">{album.titulo}</h3>
                    <p className="flex items-center gap-2 text-sm opacity-90">
                        {fecha && <span>{fecha}</span>}
                        <span className="inline-flex items-center gap-1">
                            <Images className="h-4 w-4" />
                            {album.imagenes_count}
                        </span>
                    </p>
                </div>
            </div>
        </button>
    );
}

function AlbumDialog({ slug, onClose }: { slug: string | null; onClose: () => void }) {
    const cache = useRef(new Map<string, Publicacion>());
    const [album, setAlbum] = useState<Publicacion | null>(null);
    const [error, setError] = useState(false);
    const [current, setCurrent] = useState<number | null>(null);

    useEffect(() => {
        setCurrent(null);
        setError(false);
        if (!slug) return;

        const cached = cache.current.get(slug);
        if (cached) {
            setAlbum(cached);
            return;
        }

        setAlbum(null);
        const controller = new AbortController();
        publicacionesApi
            .get(slug, controller.signal)
            .then((data) => {
                cache.current.set(slug, data);
                setAlbum(data);
            })
            .catch((err) => {
                if (err.name !== "AbortError") setError(true);
            });

        return () => controller.abort();
    }, [slug]);

    const imagenes = album?.imagenes ?? [];
    const step = useCallback(
        (delta: number) =>
            setCurrent((i) => (i === null ? i : (i + delta + imagenes.length) % imagenes.length)),
        [imagenes.length],
    );

    useEffect(() => {
        if (current === null) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") step(-1);
            if (e.key === "ArrowRight") step(1);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [current, step]);

    const viewing = current !== null ? imagenes[current] : null;

    return (
        <Dialog.Root open={slug !== null} onOpenChange={(open) => !open && onClose()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/90" />
                <Dialog.Content
                    className="fixed inset-0 z-50 overflow-y-auto text-white focus:outline-none"
                    onEscapeKeyDown={(e) => {
                        // Escape closes the single-image view first, then the album.
                        if (current !== null) {
                            e.preventDefault();
                            setCurrent(null);
                        }
                    }}
                >
                    <Dialog.Close className="fixed right-5 top-5 z-10 rounded-full bg-black/50 p-2 hover:bg-black/80">
                        <X className="h-6 w-6" />
                        <span className="sr-only">Cerrar</span>
                    </Dialog.Close>

                    <div className="w-[90%] md:w-[80%] mx-auto py-16">
                        <Dialog.Title className="text-2xl md:text-3xl font-semibold">
                            {album?.titulo ?? ""}
                        </Dialog.Title>
                        <Dialog.Description className="mt-1 text-sm opacity-80">
                            {[formatEventDate(album?.fecha_evento ?? null), album?.ubicacion]
                                .filter(Boolean)
                                .join(" · ")}
                        </Dialog.Description>
                        {album?.descripcion && (
                            <p className="mt-4 max-w-3xl whitespace-pre-line opacity-90">{album.descripcion}</p>
                        )}

                        {error && <p className="mt-8">No se pudo cargar la galería. Intenta de nuevo más tarde.</p>}

                        {!album && !error && (
                            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {Array.from({ length: 8 }, (_, i) => (
                                    <div key={i} className="aspect-[4/3] bg-white/10 animate-pulse" />
                                ))}
                            </div>
                        )}

                        {album && (
                            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {imagenes.map((imagen, index) => (
                                    <button
                                        key={imagen.id}
                                        type="button"
                                        onClick={() => setCurrent(index)}
                                        className="aspect-[4/3] overflow-hidden bg-white/10 cursor-zoom-in"
                                    >
                                        <img
                                            src={imagen.url}
                                            width={imagen.width ?? undefined}
                                            height={imagen.height ?? undefined}
                                            alt={imagen.caption ?? album.titulo}
                                            loading="lazy"
                                            className="w-full h-full object-cover hover:scale-105 duration-300"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {viewing && (
                        <div
                            className="fixed inset-0 z-[5] flex items-center justify-center bg-black"
                            onClick={() => setCurrent(null)}
                        >
                            <figure className="flex max-h-full max-w-full flex-col items-center p-4" onClick={(e) => e.stopPropagation()}>
                                <img
                                    src={viewing.url}
                                    width={viewing.width ?? undefined}
                                    height={viewing.height ?? undefined}
                                    alt={viewing.caption ?? album?.titulo ?? ""}
                                    className="max-h-[85vh] w-auto max-w-full object-contain"
                                />
                                <figcaption className="mt-3 text-sm opacity-80">
                                    {viewing.caption && <span>{viewing.caption} · </span>}
                                    {current! + 1} / {imagenes.length}
                                </figcaption>
                            </figure>
                            {imagenes.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); step(-1); }}
                                        className="absolute left-2 md:left-6 rounded-full bg-black/50 p-2 hover:bg-black/80"
                                    >
                                        <ChevronLeft className="h-8 w-8" />
                                        <span className="sr-only">Anterior</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); step(1); }}
                                        className="absolute right-2 md:right-6 rounded-full bg-black/50 p-2 hover:bg-black/80"
                                    >
                                        <ChevronRight className="h-8 w-8" />
                                        <span className="sr-only">Siguiente</span>
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

export default function Gallery() {
    const [albums, setAlbums] = useState<Publicacion[]>([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [openSlug, setOpenSlug] = useState<string | null>(null);
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setError(false);

        publicacionesApi
            .list({ tipo: "galeria", per_page: PER_PAGE, page }, controller.signal)
            .then((res) => {
                setAlbums((prev) => (page === 1 ? res.data : [...prev, ...res.data]));
                setLastPage(res.meta.last_page);
                setLoading(false);
            })
            .catch((err) => {
                if (err.name === "AbortError") return;
                setError(true);
                setLoading(false);
            });

        return () => controller.abort();
    }, [page, attempt]);

    // Re-runs the fetch effect for the page that failed.
    const retry = () => setAttempt((n) => n + 1);

    return (
        <section id="gallery" className="min-h-screen py-12 md:py-24">
            <div className="flex flex-col gap-6 md:gap-8">
                <h2 className="text-4xl font-montserrat text-[#F4B400] font-bold text-center py-4">
                    Galería de fotos
                </h2>

                <div className="w-[85%] md:w-[75%] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mx-auto">
                    {albums.map((album) => (
                        <AlbumCard key={album.id} album={album} onOpen={() => setOpenSlug(album.slug)} />
                    ))}

                    {loading &&
                        Array.from({ length: page === 1 ? 6 : 3 }, (_, i) => (
                            <div key={`skeleton-${i}`} className="h-48 md:h-[20rem] bg-gray-200 animate-pulse" />
                        ))}
                </div>

                {!loading && !error && albums.length === 0 && (
                    <p className="text-center text-gray-600">Aún no hay galerías publicadas.</p>
                )}

                {error && (
                    <div className="flex flex-col items-center gap-3 text-gray-700">
                        <p>No se pudieron cargar las galerías.</p>
                        <button
                            type="button"
                            onClick={retry}
                            className="px-5 py-2 bg-[#7A1F1F] text-white rounded-full hover:opacity-90"
                        >
                            Reintentar
                        </button>
                    </div>
                )}

                {!loading && !error && page < lastPage && (
                    <button
                        type="button"
                        onClick={() => setPage((p) => p + 1)}
                        className="mx-auto px-6 py-2 bg-[#7A1F1F] text-white rounded-full hover:opacity-90"
                    >
                        Cargar más
                    </button>
                )}

                <Divider />
            </div>

            <AlbumDialog slug={openSlug} onClose={() => setOpenSlug(null)} />
        </section>
    );
}
