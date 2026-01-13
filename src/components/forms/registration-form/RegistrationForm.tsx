import { useEffect, useMemo, useState } from "react";
import { useForm, type Resolver, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema, type RegistrationFormValues } from ".";
import InputForm from "../components/Input";
import PhotoInput from "./components/PhotoInput";
import { ageFromBirthDate, type Catedra } from "../../../lib";

interface RegistrationFormProps {
  instrumentOptions: Catedra[];
  theoreticalOptions: Catedra[];
  otherOptions: Catedra[];
  onSubmit: SubmitHandler<RegistrationFormValues>;
}

const phoneCodes = ["0412", "0422", "0414", "0424", "0416", "0426"];

const RegistrationForm = ({ onSubmit }: RegistrationFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    setError,
    formState: { errors },
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(
      registrationSchema,
    ) as Resolver<RegistrationFormValues>,
    mode: "onBlur",
    defaultValues: {
      imagen: null,
      photo64: "",
      instrumentos: [""],
      teoricas: [""],
      otros: [""],
    },
  });

  const fechaNacimiento = watch("estudianteFechaNacimiento");
  const tieneEstudios = watch("tiene_estudios");
  const isMinor = useMemo(() => {
    const age = ageFromBirthDate(fechaNacimiento);
    return age !== null && age < 18;
  }, [fechaNacimiento]);

  useEffect(() => {
    const age = ageFromBirthDate(fechaNacimiento);
    setValue("estudianteEdad", age !== null ? String(age) : "");
  }, [fechaNacimiento, setValue]);

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

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="flex flex-col w-[90%] md:w-[80%] items-center justify-center gap-6 md:gap-4 mx-auto"
    >
      <h3 className="font-montserrat font-medium text-center md:text-left w-full pt-6 md:pt-8 pb-2 mt-0 md:mt-4 border-t border-gray-200">
        Datos del Estudiante
      </h3>

      <PhotoInput
        control={control}
        name="imagen"
        onFileChange={({ preview }) => {
          setValue("photo64", preview ?? "", {
            shouldDirty: true,
            shouldTouch: true,
          });
        }}
      />

      <InputForm
        name="estudianteNombre"
        control={control}
        label="Nombres y Apellidos *"
        error={errors.estudianteNombre}
        wrapperClassName="w-full"
      />

      <div className="flex flex-col md:flex-row gap-6 w-full">
        <InputForm
          name="estudianteFechaNacimiento"
          control={control}
          label="Fecha de Nacimiento *"
          type="date"
          max={new Date().toISOString().split("T")[0]}
          className={
            typeof navigator !== "undefined" &&
            /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent)
              ? "h-9"
              : "w-full"
          }
          error={errors.estudianteFechaNacimiento}
          wrapperClassName="w-full"
        />

        <InputForm
          name="estudianteEdad"
          control={control}
          label="Edad *"
          readOnly
          tabIndex={-1}
          wrapperClassName="w-full"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-6 w-full">
        <div className="flex flex-col gap-1 w-full">
          <label className="font-montserrat text-sm">Género *</label>
          <select className="h-9" {...register("estudianteGenero")}>
            <option value="" disabled>
              Seleccione una opción
            </option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
          {errors.estudianteGenero && (
            <p className="text-red-500 text-xs">
              {errors.estudianteGenero.message}
            </p>
          )}
        </div>

        <InputForm
          name="estudianteCI"
          control={control}
          label="Cédula de Identidad"
          placeholder="eg. 12345678"
          maxLength={8}
          error={errors.estudianteCI}
          wrapperClassName="w-full"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-6 w-full">
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
              name="estudianteTelefono"
              control={control}
              label="Número de teléfono"
              labelClassName="sr-only"
              maxLength={7}
              error={errors.estudianteTelefono}
              wrapperClassName="w-full"
              className="w-full"
              inputMode="numeric"
            />
          </div>
          {errors.estudianteCodigoTelefono && (
            <p className="text-red-500 text-xs">
              {errors.estudianteCodigoTelefono.message}
            </p>
          )}
        </div>

        <InputForm
          name="estudianteRIF"
          control={control}
          label="Registro de Información Fiscal (RIF)"
          placeholder="ej. J-123456789"
          maxLength={11}
          error={errors.estudianteRIF}
          wrapperClassName="w-full"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-6 w-full">
        <InputForm
          name="estudianteInstitucion"
          control={control}
          label="Institución Educativa"
          wrapperClassName="w-full"
        />
        <InputForm
          name="estudianteOcupacion"
          control={control}
          label="Ocupación"
          wrapperClassName="w-full"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-6 w-full">
        <InputForm
          name="estudianteProfesion"
          control={control}
          label="Profesión"
          wrapperClassName="w-full"
        />
        <InputForm
          name="estudianteLugarTrabajo"
          control={control}
          label="Lugar de Trabajo"
          wrapperClassName="w-full"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-6 w-full">
        <InputForm
          name="estudianteDireccion"
          control={control}
          label="Dirección Residencial *"
          error={errors.estudianteDireccion}
          wrapperClassName="w-full"
        />
        <InputForm
          name="estudianteEmail"
          control={control}
          label="Correo Electrónico *"
          type="email"
          placeholder="usuario@gmail.com"
          error={errors.estudianteEmail}
          wrapperClassName="w-full"
        />
      </div>

      <InputForm
        name="estudianteAlergias"
        control={control}
        label="Alérgico(a) a *"
        error={errors.estudianteAlergias}
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
              {...register("estudianteAntecedentes")}
            />
            <span>Sí</span>
          </label>
          <label className="flex items-center gap-[0.1rem] font-montserrat text-[0.8rem] font-semibold">
            <input
              type="radio"
              value="No"
              {...register("estudianteAntecedentes")}
            />
            <span>No</span>
          </label>
        </div>
        {errors.estudianteAntecedentes && (
          <p className="text-red-500 text-xs">
            {errors.estudianteAntecedentes.message}
          </p>
        )}
      </div>

      <InputForm
        name="estudianteAlergiasEspecificadas"
        control={control}
        label="Especifique (anexar informe correspondiente)"
        wrapperClassName="w-full"
      />

      <InputForm
        name="estudianteContactoEmergencia"
        control={control}
        label="En caso de emergencia contactar a *"
        error={errors.estudianteContactoEmergencia}
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
            name="estudianteTelefonoEmergencia"
            control={control}
            label="Teléfono de emergencia"
            labelClassName="sr-only"
            maxLength={7}
            error={errors.estudianteTelefonoEmergencia}
            wrapperClassName="w-full"
            className="w-full"
            inputMode="numeric"
          />
        </div>
        {errors.estudianteCodigoTelefonoEmergencia && (
          <p className="text-red-500 text-xs">
            {errors.estudianteCodigoTelefonoEmergencia.message}
          </p>
        )}
      </div>

      <h3 className="font-montserrat font-medium text-center md:text-left w-full pt-8 pb-2 mt-4 border-t border-gray-200">
        Datos del Representante Legal
      </h3>

      <InputForm
        name="representanteNombre"
        control={control}
        label={`Nombres y Apellidos ${isMinor ? "*" : ""}`.trim()}
        error={errors.representanteNombre}
        wrapperClassName="w-full"
      />

      <div className="flex flex-col md:flex-row gap-6 w-full">
        <InputForm
          name="representanteCI"
          control={control}
          label={`Cédula de Identidad ${isMinor ? "*" : ""}`.trim()}
          placeholder="eg. 12345678"
          maxLength={8}
          error={errors.representanteCI}
          wrapperClassName="w-full"
        />
        <InputForm
          name="representanteParentesco"
          control={control}
          label={`Parentesco ${isMinor ? "*" : ""}`.trim()}
          error={errors.representanteParentesco}
          wrapperClassName="w-full"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-6 w-full">
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
              name="representanteTelefono"
              control={control}
              label="Teléfono del representante"
              labelClassName="sr-only"
              maxLength={7}
              error={errors.representanteTelefono}
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
          name="representanteOcupacion"
          control={control}
          label={`Ocupación ${isMinor ? "*" : ""}`.trim()}
          error={errors.representanteOcupacion}
          wrapperClassName="w-full"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-6 w-full">
        <InputForm
          name="representanteProfesion"
          control={control}
          label={`Profesión ${isMinor ? "*" : ""}`.trim()}
          error={errors.representanteProfesion}
          wrapperClassName="w-full"
        />
        <InputForm
          name="representanteLugarTrabajo"
          control={control}
          label={`Lugar de Trabajo ${isMinor ? "*" : ""}`.trim()}
          error={errors.representanteLugarTrabajo}
          wrapperClassName="w-full"
        />
      </div>

      <InputForm
        name="representanteDireccion"
        control={control}
        label={`Dirección Residencial ${isMinor ? "*" : ""}`.trim()}
        error={errors.representanteDireccion}
        wrapperClassName="w-full"
      />

      <div className="flex flex-col md:flex-row gap-6 w-full">
        <InputForm
          name="representanteRIF"
          control={control}
          label={`Registro de Información Fiscal (RIF) ${isMinor ? "*" : ""}`.trim()}
          placeholder="eg. V-123456789"
          maxLength={11}
          error={errors.representanteRIF}
          wrapperClassName="w-full"
        />
        <InputForm
          name="representanteEmail"
          control={control}
          label={`Correo Electrónico ${isMinor ? "*" : ""}`.trim()}
          type="email"
          placeholder="usuario@gmail.com"
          error={errors.representanteEmail}
          wrapperClassName="w-full"
        />
      </div>

      <h3 className="font-montserrat font-medium text-center md:text-left w-full pt-8 pb-2 mt-4 border-t border-gray-200">
        Estudios Realizados
      </h3>

      <div className="flex flex-col gap-2 w-full">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <InputForm
            name="institucion"
            control={control}
            label="Institución"
            error={errors.institucion}
          />
          <InputForm
            name="catedras_estudiadas"
            control={control}
            label="Cátedras Estudiadas"
            error={errors.catedras_estudiadas}
          />
          <InputForm
            name="duracion"
            control={control}
            type="number"
            label="Duración (en años)"
            error={errors.duracion}
          />
        </div>
      )}

      <h3 className="font-montserrat font-medium text-center md:text-left w-full pt-8 pb-2 mt-4 border-t border-gray-200">
        Autorización
      </h3>

      <p className="text-xs md:text-sm font-montserrat font-medium text-justify">
        Autorizo a la Fundación Orquesta Sinfónica de Carabobo a hacer uso del
        material fotográfico y audiovisual de las actividades académicas y
        artísticas que se lleven a cabo durante el desarrollo del Academia
        Internacional de Música. Las imágenes podrán ser usadas para la difusión
        en medios de comunicación y redes sociales. *
      </p>

      <div className="flex flex-col gap-2 w-full">
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

      <p className="text-xs md:text-sm font-montserrat text-justify pt-8 pb-2 mt-4 border-t border-gray-200">
        Documentos a consignar: RIF actualizado, copia de la cedula de de
        identidad vigente, y foto tipo carnet.
      </p>

      <button
        type="submit"
        className="flex items-center justify-center bg-[#C19310] hover:bg-[#a57f0d] px-6 py-1 mt-4 rounded-full text-sm font-montserrat text-white font-medium tracking-wide transition-all duration-300 shadow-md hover:shadow-lg mx-auto"
      >
        Enviar
      </button>
    </form>
  );
};

export default RegistrationForm;
