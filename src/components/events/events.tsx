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

const formatBadge = (iso: string, options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("es-VE", { timeZone: "UTC", ...options }).format(new Date(iso));

function DateBadge({ iso }: { iso: string }) {
    return (
        <time
            dateTime={iso.slice(0, 10)}
            className="absolute top-3 left-3 flex flex-col items-center min-w-16 px-3 py-2 rounded-md bg-wine text-white leading-none shadow-md"
        >
            <span className="sr-only">{formatLongDate(iso)}</span>
            <span aria-hidden="true" className="text-3xl font-bold">{formatBadge(iso, { day: "2-digit" })}</span>
            <span aria-hidden="true" className="mt-1 text-xs font-semibold uppercase tracking-wider text-gold-trim">
                {formatBadge(iso, { month: "short" }).replace(".", "")}
            </span>
            <span aria-hidden="true" className="mt-1 text-[0.7rem] opacity-80">{formatBadge(iso, { year: "numeric" })}</span>
        </time>
    );
}

function EventTile({ evento }: { evento: Publicacion }) {
    return (
        <article className="group relative flex flex-col h-full gap-3 font-montserrat text-gray-800">
            <div className="relative rounded-lg overflow-hidden">
                <Cover
                    src={evento.portada_url}
                    className="aspect-[4/3] transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                />
                {evento.fecha_evento && <DateBadge iso={evento.fecha_evento} />}
            </div>
            <h3 className="text-xl font-semibold leading-tight text-balance [overflow-wrap:anywhere]">{evento.titulo}</h3>
            {evento.ubicacion && (
                <p className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-wine" aria-hidden="true" />
                    <span className="min-w-0 [overflow-wrap:anywhere]">{evento.ubicacion}</span>
                </p>
            )}
            <a
                href={eventHref(evento)}
                aria-label={`Más información sobre ${evento.titulo}`}
                className={`inline-flex items-center gap-2 w-fit min-h-11 mt-auto text-sm font-semibold text-wine group-hover:underline underline-offset-4 ${stretchedLink}`}
            >
                Más información
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
            </a>
        </article>
    );
}

function EventGrid({ eventos }: { eventos: Publicacion[] }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventos.map((evento) => (
                <EventTile key={evento.id} evento={evento} />
            ))}
        </div>
    );
}

function EventSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-hidden="true">
            {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="flex flex-col gap-3 animate-pulse motion-reduce:animate-none">
                    <div className="aspect-[4/3] rounded-lg bg-gray-200" />
                    <div className="h-5 w-3/4 rounded bg-gray-200" />
                    <div className="h-4 w-1/2 rounded bg-gray-200" />
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

            {upcoming.items.length > 0 && (
                <div ref={upcoming.resultsRef} className="flex flex-col gap-6">
                    <h2 className={sectionHeading}>Próximos eventos</h2>
                    <EventGrid eventos={upcoming.items} />
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
