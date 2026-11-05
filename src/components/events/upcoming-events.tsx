import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { publicacionesApi, type Publicacion } from "../../lib/publicaciones";
import { EventCard } from "./events";

export default function UpcomingEvents() {
    const [eventos, setEventos] = useState<Publicacion[]>([]);

    useEffect(() => {
        const controller = new AbortController();
        publicacionesApi
            .list({ tipo: "evento", upcoming: true, per_page: 6 }, controller.signal)
            .then((res) => setEventos(res.data))
            // Optional section: on failure the page simply goes on without it.
            .catch(() => {});

        return () => controller.abort();
    }, []);

    if (eventos.length === 0) return null;

    return (
        <section id="eventos" className="bg-white py-12 md:py-16">
            <div className="flex flex-col gap-6 md:gap-8">
                <h2 className="text-4xl lg:text-5xl font-montserrat text-wine font-bold text-center">
                    Próximos eventos
                </h2>

                <div className="events-carousel w-[85vw] mx-auto">
                    <Swiper
                        modules={[Navigation, A11y]}
                        navigation
                        a11y={{ prevSlideMessage: "Evento anterior", nextSlideMessage: "Evento siguiente" }}
                        spaceBetween={24}
                        slidesPerView={1}
                        breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
                        className="!px-1 !py-3"
                    >
                        {eventos.map((evento) => (
                            <SwiperSlide key={evento.id} className="!h-auto">
                                <EventCard evento={evento} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <a
                    href="/eventos"
                    className="mx-auto px-6 py-3 font-montserrat font-medium bg-wine hover:bg-wine-deep text-white rounded-full transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
                >
                    Ver todos los eventos
                </a>
            </div>
        </section>
    );
}
