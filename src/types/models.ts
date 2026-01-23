
export interface User {
    username: string;
    role: 'estudiante' | 'admin'
    update_due: boolean;
    createdAt: string;
}

export interface Estudiante {
    nombre: string;
    genero: string;
    cedula?: string;
    fecha_nacimiento: string;
    direccion?: string;
    telefono_estudiantes?: string;
    rif?: string;
    correo_electronico?: string;
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
    activo?: number;

    created_at?: string;
    // notas?: StudentNotas;

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

export interface EstudianteWithNotas extends Estudiante {
    notas: {
        catedras: Record<string, NotaCatedra[]>;
        grupales: Record<string, NotaGrupal[]>;
    }
}
