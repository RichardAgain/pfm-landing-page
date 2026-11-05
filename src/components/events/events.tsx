import { useEffect, useState } from "react";
import { Calendar, MapPin } from "lucide-react";
import { formatCardDate, publicacionesApi, type Publicacion } from "../../lib/publicaciones";

const PER_PAGE = 9;

export function EventCard({ evento }: { evento: Publicacion }) {
    return (
        <article className="flex flex-col h-full rounded-lg overflow-hidden bg-gray-100">
            <div className="aspect-[16/10] bg-gray-200">
                {evento.portada_url && (
                    <img
                        src={evento.portada_url}
                        alt=""
                        loading="lazy"
                        className="w-full h-full object-cover"
                    />
                )}
            </div>
            <div className="flex flex-1 flex-col gap-2 p-4">
                <h3 className="text-lg font-montserrat font-semibold leading-tight text-gray-800 [overflow-wrap:anywhere]">{evento.titulo}</h3>
                {evento.fecha_evento && (
                    <p className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4 shrink-0 text-wine" />
                        {formatCardDate(evento.fecha_evento)}
                    </p>
                )}
                {evento.ubicacion && (
                    <p className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 shrink-0 text-wine" />
                        <span className="min-w-0 truncate">{evento.ubicacion}</span>
                    </p>
                )}
                <a
                    href={`/evento?slug=${encodeURIComponent(evento.slug)}`}
                    aria-label={`Más información sobre ${evento.titulo}`}
                    className="mt-auto pt-2 text-sm font-semibold text-wine hover:underline"
                >
                    Más información
                </a>
            </div>
        </article>
    );
}

export default function Events() {
    const [eventos, setEventos] = useState<Publicacion[]>([]);
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
            .list({ tipo: "evento", per_page: PER_PAGE, page }, controller.signal)
            .then((res) => {
                setEventos((prev) => (page === 1 ? res.data : [...prev, ...res.data]));
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

    return (
        <section id="eventos" className="min-h-screen py-12 md:py-24">
            <div className="flex flex-col gap-6 md:gap-8">
                <h2 className="text-4xl font-montserrat text-[#F4B400] font-bold text-center py-4">Eventos</h2>

                <div className="w-[85%] md:w-[75%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto">
                    {eventos.map((evento) => (
                        <EventCard key={evento.id} evento={evento} />
                    ))}

                    {loading &&
                        Array.from({ length: page === 1 ? 6 : 3 }, (_, i) => (
                            <div key={`skeleton-${i}`} className="aspect-[4/3] bg-gray-200 animate-pulse" />
                        ))}
                </div>

                {!loading && !error && eventos.length === 0 && (
                    <p className="text-center text-gray-600">Aún no hay eventos publicados.</p>
                )}

                {error && (
                    <div className="flex flex-col items-center gap-3 text-gray-700">
                        <p>No se pudieron cargar los eventos.</p>
                        <button
                            type="button"
                            onClick={() => setAttempt((n) => n + 1)}
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
            </div>
        </section>
    );
}
