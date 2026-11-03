import { Fragment } from "react";
import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react";
import { formatHour, formatLongDate } from "../../lib/publicaciones";
import PhotoGrid from "../publicaciones/photo-grid";
import usePublicacion from "../publicaciones/use-publicacion";

function NotFound() {
    return (
        <section className="flex flex-col items-center justify-center gap-6 py-24 text-center">
            <h1 className="text-4xl font-montserrat font-bold text-gray-800">404</h1>
            <p className="text-base font-inter text-gray-600 max-w-md">
                El evento que buscas no existe o ya no está disponible.
            </p>
            <a
                href="/eventos"
                className="px-6 py-2 rounded-full bg-[#7A1F1F] hover:opacity-90 text-white text-sm font-montserrat transition"
            >
                Volver a eventos
            </a>
        </section>
    );
}

function Skeleton() {
    return (
        <div className="w-[85%] md:w-[75%] max-w-3xl mx-auto py-10 animate-pulse">
            <div className="aspect-video rounded-xl bg-gray-200" />
            <div className="mt-8 h-9 w-3/4 rounded bg-gray-200" />
            <div className="mt-3 h-9 w-1/2 rounded bg-gray-200" />
            <div className="mt-6 h-4 w-2/3 rounded bg-gray-200" />
        </div>
    );
}

export default function EventDetail() {
    const { publicacion, status } = usePublicacion();

    if (status === "notfound") return <NotFound />;

    if (status === "error") {
        return <p className="py-24 text-center text-gray-700">No se pudo cargar el evento. Intenta de nuevo más tarde.</p>;
    }

    if (!publicacion) return <Skeleton />;

    const cls = "h-4 w-4 shrink-0";
    const meta: { icon: React.ReactNode; text: string; capitalize?: boolean }[] = [];
    if (publicacion.fecha_evento) {
        meta.push({ icon: <Calendar className={cls} />, text: formatLongDate(publicacion.fecha_evento), capitalize: true });
        meta.push({ icon: <Clock className={cls} />, text: formatHour(publicacion.fecha_evento) });
    }
    if (publicacion.ubicacion) meta.push({ icon: <MapPin className={cls} />, text: publicacion.ubicacion });

    const imagenes = publicacion.imagenes ?? [];

    return (
        <article className="w-[85%] md:w-[75%] max-w-3xl mx-auto flex flex-col gap-6 py-10">
            <a
                href="/eventos"
                className="inline-flex w-fit items-center gap-1 text-sm font-montserrat text-[#7A1F1F] hover:underline"
            >
                <ArrowLeft className="h-4 w-4" />
                Volver a eventos
            </a>

            {publicacion.portada_url ? (
                <img
                    src={publicacion.portada_url}
                    alt={publicacion.titulo}
                    className="aspect-video w-full rounded-xl object-cover"
                />
            ) : (
                <div className="aspect-video w-full rounded-xl bg-gray-200" />
            )}

            <h1 className="text-3xl md:text-4xl font-montserrat font-bold text-gray-900">{publicacion.titulo}</h1>

            {meta.length > 0 && (
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-inter text-gray-600">
                    {meta.map((item, i) => (
                        <Fragment key={i}>
                            {i > 0 && <span aria-hidden>·</span>}
                            <span className="inline-flex items-center gap-1.5">
                                {item.icon}
                                <span className={item.capitalize ? "first-letter:uppercase" : undefined}>
                                    {item.text}
                                </span>
                            </span>
                        </Fragment>
                    ))}
                </p>
            )}

            {publicacion.descripcion && (
                <p className="whitespace-pre-line font-inter text-gray-700">{publicacion.descripcion}</p>
            )}

            <div className="flex flex-col gap-2 px-5">
                {imagenes.map((imagen, index) => (
                    <img
                        src={imagen.url}
                        width={imagen.width ?? undefined}
                        height={imagen.height ?? undefined}
                        alt={imagen.caption ?? "imagen"}
                        loading="lazy"
                        className="w-full h-full object-cover"
                    />
                ))}
            </div>

            <a
                href="/#contacto"
                className="mt-2 w-fit rounded-full bg-[#7A1F1F] px-6 py-2 text-white hover:opacity-90"
            >
                Contáctanos
            </a>
        </article>
    );
}
