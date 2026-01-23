import React, { useState } from "react";
import { authApi, type LoginRequest } from "../../lib/api";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { actions } from "astro:actions";

const schema = z.object({
    credential: z
        .string({ required_error: "Ingresa tu usuario o correo." })
        .trim()
        .min(1, "Ingresa tu usuario o correo."),
    password: z.string({ required_error: "Ingresa tu contraseña." }).trim().min(1, "Ingresa tu contraseña."),
});

type LoginFormValues = z.infer<typeof schema>;

export default function LogIn() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            credential: "",
            password: "",
        },
    });

    // State variables for error/modals management
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);

    // --------------------------------------------------

    const onSubmit = async (values: LoginFormValues) => {
        setError("");

        const { data, error } = await actions.auth.login(values)

        if (error) {
            setError(error.message)
            setShowModal(true)
            return
        }

        window.location.href = data.redirect_url
    };

    return (
        <section id="login" className="flex flex-col w-full items-center py-12 md:py-36">
            <div className="fixed inset-0 z-0 w-full h-full">
                <img src="/background.png" className="w-full h-full object-cover" />
            </div>

            <div className="w-sm flex flex-col items-center justify-center px-8 py-6 gap-6 md:border border-gray-200 rounded-2xl md:bg-white relative z-10">
                <h1 className="text-2xl font-montserrat text-gray-800 font-bold text-center w-[85%] py-3 border-b border-gray-200">
                    Iniciar sesión
                </h1>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-[85%] gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="font-medium text-gray-700" htmlFor="credential">
                            Usuario o correo *
                        </label>
                        <input
                            id="credential"
                            type="text"
                            placeholder="Usuario o correo"
                            {...register("credential")}
                            aria-invalid={errors.credential ? "true" : "false"}
                        />
                        {errors.credential && (
                            <p className="text-xs text-red-600" role="alert">
                                {errors.credential.message}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="font-medium text-gray-700" htmlFor="password">
                            Contraseña *
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Contraseña"
                            {...register("password")}
                            aria-invalid={errors.password ? "true" : "false"}
                        />
                        {errors.password && (
                            <p className="text-xs text-red-600" role="alert">
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="text-xs font-montserrat text-white font-medium w-full bg-[#700303] hover:bg-[#700303]/80 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
                    </button>
                    <div className="flex-col justify-center text-center py-2 text-xs">
                        <p>¿Nuevo en la plataforma o olvidaste tu contraseña?</p>
                        <br />

                        <a
                            href="/restablecer-credenciales"
                            className="text-xs font-inter text-gray-600 hover:underline"
                        >
                            Restablece tu contraseña
                        </a>
                    </div>
                </form>
            </div>

            {/* Modal de rechazo */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                        <div className="flex flex-col gap-4">
                            <p className="text-sm font-montserrat text-gray-700 text-center leading-relaxed">
                                <b className="text-base">Error de inicio de sesión.</b> <br />
                                <br />
                                {error} <br />
                                Por favor, intente nuevamente.
                            </p>

                            <div className="flex justify-center gap-2 mt-2">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-sm font-montserrat font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition duration-200"
                                >
                                    Volver
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
