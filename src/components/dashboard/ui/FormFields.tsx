interface FormFieldProps {
    label: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
}

export function FormField({
    label,
    required,
    error,
    children,
}: FormFieldProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
                {label}
                {required && <span className="ml-0.5 text-red-500">*</span>}
            </label>
            {children}
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}

const inputClass =
    "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition-colors bg-white placeholder:text-gray-400";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={`${inputClass} ${props.className ?? ""}`}
        />
    );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <select
            {...props}
            className={`${inputClass} ${props.className ?? ""}`}
        />
    );
}

export function Textarea(
    props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
    return (
        <textarea
            {...props}
            className={`${inputClass} resize-none ${props.className ?? ""}`}
        />
    );
}

export function SubmitButton({
    loading,
    label,
    loadingLabel = "Saving…",
}: {
    loading?: boolean;
    label: string;
    loadingLabel?: string;
}) {
    return (
        <div className="mt-2 flex justify-end gap-3 border-t border-gray-100 pt-4">
            <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-green-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-green-200 transition-colors hover:bg-green-600 disabled:opacity-60"
            >
                {loading ? loadingLabel : label}
            </button>
        </div>
    );
}
