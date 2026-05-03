import { useEffect, useMemo, useState } from "react";
import { useForm, type Resolver, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema, type RegistrationFormValues } from ".";
import InputForm from "../components/Input";
import PhotoInput from "./components/PhotoInput";
import { ageFromBirthDate, type Catedra } from "../../../lib";

interface RegistrationFormProps {
  onSubmit: SubmitHandler<RegistrationFormValues>;
}

const phoneCodes = ["0412", "0422", "0414", "0424", "0416", "0426"];

const RegistrationForm = ({ onSubmit }: RegistrationFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(
      registrationSchema,
    ) as Resolver<RegistrationFormValues>,
    mode: "onBlur",
  });

  const fechaNacimiento = watch("fecha_nacimiento");
  const tieneEstudios = watch("tiene_estudios");
  const isMinor = useMemo(() => {
    const age = ageFromBirthDate(fechaNacimiento);
    return age !== null && age < 18;
  }, [fechaNacimiento]);

  const submitHandler: SubmitHandler<RegistrationFormValues> = async (
    values,
    event,
  ) => {
    try {
      await onSubmit(values, event);
    } catch (error: any) {
      if (error?.data) {
        alert(error.data.message);
      }
      throw error;
    }
  };
  /*  */
  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="grid grid-cols-1 md:grid-cols-2 w-[90%] md:w-[80%] items-center justify-center gap-6 md:gap-4 mx-auto"
    >
      <h3 className="font-montserrat font-medium text-center md:text-left w-full pt-6 md:pt-8 pb-2 mt-0 md:mt-4 border-t border-gray-200 md:col-span-2">
        Datos del Estudiante
      </h3>

      <InputForm
        name="nombre"
        control={control}
        label="Nombres y Apellidos"
        required
        error={errors.nombre}
        wrapperClassName="w-full"
        placeholder="Nombres completos"
      />

      <InputForm
        name="fecha_nacimiento"
        control={control}
        label="Fecha de Nacimiento"
        required
        type="date"
        max={new Date().toISOString().split("T")[0]}
        className={
          typeof navigator !== "undefined" &&
            /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent)
            ? "h-9"
            : "w-full"
        }
        error={errors.fecha_nacimiento}
        wrapperClassName="w-full"
      />

      <div className="flex flex-col gap-1 w-full">
        <label className="font-montserrat text-sm">Género *</label>
        <select className="h-9" {...register("genero")}>
          <option value="" disabled>
            Seleccione una opción
          </option>
          <option value="Masculino">Masculino</option>
          <option value="Femenino">Femenino</option>
        </select>
        {errors.genero && (
          <p className="text-red-500 text-xs">
            {errors.genero.message}
          </p>
        )}
      </div>

      <InputForm
        name="cedula"
        control={control}
        label="Cédula de Identidad"
        placeholder="ej. 12345678"
        maxLength={8}
        error={errors.cedula}
        wrapperClassName="w-full"
      />

      <div className="flex flex-col gap-1 w-full">
        <label className="font-montserrat text-sm">Teléfono Celular *</label>
        <div className="flex gap-2">
          <select
            className="w-[60%]"
            {...register("estudianteCodigoTelefono")}
          >
            <option value="" disabled>
              Seleccione una opción
            </option>
            {phoneCodes.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
          <InputForm
            name="telefono"
            control={control}
            label="Número de teléfono"
            required
            labelClassName="sr-only"
            maxLength={7}
            error={errors.telefono}
            wrapperClassName="w-full"
            className="w-full"
            inputMode="numeric"
            placeholder="ej. 1234567"
          />
        </div>
        {errors.estudianteCodigoTelefono && (
          <p className="text-red-500 text-xs">
            {errors.estudianteCodigoTelefono.message}
          </p>
        )}
      </div>

      <InputForm
        name="rif"
        control={control}
        label="Registro de Información Fiscal (RIF)"
        placeholder="ej. J-123456789"
        maxLength={11}
        error={errors.rif}
        wrapperClassName="w-full"
      />

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

      <InputForm
        name="profesion"
        control={control}
        label="Profesión"
        wrapperClassName="w-full"
      />

      <InputForm
        name="lugar_trabajo"
        control={control}
        label="Lugar de Trabajo"
        wrapperClassName="w-full"
      />

      <InputForm
        name="direccion"
        control={control}
        label="Dirección Residencial"
        required
        error={errors.direccion}
        wrapperClassName="w-full"
      />

      <InputForm
        name="correo_electronico"
        control={control}
        label="Correo Electrónico"
        required
        type="email"
        placeholder="usuario@gmail.com"
        error={errors.correo_electronico}
        wrapperClassName="w-full"
      />

      <InputForm
        name="alergias"
        control={control}
        label="Alérgico(a) a"
        required
        error={errors.alergias}
        wrapperClassName="w-full"
      />

      <div className="flex flex-col gap-2 h-12 w-full md:col-span-2">
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
            {errors.antecedentes.message}
          </p>
        )}
      </div>

      <InputForm
        name="alergias_especificadas"
        control={control}
        label="Especifique (anexar informe correspondiente)"
        wrapperClassName="w-full"
      />

      <InputForm
        name="nombre_emergencia"
        control={control}
        label="En caso de emergencia contactar a"
        required
        error={errors.nombre_emergencia}
        wrapperClassName="w-full"
      />

      <InputForm
        name="parentesco_emergencia"
        control={control}
        label="Parentesco"
        wrapperClassName="w-full"
      />

      <div className="flex flex-col gap-1 w-full">
        <label className="font-montserrat text-sm">
          Teléfono de emergencia *
        </label>
        <div className="flex gap-2">
          <select {...register("estudianteCodigoTelefonoEmergencia")}>
            <option value="" disabled>
              Seleccione una opción
            </option>
            {phoneCodes.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
          <InputForm
            name="numero_emergencia"
            control={control}
            label="Teléfono de emergencia"
            required
            labelClassName="sr-only"
            maxLength={7}
            error={errors.numero_emergencia}
            wrapperClassName="w-full"
            className="w-full"
            inputMode="numeric"
            placeholder="ej. 1234567"
          />
        </div>
        {errors.estudianteCodigoTelefonoEmergencia && (
          <p className="text-red-500 text-xs">
            {errors.estudianteCodigoTelefonoEmergencia.message}
          </p>
        )}
      </div>

      <h3 className="font-montserrat font-medium text-center md:text-left w-full pt-8 pb-2 mt-4 border-t border-gray-200 md:col-span-2">
        Datos del Representante Legal
      </h3>

      <InputForm
        name="representante_nombre"
        control={control}
        label="Nombres y Apellidos"
        required={isMinor}
        error={errors.representante_nombre}
        wrapperClassName="w-full"
      />

      <InputForm
        name="representante_cedula"
        control={control}
        label="Cédula de Identidad"
        required={isMinor}
        placeholder="ej. 12345678"
        maxLength={8}
        error={errors.representante_cedula}
        wrapperClassName="w-full"
      />

      <InputForm
        name="representante_parentesco"
        control={control}
        label="Parentesco"
        required={isMinor}
        error={errors.representante_parentesco}
        wrapperClassName="w-full"
      />

      <div className="flex flex-col gap-1 w-full">
        <label className="font-montserrat text-sm">
          Teléfono Celular {isMinor ? "*" : ""}
        </label>
        <div className="flex gap-2">
          <select
            {...register("representanteCodigoTelefono")}
            className="w-[60%]"
          >
            <option value="" disabled>
              Seleccione una opción
            </option>
            {phoneCodes.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
          <InputForm
            name="representante_telefono"
            control={control}
            label="Teléfono del representante"
            required={isMinor}
            labelClassName="sr-only"
            maxLength={7}
            error={errors.representante_telefono}
            wrapperClassName="w-full"
            className="w-full"
            inputMode="numeric"
          />
        </div>
        {errors.representanteCodigoTelefono && (
          <p className="text-red-500 text-xs">
            {errors.representanteCodigoTelefono.message}
          </p>
        )}
      </div>

      <InputForm
        name="representante_ocupacion"
        control={control}
        label="Ocupación"
        required={isMinor}
        error={errors.representante_ocupacion}
        wrapperClassName="w-full"
      />

      <InputForm
        name="representante_profesion"
        control={control}
        label="Profesión"
        required={isMinor}
        error={errors.representante_profesion}
        wrapperClassName="w-full"
      />

      <InputForm
        name="representante_lugar_trabajo"
        control={control}
        label="Lugar de Trabajo"
        required={isMinor}
        error={errors.representante_lugar_trabajo}
        wrapperClassName="w-full"
      />

      <InputForm
        name="representante_direccion"
        control={control}
        label="Dirección Residencial"
        required={isMinor}
        placeholder="Dirección completa"
        error={errors.representante_direccion}
        wrapperClassName="w-full"
      />

      <InputForm
        name="representante_rif"
        control={control}
        label="Registro de Información Fiscal (RIF)"
        required={isMinor}
        placeholder="ej. V-123456789"
        maxLength={11}
        error={errors.representante_rif}
        wrapperClassName="w-full"
      />

      <InputForm
        name="representante_email"
        control={control}
        label="Correo Electrónico"
        required={isMinor}
        type="email"
        placeholder="usuario@gmail.com"
        error={errors.representante_email}
        wrapperClassName="w-full"
      />

      <h3 className="font-montserrat font-medium text-center md:text-left w-full pt-8 pb-2 mt-4 border-t border-gray-200 md:col-span-2">
        Estudios Realizados
      </h3>

      <div className="flex flex-col gap-2 w-full md:col-span-2">
        <label className="font-montserrat text-sm font-semibold">
          ¿Tiene conocimientos previos?
        </label>
        <div className="flex flex-row gap-8">
          <label className="flex items-center gap-[0.2rem] font-montserrat text-[0.8rem] font-semibold">
            <input type="radio" value="Sí" {...register("tiene_estudios")} />
            <span>Sí</span>
          </label>
          <label className="flex items-center gap-[0.1rem] font-montserrat text-[0.8rem] font-semibold">
            <input type="radio" value="No" {...register("tiene_estudios")} />
            <span>No</span>
          </label>
        </div>
        {errors.tiene_estudios && (
          <p className="text-red-500 text-xs">
            {errors.tiene_estudios.message}
          </p>
        )}
      </div>

      {tieneEstudios === "Sí" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:col-span-2">
          <InputForm
            name="institucion_estudios"
            control={control}
            label="Institución"
            error={errors.institucion_estudios}
          />
          <InputForm
            name="catedras_estudios"
            control={control}
            label="Cátedras Estudiadas"
            error={errors.catedras_estudios}
          />
          <InputForm
            name="duracion_estudios"
            control={control}
            type="number"
            label="Duración (en años)"
            error={errors.duracion_estudios}
          />
        </div>
      )}

      <h3 className="font-montserrat font-medium text-center md:text-left w-full pt-8 pb-2 mt-4 border-t border-gray-200 md:col-span-2">
        Autorización
      </h3>

      <p className="text-xs md:text-sm font-montserrat font-medium text-justify md:col-span-2">
        Autorizo a la Fundación Orquesta Sinfónica de Carabobo a hacer uso del
        material fotográfico y audiovisual de las actividades académicas y
        artísticas que se lleven a cabo durante el desarrollo del Academia
        Internacional de Música. Las imágenes podrán ser usadas para la difusión
        en medios de comunicación y redes sociales. *
      </p>

      <div className="flex flex-col gap-2 w-full md:col-span-2">
        <div className="flex flex-row gap-8">
          <label className="flex items-center gap-[0.2rem] font-montserrat text-[0.8rem] font-semibold">
            <input type="radio" value="Sí" {...register("autorizacion")} />
            <span>Sí</span>
          </label>
          <label className="flex items-center gap-[0.1rem] font-montserrat text-[0.8rem] font-semibold">
            <input type="radio" value="No" {...register("autorizacion")} />
            <span>No</span>
          </label>
        </div>
        {errors.autorizacion && (
          <p className="text-red-500 text-xs">{errors.autorizacion.message}</p>
        )}
      </div>

      <p className="text-xs md:text-sm font-montserrat text-justify pt-8 pb-2 mt-4 border-t border-gray-200 md:col-span-2">
        Documentos a consignar: RIF actualizado, copia de la cedula de identidad
        vigente, y foto tipo carnet.
      </p>

      <button
        type="submit"
        className="flex items-center justify-center bg-[#C19310] hover:bg-[#a57f0d] px-6 py-1 mt-4 rounded-full text-sm font-montserrat text-white font-medium tracking-wide transition-all duration-300 shadow-md hover:shadow-lg mx-auto md:col-span-2"
      >
        Enviar
      </button>
    </form>
  );
};

export default RegistrationForm;
