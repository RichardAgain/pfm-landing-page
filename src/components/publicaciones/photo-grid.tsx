import { useCallback, useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { PublicacionImagen } from "../../lib/publicaciones";

export default function PhotoGrid({ imagenes, titulo }: { imagenes: PublicacionImagen[]; titulo: string }) {
    const [current, setCurrent] = useState<number | null>(null);

    const step = useCallback(
        (delta: number) =>
            setCurrent((i) => (i === null ? i : (i + delta + imagenes.length) % imagenes.length)),
        [imagenes.length],
    );

    useEffect(() => {
        if (current === null) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") step(-1);
            if (e.key === "ArrowRight") step(1);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [current, step]);

    const viewing = current !== null ? imagenes[current] : null;

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {imagenes.map((imagen, index) => (
                    <button
                        key={imagen.id}
                        type="button"
                        onClick={() => setCurrent(index)}
                        className="aspect-[4/3] overflow-hidden bg-gray-200 cursor-zoom-in focus-visible:outline-2 focus-visible:outline-[#7A1F1F]"
                    >
                        <img
                            src={imagen.url}
                            width={imagen.width ?? undefined}
                            height={imagen.height ?? undefined}
                            alt={imagen.caption ?? titulo}
                            loading="lazy"
                            className="w-full h-full object-cover hover:scale-105 duration-300"
                        />
                    </button>
                ))}
            </div>

            <Dialog.Root open={viewing !== null} onOpenChange={(open) => !open && setCurrent(null)}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-50 bg-black" />
                    <Dialog.Content
                        className="fixed inset-0 z-50 flex items-center justify-center text-white focus:outline-none"
                        onClick={() => setCurrent(null)}
                        aria-describedby={undefined}
                    >
                        <Dialog.Title className="sr-only">{titulo}</Dialog.Title>
                        <Dialog.Close className="fixed right-5 top-5 z-10 rounded-full bg-black/50 p-2 hover:bg-black/80">
                            <X className="h-6 w-6" />
                            <span className="sr-only">Cerrar</span>
                        </Dialog.Close>

                        {viewing && (
                            <figure
                                className="flex max-h-full max-w-full flex-col items-center p-4"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <img
                                    src={viewing.url}
                                    width={viewing.width ?? undefined}
                                    height={viewing.height ?? undefined}
                                    alt={viewing.caption ?? titulo}
                                    className="max-h-[85vh] w-auto max-w-full object-contain"
                                />
                                <figcaption className="mt-3 text-sm opacity-80">
                                    {viewing.caption && <span>{viewing.caption} · </span>}
                                    {current! + 1} / {imagenes.length}
                                </figcaption>
                            </figure>
                        )}

                        {imagenes.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); step(-1); }}
                                    className="absolute left-2 md:left-6 rounded-full bg-black/50 p-2 hover:bg-black/80"
                                >
                                    <ChevronLeft className="h-8 w-8" />
                                    <span className="sr-only">Anterior</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); step(1); }}
                                    className="absolute right-2 md:right-6 rounded-full bg-black/50 p-2 hover:bg-black/80"
                                >
                                    <ChevronRight className="h-8 w-8" />
                                    <span className="sr-only">Siguiente</span>
                                </button>
                            </>
                        )}
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    );
}
