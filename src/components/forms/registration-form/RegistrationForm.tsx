import { useMemo, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema, type RegistrationFormValues, type RegistrationFormInputValues } from ".";
import { useFillRegistrationForm } from "./registrationFormDefaults";
import InputForm from "../components/Input";
import { ageFromBirthDate, aspiranteApi, type Catedra } from "@src/lib";


const RegistrationForm = () => {
  const form = useForm<RegistrationFormInputValues, any, RegistrationFormValues>({
    resolver: zodResolver(registrationSchema) as any,
    mode: "onBlur",
  });

  useFillRegistrationForm(form);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = form;

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
    const response = await aspiranteApi.create(values);

    if (response.message) {
      alert(response.message);
      window.location.href = "/";
    } else {
      alert("Ha ocurrido un error. Por favor, intente nuevamente más tarde.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="grid grid-cols-1 md:grid-cols-2 w-[90%] md:w-[80%] items-center justify-center gap-6 md:gap-4 mx-auto"
    >
      <p className="text-sm col-span-2 text-zinc-500 mt-4">
        Los campos marcados con (<span className="text-red-500">*</span>) son obligatorios.
        Los campos que no apliquen, por favor, dejar EN BLANCO.
      </p>

      <h3 className="font-montserrat font-medium text-center md:text-left w-full pt-6 md:pt-8 pb-2 mt-0 md:mt-4 border-t border-gray-200 md:col-span-2">
        Datos del Estudiante
      </h3>

      <div className="md:col-span-2">
        <InputForm
          name="nombre"
          control={control}
          label="Nombres y Apellidos"
          required
          error={errors.nombre}
          wrapperClassName="w-full"
          placeholder="Nombres completos"
        />
      </div>

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
        <label className="font-montserrat text-sm">Género</label>
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
        name="telefono"
        control={control}
        label="Teléfono"
        error={errors.telefono}
        wrapperClassName="w-full"
        inputMode="numeric"
        placeholder="0414-1234567"
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

      <div className="md:col-span-2">
        <InputForm
          name="direccion"
          control={control}
          label="Dirección Residencial"
          required
          error={errors.direccion}
          wrapperClassName="w-full"
        />
      </div>

      <h3 className="font-montserrat font-medium text-center md:text-left w-full pt-8 pb-2 mt-4 border-t border-gray-200 md:col-span-2">
        Estudios Realizados
      </h3>

      <div className="flex flex-col gap-2 w-full md:col-span-2">
        <label className="font-montserrat text-sm font-semibold">
          ¿Posee Instrumento?
        </label>
        <div className="flex flex-row gap-8">
          <label className="flex items-center gap-[0.2rem] font-montserrat text-[0.8rem] font-semibold">
            <input type="radio" value="si" {...register("instrumento")} />
            <span>Si</span>
          </label>
          <label className="flex items-center gap-[0.1rem] font-montserrat text-[0.8rem] font-semibold">
            <input type="radio" value="no" {...register("instrumento")} />
            <span>No</span>
          </label>
        </div>
        {errors.instrumento && (
          <p className="text-red-500 text-xs">
            {errors.instrumento.message}
          </p>
        )}
      </div>

      <div></div>

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

      <h3 className="font-montserrat font-medium text-center md:text-left w-full pt-6 md:pt-8 pb-2 mt-0 md:mt-4 border-t border-gray-200 md:col-span-2">
        Antecedentes Médicos
      </h3>

      <div className="flex flex-col gap-2 h-12 w-full md:col-span-2">
        <label className="font-montserrat text-sm">
          Antecedentes (médicos, psicológicos)
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

      <div></div>

      <InputForm
        name="alergias"
        control={control}
        label="Alérgico(a) a"
        error={errors.alergias}
        wrapperClassName="w-full"
      />

      <h3 className="font-montserrat font-medium text-center md:text-left w-full pt-6 md:pt-8 pb-2 mt-0 md:mt-4 border-t border-gray-200 md:col-span-2">
        Datos de Emergencia
      </h3>

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

      <InputForm
        name="numero_emergencia"
        control={control}
        label="Teléfono de emergencia"
        required
        error={errors.numero_emergencia}
        wrapperClassName="w-full"
        inputMode="numeric"
        placeholder="0414-1234567"
      />

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

      <InputForm
        name="representante_telefono"
        control={control}
        label="Teléfono Celular"
        required={isMinor}
        error={errors.representante_telefono}
        wrapperClassName="w-full"
        inputMode="numeric"
        placeholder="0414-1234567"
      />

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

      <h3 className="font-montserrat font-medium text-center md:text-left w-full pt-3 mt-6 border-t border-gray-200 md:col-span-2">
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
        Una vez enviado el formulario, debera dirigirse al plantel para terminar el proceso de inscripción.<br />

        Documentos a consignar: <b>RIF actualizado, copia de la cedula de identidad
          vigente, y foto tipo carnet.</b>
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
