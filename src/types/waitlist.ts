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
