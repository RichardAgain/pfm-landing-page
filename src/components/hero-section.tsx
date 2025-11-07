import { useState, useEffect, useRef } from "react";
import { Menu, ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet.tsx";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import SwiperCore from "swiper";
import { Autoplay } from "swiper/modules";

SwiperCore.use([Autoplay]);

export default function HeroSection() {
  // State variable for toggle menu management
  const [isOpen, setIsOpen] = useState(false);

  // Routes array
  const routes = [
    { href: "#nosotros", label: "Nosotros" },
    { href: "#historia", label: "Historia" },
    { href: "#aliados", label: "Aliados" },
    { href: "/programa-t21-down", label: "Programa T21 Down" },
    { href: "/galeria", label: "Galería" },
    { href: "#contacto", label: "Contacto" }
  ]

  // ----------------------------------------------------------

  // Ref for slide-in transition
  const ref = useRef(null);

  // State variables for content slide-in transition
  const [titleVisible, setTitleVisible] = useState(false);
  const [phraseVisible, setPhraseVisible] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(false);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => { setTitleVisible(true); }, 750);
          setTimeout(() => { setPhraseVisible(true); }, 1500);
          setTimeout(() => { setButtonsVisible(true); }, 2250);
        }
      },
      { threshold: 0 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="inicio" ref={ref} className="relative w-full min-h-130 md:min-h-screen bottom-fade">
      <div className="absolute inset-0 z-0 w-full">
        <Swiper loop={true} autoplay={{ delay: 5000 }} className="flex w-full h-130 md:h-[100%]">
          {["/herosection/image1.JPG", "/herosection/image2.JPG", "/herosection/image3.JPG", "/herosection/image4.jpg", "/herosection/image5.JPG", "/herosection/image6.JPG"].map((src, index) => (
            <SwiperSlide key={index}>
              <img src={src} alt="Academia Internacional de Música - Maestro José Calabrese" className="w-full h-130 md:h-[100%] object-cover" />
              <div className="absolute inset-0 z-5 h-130 md:h-[100%] bg-black opacity-50 pointer-events-none"></div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Navigator */}
      <header className="flex items-center p-8 md:px-24 md:py-6 z-10 slide-from-bottom">
        <div className="flex w-full items-center justify-start z-10">
          <div className="flex w-1/2 lg:w-1/5 items-center">
            <img src="/logo-white.png" alt="Academia Internacional de Música - Maestro José Calabrese" className="w-15 md:w-20" />
          </div>

          {/* Main menu */}
          <nav className="hidden lg:flex lg:w-3/5 justify-center gap-8">
            {routes.map((route) => (
              <a key={route.href} href={route.href} className="md:text-sm text-white font-montserrat font-medium py-1 border-b-2 border-b-transparent hover:border-b-white">{route.label}</a>
            ))}
          </nav>

          {/* Login button */}
          <div className="hidden lg:flex lg:w-1/5 items-center justify-end gap-2">
            <a href="/registro" className="flex w-fit items-center justify-center bg-[#C19310] hover:bg-[#a57f0d] gap-1 px-4 py-[0.8vh] rounded-full md:text-sm font-montserrat text-white font-medium duration-300 cursor-pointer">Inscripción</a>
            <a href="/login" className="flex w-fit items-center justify-center bg-[#C19310] hover:bg-[#a57f0d] gap-[2px] px-4 py-[0.8vh] rounded-full md:text-sm font-montserrat text-white font-medium duration-300 cursor-pointer">Iniciar sesión <ChevronRight className="w-5 h-5"></ChevronRight></a>
          </div>

          {/* Toggle menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="flex w-1/2 items-center justify-end lg:hidden">
                <Menu className="h-5 w-5 text-white" />
              </button>
            </SheetTrigger>

            <SheetContent className="bg-white lg:hidden slide-from-right">
              <div className="absolute left-0 top-0 h-full w-[5px] bg-gradient-to-b from-[#A4131F] to-[#C19310]"></div>
              <nav className="flex flex-col gap-6 my-12">
                {routes.map((route) => (
                  <a key={route.href} href={route.href} className="text-lg font-montserrat text-gray-800 font-medium hover:font-semibold" onClick={() => setIsOpen(false)}>{route.label}</a>
                ))}
                <a key="/registro" href="/registro" className="text-lg font-montserrat text-gray-800 font-semibold hover:font-bold" onClick={() => setIsOpen(false)}>Inscripción</a>
                <a key="/login" href="/login" className="text-lg font-montserrat text-gray-800 font-semibold hover:font-bold" onClick={() => setIsOpen(false)}>Iniciar sesión</a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Content */}
      <div className="relative inset-0 z-10 top-5 md:top-30 flex flex-col w-[85vw] gap-4 md:gap-6 mx-auto">
        <h1 className={`font-montserrat text-white text-center md:leading-[4rem] ${titleVisible ? "slide-from-bottom" : "opacity-0"}`}>
          <span className="text-lg md:text-5xl font-light">Academia Internacional de Música</span> <br /> <span className="text-4xl md:text-6xl bg-clip-text text-transparent bg-[#C19319] font-bold">Maestro José Calabrese</span>
        </h1>
        <p className={`text-base md:text-3xl font-montserrat text-white text-center px-6 md:px-0 ${phraseVisible ? "slide-from-bottom" : "opacity-0"}`}>
          <i>Desde el corazón de Carabobo, resonando con historia y pasión</i>
        </p>
        <div className={`flex justify-center gap-2 my-4 md:my-8 ${buttonsVisible ? "slide-from-bottom" : "opacity-0"}`}>
          <a href="/registro" className="flex w-fit items-center justify-center bg-[#56070c] hover:bg-[#6e0a11] gap-1 px-4 md:px-8 py-1 md:py-2 rounded-full text-sm md:text-base font-montserrat text-white font-medium duration-300 cursor-pointer">Inscribirse <ChevronRight className="w-5 h-5"></ChevronRight></a>
          <a href="#contacto" className="flex w-fit items-center justify-center bg-[#7a1a1f] hover:bg-[#942026] gap-1 px-4 md:px-8 py-1 md:py-2 rounded-full text-sm md:text-base font-montserrat text-white font-medium duration-300 cursor-pointer">Contáctanos</a>
        </div>
      </div>
    </section>
  )
} 3
