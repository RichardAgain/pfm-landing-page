import { useEffect, useState } from "react";
import UpdateStudentForm from "./UpdateStudentForm";
import type { Estudiante } from "../../../types/models";
import { type UpdateStudentFormValues } from "./schema";
import { actions } from "astro:actions";

const UpdateStudentPageContent = () => {
  const [initialData, setInitialData] = useState<Estudiante | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await actions.students.getEstudiante();

      if (error) {
        setError("No se pudo cargar la información del estudiante.");
        setLoading(false);
        return;
      }

      setInitialData(data.data)
      setPhotoUrl(data.photoUrl)

      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleUpdate = async (values: any) => {
    setLoading(true);

    console.log([...values])

    const { data, error } = await actions.students.updateProfile(values);

    if (error) {
      alert("Error al actualizar: " + error.message);
      console.error(error);
      setLoading(false);
      return;
    }

    alert("Datos actualizados correctamente.");
    // window.location.href = "/estudiante";
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C19310]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600 font-montserrat">
        {error}
        <button
          onClick={() => window.location.reload()}
          className="block mx-auto mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-black"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-100">
      <UpdateStudentForm
        initialData={initialData!}
        photoUrl={photoUrl}
        onSubmit={handleUpdate}
      />
    </div>
  );
};

export default UpdateStudentPageContent;
