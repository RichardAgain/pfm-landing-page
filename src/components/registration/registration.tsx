import { useRef, useState } from "react";
import { aspiranteApi } from "../../lib/api";
import type { RegistrationFormValues } from "../forms/registration-form";
import RegistrationForm from "../forms/registration-form/RegistrationForm";
import { formatPhone } from "../../utils/format-phone";

export default function Registration() {
  const [showModal, setShowModal] = useState(false);
  const [pendingValues, setPendingValues] =
    useState<RegistrationFormValues | null>(null);

  const handleRegistration = async (values: RegistrationFormValues) => {
    try {
      const formData = new FormData();

      formData.append("nombre", values.estudianteNombre);
      formData.append("genero", values.estudianteGenero);
      formData.append("cedula", values.estudianteCI);
      formData.append("fecha_nacimiento", values.estudianteFechaNacimiento);
      formData.append("correo_electronico", values.estudianteEmail);
      formData.append("direccion", values.estudianteDireccion);
      formData.append(
        "telefono_estudiantes",
        formatPhone(values.estudianteCodigoTelefono, values.estudianteTelefono),
      );
      formData.append("rif", values.estudianteRIF);
      formData.append("institucion_educacional", values.estudianteInstitucion);
      formData.append("ocupacion", values.estudianteOcupacion);
      formData.append("profesion", values.estudianteProfesion);
      formData.append("lugar_trabajo", values.estudianteLugarTrabajo);
      formData.append("alergico_a", values.estudianteAlergias);
      formData.append("antecedentes", values.estudianteAntecedentes);
      formData.append(
        "especificacion_antecedentes",
        values.estudianteAlergiasEspecificadas,
      );
      formData.append("nombre_emergencia", values.estudianteContactoEmergencia);
      formData.append(
        "numero_emergencia",
        formatPhone(
          values.estudianteCodigoTelefonoEmergencia,
          values.estudianteTelefonoEmergencia,
        ),
      );

      formData.append("nombre_representante", values.representanteNombre);
      formData.append("cedula_representante", values.representanteCI);
      formData.append("parentesco", values.representanteParentesco);
      formData.append(
        "telefono_representante",
        formatPhone(
          values.representanteCodigoTelefono,
          values.representanteTelefono,
        ),
      );
      formData.append("ocupacion_representante", values.representanteOcupacion);
      formData.append("profesion_representante", values.representanteProfesion);
      formData.append(
        "lugar_trabajo_representante",
        values.representanteLugarTrabajo,
      );
      formData.append("direccion_representante", values.representanteDireccion);
      formData.append("rif_representante", values.representanteRIF);
      formData.append("email_representante", values.representanteEmail);
      formData.append(
        "tiene_estudios",
        values.tiene_estudios === "Sí" ? "1" : "0",
      );
      formData.append("institucion", values.institucion);
      formData.append("catedras_estudiadas", values.catedras_estudiadas);
      formData.append("duracion", values.duracion);

      formData.append("autorizacion", values.autorizacion === "Sí" ? "1" : "0");

      formData.append("imagen", values.imagen, values.imagen.name);

      const response = await aspiranteApi.create(formData);

      if (response.message) {
        const link = document.createElement("a");
        link.href = response.download_url;
        link.download = `planilla_inscripcion.pdf`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        alert("Inscripción enviada exitosamente. Será contactado pronto.");
        window.location.href = "/";
      } else {
        alert("Ha ocurrido un error. Por favor, intente nuevamente más tarde.");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error?.status === 422) {
        throw error;
      }
      alert("Ha ocurrido un error. Por favor, intente nuevamente más tarde.");
    }
  };

  return (
    <section
      id="inscripción"
      className="w-full overflow-hidden bg-white py-12 background"
    >
      <div className="flex flex-col w-[90%] md:w-[55%] gap-6 py-4 md:py-12 mx-auto mb-12 md:bg-white md:border border-gray-200 rounded-3xl">
        <div className="flex flex-col gap-8">
          <div className="flex w-full items-center justify-center">
            <div className="flex items-center justify-center gap-2">
              <img
                src="/logo.png"
                alt="Academia Internacional de Música - Maestro José Calabrese"
                className="w-22 md:w-22 md:h-fit justify-center"
              />
              <img
                src="/logo-fosc.png"
                alt="Fundación Orquesta Sinfónica de Carabobo"
                className="w-35 md:w-35 md:h-fit justify-center pl-2 border-l border-gray-300"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <h1 className="md:text-xl font-montserrat font-medium text-center">
              Academia Internacional de Música
            </h1>
            <h2 className="text-xl md:text-3xl font-montserrat font-bold text-center">
              Maestro José Calabrese
            </h2>
          </div>
          <p className="md:text-lg font-montserrat font-semibold text-center">
            Planilla de Inscripción
          </p>
        </div>

        <RegistrationForm onSubmit={handleRegistration} />

        {showModal && pendingValues && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
              <div className="flex flex-col gap-4">
                <p className="text-sm font-montserrat text-gray-700 text-center leading-relaxed">
                  <b className="text-base">
                    Se ha descargado la planilla de inscripción.
                  </b>
                  <br />
                  <br />
                  Por favor, realice una revisión detallada del documento. Si
                  todos los datos proporcionados son correctos, proceda a
                  culminar su inscripción. Si existe algún error, por favor,
                  realice el proceso nuevamente.
                </p>

                <div className="flex justify-center gap-2 mt-2">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm font-montserrat font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition duration-200"
                  >
                    Volver
                  </button>

                  <button
                    onClick={async () => {
                      setShowModal(false);
                      if (pendingValues) {
                        await handleRegistration(pendingValues);
                      }
                    }}
                    className="px-4 py-2 text-sm font-montserrat font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition duration-200"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
