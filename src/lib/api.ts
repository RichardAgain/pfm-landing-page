import { API_BASE_URL } from "../config/api";

// Types for API responses
export interface ApiResponse<T> {
    message: string;
    data?: T;
}

export interface LoginRequest {
    credential: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: any; // UserResource from Laravel
}

export interface CreateUserRequest {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface ResetPasswordRequest {
    email: string;
    password: string;
    password_confirmation: string;
    token: string;
}

export interface ResetPasswordResponse {
    message: string;
}

export interface RequestPasswordResetPayload {
    email: string;
}

export interface Estudiante {
    id: number;
    nombre: string;
    genero?: string;
    cedula?: string;
    fecha_nacimiento?: string;
    correo_electronico?: string;
    direccion?: string;
    telefono_estudiantes?: string;
    rif?: string;
    institucion_educacional?: string;
    ocupacion?: string;
    profesion?: string;
    lugar_trabajo?: string;
    alergico_a?: string;
    antecedentes?: string;
    especificacion_antecedentes?: string;
    nombre_emergencia?: string;
    numero_emergencia?: string;
    nombre_representante?: string;
    cedula_representante?: string;
    parentesco?: string;
    telefono_representante?: string;
    ocupacion_representante?: string;
    profesion_representante?: string;
    lugar_trabajo_representante?: string;
    direccion_representante?: string;
    rif_representante?: string;
    email_representante?: string;
    instrumentos?: string;
    teoricas?: string;
    otros?: string;
    autorizacion?: boolean;
    activo?: number;
    id_usuario?: number;
    created_at?: string;
    updated_at?: string;
    notas?: StudentNotas;

    photo_url?: string | null;
}

export interface NotaCatedra {
    id: number;
    estudiante_id: number;
    acta_id: number;
    previa: number | null;
    tecnico: number | null;
    final: number | null;
    definitiva: number | null;
    nivel: string | null;
    nivel_obtenido: string | null;
    catedra: string;
    profesor_nombre: string | null;
    profesor_cedula: string | null;
    periodo_nombre: string | null;
    estudiante?: string | null;
    cedula?: string | null;
}

export interface NotaGrupal {
    id: number;
    acta_id: number;
    estudiante_id: number;
    obras: Record<string, number>;
    definitiva: number | null;
    observacion: string | null;
    catedra: string;
    profesor_nombre: string | null;
    profesor_cedula: string | null;
    created_at?: string | null;
    updated_at?: string | null;
}

export interface StudentNotas {
    catedras: Record<string, NotaCatedra[]>;
    grupales: Record<string, NotaGrupal[]>;
}

export interface Catedra {
    id: number;
    nombre: string;
}

export interface CatedrasGroupedResponse {
    Instrumento?: Catedra[];
    Otros?: Catedra[];
    Teoricas?: Catedra[];
}

export interface AspiranteRequest {
    nombre: string;
    genero?: string;
    cedula?: string;
    fecha_nacimiento?: string;
    correo_electronico?: string;
    direccion?: string;
    telefono_estudiantes?: string;
    rif?: string;
    institucion_educacional?: string;
    ocupacion?: string;
    profesion?: string;
    lugar_trabajo?: string;
    alergico_a?: string;
    antecedentes?: string;
    especificacion_antecedentes?: string;
    nombre_emergencia?: string;
    numero_emergencia?: string;
    nombre_representante?: string;
    cedula_representante?: string;
    parentesco?: string;
    telefono_representante?: string;
    ocupacion_representante?: string;
    profesion_representante?: string;
    lugar_trabajo_representante?: string;
    direccion_representante?: string;
    rif_representante?: string;
    email_representante?: string;
    autorizacion?: boolean;
    catedra_instrumento?: number[];
    catedra_teoricas?: number[];
    catedra_otros?: number[];
    imagen?: File | string;
}

// Utility function to get auth token - now uses session manager
const getAuthToken = (): string | null => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("auth_token");
    }
    return null;
};

// Utility function to set auth token - deprecated, use sessionManager.saveSession instead
const setAuthToken = (token: string): void => {
    if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", token);
    }
};

