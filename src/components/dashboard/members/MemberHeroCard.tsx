"use client";

import { useState } from "react";
import Link from "next/link";

type ContactIconType = "id" | "phone" | "card" | "email" | "calendar";

const contactIcons: Record<ContactIconType, React.ReactNode> = {
    id: (
        <svg
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
            />
        </svg>
    ),
    phone: (
        <svg
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
        </svg>
    ),
    card: (
        <svg
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
        </svg>
    ),
    email: (
        <svg
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
        </svg>
    ),
    calendar: (
        <svg
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
        </svg>
    ),
};

function ContactItem({
    label,
    value,
    icon,
    breakAll,
}: {
    label: string;
    value?: string | null;
    icon: ContactIconType;
    breakAll?: boolean;
}) {
    return (
        <div>
            <p className="mb-0.5 flex items-center gap-1 text-xs text-gray-400">
                {contactIcons[icon]}
                {label}
            </p>
            {value ? (
                <p
                    className={`text-sm font-medium text-gray-700 ${breakAll ? "break-all" : ""}`}
                >
                    {value}
                </p>
            ) : (
                <p className="text-sm text-gray-400 italic">Not provided</p>
            )}
        </div>
    );
}

export interface MemberHeroCardProps {
    uuid?: string;
    name?: string;
    profilePicture?: string;
    userId?: string | number;
    phone?: string | null;
    nidNumber?: string | null;
    dateOfBirth?: string | null;
    accountNumber?: string | null;
    email?: string | null;
}

export function MemberHeroCard({
    uuid,
    name,
    profilePicture,
    userId,
    phone,
    nidNumber,
    dateOfBirth,
    accountNumber,
    email,
}: MemberHeroCardProps) {
    const [imgError, setImgError] = useState(false);

    const initials = name?.charAt(0)?.toUpperCase() ?? "?";

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                {/* Avatar */}
                <div className="shrink-0">
                    {!imgError && profilePicture ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={profilePicture}
                            alt={name}
                            onError={() => setImgError(true)}
                            className="h-24 w-24 rounded-2xl border-2 border-gray-100 object-cover shadow-sm"
                        />
                    ) : (
                        <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-gray-100 bg-green-100 text-3xl font-bold text-green-600">
                            {initials}
                        </div>
                    )}
                </div>

                {/* Name + meta */}
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <h1 className="text-xl font-bold tracking-tight text-gray-900 md:text-2xl">
                            {name}
                        </h1>
                        {uuid && (
                            <Link
                                href={`/dashboard/members/${uuid}/edit`}
                                className="hidden items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100"
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
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                </svg>
                                Edit
                            </Link>
                        )}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                        <ContactItem
                            label="User ID"
                            value={String(userId ?? "")}
                            icon="id"
                        />
                        <ContactItem
                            label="Mobile No."
                            value={phone}
                            icon="phone"
                        />
                        <ContactItem
                            label="NID Number"
                            value={nidNumber}
                            icon="id"
                        />
                        <ContactItem
                            label="Date of Birth"
                            value={dateOfBirth}
                            icon="calendar"
                        />
                        <ContactItem
                            label="Account No."
                            value={accountNumber}
                            icon="card"
                        />
                        <ContactItem
                            label="Email"
                            value={email}
                            icon="email"
                            breakAll
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
