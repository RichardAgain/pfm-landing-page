import { useEffect, useState } from "react";
import { Eye, Check, X } from "lucide-react";
import { actions } from "astro:actions";
import type { ListaEsperaItem } from "../../types/waitlist";

// ------------------------------------------------------------------

// Function for calculating applicant's age
const calculateAge = (date?: string | null) => {
    if (!date) return 0;

    const normalizedDate = date.replaceAll("/", "-");

    const birthDate = new Date(normalizedDate);

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
};

// ------------------------------------------------------------------

export default function Administrator() {
    // State variable for students data
    const [students, setStudents] = useState<ListaEsperaItem[]>([]);

    // State variable for loading view management
    const [loading, setLoading] = useState<boolean>(true);

    // State variable for error message management
    const [error, setError] = useState<string | null>(null);

    // State variables for confirmation/rejection modals management
    const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
    const [showRejectionModal, setShowRejectionModal] = useState<boolean>(false);

    // State variables for selected student
    const [selectedStudent, setSelectedStudent] = useState<number>(0);

    // ------------------------------------------------------------------

    // Get applicants data using fetch (wait-list)
    useEffect(() => {
        const fetchWaitList = async () => {
            setLoading(true);

            const { data, error } = await actions.applicants.getWaitList();

            if (error) {
                console.error("Error al cargar la lista de espera:", error);
                setError("Error al cargar la lista de espera.");
                setLoading(false);
                return;
            }

            if (data && data.data) {
                // Your Laravel controller already filters by estado = 1
                setStudents(data.data);
            } else {
                setStudents([]);
            }

            setLoading(false);
        };

        fetchWaitList();
    }, []);

    // ------------------------------------------------------------------

    const handleDownloadPDF = async (id: number) => {
        const { data, error } = await actions.applicants.downloadPdf({ id });

        if (error) {
            console.error("Error downloading PDF:", error);
            alert("Error al descargar la planilla.");
            return;
        }

        if (!data || !data.download_url) {
            alert("Error: No se recibió la URL de descarga.");
            return;
        }

        const link = document.createElement("a");
        link.href = data.download_url;
        link.download = `planilla_inscripcion.pdf`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // ------------------------------------------------------------------

    // Applicant acceptation handler
    const handleAcceptation = async (id: number) => {
        const student = students.find((s) => s.id === id) ?? null;

        if (student) {
            const { data, error } = await actions.applicants.accept({ id });

            if (error) {
                console.error("Acceptation error:", error);
                alert("Error al procesar la aceptación.");
                return;
            }

            if (data && data.message) {
                setStudents((prev) => prev.filter((s) => s.id !== id));
                alert(`Aplicante aceptado con éxito${student.nombre ? `: ${student.nombre}` : ""}.`);
            } else {
                alert("Error al aceptar al aplicante.");
            }
        } else {
            alert("Error. No se ha encontrado al aplicante.");
        }
    };

    // ------------------------------------------------------------------

    // Applicant rejection handler
    const handleRejection = async (id: number) => {
        const student = students.find((s) => s.id === id) ?? null;

        if (student) {
            const { data, error } = await actions.applicants.reject({ id });

            if (error) {
                console.error("Rejection error:", error);
                alert("Error al procesar el rechazo.");
                return;
            }

            if (data && data.message) {
                // Remove from local state
                setStudents((prev) => prev.filter((s) => s.id !== id));
                alert(`Aplicante rechazado con éxito${student.nombre ? `: ${student.nombre}` : ""}.`);
            } else {
                alert("Error al rechazar al aplicante.");
            }
        } else {
            alert("Error. No se ha encontrado al aplicante.");
        }
    };

    return (
        <section id="administrator">
            <div className="absolute inset-0 z-0 w-full">
                <img src="/background.png" className="w-full h-full fixed" />
            </div>

            <div className="flex flex-col w-[90vw] md:w-[80vw] items-center justify-center py-16 gap-12 mx-auto relative z-10">
                <div className="flex flex-col w-full gap-6 pb-6 border-b border-gray-200">
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
                    <div className="flex flex-col">
                        <h1 className="text-lg font-montserrat text-gray-800 font-medium text-center">
                            Academia Internacional de Música
                        </h1>
                        <h2 className="text-2xl font-montserrat text-gray-800 font-bold text-center">
                            Maestro José Calabrese
                        </h2>
                    </div>
                    <h3 className="text-xl font-montserrat text-gray-800 font-bold text-center">Lista de Espera</h3>
                </div>

                {loading ? (
                    <p className="text-lg font-montserrat text-gray-700 font-bold text-center w-full">
                        Cargando aplicantes...
                    </p>
                ) : error ? (
                    <p className="text-lg font-montserrat text-gray-700 font-bold text-center w-full">{error}</p>
                ) : (
                    <div className="w-full overflow-auto max-h-[60vh]">
                        <table className="w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr className="hover:bg-gray-50">
                                    <th className="px-4 py-2 text-left text-xs font-montserrat text-gray-700 font-medium uppercase tracking-wider">
                                        Nombre
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-montserrat text-gray-700 font-medium uppercase tracking-wider">
                                        Edad
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-montserrat text-gray-700 font-medium uppercase tracking-wider">
                                        Cédula
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-montserrat text-gray-700 font-medium uppercase tracking-wider">
                                        Instrumento(s)
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-montserrat text-gray-700 font-medium uppercase tracking-wider">
                                        Teórica(s)
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-montserrat text-gray-700 font-medium uppercase tracking-wider">
                                        Otro(s)
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-montserrat text-gray-700 font-medium uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {students.length === 0 ? (
                                    <tr className="hover:bg-gray-100">
                                        <td
                                            colSpan={7}
                                            className="px-4 py-4 text-xs font-montserrat font-medium text-center"
                                        >
                                            No hay aplicantes en lista de espera
                                        </td>
                                    </tr>
                                ) : (
                                    students.map((e) => {
                                        return (
                                            <tr key={e.id} className="hover:bg-gray-100">
                                                <td className="px-4 py-2 text-xs font-montserrat">{e.nombre}</td>
                                                <td className="px-4 py-2 text-xs font-montserrat text-right">
                                                    {e.fecha_nacimiento ? calculateAge(e.fecha_nacimiento) : "-"}
                                                </td>
                                                <td className="px-4 py-2 text-xs font-montserrat text-right">
                                                    {e.cedula || "—"}
                                                </td>
                                                <td className="px-4 py-2 text-xs font-montserrat">
                                                    {e.enrollments?.Instrumento}
                                                </td>
                                                <td className="px-4 py-2 text-xs font-montserrat">
                                                    {e.enrollments?.Teoricas}
                                                </td>
                                                <td className="px-4 py-2 text-xs font-montserrat">
                                                    {e.enrollments?.Otros}
                                                </td>
                                                <td className="flex flex-row items-center justify-center gap-4 py-2">
                                                    <button
                                                        onClick={() => handleDownloadPDF(e.id)}
                                                        aria-label="Ver planilla"
                                                    >
                                                        <Eye className="w-4 h-4 text-blue-500 hover:text-blue-700"></Eye>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedStudent(e.id);
                                                            setShowConfirmationModal(true);
                                                        }}
                                                        aria-label="Aprobar"
                                                    >
                                                        <Check className="w-4 h-4 text-green-500 hover:text-green-700"></Check>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedStudent(e.id);
                                                            setShowRejectionModal(true);
                                                        }}
                                                        aria-label="Rechazar"
                                                    >
                                                        <X className="w-4 h-4 text-red-500 hover:text-red-700"></X>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal de confirmación */}
            {showConfirmationModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="flex flex-col bg-white max-w-sm w-full rounded-lg p-8 gap-6">
                        <p className="font-montserrat font-medium text-center">
                            ¿Está seguro de que desea aceptar a{" "}
                            <b>{students.find((e) => e.id === selectedStudent)?.nombre}</b>? Esta acción no se puede
                            revertir.
                        </p>
                        <div className="flex items-center justify-center gap-2">
                            <button
                                className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-full text-sm font-montserrat font-medium text-center"
                                onClick={() => setShowConfirmationModal(false)}
                            >
                                Volver
                            </button>
                            <button
                                className="bg-green-200 hover:bg-green-300 px-6 py-2 rounded-full text-sm font-montserrat font-medium text-center"
                                onClick={() => {
                                    setShowConfirmationModal(false);
                                    handleAcceptation(selectedStudent);
                                }}
                            >
                                Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de rechazo */}
            {showRejectionModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="flex flex-col bg-white max-w-sm w-full rounded-lg p-8 gap-6">
                        <p className="font-montserrat font-medium text-center">
                            ¿Está seguro de que desea rechazar a{" "}
                            <b>{students.find((e) => e.id === selectedStudent)?.nombre}</b>? Esta acción no se puede
                            revertir.
                        </p>
                        <div className="flex items-center justify-center gap-2">
                            <button
                                className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-full text-sm font-montserrat font-medium"
                                onClick={() => setShowRejectionModal(false)}
                            >
                                Volver
                            </button>
                            <button
                                className="bg-red-200 hover:bg-red-300 px-6 py-2 rounded-full text-sm font-montserrat font-medium"
                                onClick={() => {
                                    setShowRejectionModal(false);
                                    handleRejection(selectedStudent);
                                }}
                            >
                                Rechazar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
