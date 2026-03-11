import Link from "next/link";

export function ErrorState({
    message,
    onRetry,
    backHref = "/dashboard/members",
    backLabel = "Back to Members",
}: {
    message?: string;
    onRetry: () => void;
    backHref?: string;
    backLabel?: string;
}) {
    return (
        <div className="mx-auto max-w-3xl pb-8">
            <Link
                href={backHref}
                className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-green-600"
            >
                <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
                {backLabel}
            </Link>

            <div className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 p-12 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                    <svg
                        className="h-7 w-7 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>
                <h2 className="mb-2 text-lg font-semibold text-gray-800">
                    Failed to load
                </h2>
                <p className="mb-6 max-w-sm text-sm text-gray-500">
                    {message ?? "Something went wrong. Please try again."}
                </p>
                <button
                    onClick={onRetry}
                    className="flex items-center gap-2 rounded-lg bg-red-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600 focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:outline-none"
                >
                    <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                    </svg>
                    Retry
                </button>
            </div>
        </div>
    );
}
