import { useEffect, useState } from "react";
import { Calendar, Images, MapPin } from "lucide-react";
import { formatLongDate, publicacionesApi, type Publicacion } from "../../lib/publicaciones";

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

function AlbumCard({ album }: { album: Publicacion }) {
    return (
        <a
            href={`/album?slug=${encodeURIComponent(album.slug)}`}
            className="bg-white text-left transition duration-500 transform cursor-pointer hover:-translate-y-2 hover:shadow-lg"
        >
            <div className="relative group aspect-square bg-gray-200">
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
                    <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/80">
                        <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span className="first-letter:uppercase">
                                {formatLongDate(album.fecha_evento ?? album.created_at)}
                            </span>
                        </span>
                        {album.ubicacion && (
                            <span className="inline-flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {album.ubicacion}
                            </span>
                        )}
                        <span className="inline-flex items-center gap-1">
                            <Images className="h-3.5 w-3.5" />
                            {album.imagenes_count} {album.imagenes_count === 1 ? "foto" : "fotos"}
                        </span>
                    </p>
                </div>
            </div>
        </a>
    );
}

export default function Gallery() {
    const [albums, setAlbums] = useState<Publicacion[]>([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
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
                        <AlbumCard key={album.id} album={album} />
                    ))}

                    {loading &&
                        Array.from({ length: page === 1 ? 6 : 3 }, (_, i) => (
                            <div key={`skeleton-${i}`} className="aspect-square bg-gray-200 animate-pulse" />
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
        </section>
    );
}
