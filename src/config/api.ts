// API Configuration for different environments
export const API_CONFIG = {
    development: {
        baseUrl: import.meta.env.PUBLIC_DEVELOPMENT_API_URL || "http://localhost:8000/api",
        turnstile_public_key: import.meta.env.PUBLIC_TURNSTILE_SITE_KEY
    },

    production: {
        baseUrl: import.meta.env.PUBLIC_PRODUCTION_API_URL || "https://notas.sinfocarabobo.com/api",
        turnstile_public_key: import.meta.env.PUBLIC_TURNSTILE_SITE_KEY
    },
} as const;

const normalizeBaseUrl = (url: string): string => {
    const trimmed = url.trim();

    if (!trimmed) {
        return "";
    }

    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed.replace(/^\/+/, "")}`;

    return withProtocol.replace(/\/$/, "");
};

// Get current environment
const getEnvironment = (): "development" | "production" => {
    if (typeof window === "undefined") return "development";

    const hostname = window.location.hostname;

    if (hostname === "localhost" || hostname === "127.0.0.1") {
        return "development";
    } else {
        return "production";
    }
};

// Export the current API base URL
export const API_BASE_URL = normalizeBaseUrl(API_CONFIG[getEnvironment()].baseUrl);
export const TURNSTILE_KEY = API_CONFIG[getEnvironment()].turnstile_public_key;
