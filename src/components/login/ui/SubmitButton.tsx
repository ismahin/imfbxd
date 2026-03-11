// ─── SubmitButton Component ───────────────────────────────────────────────────

interface SubmitButtonProps {
	isBusy: boolean;
	isLoadingProfile: boolean;
}

function Spinner() {
	return (
		<svg
			className="h-4 w-4 animate-spin text-white sm:h-5 sm:w-5"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			aria-hidden="true"
		>
			<circle
				className="opacity-25"
				cx="12"
				cy="12"
				r="10"
				stroke="currentColor"
				strokeWidth="4"
			/>
			<path
				className="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8v8H4z"
			/>
		</svg>
	);
}

export function SubmitButton({ isBusy, isLoadingProfile }: SubmitButtonProps) {
	const loadingLabel = isLoadingProfile ? "Loading profile…" : "Signing in…";

	return (
		<button
			type="submit"
			disabled={isBusy}
			className="border-black flex w-full items-center justify-center gap-2 rounded-xl bg-green-400 py-3 text-sm font-bold text-white shadow-md shadow-green-200 transition-colors duration-200 hover:bg-green-500 active:bg-green-600 disabled:cursor-not-allowed disabled:bg-green-300 sm:rounded-2xl sm:py-3.5 sm:text-base md:text-lg"
		>
			{isBusy ? (
				<>
					<Spinner />
					<span>{loadingLabel}</span>
				</>
			) : (
				"Sign in"
			)}
		</button>
	);
}