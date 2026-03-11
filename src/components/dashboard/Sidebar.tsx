"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { useGetSettingsQuery } from "@/store/services/settingsApi";

function getLogoUrl(path: string | undefined): string {
	if (!path) return "";
	const base = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_API_BASE_URL : "";
	if (!base) return path;
	return path.startsWith("http") ? path : `${base.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;
}

const NAV_ITEMS = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: (
            <svg
                className="h-[17px] w-[17px]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
            </svg>
        ),
    },
    {
        label: "Members Management",
        href: "/dashboard/members",
        icon: (
            <svg
                className="h-[17px] w-[17px]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
            </svg>
        ),
    },
    {
        label: "Deposit Management",
        href: "/dashboard/deposits",
        icon: (
            <svg
                className="h-[17px] w-4.25"
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
    },
    {
        label: "Content Management",
        href: "/dashboard/content",
        icon: (
            <svg
                className="h-[17px] w-[17px]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
            </svg>
        ),
    },
    {
        label: "Gallery Management",
        href: "/dashboard/gallery",
        icon: (
            <svg
                className="h-[17px] w-[17px]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
            </svg>
        ),
    },
    {
        label: "Board Management",
        href: "/dashboard/board",
        icon: (
            <svg
                className="h-[17px] w-[17px]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
            </svg>
        ),
    },
    {
        label: "Messages",
        href: "/dashboard/messages",
        icon: (
            <svg
                className="h-[17px] w-[17px]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
            </svg>
        ),
    },
    {
        label: "Send Notifications",
        href: "/dashboard/notifications",
        icon: (
            <svg
                className="h-[17px] w-[17px]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
            </svg>
        ),
    },
    {
        label: "Logo Settings",
        href: "/dashboard/logo",
        icon: (
            <svg
                className="h-[17px] w-[17px]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
            </svg>
        ),
    },
    {
        label: "Settings",
        href: "/dashboard/settings",
        icon: (
            <svg
                className="h-[17px] w-[17px]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
            </svg>
        ),
    },
];

interface SidebarProps {
    mobileOpen: boolean;
    onClose: () => void;
    onLogout?: () => void;
}

function NavLinks({ onClose }: { onClose?: () => void }) {
    const pathname = usePathname();

    return (
        <nav className="flex-1 overflow-y-auto py-3">
            {NAV_ITEMS.map(({ label, href, icon }) => {
                const isActive = pathname === href;
                return (
                    <Link
                        key={href}
                        href={href}
                        onClick={onClose}
                        className={`mx-2 mb-0.5 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                            isActive
                                ? "bg-green-500 text-white shadow-sm"
                                : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                        }`}
                    >
                        <span
                            className={
                                isActive ? "text-white" : "text-gray-400"
                            }
                        >
                            {icon}
                        </span>
                        {label}
                    </Link>
                );
            })}
        </nav>
    );
}

export default function Sidebar({ mobileOpen, onClose, onLogout }: SidebarProps) {
    const { data: settings } = useGetSettingsQuery();
    const logoUrl = settings?.primary_logo ? getLogoUrl(settings.primary_logo) : null;
    const logoLabel = settings?.show_logo_text && settings?.logo_text ? settings.logo_text : (settings?.org_name || "IMF Foundation");

    return (
        <>
            {/* ── Desktop sidebar ─────────────────────────────────────── */}
            <aside className="fixed top-0 left-0 z-30 hidden min-h-screen w-64 flex-col border-r border-gray-200 bg-white lg:flex">
                {/* Logo */}
                <Link
                    href={"/"}
                    className="flex shrink-0 items-center gap-3 border-b border-gray-100 px-4 py-4"
                >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm">
                        {logoUrl ? (
                            <img src={logoUrl} alt={settings?.logo_alt_text || logoLabel} className="h-full w-full object-contain" />
                        ) : (
                            <span className="text-xs font-bold text-gray-500">IMF</span>
                        )}
                    </div>
                    <span className="text-sm font-semibold tracking-wide text-gray-700 truncate">
                        {logoLabel}
                    </span>
                </Link>

                <div className="min-h-0 flex-1 overflow-y-auto">
                    <NavLinks />
                </div>

                <div className="mt-auto border-t border-gray-100 px-4 py-3">
                    {onLogout && (
                        <button
                            onClick={onLogout}
                            className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 hover:text-red-700"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    )}
                    <p className="text-center text-xs text-gray-400">
                        © 2026 IMF Admin
                    </p>
                </div>
            </aside>

            {/* ── Mobile overlay ───────────────────────────────────────── */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* ── Mobile sidebar ───────────────────────────────────────── */}
            <aside
                className={`fixed top-0 left-0 z-50 flex h-full w-64 transform flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                {/* Logo + close */}
                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
                    <Link href={"/"} className="flex items-center gap-3 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm">
                            {logoUrl ? (
                                <img src={logoUrl} alt={settings?.logo_alt_text || logoLabel} className="h-full w-full object-contain" />
                            ) : (
                                <span className="text-xs font-bold text-gray-500">IMF</span>
                            )}
                        </div>
                        <span className="text-sm font-semibold text-gray-700 truncate">
                            {logoLabel}
                        </span>
                    </Link>

                    <button
                        onClick={onClose}
                        className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                        aria-label="Close sidebar"
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
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <NavLinks onClose={onClose} />

                <div className="mt-auto border-t border-gray-100 px-4 py-3">
                    {onLogout && (
                        <button
                            onClick={() => { onLogout(); onClose(); }}
                            className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 hover:text-red-700"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    )}
                    <p className="text-center text-xs text-gray-400">
                        © 2026 IMF Admin
                    </p>
                </div>
            </aside>
        </>
    );
}
