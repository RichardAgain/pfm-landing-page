// src/middleware.ts
import api from '@lib/axios';
import { actions, getActionContext } from 'astro:actions';
import { defineMiddleware, sequence } from 'astro:middleware';
import { navigate } from 'astro:transitions/client';
import { isAxiosError } from 'axios';

const PROTECTED_ROUTES = [/^\/estudiante($|\/.*)/, /^\/administrador($|\/.*)/, /^\/500($|\/.*)/];

const isProtectedRoute = (path: string) => PROTECTED_ROUTES.some(pattern => pattern.test(path));

const authMiddleware = defineMiddleware(async (context, next) => {
    const url = new URL(context.url)

    const baseUrl = url.origin
    const pathName = url.pathname

    if (!isProtectedRoute(pathName)) return next();


    if (context.cookies.has('cookies_session')) {
        return Response.redirect(`${baseUrl}/login`, 302)
    }

    return next();
});

const checkStudentMiddleware = defineMiddleware(async (context, next) => {
    const url = new URL(context.request.url)

    const baseUrl = url.origin
    const pathName = url.pathname

    if (!/^\/estudiante($|\/.*)/.test(pathName)) {
        return next()
    }

    const token = context.cookies.get('session_token')?.value

    try {
        await api.get('/estudiante/user', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    } catch (error: any) {
        const redirect_url = error.response.data.redirect_url

        console.log(error.status)

        if (error.status === 401) {
            return Response.redirect(`${baseUrl}/login`, 302)
        }

        if (redirect_url && pathName !== redirect_url) {
            console.log('redirected')
            return Response.redirect(`${baseUrl}${error.response.data.redirect_url}`, 302)
        }
    }

    return next()
})

export const onRequest = sequence(authMiddleware, checkStudentMiddleware)
