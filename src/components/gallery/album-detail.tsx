import { ArrowLeft } from "lucide-react";
import ArticleContent from "../publicaciones/article-content";
import PhotoGrid from "../publicaciones/photo-grid";
import { GallerySkeleton } from "../publicaciones/list-parts";
import usePublicacion from "../publicaciones/use-publicacion";

function NotFound() {
    return (
        <section className="flex flex-col items-center justify-center gap-6 py-24 text-center">
            <h1 className="text-4xl font-montserrat font-bold text-gray-800">404</h1>
            <p className="text-base text-gray-600 max-w-md">
                El álbum que buscas no existe o ya no está disponible.
            </p>
            <a
                href="/galeria"
                className="px-6 py-2 rounded-full bg-[#7A1F1F] hover:opacity-90 text-white text-sm font-montserrat transition"
            >
                Volver a la galería
            </a>
        </section>
    );
}

export default function AlbumDetail() {
    const { publicacion, status } = usePublicacion("galeria");

    if (status === "notfound") return <NotFound />;

    if (status === "error") {
        return <p className="py-24 text-center text-gray-700">No se pudo cargar el álbum. Intenta de nuevo más tarde.</p>;
    }

    if (!publicacion) {
        return (
            <div className="w-[85%] md:w-[75%] mx-auto py-10">
                <GallerySkeleton />
            </div>
        );
    }

    const { imagenes } = publicacion;

    return (
        <article className="w-[85%] md:w-[75%] mx-auto flex flex-col gap-6 py-10">
            <a
                href="/galeria"
                className="inline-flex w-fit items-center gap-1 text-sm font-montserrat text-[#7A1F1F] hover:underline"
            >
                <ArrowLeft className="h-4 w-4" />
                Galería
            </a>

            <h1 className="text-3xl md:text-4xl font-montserrat font-bold text-gray-900">{publicacion.titulo}</h1>

            <ArticleContent html={publicacion.contenido} />

            {imagenes.length > 0 && <PhotoGrid imagenes={imagenes} titulo={publicacion.titulo} />}
        </article>
    );
}
