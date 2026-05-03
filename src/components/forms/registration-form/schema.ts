import { z } from "zod";
import { ageFromBirthDate } from "@src/lib";

const ciRegex = /^\d{7,8}$/;
const rifRegex = /^[JV]-\d{9}$/i;
const phoneRegex = /^\d{7}$/;

export const registrationSchema = z
  .object({
    nombre: z
      .string({ required_error: "Este campo es obligatorio" })
      .min(4, "Este campo es obligatorio"),
    fecha_nacimiento: z
      .string({ required_error: "Este campo es obligatorio" })
      .min(1, "Seleccione una fecha válida")
      .refine((val) => {
        if (!val) return false;
        const date = new Date(val);
        const today = new Date();
        return date <= today;
      }, "Seleccione una fecha válida"),
    genero: z
      .string({ required_error: "Seleccione una opción" })
      .refine((val) => val === "Masculino" || val === "Femenino", {
        message: "Seleccione una opción",
      }),
    cedula: z
      .string()
      .optional()
      .refine((val) => !val || ciRegex.test(val), {
        message: "Debe tener entre 7 y 8 dígitos",
      })
      .default(""),
    rif: z
      .string()
      .optional()
      .refine((val) => !val || rifRegex.test(val.trim().toUpperCase()), {
        message:
          "Formato de RIF inválido. Debe utilizar J o V, seguido de 9 dígitos.",
      })
      .default(""),
    estudianteCodigoTelefono: z
      .string({ required_error: "Seleccione una opción" })
      .min(1, "Seleccione una opción"),
    telefono: z
      .string({ required_error: "Debe ingresar 7 dígitos" })
      .min(7, "Debe ingresar 7 dígitos")
      .max(7, "Debe ingresar 7 dígitos")
      .refine((val) => phoneRegex.test(val), {
        message: "Solo números, 7 dígitos",
      }),
    institucion_educacional: z.string().optional(),
    ocupacion: z.string().optional(),
    profesion: z.string().optional(),
    lugar_trabajo: z.string().optional(),
    direccion: z
      .string({ required_error: "Este campo es obligatorio" })
      .min(1, "Este campo es obligatorio"),
    correo_electronico: z
      .string({ required_error: "Este campo es obligatorio" })
      .email("Ingrese un correo válido"),
    alergias: z
      .string({
        required_error: "Este campo es obligatorio",
      })
      .min(1, "Este campo es obligatorio"),
    antecedentes: z
      .string({ invalid_type_error: "Seleccione una opción" })
      .refine((val) => val === "Sí" || val === "No", {
        message: "Seleccione una opción",
      }),
    alergias_especificadas: z.string().optional(),
    nombre_emergencia: z
      .string({ required_error: "Este campo es obligatorio" })
      .min(1, "Este campo es obligatorio"),
    estudianteCodigoTelefonoEmergencia: z
      .string({ required_error: "Seleccione una opción" })
      .min(1, "Seleccione una opción"),
    numero_emergencia: z
      .string({ required_error: "Debe ingresar 7 dígitos" })
      .min(7, "Debe ingresar 7 dígitos")
      .max(7, "Debe ingresar 7 dígitos")
      .refine((val) => phoneRegex.test(val), {
        message: "Solo números, 7 dígitos",
      }),
    parentesco_emergencia: z.string().optional(),

    representante_nombre: z.string().optional(),
    representante_cedula: z
      .string()
      .optional()
      .refine((val) => !val || ciRegex.test(val), {
        message: "Debe tener entre 7 y 8 dígitos",
      }),
    representante_rif: z
      .string()
      .optional()
      .refine((val) => !val || rifRegex.test(val.trim().toUpperCase()), {
        message:
          "Formato de RIF inválido. Debe utilizar J o V, seguido de 9 dígitos.",
      }),
    representante_parentesco: z.string().optional(),
    representanteCodigoTelefono: z.string().optional(),
    representante_telefono: z
      .string()
      .optional()
      .refine((val) => !val || phoneRegex.test(val), {
        message: "Solo números, 7 dígitos",
      }),
    representante_ocupacion: z.string().optional(),
    representante_profesion: z.string().optional(),
    representante_lugar_trabajo: z.string().optional(),
    representante_direccion: z.string().optional(),
    representante_email: z
      .string()
      .optional()
      .refine((val) => !val || z.string().email().safeParse(val).success, {
        message: "Ingrese un correo válido",
      }),

    tiene_estudios: z
      .string({ invalid_type_error: "Seleccione una opción" })
      .refine((val) => val === "Sí" || val === "No", {}),
    institucion_estudios: z.string().optional(),
    catedras_estudios: z.string().optional(),
    duracion_estudios: z
      .string()
      .optional()
      .refine((val) => !val || /^\d+$/.test(val), {
        message: "Debe ser un número",
      }),

    autorizacion: z
      .string({
        required_error: "Seleccione una opción",
        invalid_type_error: "Seleccione una opción",
      })
      .refine((val) => val === "Sí" || val === "No", {
        message: "Seleccione una opción",
      }),
  })
  .superRefine((data, ctx) => {
    const age = ageFromBirthDate(data.fecha_nacimiento);

    if (age === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Seleccione una fecha válida",
        path: ["fecha_nacimiento"],
      });
    } else if (age <= 3 || age >= 99) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Seleccione una fecha válida",
        path: ["fecha_nacimiento"],
      });
    }

    if (age !== null) {
      if (age < 18) {
        const requiredRepresentativeFields: Array<keyof typeof data> = [
          "representante_nombre",
          "representante_cedula",
          "representante_parentesco",
          "representanteCodigoTelefono",
          "representante_telefono",
          "representante_ocupacion",
          "representante_profesion",
          "representante_lugar_trabajo",
          "representante_direccion",
          "representante_email",
          "representante_rif",
        ];

        requiredRepresentativeFields.forEach((field) => {
          const value = data[field];
          if (!value || (typeof value === "string" && value.trim() === "")) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Este campo es obligatorio",
              path: [field],
            });
          }
        });

        if (data.representante_cedula && !ciRegex.test(data.representante_cedula)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Debe tener entre 6 y 8 dígitos",
            path: ["representante_cedula"],
          });
        }

        if (
          data.representante_telefono &&
          !phoneRegex.test(data.representante_telefono)
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Solo números, 7 dígitos",
            path: ["representante_telefono"],
          });
        }

        if (
          data.representante_rif &&
          !rifRegex.test(data.representante_rif.trim().toUpperCase())
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Formato de RIF inválido. Debe utilizar J o V, seguido de 9 dígitos.",
            path: ["representante_rif"],
          });
        }

        if (
          data.representante_email &&
          !z.string().email().safeParse(data.representante_email).success
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Ingrese un correo válido",
            path: ["representante_email"],
          });
        }
      }
    }

    if (data.tiene_estudios === "Sí") {
      if (!data.institucion_estudios || data.institucion_estudios.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Este campo es obligatorio",
          path: ["institucion_estudios"],
        });
      }
      if (!data.catedras_estudios || data.catedras_estudios.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Este campo es obligatorio",
          path: ["catedras_estudios"],
        });
      }
      if (!data.duracion_estudios || data.duracion_estudios.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Este campo es obligatorio",
          path: ["duracion_estudios"],
        });
      }
    }
  });

type RegistrationSchema = z.infer<typeof registrationSchema>;

export type RegistrationFormValues = RegistrationSchema
