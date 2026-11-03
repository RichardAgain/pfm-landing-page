import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
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
            .catch(() => {});

        return () => controller.abort();
    }, []);

    if (eventos.length === 0) return null;

    return (
        <section id="eventos" className="py-12 md:py-24">
            <div className="flex flex-col gap-6 md:gap-8">
                <h2 className="text-4xl font-montserrat text-[#F4B400] font-bold text-center py-4">
                    Próximos eventos
                </h2>

                <div className="w-[85%] md:w-[75%] mx-auto">
                    <Swiper
                        modules={[Navigation]}
                        navigation
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
                    className="mx-auto px-6 py-2 bg-[#7A1F1F] text-white rounded-full hover:opacity-90"
                >
                    Ver todos
                </a>
            </div>
        </section>
    );
}
