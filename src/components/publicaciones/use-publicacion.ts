import { useEffect, useState } from "react";
import { publicacionesApi, type Publicacion } from "../../lib/publicaciones";

export default function usePublicacion() {
    const [publicacion, setPublicacion] = useState<Publicacion | null>(null);
    const [status, setStatus] = useState<"loading" | "ready" | "notfound" | "error">("loading");

    useEffect(() => {
        const slug = new URLSearchParams(window.location.search).get("slug");
        if (!slug) {
            setStatus("notfound");
            return;
        }

        const controller = new AbortController();
        publicacionesApi
            .get(slug, controller.signal)
            .then((data) => {
                setPublicacion(data);
                setStatus("ready");
            })
            .catch((err) => {
                if (err.name === "AbortError") return;
                setStatus(err.status === 404 ? "notfound" : "error");
            });

        return () => controller.abort();
    }, []);

    return { publicacion, status };
}
