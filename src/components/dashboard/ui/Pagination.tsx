"use client";

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (p: number) => void;
    totalItems: number;
    pageSize: number;
}

export default function Pagination({
    page,
    totalPages,
    onPageChange,
    totalItems,
    pageSize,
}: PaginationProps) {
    const from = (page - 1) * pageSize + 1;
    const to = Math.min(page * pageSize, totalItems);

    const pages: (number | "…")[] = [];
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        pages.push(1);
        if (page > 3) pages.push("…");
        for (
            let i = Math.max(2, page - 1);
            i <= Math.min(totalPages - 1, page + 1);
            i++
        )
            pages.push(i);
        if (page < totalPages - 2) pages.push("…");
        pages.push(totalPages);
    }

    return (
        <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-5 py-3 sm:flex-row">
            <p className="text-xs text-gray-500">
                Showing {from}–{to} of {totalItems} results
            </p>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                    className="rounded border border-gray-200 p-1.5 text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-40"
                >
                    <svg
                        className="h-3.5 w-3.5"
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
                </button>
                {pages.map((p, i) =>
                    p === "…" ? (
                        <span
                            key={`ellipsis-${i}`}
                            className="px-1 text-sm text-gray-400"
                        >
                            …
                        </span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onPageChange(p as number)}
                            className={`h-7 w-7 rounded text-xs font-medium transition-colors ${
                                p === page
                                    ? "bg-green-500 text-white"
                                    : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            {p}
                        </button>
                    ),
                )}
                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === totalPages}
                    className="rounded border border-gray-200 p-1.5 text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-40"
                >
                    <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}
