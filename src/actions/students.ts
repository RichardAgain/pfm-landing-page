import { z } from "astro:schema";
import { ActionError, defineAction } from "astro:actions";

import api from "@lib/axios";
import { errorCodeMapper } from "../utils/error-codes";
import type { EstudianteWithNotas } from "../types/models";

export const students = {
    getProfile: defineAction({
        handler: async (_input, context) => {
            const token = context.cookies.get('session_token')?.value;

            try {
                const data: { message: string, data: EstudianteWithNotas } = await api.get('/estudiante/perfil', {
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
            }

        }
    }),

    // updateProfile: defineAction({
    //     input: z.object({
    //         id: z.number(),
    //         data: z.any()
    //     }),
    //     handler: async (input, context) => {
    //         const token = context.cookies.get('session_token')?.value;
    //         try {
    //             const data = await api.put(`/estudiantes/${input.id}`, input.data, {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`
    //                 }
    //             });
    //             return data as unknown as { message: string };
    //         } catch (error: any) {
    //             throw new Error(error.response?.data?.message || "Failed to update profile");
    //         }
    //     }
    // })
}
