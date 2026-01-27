import { useEffect, useId, useState } from "react";
import type { ChangeEvent } from "react";
import { useController, type Control } from "react-hook-form";

interface PhotoInputProps {
    control: Control<any>;
    name: string;
    label?: string;
    helperText?: string;
    wrapperClassName?: string;
    onFileChange?: (value: { file: File | null; preview: string | null }) => void;
}

const DEFAULT_HELPER_TEXT = "La foto debe ser nítida, tipo carnet, fondo blanco, tamaño 3x4 cm. Formato JPG o PNG.";

const PhotoInput = ({
    control,
    name,
    label = "Subir foto",
    helperText = DEFAULT_HELPER_TEXT,
    wrapperClassName = "flex flex-col items-center justify-center w-[40%] gap-4 mb-4 imagen",
    onFileChange,
}: PhotoInputProps) => {
    const inputId = useId();
    const {
        field: { value, onChange, onBlur, ref },
        fieldState: { error },
    } = useController({ control, name });

    const [previewURL, setPreviewURL] = useState<string | null>(null);

    useEffect(() => {
        if (typeof value === "string" && value.length > 0) {
            setPreviewURL(value);
            return;
        }

        if (value instanceof File) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = typeof reader.result === "string" ? reader.result : null;
                setPreviewURL(result);
            };
            reader.readAsDataURL(value);
            return () => {
                reader.abort();
            };
        }

        setPreviewURL(null);
    }, [value]);

    const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            setPreviewURL(null);
            onChange(null);
            onFileChange?.({ file: null, preview: null });
            return;
        }

        onChange(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = typeof reader.result === "string" ? reader.result : null;
            setPreviewURL(result);
            onFileChange?.({ file, preview: result });
        };
        reader.readAsDataURL(file);

        // allow selecting the same file again
        event.target.value = "";
    };

    return (
        <div className={wrapperClassName}>
            <div className="flex flex-col items-center gap-2 imagen">
                <div className="w-[120px] h-[160px] bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden imagen">
                    {previewURL ? (
                        <img src={previewURL} alt="Vista previa" className="object-cover w-full h-full" />
                    ) : (
                        <span className="text-xs font-montserrat text-gray-500">Foto</span>
                    )}
                </div>

                <label
                    htmlFor={inputId}
                    className="cursor-pointer text-center text-[0.8rem] font-montserrat font-semibold text-blue-600 hover:underline"
                >
                    <input
                        className="hidden"
                        id={inputId}
                        type="file"
                        accept="image/*"
                        ref={ref}
                        onChange={handlePhotoChange}
                        onBlur={onBlur}
                    />
                    {label}
                </label>
                {error && <p className="text-red-500 text-xs text-center">{error.message}</p>}
            </div>

            {helperText && (
                <p className="text-[0.7rem] font-montserrat font-medium text-center text-gray-600 leading-snug">
                    {helperText}
                </p>
            )}
        </div>
    );
};

export default PhotoInput;
