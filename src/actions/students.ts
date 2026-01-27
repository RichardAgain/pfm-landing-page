import { date, z } from "astro:schema";
import { ActionError, defineAction } from "astro:actions";

import api from "@lib/axios";
import { errorCodeMapper } from "../utils/error-codes";
import type { Estudiante, EstudianteWithNotas } from "../types/models";
import { updateStudentSchema } from "@components/forms/update-student-form/schema";

export const students = {
    getEstudiante: defineAction({
        handler: async (_input, context) => {
            const token = context.cookies.get('session_token')?.value;

            try {
                const data: { message: string, data: Estudiante, photoUrl: string } = await api.get('/estudiante', {
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

    updateProfile: defineAction({
        accept: 'form',
        input: z.any(),
        handler: async (input, context) => {
            const token = context.cookies.get('session_token')?.value;

            console.log(input)

            try {
                const data = await api.post(`/estudiante/actualizar-datos`, input, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                return data as unknown as { message: string };
            } catch (error: any) {
                throw new Error(error.response?.data?.message || "Failed to update profile");
            }
        }
    })
}
