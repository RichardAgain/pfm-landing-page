import { useState, useEffect } from "react";
import { studentApi, type Estudiante, type StudentNotas, type NotaCatedra, type NotaGrupal } from "../../lib/api";
import { API_BASE_URL } from "../../config/api";

const EMPTY_GRADES: StudentNotas = { catedras: {}, grupales: {} };

export default function Student() {
    // State variable for student data
    const [student, setStudent] = useState<Estudiante | null>(null);

    // State variable for student's grades (grouped by subject)
    const [grades, setGrades] = useState<StudentNotas | null>(null);

    // State variables for loading views management
    const [loadingStudent, setLoadingStudent] = useState(true);

    // State variables for errors management
    const [studentError, setStudentError] = useState<string | null>(null);
    const [gradesError, setGradesError] = useState<string | null>(null);

    // ------------------------------------------------------

    // Local state to toggle image error fallback
    const [imageError, setImageError] = useState(false);

    const getInitials = (name?: string | null) => {
        if (!name) return "ES";
        const parts = name.trim().split(/\s+/);
        const initials = parts
            .slice(0, 2)
            .map((p) => p[0]?.toUpperCase() ?? "")
            .join("");
        return initials || "ES";
    };

    // Get student's data using fetch
    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                setLoadingStudent(true);
                setGradesError(null);

                // Get user data from localStorage (set during login)
                const userData = localStorage.getItem("user_data");
                if (!userData) {
                    setStudentError("No se encontraron datos de usuario. Por favor, inicie sesión nuevamente.");
                    setGrades(EMPTY_GRADES);
                    setLoadingStudent(false);
                    return;
                }

                // Use the student ID from the user data (assuming it's linked via id_estudiante)
                const response = await studentApi.getProfile();

                if (response.data) {
                    setStudent(response.data);
                    setGrades(response.data.notas ?? EMPTY_GRADES);
                } else {
                    setStudentError("No se encontraron datos del estudiante.");
                    setGrades(EMPTY_GRADES);
                    setGradesError("No se encontraron notas del estudiante.");
                }
            } catch (error) {
                console.error("Error al cargar los datos del estudiante:", error);
                setStudentError("Error al cargar los datos del estudiante.");
                setGrades(EMPTY_GRADES);
                setGradesError("Error al cargar las notas del estudiante.");
            } finally {
                setLoadingStudent(false);
            }
        };

        fetchStudentData();
    }, []);

    // ------------------------------------------------------

    const hasCatedras = Object.keys(grades?.catedras ?? {}).length > 0;
    const hasGrupales = Object.keys(grades?.grupales ?? {}).length > 0;

    const catedraEntries = Object.entries(grades?.catedras ?? {}) as [string, NotaCatedra[]][];
    const grupalEntries = Object.entries(grades?.grupales ?? {}) as [string, NotaGrupal[]][];

    const formatProfessor = (nombre?: string | null, cedula = " "): string => {
        return nombre || "";
    };

    const getObrasWithNotas = (registro: NotaGrupal): Array<{ nombre: string; nota: number | string }> => {
        const observaciones = (registro.observacion ?? "")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        const keys = ["obra1", "obra2", "obra3"];

        return keys.map((key, index) => {
            const nombre = observaciones[index] || `Obra ${index + 1}`;
            const nota = registro.obras?.[key] ?? "N/A";
            return { nombre, nota };
        });
    };

    // Alternative views
    if (loadingStudent) {
        return (
            <div className="flex flex-col w-full h-120 md:h-150 items-center justify-center">
                <div className="absolute inset-0 z-0 w-full">
                    <img src="/background.png" className="w-full h-full" />
                </div>

                <p className="md:text-lg font-montserrat text-gray-700 font-bold text-center z-10 mx-8 md:mx-0">
                    Cargando...
                </p>
            </div>
        );
    }

    if (studentError) {
        return (
            <div className="flex flex-col w-full h-120 md:h-150 items-center justify-center">
                <div className="absolute inset-0 z-0 w-full">
                    <img src="/background.png" className="w-full h-full" />
                </div>

                <p className="md:text-xl font-montserrat text-red-500 font-bold text-center z-10 mx-8 md:mx-0">
                    Error: {studentError}
                </p>
            </div>
        );
    }

    if (!loadingStudent && !student) {
        return (
            <div className="flex flex-col w-full h-120 md:h-150 items-center justify-center">
                <div className="absolute inset-0 z-0 w-full">
                    <img src="/background.png" className="w-full h-full" />
                </div>

                <p className="md:text-xl font-montserrat text-red-500 font-bold text-center z-10 mx-8 md:mx-0">
                    Error: Estudiante no encontrado.
                </p>
            </div>
        );
    }

    return (
        <section id="student">
            <div className="absolute inset-0 z-0 w-full">
                <img src="/background.png" className="w-full h-full fixed" />
            </div>


            <div className="flex flex-col md:w-[75%] py-8 md:py-16 mx-auto gap-8 md:gap-12 relative z-10">
                <div className="flex flex-col w-full items-center py-8 gap-6 md:border border-gray-200 rounded-lg bg-zinc-50">
                    <h2 className="text-2xl font-montserrat text-gray-800 font-bold text-center w-[85%] md:w-[80%] pb-4 border-b border-gray-200">
                        Información personal
                    </h2>
                    <div className="flex flex-col md:flex-row w-[85%] md:w-[80%] items-start justify-center gap-6 md:gap-16">
                        {/* Avatar column */}
                        <div className="flex-shrink-0 flex items-center justify-center">
                            {(() => {
                                const raw = student?.photo_url ?? null;
                                const photoSrc = raw ? (raw.startsWith("http") ? raw : `${API_BASE_URL}${raw}`) : null;

                                return photoSrc && !imageError ? (
                                    <img
                                        src={photoSrc}
                                        alt={`Foto de ${student?.nombre ?? "estudiante"}`}
                                        onError={() => setImageError(true)}
                                        className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border border-gray-200"
                                    />
                                ) : (
                                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-gray-700">
                                        {getInitials(student?.nombre)}
                                    </div>
                                );
                            })()}
                        </div>

                        <div className="flex flex-col md:flex-row w-full items-start justify-center gap-6 md:gap-16">
                            <div className="flex flex-col gap-2">
                                <div className="text-sm font-montserrat text-gray-700">
                                    <b>Nombre completo:</b> {student?.nombre}
                                </div>
                                <div className="text-sm font-montserrat text-gray-700">
                                    <b>Cédula de identidad:</b> {student?.cedula || "No registrado"}
                                </div>
                                <div className="text-sm font-montserrat text-gray-700">
                                    <b>Teléfono:</b> {student?.telefono_estudiantes || "No registrado"}
                                </div>
                                <div className="text-sm font-montserrat text-gray-700">
                                    <b>Correo electrónico:</b> {student?.correo_electronico || "No registrado"}
                                </div>
                                <div className="text-sm font-montserrat text-gray-700">
                                    <b>Fecha de nacimiento:</b> {student?.fecha_nacimiento || "No registrado"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Historial académico */}
                {gradesError ? (
                    <p className="text-lg font-montserrat text-red-500 font-bold text-center w-full">
                        Error: {gradesError}
                    </p>
                ) : hasCatedras || hasGrupales ? (
                    <>
                        {hasCatedras &&
                            catedraEntries.map(([materia, registros]) => (
                                <div
                                    key={materia}
                                    className="flex flex-col w-[85%] md:w-full items-center justify-center py-8 px-6 md:px-12 mx-auto gap-6 border border-gray-200 rounded-lg bg-zinc-50"
                                >
                                    <h3 className="text-lg md:text-xl font-montserrat text-gray-800 font-bold text-center">
                                        Historial académico - Cátedra: {materia}
                                    </h3>
                                    <div className="w-full overflow-x-auto max-h-[60vh]">
                                        <table className="w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-100">
                                                <tr className="hover:bg-gray-50">
                                                    <th className="px-4 py-2 text-left text-xs font-montserrat text-gray-700 font-medium uppercase tracking-wider">
                                                        Periodo
                                                    </th>
                                                    <th className="px-4 py-2 text-left text-xs font-montserrat text-gray-700 font-medium uppercase tracking-wider">
                                                        Nivel cursado
                                                    </th>
                                                    <th className="px-4 py-2 text-left text-xs font-montserrat text-gray-700 font-medium uppercase tracking-wider">
                                                        Definitiva
                                                    </th>
                                                    <th className="px-4 py-2 text-left text-xs font-montserrat text-gray-700 font-medium uppercase tracking-wider">
                                                        Nivel obtenido
                                                    </th>
                                                    <th className="px-4 py-2 text-left text-xs font-montserrat text-gray-700 font-medium uppercase tracking-wider">
                                                        Profesor
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {registros.length > 0 ? (
                                                    registros.map((registro) => (
                                                        <tr key={registro.id} className="hover:bg-gray-50">
                                                            <td className="px-4 py-2 text-xs font-montserrat">
                                                                {registro.periodo_nombre ?? "No Registrado"}
                                                            </td>
                                                            <td className="px-4 py-2 text-xs font-montserrat">
                                                                {registro.nivel ?? "No registrado"}
                                                            </td>
                                                            <td className="px-4 py-2 text-xs font-montserrat">
                                                                {registro.definitiva ?? "N/A"}
                                                            </td>
                                                            <td className="px-4 py-2 text-xs font-montserrat">
                                                                {registro.nivel_obtenido ?? "No registrado"}
                                                            </td>
                                                            <td className="px-4 py-2 text-xs font-montserrat">
                                                                {formatProfessor(
                                                                    registro.profesor_nombre,
                                                                )}
                                                            </td>

                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td
                                                            className="px-4 py-2 text-xs font-montserrat text-center"
                                                            colSpan={7}
                                                        >
                                                            No hay registros para esta cátedra.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}

                        {hasGrupales &&
                            grupalEntries.map(([materia, registros]) => (
                                <div
                                    key={materia}
                                    className="flex flex-col w-[85%] md:w-full items-center justify-center py-8 px-6 md:px-12 mx-auto gap-6 border border-gray-200 rounded-lg bg-zinc-50"
                                >
                                    <h3 className="text-lg md:text-xl font-montserrat text-gray-800 font-bold text-center">
                                        Historial académico - Grupal: {materia}
                                    </h3>
                                    <div className="w-full overflow-x-auto max-h-[60vh]">
                                        <table className="w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-100">
                                                <tr className="hover:bg-gray-50">
                                                    <th className="px-4 py-2 text-left text-xs font-montserrat text-gray-700 font-medium uppercase tracking-wider">
                                                        Obra 1
                                                    </th>
                                                    <th className="px-4 py-2 text-left text-xs font-montserrat text-gray-700 font-medium uppercase tracking-wider">
                                                        Obra 2
                                                    </th>
                                                    <th className="px-4 py-2 text-left text-xs font-montserrat text-gray-700 font-medium uppercase tracking-wider">
                                                        Obra 3
                                                    </th>
                                                    <th className="px-4 py-2 text-left text-xs font-montserrat text-gray-700 font-medium uppercase tracking-wider">
                                                        Definitiva
                                                    </th>
                                                    <th className="px-4 py-2 text-left text-xs font-montserrat text-gray-700 font-medium uppercase tracking-wider">
                                                        Profesor
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {registros.length > 0 ? (
                                                    registros.map((registro) => {
                                                        const obras = getObrasWithNotas(registro);

                                                        return (
                                                            <tr key={registro.id} className="hover:bg-gray-50">
                                                                {obras.map((obra, index) => (
                                                                    <td
                                                                        key={`${registro.id}-obra-${index}`}
                                                                        className="px-4 py-2 text-xs font-montserrat"
                                                                    >
                                                                        <span className="block font-semibold">
                                                                            {obra.nombre}
                                                                        </span>
                                                                        <span>{obra.nota}</span>
                                                                    </td>
                                                                ))}
                                                                <td className="px-4 py-2 text-xs font-montserrat">
                                                                    {registro.definitiva ?? "N/A"}
                                                                </td>
                                                                <td className="px-4 py-2 text-xs font-montserrat">
                                                                    {formatProfessor(
                                                                        registro.profesor_nombre,
                                                                        registro.profesor_cedula
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                ) : (
                                                    <tr>
                                                        <td
                                                            className="px-4 py-2 text-xs font-montserrat text-center"
                                                            colSpan={5}
                                                        >
                                                            No hay registros grupales para esta cátedra.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                    </>
                ) : (
                    <p className="text-lg font-montserrat text-gray-700 font-bold text-center w-full">
                        No hay notas disponibles para el estudiante <b>{student?.nombre}.</b>
                    </p>
                )}
            </div>
        </section>
    );
}
