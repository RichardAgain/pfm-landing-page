import { useState, type ReactNode } from "react";
import type { ListError } from "./use-publicaciones-list";

// Shared pieces of the /galeria and /eventos lists.

const INSTAGRAM_URL = "https://www.instagram.com/sinfocarabobo";
const buttonClass =
  "inline-flex items-center justify-center w-fit min-h-11 px-6 rounded-full font-montserrat font-medium text-white bg-wine hover:bg-wine-deep transition-colors duration-300 aria-disabled:opacity-70 aria-disabled:cursor-wait";

// A publication's cover. Admin content can have no image or a broken one, so both fall
// back to a burgundy panel with the academy mark.
export function Cover({ src, alt = "", className = "" }: { src: string | null; alt?: string; className?: string }) {
  const [broken, setBroken] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-gradient-to-b from-wine-deep to-wine ${className}`}>
      {src && !broken ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setBroken(true)}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <img
          src="/logo-icon.png"
          alt=""
          width="40"
          height="40"
          className="absolute top-1/2 left-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2"
        />
      )}
    </div>
  );
}

export function ErrorState({
  error,
  noun,
  loading,
  onRetry,
}: {
  error: ListError;
  noun: string;
  loading: boolean;
  onRetry: () => void;
}) {
  return (
    <div role="alert" className="flex flex-col items-start gap-4 font-montserrat text-gray-800">
      <span aria-hidden="true" className="block w-12 h-0.5 bg-gold" />
      <h2 className="text-2xl md:text-3xl font-bold leading-tight text-wine text-balance">
        No se pudieron cargar {noun}
      </h2>
      <p className="text-base leading-relaxed text-pretty max-w-[60ch]">
        {error === "rate-limit"
          ? "Hay demasiadas solicitudes en este momento. Espera un momento e inténtalo de nuevo."
          : "Revisa tu conexión e inténtalo de nuevo. También puedes ver nuestras novedades en Instagram."}
      </p>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <button
          type="button"
          onClick={onRetry}
          aria-disabled={loading}
          className={buttonClass}
        >
          {loading ? "Reintentando…" : "Reintentar"}
        </button>
        <InstagramLink />
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  text,
  action,
}: {
  title: string;
  text: string;
  action: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col items-start gap-4 font-montserrat text-gray-800">
      <span aria-hidden="true" className="block w-12 h-0.5 bg-gold" />
      <h2 className="text-2xl md:text-3xl font-bold leading-tight text-wine text-balance">{title}</h2>
      <p className="text-base leading-relaxed text-pretty max-w-[60ch]">{text}</p>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <a href={action.href} className={buttonClass}>
          {action.label}
        </a>
        <InstagramLink />
      </div>
    </div>
  );
}

function InstagramLink() {
  return (
    <a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center min-h-11 font-montserrat font-medium text-wine underline underline-offset-4 hover:text-wine-deep"
    >
      Síguenos en Instagram
      <span className="sr-only"> (se abre en una pestaña nueva)</span>
    </a>
  );
}

export function GallerySkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-hidden="true">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="aspect-square rounded-lg bg-gray-200 animate-pulse motion-reduce:animate-none" />
      ))}
    </div>
  );
}

export function LoadMore({ loading, onClick }: { loading: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-disabled={loading}
      className={`${buttonClass} mx-auto`}
    >
      {loading ? "Cargando…" : "Cargar más"}
    </button>
  );
}

export function LoadingStatus({ loading, children }: { loading: boolean; children: ReactNode }) {
  return (
    <p role="status" className="sr-only">
      {loading ? children : ""}
    </p>
  );
}
