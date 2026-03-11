"use client";

import { useEffect, useRef, useState } from "react";

interface SearchBarProps {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
}

export function SearchBar({
    value,
    onChange,
    placeholder = "Search…",
}: SearchBarProps) {
    return (
        <div className="relative max-w-sm flex-1">
            <svg
                className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
            </svg>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pr-4 pl-9 text-sm focus:border-green-400 focus:ring-2 focus:ring-green-200 focus:outline-none"
            />
        </div>
    );
}

interface AddButtonProps {
    onClick: () => void;
    label: string;
}

export function AddButton({ onClick, label }: AddButtonProps) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2.5 text-sm font-medium whitespace-nowrap text-white shadow-sm shadow-green-200 transition-colors hover:bg-green-600"
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
                    d="M12 4v16m8-8H4"
                />
            </svg>
            {label}
        </button>
    );
}

export function StatusBadge({ status }: { status: string }) {
    // console.log(status);

    const styles: Record<string, string> = {
        Active: "bg-green-100 text-green-700",
        Inactive: "bg-gray-100 text-gray-600",
        // Pending: "bg-yellow-100 text-yellow-700",
        // Completed: "bg-green-100 text-green-700",
        // Failed: "bg-red-100 text-red-600",
        // Published: "bg-blue-100 text-blue-700",
        // Draft: "bg-gray-100 text-gray-600",
    };
    return (
        <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                styles[status] ?? "bg-gray-100 text-gray-600"
            }`}
        >
            {status}
        </span>
    );
}

export function ActionMenu({
    onEdit,
    onDelete,
    onDeactivate,
    isActive = true,
}: {
    onEdit: () => void;
    onDelete?: () => void;
    onDeactivate?: () => void;
    isActive?: boolean;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen((p) => !p)}
                className="rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                title="Actions"
                aria-expanded={open}
                aria-haspopup="true"
            >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
            </button>
            {open && (
                <div className="absolute right-0 top-full z-10 mt-1 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                    <button
                        type="button"
                        onClick={() => {
                            onEdit();
                            setOpen(false);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    >
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                    </button>
                    {onDeactivate && (
                        <button
                            type="button"
                            onClick={() => {
                                onDeactivate();
                                setOpen(false);
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            {isActive ? "De-activate" : "Activate"}
                        </button>
                    )}
                    {onDelete && (
                        <button
                            type="button"
                            onClick={() => {
                                onDelete();
                                setOpen(false);
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export function TableWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">{children}</div>
        </div>
    );
}

export function Th({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <th
            className={`bg-gray-50 px-5 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase ${className}`}
        >
            {children}
        </th>
    );
}

export function Td({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <td className={`px-5 py-4 text-sm text-gray-700 ${className}`}>
            {children}
        </td>
    );
}