// Utility function to remove auth token - now uses session manager
const removeAuthToken = (): void => {
    if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
    }
};

// Generic API request function
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getAuthToken();

    const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

    const defaultHeaders: HeadersInit = {
        Accept: "application/json",
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
    };

    if (token) {
        defaultHeaders["Authorization"] = `Bearer ${token}`;
    }

    const config: RequestInit = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error(`API request failed for ${endpoint}:`, error);
        throw error;
    }
}

// Authentication API calls
export const authApi = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await apiRequest<LoginResponse>("/login", {
            method: "POST",
            body: JSON.stringify(credentials),
        });

        if (response.token) {
            setAuthToken(response.token);
        }

        return response;
    },

    logout: async (): Promise<{ message: string }> => {
        const response = await apiRequest<{ message: string }>("/logout", {
            method: "POST",
        });

        removeAuthToken();
        return response;
    },

    createUser: async (userData: CreateUserRequest): Promise<any> => {
        return apiRequest("/estudiante/create-user", {
            method: "POST",
            body: JSON.stringify(userData),
        });
    },

    getCurrentUser: async (): Promise<any> => {
        return apiRequest("/estudiante/user");
    },

    resetPassword: async (payload: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
        return apiRequest<ResetPasswordResponse>("/password/reset-password", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    requestPasswordReset: async (payload: RequestPasswordResetPayload): Promise<{ message: string }> => {
        return apiRequest<{ message: string }>("/password/reset-link", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },
};

// Student profile API calls
export const studentApi = {
    getProfile: async (): Promise<{ message: string; data: Estudiante }> => {
        return apiRequest(`/estudiante/perfil`);
    },

    generatePlanilla: async (studentData: any): Promise<Blob> => {
        const url = `${API_BASE_URL}/estudiante/generar-planilla`;
        const token = getAuthToken();

        const headers: HeadersInit = {
            "Content-Type": "application/json",
            Accept: "application/pdf",
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(studentData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.blob();
    },
};

// Applicants API calls
export const aspiranteApi = {
    getByIds: async (ids: number[]): Promise<{ message: string; data: any[] }> => {
        return apiRequest("/aspirante", {
            method: "POST",
            body: JSON.stringify({ id: ids }),
        });
    },

    create: async (aspiranteData: FormData): Promise<{ message: string; download_url: string }> => {
        return apiRequest("/aspirante", {
            method: "POST",
            body: aspiranteData,
        });
    },

    downloadPdf: async (aspiranteId: number): Promise<{ message: string; download_url: string }> => {
        return apiRequest(`/admin/aspirante/planilla/${aspiranteId}`, { method: "GET" });
    },
};

// Students management API calls
export const estudianteApi = {
    getByIds: async (ids: number[]): Promise<{ message: string; data: Estudiante[] }> => {
        return apiRequest("/estudiantes", {
            method: "POST",
            body: JSON.stringify({ id: ids }),
        });
    },

    create: async (estudianteData: Partial<Estudiante>): Promise<{ message: string; id: number }> => {
        return apiRequest("/estudiantes", {
            method: "POST",
            body: JSON.stringify(estudianteData),
        });
    },

    update: async (studentId: number, estudianteData: { id_usuario: number }): Promise<{ message: string }> => {
        return apiRequest(`/estudiantes/${studentId}`, {
            method: "PUT",
            body: JSON.stringify(estudianteData),
        });
    },
};

// Wait list interface matching your Laravel controller response
export interface AspiranteCatedra {
    id: number;
    tipo_id: number;
    nombre: string;
    created_at: string;
    updated_at: string;
    siglas: string | null;
    niveles: {
        etapas: any[];
        duracion: number;
    };
    nivelesForNotas: string[];
    hasPreparatorio: boolean;
    pivot: {
        aspirante_id: number;
        catedra_id: number;
    };
    tipo: {
        id: number;
        nombre: string;
    };
}

export interface ListaEsperaItem {
    id: number;
    nombre: string;
    genero?: string | null;
    cedula?: string | null;
    fecha_nacimiento?: string | null;
    correo_electronico?: string | null;
    direccion?: string | null;
    fecha_ingreso?: string | null;
    instrumento?: string | null;
    codigo_instrumento?: string | null;
    nombre_representante?: string | null;
    ocupacion_representante?: string | null;
    parentesco?: string | null;
    cedula_representante?: string | null;
    telefono_estudiantes?: string | null;
    telefono_representante?: string | null;
    nombre_emergencia?: string | null;
    numero_emergencia?: string | null;
    activo?: boolean | number;
    photo_url?: string | null;
    edad?: string | number | null;
    rif?: string | null;
    institucion_educacional?: string | null;
    ocupacion?: string | null;
    profesion?: string | null;
    lugar_trabajo?: string | null;
    alergias?: string | null;
    antecedentes?: string | null;
    alergias_especificadas?: string | null;
    representante_rif?: string | null;
    representante_profesion?: string | null;
    representante_lugar_trabajo?: string | null;
    representante_direccion?: string | null;
    representante_email?: string | null;
    teoricas_data?: string | null;
    otros_data?: string | null;
    autorizacion?: boolean | string | null;
    created_at?: string | null;
    updated_at?: string | null;

    // Campos legados para compatibilidad con implementaciones anteriores
    telefono?: string | null;
    instrumentos?: string | null;
    teoricas?: string | null;
    otros?: string | null;
    alergico_a?: string | null;
    especificacion_antecedentes?: string | null;
    email?: string | null;
    direccion_representante?: string | null;
    email_representante?: string | null;
    rif_representante?: string | null;
    lugar_trabajo_representante?: string | null;
    profesion_representante?: string | null;
    estado?: number;

    enrollments?: {
        Instrumento: string[];
        Teoricas: string[];
        Otros: string[];
    };
}

// Wait list API calls
export const listaEsperaApi = {
    getAll: async (): Promise<{ message: string; data: ListaEsperaItem[] }> => {
        return apiRequest("/admin/aspirante");
    },

    accept: async (studentId: number): Promise<{ message: string }> => {
        return apiRequest(`/admin/aspirante/accept/${studentId}`, {
            method: "POST",
        });
    },

    reject: async (studentId: number): Promise<{ message: string }> => {
        return apiRequest(`/admin/aspirante/reject/${studentId}`, {
            method: "DELETE",
        });
    },
};

// Subjects API calls
export const catedraApi = {
    getAll: async (): Promise<CatedrasGroupedResponse> => {
        const response = await apiRequest<CatedrasGroupedResponse>("/catedras");
        return response;
    },

    // Helper function to get all catedras as a flat array
    getAllFlat: async (): Promise<Catedra[]> => {
        const groupedResponse = await catedraApi.getAll();
        const allCatedras: Catedra[] = [];

        if (groupedResponse.Instrumento) {
            allCatedras.push(...groupedResponse.Instrumento);
        }
        if (groupedResponse.Otros) {
            allCatedras.push(...groupedResponse.Otros);
        }
        if (groupedResponse.Teoricas) {
            allCatedras.push(...groupedResponse.Teoricas);
        }

        return allCatedras;
    },

    // Helper function to get catedras by type
    getByType: async (tipo: "Instrumento" | "Otros" | "Teoricas"): Promise<Catedra[]> => {
        const groupedResponse = await catedraApi.getAll();
        return groupedResponse[tipo] || [];
    },
};

// User creation API calls
export const userApi = {
    createUser: async (id_estudiante: number): Promise<{ message: string; id: number }> => {
        return apiRequest("/estudiante/user", {
            method: "POST",
            body: JSON.stringify({ id_estudiante }),
        });
    },
};

// Migration API calls
export const migracionApi = {
    createUsers: async (userData: any): Promise<ApiResponse<any>> => {
        return apiRequest("/migracion/crear-usuarios", {
            method: "POST",
            body: JSON.stringify(userData),
        });
    },
};

// Utility functions
export const apiUtils = {
    setAuthToken,
    getAuthToken,
    removeAuthToken,
};
