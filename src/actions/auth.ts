import { z } from "astro:schema";
import { defineAction } from "astro:actions";

import { API_BASE_URL } from "../config/api";

export const auth = {
    login: defineAction({
        input: z.object({ credential: z.string(), password: z.string() }),
        handler: async (input, context): Promise<{ success: boolean; redirect_url: string }> => {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                body: JSON.stringify(input),
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                return {
                    success: false,
                    redirect_url: "",
                }
            }

            const data = await response.json();

            if (data.session_token) {
                context.cookies.set('session_token', data.session_token, {
                    httpOnly: true,
                    path: '/'
                });
            }

            return { success: true, redirect_url: data.redirect_url };
        }
    })
}