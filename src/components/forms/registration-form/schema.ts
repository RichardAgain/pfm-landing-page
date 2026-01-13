import { z } from "zod";
import { ageFromBirthDate } from "../../../lib";

const ciRegex = /^\d{7,8}$/;
const rifRegex = /^[JV]-\d{9}$/i;
const phoneRegex = /^\d{7}$/;

const imageField = z
  .any({ required_error: "La foto es obligatoria" })
  .refine((file) => file !== null && file !== undefined, {
    message: "La foto es obligatoria",
  })
  .refine((file) => typeof File === "undefined" || file instanceof File, {
    message: "Seleccione una imagen válida",
  });

export const registrationSchema = z
  .object({
    imagen: imageField,
    photo64: z.string().optional(),

    estudianteNombre: z
      .string({ required_error: "Este campo es obligatorio" })
      .min(4, "Este campo es obligatorio"),
    estudianteFechaNacimiento: z
      .string({ required_error: "Este campo es obligatorio" })
      .min(1, "Seleccione una fecha válida")
      .refine((val) => {
        if (!val) return false;
        const date = new Date(val);
        const today = new Date();
        return date <= today;
      }, "Seleccione una fecha válida"),
    estudianteEdad: z.string().optional(),
    estudianteGenero: z
      .string({ required_error: "Seleccione una opción" })
      .refine((val) => val === "Masculino" || val === "Femenino", {
        message: "Seleccione una opción",
      }),
    estudianteCI: z
      .string()
      .optional()
      .refine((val) => !val || ciRegex.test(val), {
        message: "Debe tener entre 7 y 8 dígitos",
      }),
    estudianteRIF: z
      .string()
      .optional()
      .refine((val) => !val || rifRegex.test(val.trim().toUpperCase()), {
        message:
          "Formato de RIF inválido. Debe utilizar J o V, seguido de 9 dígitos.",
      }),
    estudianteCodigoTelefono: z
      .string({ required_error: "Seleccione una opción" })
      .min(1, "Seleccione una opción"),
    estudianteTelefono: z
      .string({ required_error: "Debe ingresar 7 dígitos" })
      .min(7, "Debe ingresar 7 dígitos")
      .max(7, "Debe ingresar 7 dígitos")
      .refine((val) => phoneRegex.test(val), {
        message: "Solo números, 7 dígitos",
      }),
    estudianteInstitucion: z.string().optional(),
    estudianteOcupacion: z.string().optional(),
    estudianteProfesion: z.string().optional(),
    estudianteLugarTrabajo: z.string().optional(),
    estudianteDireccion: z
      .string({ required_error: "Este campo es obligatorio" })
      .min(1, "Este campo es obligatorio"),
    estudianteEmail: z
      .string({ required_error: "Este campo es obligatorio" })
      .email("Ingrese un correo válido"),
    estudianteAlergias: z
      .string({ required_error: "Este campo es obligatorio" })
      .min(1, "Este campo es obligatorio"),
    estudianteAntecedentes: z
      .string({ required_error: "Seleccione una opción" })
      .refine((val) => val === "Sí" || val === "No", {
        message: "Seleccione una opción",
      }),
    estudianteAlergiasEspecificadas: z.string().optional(),
    estudianteContactoEmergencia: z
      .string({ required_error: "Este campo es obligatorio" })
      .min(1, "Este campo es obligatorio"),
    estudianteCodigoTelefonoEmergencia: z
      .string({ required_error: "Seleccione una opción" })
      .min(1, "Seleccione una opción"),
    estudianteTelefonoEmergencia: z
      .string({ required_error: "Debe ingresar 7 dígitos" })
      .min(7, "Debe ingresar 7 dígitos")
      .max(7, "Debe ingresar 7 dígitos")
      .refine((val) => phoneRegex.test(val), {
        message: "Solo números, 7 dígitos",
      }),

    representanteNombre: z.string().optional(),
    representanteCI: z
      .string()
      .optional()
      .refine((val) => !val || ciRegex.test(val), {
        message: "Debe tener entre 7 y 8 dígitos",
      }),
    representanteRIF: z
      .string()
      .optional()
      .refine((val) => !val || rifRegex.test(val.trim().toUpperCase()), {
        message:
          "Formato de RIF inválido. Debe utilizar J o V, seguido de 9 dígitos.",
      }),
    representanteParentesco: z.string().optional(),
    representanteCodigoTelefono: z.string().optional(),
    representanteTelefono: z
      .string()
      .optional()
      .refine((val) => !val || phoneRegex.test(val), {
        message: "Solo números, 7 dígitos",
      }),
    representanteOcupacion: z.string().optional(),
    representanteProfesion: z.string().optional(),
    representanteLugarTrabajo: z.string().optional(),
    representanteDireccion: z.string().optional(),
    representanteEmail: z
      .string()
      .optional()
      .refine((val) => !val || z.string().email().safeParse(val).success, {
        message: "Ingrese un correo válido",
      }),

    instrumentos: z.array(z.string()).default([""]),
    teoricas: z.array(z.string()).default([""]),
    otros: z.array(z.string()).default([""]),

    tiene_estudios: z
      .string({ required_error: "Seleccione una opción" })
      .refine((val) => val === "Sí" || val === "No", {}),
    institucion: z.string().optional(),
    catedras_estudiadas: z.string().optional(),
    duracion: z
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
    const age = ageFromBirthDate(data.estudianteFechaNacimiento);

    if (age === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Seleccione una fecha válida",
        path: ["estudianteFechaNacimiento"],
      });
    } else if (age <= 3 || age >= 99) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Seleccione una fecha válida",
        path: ["estudianteFechaNacimiento"],
      });
    }

    if (age !== null) {
      if (age < 18) {
        const requiredRepresentativeFields: Array<keyof typeof data> = [
          "representanteNombre",
          "representanteCI",
          "representanteParentesco",
          "representanteCodigoTelefono",
          "representanteTelefono",
          "representanteOcupacion",
          "representanteProfesion",
          "representanteLugarTrabajo",
          "representanteDireccion",
          "representanteEmail",
          "representanteRIF",
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

        if (data.representanteCI && !ciRegex.test(data.representanteCI)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Debe tener entre 6 y 8 dígitos",
            path: ["representanteCI"],
          });
        }

        if (
          data.representanteTelefono &&
          !phoneRegex.test(data.representanteTelefono)
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Solo números, 7 dígitos",
            path: ["representanteTelefono"],
          });
        }

        if (
          data.representanteRIF &&
          !rifRegex.test(data.representanteRIF.trim().toUpperCase())
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Formato de RIF inválido. Debe utilizar J o V, seguido de 9 dígitos.",
            path: ["representanteRIF"],
          });
        }

        if (
          data.representanteEmail &&
          !z.string().email().safeParse(data.representanteEmail).success
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Ingrese un correo válido",
            path: ["representanteEmail"],
          });
        }
      }
    }

    if (data.tiene_estudios === "Sí") {
      if (!data.institucion || data.institucion.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Este campo es obligatorio",
          path: ["institucion"],
        });
      }
      if (!data.catedras_estudiadas || data.catedras_estudiadas.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Este campo es obligatorio",
          path: ["catedras_estudiadas"],
        });
      }
      if (!data.duracion || data.duracion.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Este campo es obligatorio",
          path: ["duracion"],
        });
      }
    }
  });

type RegistrationSchema = z.infer<typeof registrationSchema>;

export type RegistrationFormValues = Omit<RegistrationSchema, "imagen"> & {
  imagen: File | null;
};
