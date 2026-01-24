import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";

import api from "@lib/axios";
import type { ListaEsperaItem } from "../types/waitlist";
import { errorCodeMapper } from "../utils/error-codes";

export const applicants = {
    getWaitList: defineAction({
        handler: async (_input, context) => {
            const token = context.cookies.get('session_token')?.value;

            try {
                const data: { message: string; data: ListaEsperaItem[] } = await api.get('/admin/aspirante', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                return data
            } catch (error: any) {
                throw new ActionError({
                    code: errorCodeMapper(error.status),
                    message: error.response.data.message
                })
            }
        }
    }),

    downloadPdf: defineAction({
        input: z.object({ id: z.number() }),
        handler: async (input, context) => {
            const token = context.cookies.get('session_token')?.value

            try {
                const data: { message: string; download_url: string } = await api.get(`/admin/aspirante/planilla/${input.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                return data
            } catch (error: any) {
                throw new ActionError({
                    code: errorCodeMapper(error.status),
                    message: error.response.data.message
                })
            }
        }
    }),

    accept: defineAction({
        input: z.object({ id: z.number() }),
        handler: async (input, context) => {
            const token = context.cookies.get('session_token')?.value

            try {
                const data: { message: string } = await api.post(`/admin/aspirante/accept/${input.id}`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                return data
            } catch (error: any) {
                throw new ActionError({
                    code: errorCodeMapper(error.status),
                    message: error.response.data.message
                })
            }
        }
    }),

    reject: defineAction({
        input: z.object({ id: z.number() }),
        handler: async (input, context) => {
            const token = context.cookies.get('session_token')?.value

            try {
                const data: { message: string } = await api.delete(`/admin/aspirante/reject/${input.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                return data
            } catch (error: any) {
                throw new ActionError({
                    code: errorCodeMapper(error.status),
                    message: error.response.data.message
                })
            }
        }
    }),
}
