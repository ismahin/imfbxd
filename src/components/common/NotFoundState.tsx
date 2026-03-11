import Link from "next/link";

export function NotFoundState({
    title = "Not found",
    description = "This record doesn't exist or may have been removed.",
    backHref = "/dashboard/members",
    backLabel = "Back to Members",
    icon,
}: {
    title?: string;
    description?: string;
    backHref?: string;
    backLabel?: string;
    icon?: React.ReactNode;
}) {
    return (
        <div className="mx-auto max-w-3xl pb-8">
            {backLabel && backHref && (
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
            )}

            <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 p-12 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-200">
                    {icon ?? (
                        <svg
                            className="h-7 w-7 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    )}
                </div>
                <h2 className="mb-2 text-lg font-semibold text-gray-800">
                    {title}
                </h2>
                <p className="mb-6 max-w-sm text-sm text-gray-500">
                    {description}
                </p>

                {backLabel && backHref && (
                    <Link
                        href={backHref}
                        className="rounded-lg bg-green-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-600 focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:outline-none"
                    >
                        {backLabel}
                    </Link>
                )}
            </div>
        </div>
    );
}
