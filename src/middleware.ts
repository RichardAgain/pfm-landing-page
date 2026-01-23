// src/middleware.ts
import { defineMiddleware, sequence } from 'astro:middleware';

const PROTECTED_ROUTES = [/^\/estudiante($|\/.*)/, /^\/administrador($|\/.*)/, /^\/500($|\/.*)/];

const isProtectedRoute = (path: string) => PROTECTED_ROUTES.some(pattern => pattern.test(path));

export const authMiddleware = defineMiddleware((context, next) => {
    const url = new URL(context.url)

    const baseUrl = url.origin
    const pathName = url.pathname

    if (!isProtectedRoute(pathName)) return next();

    // const session = sessionManager.getAuthToken()

    const token = context.cookies.get('session_token')

    if (!token) {
        return Response.redirect(`${baseUrl}/login`, 302)
    }

    return next();
});

export const onRequest = sequence(authMiddleware)
