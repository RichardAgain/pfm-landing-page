import RegistrationForm from "@components/forms/registration-form/RegistrationForm";

export default function Registration() {
  return (
    <section
      id="inscripción"
      className="w-full overflow-hidden bg-white py-12 background"
    >
      <div className="flex flex-col w-[90%] md:w-[65%] gap-6 py-4 md:py-12 mx-auto mb-12 md:bg-white md:border border-gray-200 rounded-3xl">
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

        <RegistrationForm />

      </div>
    </section>
  );
}
