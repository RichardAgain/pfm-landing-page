import type { InputHTMLAttributes } from "react";
import { Controller, type Control, type FieldError, type FieldPath, type FieldValues } from "react-hook-form";

interface Props<T extends FieldValues> extends Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "defaultValue" | "value"> {
    name: FieldPath<T>;
    control: Control<T>;
    label?: string;
    error?: FieldError;
    wrapperClassName?: string;
    labelClassName?: string;
    required?: boolean;
}

const InputForm = <T extends FieldValues,>({
    name,
    control,
    label,
    type = "text",
    error,
    className,
    wrapperClassName,
    labelClassName,
    required,
    ...rest
}: Props<T>) => {
    return (
        <div className={`flex flex-col gap-1 ${wrapperClassName ?? ""}`}>
<label htmlFor={name} className={labelClassName ?? "font-montserrat text-sm"}>
    {label}{required && <span className="text-red-500"> *</span>}
</label>

            <Controller
                name={name}
                control={control}
                defaultValue={"" as any}
                render={({ field }) => (
                    <input
                        {...field}
                        value={field.value ?? ""}
                        {...rest}
                        type={type}
                        className={`border p-0 ${error && "border-red-500"} ${className ?? ""}`}
                    />
                )}
            />
            {error && <p className="text-red-500 text-xs">{error.message}</p>}
        </div>
    );
};

export default InputForm;
