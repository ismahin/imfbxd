// ─── ErrorBanner Component ────────────────────────────────────────────────────

interface ErrorBannerProps {
	message: string | null;
}

export function ErrorBanner({ message }: ErrorBannerProps) {
	return (
		<div
			role="alert"
			aria-live="assertive"
			aria-atomic="true"
			className={[
				"mb-4 rounded-xl border px-4 py-3 text-center text-xs sm:mb-5 sm:text-sm",
				"transition-all duration-300 ease-in-out",
				message
					? "border-red-200 bg-red-50 text-red-600 opacity-100"
					: "pointer-events-none select-none border-transparent opacity-0",
			].join(" ")}
		>
			{/* Non-breaking space keeps height stable when no error is present */}
			{message ?? "\u00A0"}
		</div>
	);
}