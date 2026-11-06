import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { formatLongDate, type Publicacion } from "../../lib/publicaciones";
import { Cover, EmptyState, ErrorState, LoadingStatus, LoadMore } from "../publicaciones/list-parts";
import { usePublicacionesList } from "../publicaciones/use-publicaciones-list";

const PER_PAGE = 9;
// The API's maximum; a school calendar doesn't hold more upcoming events than this.
const MAX_UPCOMING = 50;

const eventHref = (evento: Publicacion) => `/evento?slug=${encodeURIComponent(evento.slug)}`;
// Stretches the link's hit area over the nearest `relative` ancestor, so the whole card is clickable.
const stretchedLink = "after:absolute after:inset-0";

function EventMeta({ evento, iconClass }: { evento: Publicacion; iconClass: string }) {
    return (
        <>
            {evento.fecha_evento && (
                <p className="flex items-start gap-2 text-sm">
                    <Calendar className={`h-4 w-4 mt-0.5 shrink-0 ${iconClass}`} aria-hidden="true" />
                    <span className="first-letter:uppercase">{formatLongDate(evento.fecha_evento)}</span>
                </p>
            )}
            {evento.ubicacion && (
                <p className="flex items-start gap-2 text-sm">
                    <MapPin className={`h-4 w-4 mt-0.5 shrink-0 ${iconClass}`} aria-hidden="true" />
                    <span className="min-w-0 [overflow-wrap:anywhere]">{evento.ubicacion}</span>
                </p>
            )}
        </>
    );
}

export function EventCard({ evento }: { evento: Publicacion }) {
    return (
        <article className="relative flex flex-col h-full rounded-lg overflow-hidden bg-gray-100 font-montserrat text-gray-800">
            <Cover src={evento.portada_url} className="aspect-[16/10]" />
            <div className="flex flex-1 flex-col gap-2 p-4">
                <h3 className="text-lg font-semibold leading-tight [overflow-wrap:anywhere]">{evento.titulo}</h3>
                <EventMeta evento={evento} iconClass="text-wine" />
                <a
                    href={eventHref(evento)}
                    aria-label={`Más información sobre ${evento.titulo}`}
                    className={`inline-flex items-center w-fit min-h-11 mt-auto text-sm font-semibold text-wine hover:underline underline-offset-4 ${stretchedLink}`}
                >
                    Más información
                </a>
            </div>
        </article>
    );
}

function NextEvent({ evento }: { evento: Publicacion }) {
    return (
        <article className="relative grid md:grid-cols-2 font-montserrat text-white">
            <Cover src={evento.portada_url} className="aspect-[4/3] md:aspect-auto md:min-h-96" />
            <div className="flex flex-col justify-center items-start gap-3 p-8 lg:p-12 bg-gradient-to-b from-wine-deep to-wine">
                <h3 className="text-3xl lg:text-4xl font-bold leading-tight text-balance [overflow-wrap:anywhere]">
                    {evento.titulo}
                </h3>
                <EventMeta evento={evento} iconClass="text-gold-trim" />
                {evento.descripcion && (
                    <p className="text-base leading-relaxed line-clamp-3 text-pretty">{evento.descripcion}</p>
                )}
                <a
                    href={eventHref(evento)}
                    aria-label={`Más información sobre ${evento.titulo}`}
                    className={`inline-flex items-center gap-2 min-h-11 mt-2 px-6 rounded-full font-semibold text-wine-deep bg-gold-trim hover:bg-white transition-colors duration-300 focus-visible:outline-white ${stretchedLink}`}
                >
                    Más información
                    <ArrowRight className="h-5 w-5 shrink-0" aria-hidden="true" />
                </a>
            </div>
        </article>
    );
}

function EventGrid({ eventos }: { eventos: Publicacion[] }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventos.map((evento) => (
                <EventCard key={evento.id} evento={evento} />
            ))}
        </div>
    );
}

function EventSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-hidden="true">
            {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="flex flex-col rounded-lg overflow-hidden bg-gray-100 animate-pulse motion-reduce:animate-none">
                    <div className="aspect-[16/10] bg-gray-200" />
                    <div className="flex flex-col gap-3 p-4 h-36">
                        <div className="h-5 w-3/4 rounded bg-gray-200" />
                        <div className="h-4 w-1/2 rounded bg-gray-200" />
                    </div>
                </div>
            ))}
        </div>
    );
}

const sectionHeading = "text-3xl lg:text-4xl font-montserrat font-bold leading-tight text-wine text-balance";

export default function Events() {
    const upcoming = usePublicacionesList({ tipo: "evento", upcoming: true, per_page: MAX_UPCOMING });
    const all = usePublicacionesList({ tipo: "evento", per_page: PER_PAGE }, { syncPageToUrl: true });

    const loading = upcoming.loading || all.loading;
    const error = upcoming.error ?? all.error;
    const retry = () => {
        if (upcoming.error) upcoming.retry();
        if (all.error) all.retry();
    };

    // The full list also contains the upcoming events, newest first. Until the upcoming
    // list has arrived they can't be told apart, and would be shown as past events.
    const upcomingReady = !upcoming.loading && !upcoming.error;
    const upcomingIds = new Set(upcoming.items.map((evento) => evento.id));
    const past = upcomingReady ? all.items.filter((evento) => !upcomingIds.has(evento.id)) : [];
    const [next, ...later] = upcoming.items;

    const hasEvents = upcoming.items.length > 0 || past.length > 0;
    const isEmpty = !loading && !error && !hasEvents;

    return (
        <section id="eventos" className="flex flex-col gap-12 w-[85vw] mx-auto py-12 md:py-16">
            <LoadingStatus loading={loading}>Cargando eventos…</LoadingStatus>

            {loading && !error && !hasEvents && <EventSkeleton />}

            {error && <ErrorState error={error} noun="los eventos" loading={loading} onRetry={retry} />}

            {isEmpty && (
                <EmptyState
                    title="Aún no hay eventos publicados."
                    text="Mientras tanto, puedes ver las fotos de la academia en la galería o seguirnos en Instagram."
                    action={{ href: "/galeria", label: "Ver la galería" }}
                />
            )}

            {next && (
                <div ref={upcoming.resultsRef} className="flex flex-col gap-6">
                    <h2 className={sectionHeading}>Próximos eventos</h2>
                    <NextEvent evento={next} />
                    {later.length > 0 && <EventGrid eventos={later} />}
                </div>
            )}

            {past.length > 0 && (
                <div ref={all.resultsRef} className="flex flex-col gap-6">
                    <h2 className={sectionHeading}>Eventos anteriores</h2>
                    <EventGrid eventos={past} />
                </div>
            )}

            {!error && upcomingReady && all.hasMore && <LoadMore loading={all.loading} onClick={all.loadMore} />}
        </section>
    );
}
