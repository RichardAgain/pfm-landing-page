import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, type Resolver, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateStudentSchema, type UpdateStudentFormValues } from "./schema";
import InputForm from "../components/Input";
import PhotoInput from "./PhotoInput";
import { ageFromBirthDate } from "../../../lib";
import type { Estudiante } from "../../../types/models";

interface UpdateStudentFormProps {
  onSubmit: SubmitHandler<UpdateStudentFormValues>;
  initialData?: Estudiante;
  photoUrl: string | null
}

const phoneCodes = ["0412", "0422", "0414", "0424", "0416", "0426"];
const rifTypes = ["V", "J"] as const;

const normalizeRif = (raw: unknown): { type: "" | (typeof rifTypes)[number]; number: string } => {
  if (typeof raw !== "string") return { type: "", number: "" };
  const value = raw.trim().toUpperCase();
  if (value.length === 0) return { type: "", number: "" };

  const type = (value[0] === "V" || value[0] === "J") ? (value[0] as "V" | "J") : "";
  const number = value.slice(1).replace(/\D/g, "").slice(0, 9);
  return { type, number };
};

const UpdateStudentForm = ({ onSubmit, initialData, photoUrl }: UpdateStudentFormProps) => {
  const [rifType, setRifType] = useState<"" | "V" | "J">("");
  const [rifNumber, setRifNumber] = useState<string>("");

  const [repRifType, setRepRifType] = useState<"" | "V" | "J">("");
  const [repRifNumber, setRepRifNumber] = useState<string>("");

  const formRef = useRef<any>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UpdateStudentFormValues>({
    resolver: zodResolver(updateStudentSchema) as Resolver<UpdateStudentFormValues>,
    mode: "onBlur",
    defaultValues: {
      imagen: undefined,
      photo64: "",
    }
  });

  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          setValue(key as any, value);
        }
      });

      setValue('imagen', photoUrl)

      const rif = normalizeRif(initialData.rif);
      setRifType(rif.type);
      setRifNumber(rif.number);
      setValue("rif", rif.type && rif.number ? `${rif.type}${rif.number}` : "", {
        shouldDirty: false, shouldValidate: false
      });

      const repRif = normalizeRif(initialData.representante_rif);
      setRepRifType(repRif.type);
      setRepRifNumber(repRif.number);
      setValue("representante_rif", repRif.type && repRif.number ? `${repRif.type}${repRif.number}` : "", {
        shouldDirty: false, shouldValidate: false
      });
    }
  }, [setValue]);

  const fechaNacimiento = (initialData as any)?.fecha_nacimiento;
  const isMinor = useMemo(() => {
    const age = ageFromBirthDate(fechaNacimiento);
    return age !== null && age < 18;
  }, [fechaNacimiento]);

  // Construct FormData explicitly
  const submitHandler: SubmitHandler<UpdateStudentFormValues> = async (values) => {
    const fd = new FormData(formRef.current);

    fd.append("autorizacion", values.autorizacion ? "1" : "0");

    if (values.telefono_estudiantes_code && values.telefono_estudiantes_number) {
      fd.append("telefono_estudiantes", `${values.telefono_estudiantes_code}-${values.telefono_estudiantes_number}`);
    }
    if (values.numero_emergencia_code && values.numero_emergencia_number) {
      fd.append("numero_emergencia", `${values.numero_emergencia_code}-${values.numero_emergencia_number}`);
    }
    if (values.telefono_representante_code && values.telefono_representante_number) {
      fd.append("telefono_representante", `${values.telefono_representante_code}-${values.telefono_representante_number}`);
    }

    if (values.rif) {
      fd.append('rif', values.rif)
    }

    if (values.representante_rif) {
      fd.append('representante_rif', values.representante_rif)
    }

    // Studies
    // append("tiene_estudios", values.tiene_estudios);
    // append("institucion", values.institucion);
    // append("catedras_estudiadas", values.catedras_estudiadas);
    // append("duracion", values.duracion);

    if (values.imagen instanceof File) {
      fd.append("imagen", values.imagen, values.imagen.name);
    }

    await onSubmit(fd as any);
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(submitHandler)}
      className="flex flex-col w-[90%] md:w-[80%] items-center justify-center gap-6 md:gap-4 mx-auto pb-12"
    >
      <div className="w-full bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-yellow-700 font-montserrat">
              Por favor actualice sus datos personales para continuar. Los campos marcados en gris no pueden ser modificados.
              Si necesita corregir su nombre o cédula, contacte a administración.
            </p>
          </div>
        </div>
      </div>

      <h3 className="font-montserrat font-medium text-center md:text-left w-full pb-2 border-b border-gray-200">
        Datos del Estudiante
      </h3>

      <div className="flex flex-col md:flex-row gap-6 w-full items-start">
        {/* Photo Input */}
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <PhotoInput
            control={control}
            name="imagen"
            label="Actualizar Foto"
            helperText="Suba una nueva foto solo si desea cambiar la actual."
            onFileChange={({ preview }) => {
              setValue("photo64", preview ?? "", { shouldDirty: true });
            }}
          />
          {Boolean((initialData as any)?.photo_url) && (
            <p className="text-xs text-gray-500 mt-2 font-montserrat">
              Foto actual registrada
            </p>
          )}
        </div>

        <div className="w-full md:w-2/3 flex flex-col gap-4">
          <InputForm
            name="estudianteNombre" // Not in schema, purely display
            control={control}
            label="Nombres y Apellidos"
            disabled
            className="bg-gray-100 cursor-not-allowed"
            wrapperClassName="w-full"
            // We can just display the value directly since it's read-only and not in schema
            value={(initialData as any)?.nombre || ""}
            onChange={() => { }} // No-op
          />

          <div className="flex flex-col md:flex-row gap-6 w-full">
            <InputForm
              name="estudianteFechaNacimiento"
              control={control}
              label="Fecha de Nacimiento"
              type="date"
              disabled
              className="bg-gray-100 cursor-not-allowed w-full"
              wrapperClassName="w-full"
              value={(initialData as any)?.fecha_nacimiento || ""}
              onChange={() => { }}
            />

            {/* Age is derived, just display it */}
            <div className="flex flex-col gap-1 w-full">
              <label className="font-montserrat text-sm">Edad</label>
              <input
                readOnly
                disabled
                className="border p-0 bg-gray-100 h-9 px-2 rounded"
                value={ageFromBirthDate((initialData as any)?.fecha_nacimiento) ?? ""}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 w-full">
            <div className="flex flex-col gap-1 w-full">
              <label className="font-montserrat text-sm text-gray-500">Género</label>
              <select
                className="h-9 bg-gray-100 cursor-not-allowed border p-2 rounded"
                disabled
                value={(initialData as any)?.genero || ""}
              >
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>
            </div>

            <InputForm
              name="cedula"
              control={control}
              label="Cédula de Identidad"
              // If you want it editable only if empty, or just read-only:
              disabled // usually ID is read-only
              className="bg-gray-100 cursor-not-allowed"
              error={errors.cedula}
              wrapperClassName="w-full"
            />
          </div>
        </div>
      </div>

      {/* Editable Fields Start Here */}
      <div className="flex flex-col md:flex-row gap-6 w-full mt-4">
        <div className="flex flex-col gap-1 w-full">
          <label className="font-montserrat text-sm">Teléfono Celular *</label>
          <div className="flex gap-2">
            <select
              className="w-[35%] border p-2 h-10"
              {...register("telefono_estudiantes_code")}
            >
              <option value="" disabled>Cod</option>
              {phoneCodes.map((code) => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
            <InputForm
              name="telefono_estudiantes_number"
              control={control}
              label="Número"
              labelClassName="sr-only"
              maxLength={7}
              error={errors.telefono_estudiantes_number}
              wrapperClassName="w-full"
              className="w-full h-10"
              inputMode="numeric"
              placeholder="1234567"
            />
          </div>
          {errors.telefono_estudiantes_code && (
            <p className="text-red-500 text-xs">
              {errors.telefono_estudiantes_code.message as string}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1 w-full">
          <label className="font-montserrat text-sm">RIF</label>
          <div className="flex gap-2">
            <select
              className="w-[35%] border p-2 h-10"
              value={rifType}
              onChange={(e) => {
                const nextType = (e.target.value as any) ?? "";
                const cleanedType = nextType === "V" || nextType === "J" ? nextType : "";
                setRifType(cleanedType);
                const combined = cleanedType && rifNumber ? `${cleanedType}${rifNumber}` : "";
                setValue("rif", combined, { shouldDirty: true, shouldValidate: true });
              }}
            >
              <option value="">Tipo</option>
              {rifTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <input
              className="w-full h-10 border p-2"
              inputMode="numeric"
              placeholder="11223344"
              value={rifNumber}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 9);
                setRifNumber(digits);
                const combined = rifType && digits ? `${rifType}${digits}` : "";
                setValue("rif", combined, { shouldDirty: true, shouldValidate: true });
              }}
            />
          </div>

          {errors.rif && (
            <p className="text-red-500 text-xs">{errors.rif.message as string}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 w-full">
        <InputForm
          name="institucion_educacional"
          control={control}
          label="Institución Educativa"
          wrapperClassName="w-full"
        />
        <InputForm
          name="ocupacion"
          control={control}
          label="Ocupación"
          wrapperClassName="w-full"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-6 w-full">
        <InputForm
          name="direccion"
          control={control}
          label="Dirección Residencial *"
          error={errors.direccion}
          wrapperClassName="w-full"
        />
        {/* Email is often read-only too, but if editable: */}
        {/* NOTE: You had 'estudianteEmail' mapped to 'correo_electronico'. 
             But your schema doesn't list 'correo_electronico' or 'email'. 
             I'll assume it's read-only or handled separately if not in your requested schema update.
             I'll disable it for now or just display it since it wasn't in your PHP array list.
          */}
        <div className="flex flex-col gap-1 w-full">
          <label className="font-montserrat text-sm">Correo Electrónico</label>
          <input
            disabled
            className="border p-2 bg-gray-100 cursor-not-allowed w-full"
            value={(initialData as any)?.correo_electronico || ""}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 w-full">
        <InputForm
          name="alergias"
          control={control}
          label="Alérgico(a) a *"
          error={errors.alergias}
          wrapperClassName="w-full"
        />

        <div className="flex flex-col gap-2 h-12 w-full">
          <label className="font-montserrat text-sm">
            Antecedentes (médicos, psicológicos) *
          </label>
          <div className="flex flex-row gap-8">
            <label className="flex items-center gap-[0.2rem] font-montserrat text-[0.8rem] font-semibold">
              <input
                type="radio"
                value="Sí"
                {...register("antecedentes")}
              />
              <span>Sí</span>
            </label>
            <label className="flex items-center gap-[0.1rem] font-montserrat text-[0.8rem] font-semibold">
              <input
                type="radio"
                value="No"
                {...register("antecedentes")}
              />
              <span>No</span>
            </label>
          </div>
          {errors.antecedentes && (
            <p className="text-red-500 text-xs">
              {errors.antecedentes.message as string}
            </p>
          )}
        </div>
      </div>

      <InputForm
        name="alergias_especificadas"
        control={control}
        label="Especifique (anexar informe correspondiente)"
        wrapperClassName="w-full"
      />

      <div className="flex flex-col md:flex-row gap-6 w-full">
        <InputForm
          name="nombre_emergencia"
          control={control}
          label="En caso de emergencia contactar a *"
          error={errors.nombre_emergencia}
          wrapperClassName="w-full"
        />

        <div className="flex flex-col gap-1 w-full">
          <label className="font-montserrat text-sm">Teléfono de emergencia *</label>
          <div className="flex gap-2">
            <select
              className="w-[35%] border p-2 h-10"
              {...register("numero_emergencia_code")}
            >
              <option value="" disabled>Cod</option>
              {phoneCodes.map((code) => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
            <InputForm
              name="numero_emergencia_number"
              control={control}
              label="Teléfono"
              labelClassName="sr-only"
              maxLength={7}
              error={errors.numero_emergencia_number}
              wrapperClassName="w-full"
              className="w-full h-10"
              inputMode="numeric"
            />
          </div>
          {errors.numero_emergencia_code && (
            <p className="text-red-500 text-xs">
              {errors.numero_emergencia_code.message as string}
            </p>
          )}
        </div>
      </div>

      <h3 className="font-montserrat font-medium text-center md:text-left w-full pt-8 pb-2 mt-4 border-t border-gray-200">
        Datos del Representante Legal
      </h3>

      <InputForm
        name="nombre_representante"
        control={control}
        label={`Nombres y Apellidos ${isMinor ? "*" : ""}`.trim()}
        error={errors.nombre_representante}
        wrapperClassName="w-full"
      />

      <div className="flex flex-col md:flex-row gap-6 w-full">
        <InputForm
          name="cedula_representante"
          control={control}
          label={`Cédula de Identidad ${isMinor ? "*" : ""}`.trim()}
          error={errors.cedula_representante}
          wrapperClassName="w-full"
        />
        <InputForm
          name="parentesco"
          control={control}
          label={`Parentesco ${isMinor ? "*" : ""}`.trim()}
          error={errors.parentesco}
          wrapperClassName="w-full"
        />
      </div>

      <div className="flex flex-col gap-1 w-full">
        <label className="font-montserrat text-sm">
          Teléfono Celular {isMinor ? "*" : ""}
        </label>
        <div className="flex gap-2">
          <select
            {...register("telefono_representante_code")}
            className="w-[35%] border p-2 h-10"
          >
            <option value="" disabled>Cod</option>
            {phoneCodes.map((code) => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
          <InputForm
            name="telefono_representante_number"
            control={control}
            label="Teléfono"
            labelClassName="sr-only"
            maxLength={7}
            error={errors.telefono_representante_number}
            wrapperClassName="w-full"
            className="w-full h-10"
            inputMode="numeric"
          />
        </div>
        {errors.telefono_representante_code && (
          <p className="text-red-500 text-xs">
            {errors.telefono_representante_code.message as string}
          </p>
        )}
      </div>

      {/* Extra representative fields from your list if needed */}
      <div className="flex flex-col md:flex-row gap-6 w-full mt-4">
        <InputForm name="ocupacion_representante" control={control} label="Ocupación Rep." wrapperClassName="w-full" />
        <InputForm name="representante_profesion" control={control} label="Profesión Rep." wrapperClassName="w-full" />
      </div>

      <InputForm name="representante_direccion" control={control} label="Dirección Rep." wrapperClassName="w-full" />
      <InputForm name="representante_email" control={control} label="Email Rep." type="email" wrapperClassName="w-full" error={errors.representante_email} />

      {/* Representative RIF UI */}
      <div className="flex flex-col gap-1 w-full mt-4">
        <label className="font-montserrat text-sm">RIF Representante</label>
        <div className="flex gap-2">
          <select
            className="w-[35%] border p-2 h-10"
            value={repRifType}
            onChange={(e) => {
              const nextType = (e.target.value as any) ?? "";
              const cleanedType = nextType === "V" || nextType === "J" ? nextType : "";
              setRepRifType(cleanedType);
              const combined = cleanedType && repRifNumber ? `${cleanedType}${repRifNumber}` : "";
              setValue("representante_rif", combined, { shouldDirty: true, shouldValidate: true });
            }}
          >
            <option value="">Tipo</option>
            {rifTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <input
            className="w-full h-10 border p-2"
            inputMode="numeric"
            placeholder="11223344"
            value={repRifNumber}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "").slice(0, 9);
              setRepRifNumber(digits);
              const combined = repRifType && digits ? `${repRifType}${digits}` : "";
              setValue("representante_rif", combined, { shouldDirty: true, shouldValidate: true });
            }}
          />
        </div>
        {errors.representante_rif && (
          <p className="text-red-500 text-xs">{errors.representante_rif.message as string}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center justify-center bg-[#C19310] hover:bg-[#a57f0d] px-8 py-2 mt-8 rounded-full text-base font-montserrat text-white font-medium tracking-wide transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Enviando..." : "Actualizar Datos"}
      </button>
    </form>
  );
};

export default UpdateStudentForm;
