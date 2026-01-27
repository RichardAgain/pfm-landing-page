import { z } from "zod";

const ciRegex = /^\d{7,8}$/;
const rifRegex = /^[JV]-?\d{8,9}$/i;
const phoneRegex = /^\d{7}$/;

// Helper for optional fields that can be empty strings
const optionalString = z.string().optional().or(z.literal(""));

export const updateStudentSchema = z.object({
  // Student Data
  cedula: z.string().optional().refine((val) => !val || ciRegex.test(val), {
    message: "Debe tener entre 7 y 8 dígitos",
  }),

  direccion: z.string().min(1, "Campo obligatorio"),

  // Phone 1 (Student)
  telefono_estudiantes_code: z.string().min(1, "Seleccione"),
  telefono_estudiantes_number: z.string().regex(phoneRegex, "7 dígitos"),

  rif: optionalString.refine((val) => !val || rifRegex.test(val.trim().toUpperCase()), {
    message: "Formato inválido (Ej: V12345678)",
  }),

  institucion_educacional: optionalString,
  ocupacion: optionalString,
  profesion: optionalString,
  lugar_trabajo: optionalString,

  // Medical
  alergias: z.string().min(1, "Campo obligatorio"),
  antecedentes: z.enum(["Sí", "No"], { errorMap: () => ({ message: "Seleccione una opción" }) }),
  alergias_especificadas: optionalString,

  // Emergency Contact
  nombre_emergencia: z.string().min(1, "Campo obligatorio"),

  // Phone 2 (Emergency)
  numero_emergencia_code: z.string().min(1, "Seleccione"),
  numero_emergencia_number: z.string().regex(phoneRegex, "7 dígitos"),

  // Representative Data
  nombre_representante: optionalString,
  cedula_representante: optionalString.refine((val) => !val || ciRegex.test(val), {
    message: "Debe tener entre 7 y 8 dígitos",
  }),
  parentesco: optionalString,

  // Phone 3 (Representative)
  telefono_representante_code: optionalString,
  telefono_representante_number: optionalString.refine((val) => !val || phoneRegex.test(val), {
    message: "7 dígitos",
  }),

  ocupacion_representante: optionalString,
  representante_profesion: optionalString,
  representante_lugar_trabajo: optionalString,
  representante_direccion: optionalString,

  representante_rif: optionalString.refine((val) => !val || rifRegex.test(val.trim().toUpperCase()), {
    message: "Formato inválido (Ej: V12345678)",
  }),

  representante_email: optionalString.refine((val) => !val || z.string().email().safeParse(val).success, {
    message: "Email inválido",
  }),

  // Authorization
  autorizacion: z.boolean().optional(), // Handled as boolean or check in UI

  // Studies (Previous schema omitted some of these, but included here based on backend list)
  tiene_estudios: z.string().optional(), // 'Sí' | 'No' usually
  institucion: optionalString,
  catedras_estudiadas: optionalString,
  duracion: optionalString,

  // Image
  imagen: z.any().optional(),
  photo64: z.string().optional(), // Helper for preview
});

export type UpdateStudentFormValues = z.infer<typeof updateStudentSchema>;
