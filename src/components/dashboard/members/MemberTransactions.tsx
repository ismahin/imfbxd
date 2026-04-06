"use client";

import { useEffect, useState } from "react";
import { SectionHeading } from "@/components/common";
import Pagination from "@/components/dashboard/ui/Pagination";

export interface Transaction {
    id: string;
    date: string;
    amount: string;
    channel: string;
    status: "Completed" | "Pending" | "Failed";
}

const statusStyles: Record<Transaction["status"], string> = {
    Completed: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Failed: "bg-red-100 text-red-600",
};

const TRANSACTIONS_PAGE_SIZE = 10;

function EmptyTransactions() {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <svg
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                </svg>
            </div>
            <p className="text-sm font-medium text-gray-600">
                No transactions yet
            </p>
            <p className="mt-1 text-xs text-gray-400">
                Transactions will appear here once activity begins.
            </p>
        </div>
    );
}

export function MemberTransactions({
    transactions,
}: {
    transactions: Transaction[];
}) {
    const [page, setPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(transactions.length / TRANSACTIONS_PAGE_SIZE));
    const paginatedTransactions = transactions.slice(
        (page - 1) * TRANSACTIONS_PAGE_SIZE,
        page * TRANSACTIONS_PAGE_SIZE,
    );

    useEffect(() => {
        setPage((current) => Math.min(current, totalPages));
    }, [totalPages]);

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
            <SectionHeading
                title="Transaction History"
                icon={
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
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                    </svg>
                }
            />

            {transactions.length === 0 ? (
                <EmptyTransactions />
            ) : (
                <div className="overflow-hidden rounded-xl border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-green-500 text-white">
                                    <th className="px-5 py-3 text-left text-sm font-medium">
                                        Date
                                    </th>
                                    <th className="px-5 py-3 text-left text-sm font-medium">
                                        Amount
                                    </th>
                                    <th className="px-5 py-3 text-left text-sm font-medium">
                                        Channel
                                    </th>
                                    <th className="hidden px-5 py-3 text-left text-sm font-medium sm:table-cell">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedTransactions.map((tx, i) => (
                                    <tr
                                        key={tx.id}
                                        className={`border-t border-green-100 transition-colors hover:bg-green-50/60 ${
                                            i % 2 === 0
                                                ? "bg-green-50/30"
                                                : "bg-white"
                                        }`}
                                    >
                                        <td className="px-5 py-3 text-gray-700">
                                            {tx.date}
                                        </td>
                                        <td className="px-5 py-3 font-medium text-gray-800">
                                            {tx.amount}
                                        </td>
                                        <td className="px-5 py-3 text-gray-600">
                                            {tx.channel}
                                        </td>
                                        <td className="hidden px-5 py-3 sm:table-cell">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[tx.status]}`}
                                            >
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {transactions.length > TRANSACTIONS_PAGE_SIZE && (
                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                            totalItems={transactions.length}
                            pageSize={TRANSACTIONS_PAGE_SIZE}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
