import { z } from "astro:schema";
import { ActionError, defineAction } from "astro:actions";
import api from "@lib/axios";
import { errorCodeMapper } from "../utils/error-codes";

export const auth = {
    login: defineAction({
        input: z.object({ credential: z.string(), password: z.string() }),
        handler: async (input, context) => {
            try {
                const data: { session_token: string, redirect_url: string } = await api.post('/login', input);

                if (data.session_token) {
                    context.cookies.set('session_token', data.session_token, {
                        httpOnly: true,
                        path: '/'
                    });
                }

                return data;
            } catch (error: any) {
                throw new ActionError({
                    code: errorCodeMapper(error.status),
                    message: error.response.data.message
                })
            }
        }
    }),

    getUser: defineAction({
        handler: async (_input, context) => {
            const token = context.cookies.get('session_token')?.value;

            try {
                const data = await api.post('/user', {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                return data;
            } catch (error: any) {
                throw new ActionError({
                    code: errorCodeMapper(error.status),
                    message: error.response.data.message,
                })
            }
        }
    }),

    logout: defineAction({
        handler: async (_input, context) => {
            const token = context.cookies.get('session_token')?.value;

            try {
                const data = await api.post('/logout', {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                return data;
            } catch (error: any) {
                throw new ActionError({
                    code: errorCodeMapper(error.status),
                    message: error.response.data.message
                })
            } finally {
                context.cookies.delete('session_token', { path: '/' });
            }
        }
    })
}
