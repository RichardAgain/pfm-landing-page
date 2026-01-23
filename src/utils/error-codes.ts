import type { ActionErrorCode } from "astro:actions";

export const errorCodeMapper = (status: number): ActionErrorCode => {
    switch (status) {
        case 400:
            return "BAD_REQUEST";
        case 401:
            return "UNAUTHORIZED";
        case 403:
            return "FORBIDDEN";
        case 404:
            return "NOT_FOUND";
        case 405:
            return "METHOD_NOT_ALLOWED";
        case 408:
            return "REQUEST_TIMEOUT";
        case 409:
            return "CONFLICT";
        case 415:
            return "UNSUPPORTED_MEDIA_TYPE";
        case 422:
            return "UNPROCESSABLE_CONTENT";
        case 429:
            return "TOO_MANY_REQUESTS";
        case 500:
            return "INTERNAL_SERVER_ERROR";
        default:
            return "BAD_REQUEST"
    }
}