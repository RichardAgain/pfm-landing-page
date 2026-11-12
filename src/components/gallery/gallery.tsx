import { Calendar, Images } from "lucide-react";
import { formatLongDate, type Publicacion } from "../../lib/publicaciones";
import { Cover, EmptyState, ErrorState, GallerySkeleton, LoadingStatus, LoadMore } from "../publicaciones/list-parts";
import { usePublicacionesList } from "../publicaciones/use-publicaciones-list";

const PER_PAGE = 12;

const albumHref = (album: Publicacion) => `/album?slug=${encodeURIComponent(album.slug)}`;
const photoCount = (album: Publicacion) => `${album.imagenes_count} ${album.imagenes_count === 1 ? "foto" : "fotos"}`;

function AlbumMeta({ album }: { album: Publicacion }) {
    return (
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <span className="inline-flex items-center gap-1">
                <Calendar className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="first-letter:uppercase">
                    {formatLongDate(album.fecha_evento ?? album.created_at)}
                </span>
            </span>
            <span className="inline-flex items-center gap-1">
                <Images className="h-4 w-4 shrink-0" aria-hidden="true" />
                {photoCount(album)}
            </span>
        </p>
    );
}

function AlbumCard({ album }: { album: Publicacion }) {
    return (
        <a href={albumHref(album)} className="group relative block aspect-square rounded-lg overflow-hidden text-white font-montserrat">
            <div className="absolute inset-0">
                <Cover
                    src={album.portada_url}
                    className="h-full transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                />
            </div>
            {/* The gradient grows with the text, so long titles stay on the dark part */}
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-4 pt-14 bg-gradient-to-t from-black/90 via-black/75 to-transparent">
                <h2 className="text-lg font-semibold leading-tight [overflow-wrap:anywhere] group-hover:underline underline-offset-4">
                    {album.titulo}
                </h2>
                <AlbumMeta album={album} />
            </div>
        </a>
    );
}

const GRID_CLASS = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";

export default function Gallery() {
    const { items: albums, loading, error, hasMore, retry, loadMore, resultsRef } = usePublicacionesList(
        { tipo: "galeria", per_page: PER_PAGE },
        { syncPageToUrl: true },
    );

    const isEmpty = !loading && !error && albums.length === 0;
    const showSkeleton = loading && !error && albums.length === 0;

    return (
        <section id="gallery" className="flex flex-col gap-8 w-[85vw] mx-auto py-12 md:py-16">
            <LoadingStatus loading={loading}>Cargando galerías…</LoadingStatus>

            {albums.length > 0 && (
                <div ref={resultsRef} className={GRID_CLASS}>
                    {albums.map((album) => (
                        <AlbumCard key={album.id} album={album} />
                    ))}
                </div>
            )}

            {showSkeleton && <GallerySkeleton />}

            {isEmpty && (
                <EmptyState
                    title="Aún no hay galerías publicadas."
                    text="Mientras tanto, puedes ver los eventos de la academia o seguirnos en Instagram."
                    action={{ href: "/eventos", label: "Ver los eventos" }}
                />
            )}

            {error && <ErrorState error={error} noun="las galerías" loading={loading} onRetry={retry} />}

            {!error && hasMore && <LoadMore loading={loading} onClick={loadMore} />}
        </section>
    );
}
