import type { RegistrationFormInputValues } from ".";
import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";

export const defaultRegistrationValues: RegistrationFormInputValues = {
  nombre: "Juan Carlos Pérez González",
  fecha_nacimiento: "2000-01-15",
  genero: "Masculino",
  cedula: "12345678",
  rif: "J-123456789",
  telefono: "0414-1234567",
  institucion_educacional: "Universidad Central de Venezuela",
  ocupacion: "Músico",
  profesion: "Violinista",
  lugar_trabajo: "Orquesta Sinfónica de Carabobo",
  direccion: "Av. Bolívar Norte, Edif. Centro Plaza, Apt. 4-B, Valencia, Edo. Carabobo",
  correo_electronico: "juan.perez@example.com",
  alergias: "Ninguna conocida",
  antecedentes: "No",
  alergias_especificadas: "",
  nombre_emergencia: "María González de Pérez",
  numero_emergencia: "0424-7654321",
  parentesco_emergencia: "Madre",

  representante_nombre: "",
  representante_cedula: "",
  representante_rif: "",
  representante_parentesco: "",
  representante_telefono: "",
  representante_ocupacion: "",
  representante_profesion: "",
  representante_lugar_trabajo: "",
  representante_direccion: "",
  representante_email: "",

  tiene_estudios: "Sí",
  institucion_estudios: "Conservatorio de Música Simón Bolívar",
  catedras_estudios: "Violín, Teoría Musical, Solfeo",
  duracion_estudios: "6",

  autorizacion: "Sí",

  instrumento: "si",
};

export const useFillRegistrationForm = (form: UseFormReturn<RegistrationFormInputValues>) => {
  useEffect(() => {
    if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
      form.reset(defaultRegistrationValues as any);
    }
  }, [form]);
};
