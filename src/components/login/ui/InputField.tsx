// ─── InputField Component ─────────────────────────────────────────────────────

export interface InputFieldProps {
	id: string;
	errorId: string;
	label: string;
	type: "email" | "text" | "password";
	value: string;
	error?: string;
	disabled?: boolean;
	placeholder?: string;
	autoComplete?: string;
	maxLength?: number;
	onChange: (value: string) => void;
	/** Optional slot for right-aligned content inside the input (e.g. show/hide button) */
	rightSlot?: React.ReactNode;
}

export function InputField({
	id,
	errorId,
	label,
	type,
	value,
	error,
	disabled,
	placeholder,
	autoComplete,
	maxLength,
	onChange,
	rightSlot,
}: InputFieldProps) {
	return (
		<div className="flex flex-col gap-1.5 sm:gap-2">
			<label
				htmlFor={id}
				className="text-sm font-medium text-gray-700 sm:text-base"
			>
				{label}
			</label>

			<div className="relative">
				<input
					id={id}
					type={type}
					value={value}
					disabled={disabled}
					placeholder={placeholder}
					autoComplete={autoComplete}
					maxLength={maxLength}
					aria-invalid={!!error}
					aria-describedby={error ? errorId : undefined}
					onChange={(e) => onChange(e.target.value)}
					className={[
						"w-full px-4 py-3 sm:px-5 sm:py-3.5 md:py-4",
						"bg-gray-100 text-sm text-gray-800 placeholder:text-gray-400 sm:text-base",
						"rounded-xl border-2 transition-all duration-200 outline-none sm:rounded-2xl",
						"disabled:cursor-not-allowed disabled:opacity-50",
						rightSlot ? "pr-16" : "",
						error
							? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-100"
							: "border-transparent focus:border-green-400 focus:bg-white focus:ring-2 focus:ring-green-100",
					]
						.filter(Boolean)
						.join(" ")}
				/>
				{rightSlot}
			</div>

			{/* Space always reserved — opacity transition prevents layout shift */}
			<p
				id={errorId}
				role="alert"
				aria-live="polite"
				aria-atomic="true"
				className={[
					"min-h-5 text-xs transition-all duration-200 sm:text-sm",
					error
						? "text-red-500 opacity-100"
						: "pointer-events-none select-none opacity-0",
				].join(" ")}
			>
				{error ?? "\u00A0"}
			</p>
		</div>
	);
}