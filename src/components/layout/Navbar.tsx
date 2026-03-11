"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, LogOut, User } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

// 👇 Adjust these import paths to match your project
import type { RootState } from "@/store";
import { logout } from "@/store/slices/authSlice";
import Image from "next/image";
import { useGetSettingsQuery } from "@/store/services/settingsApi";

/* ─── Types ─────────────────────────────────────────────── */
interface AuthUser {
    uuid?: string | null;
    email?: string | null;
    name?: string | null;
    phone?: string | null;
    user_id?: string | null;
    account_number?: string | null;
    beneficiary_ref_id?: string | null;
    nominee_name?: string | null;
    nominee_phone?: string | null;
    current_address?: string | null;
    permanent_address?: string | null;
    nominee_address?: string | null;
    profile_picture?: string | null;
    user_type?: string | null;
    is_active?: boolean | null;
    created_at?: string | null;
    isAuthenticated: boolean;
    accessToken: string | null;
    refreshToken: string | null;
}

/* ─── Nav Links (public) ─────────────────────────────────── */
const publicNavLinks = [
    { href: "/", label: "Home" },
    { href: "/#projects", label: "Projects" },
    { href: "/#about", label: "About" },
    { href: "/#contact", label: "Contact" },
];

/* ─── Helpers ────────────────────────────────────────────── */
function getDashboardHref(userType?: string | null) {
    return userType === "Admin" ? "/dashboard" : "/member";
}

function getLogoUrl(path: string | undefined): string {
    if (!path) return "";
    const base = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_API_BASE_URL : "";
    if (!base) return path;
    return path.startsWith("http") ? path : `${base.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;
}

function getInitials(name?: string | null) {
    if (!name) return "U";
    return name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

/* ─── UserDropdown ───────────────────────────────────────── */
function UserDropdown({ user }: { user: AuthUser }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();
    const router = useRouter();

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function handleLogout() {
        setOpen(false);
        dispatch(logout());
        document.cookie = "accessToken=; path=/; max-age=0; SameSite=Strict";
        router.replace("/login");
    }

    return (
        <div ref={ref} className="relative">
            {/* Trigger */}
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#b4b4b4] px-3 py-1.5 transition-colors hover:bg-neutral-100"
            >
                {/* Avatar */}
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#34C759] text-xs font-bold text-white">
                    {getInitials(user.name)}
                </span>

                <span className="hidden max-w-30 truncate text-sm font-medium text-neutral-800 lg:flex lg:text-base">
                    {user.name && user.name.length > 7
                        ? `${user.name.slice(0, 7)}...`
                        : (user.name ?? "User")}
                </span>

                <ChevronDown
                    size={16}
                    className={`text-neutral-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
            </button>

            {/* Dropdown Panel */}
            {open && (
                <div className="absolute right-0 mt-2 w-52 origin-top-right animate-[fadeIn_0.15s_ease] rounded-xl border border-[#b4b4b4] bg-white shadow-lg">
                    {/* User info header */}
                    <div className="border-b border-[#b4b4b4] px-4 py-3">
                        <p className="truncate text-sm font-semibold text-neutral-800">
                            {user.name ?? "User"}
                        </p>
                        <p className="truncate text-xs text-neutral-500">
                            {user.email ?? ""}
                        </p>
                        {user.user_type && (
                            <span className="mt-1 inline-block rounded-full bg-[#34C759]/15 px-2 py-0.5 text-[11px] font-medium text-[#34C759]">
                                {user.user_type}
                            </span>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="p-1.5">
                        <Link
                            href={getDashboardHref(user.user_type)}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-100"
                        >
                            <User size={15} />
                            {user.user_type === "Admin"
                                ? "Dashboard"
                                : "My Profile"}
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-50"
                        >
                            <LogOut size={15} />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ─── Navbar ─────────────────────────────────────────────── */
export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { data: settings } = useGetSettingsQuery();

    // 👇 Adjust selector path to match your Redux state shape
    const user = useSelector((state: RootState) => state.auth) as AuthUser;
    const isAuthenticated = user?.isAuthenticated ?? false;

    const dashboardHref = getDashboardHref(user?.user_type);

    // console.log(user);

    return (
        <>
            <header className="bg-background/80 sticky top-0 z-40 w-full border-b border-[#b4b4b4] backdrop-blur-md">
                <div className="container mx-auto pl-3 sm:pl-0">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <Link
                            href="/"
                            className="text-lg font-bold tracking-tight flex items-center gap-2"
                        >
                            {settings?.primary_logo ? (
                                <img
                                    src={getLogoUrl(settings.primary_logo)}
                                    alt={settings.logo_alt_text || settings.logo_text || "IMF logo"}
                                    className="h-[50px] w-auto max-w-[120px] object-contain"
                                />
                            ) : (
                                <Image
                                    alt="imf_logo"
                                    src={"/assets/images/logo_imf.png"}
                                    width={77}
                                    height={50}
                                />
                            )}
                            {settings?.show_logo_text && settings?.logo_text && (
                                <span className="hidden text-lg font-semibold text-gray-800 sm:inline">{settings.logo_text}</span>
                            )}
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden items-center space-x-8 sm:space-x-10 md:flex md:space-x-12 lg:space-x-16">
                            {publicNavLinks.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="font-montserrat hover:text-primary focus:text-primary text-[16px] transition-colors focus:border-b-2 focus:border-[#34C759] focus:font-semibold lg:text-xl"
                                >
                                    {item.label}
                                </Link>
                            ))}

                            {/* Dashboard — only for authenticated users */}
                            {isAuthenticated && (
                                <Link
                                    href={dashboardHref}
                                    className="font-montserrat hover:text-primary text-[16px] transition-colors lg:text-xl"
                                >
                                    Dashboard
                                </Link>
                            )}
                        </nav>

                        {/* Right side: Login OR User Dropdown */}
                        <div className="hidden md:flex">
                            {isAuthenticated ? (
                                <UserDropdown user={user} />
                            ) : (
                                <button className="hover:text-secondary cursor-pointer rounded-xl bg-[#34C759] px-6 py-2 text-white hover:backdrop-opacity-60 lg:text-xl">
                                    <Link href="/login">Login</Link>
                                </button>
                            )}
                        </div>

                        {/* Mobile Hamburger */}
                        <button
                            onClick={() => setIsOpen(true)}
                            aria-label="Open menu"
                            className="p-2 md:hidden"
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="bg-background fixed inset-0 z-50 flex flex-col p-6 backdrop-blur-md md:hidden">
                    {/* Close Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={() => setIsOpen(false)}
                            aria-label="Close menu"
                            className="p-2"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Mobile Links */}
                    <div className="mt-8 flex flex-col space-y-6">
                        <nav className="flex flex-col space-y-4">
                            {publicNavLinks.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-base font-medium text-neutral-700 transition-colors hover:text-black"
                                >
                                    {item.label}
                                </Link>
                            ))}

                            {/* Dashboard — only for authenticated users */}
                            {isAuthenticated && (
                                <Link
                                    href={dashboardHref}
                                    onClick={() => setIsOpen(false)}
                                    className="text-base font-medium text-neutral-700 transition-colors hover:text-black"
                                >
                                    Dashboard
                                </Link>
                            )}
                        </nav>

                        {/* Divider */}
                        <div className="flex flex-col space-y-4 border-t pt-6">
                            {isAuthenticated ? (
                                <MobileUserPanel
                                    user={user}
                                    onClose={() => setIsOpen(false)}
                                />
                            ) : (
                                <Link href="/login">
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="hover:text-secondary w-full cursor-pointer rounded-xl bg-[#34C759] px-6 py-2 text-white hover:backdrop-opacity-60"
                                    >
                                        Login
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

/* ─── MobileUserPanel ────────────────────────────────────── */
function MobileUserPanel({
    user,
    onClose,
}: {
    user: AuthUser;
    onClose: () => void;
}) {
    const dispatch = useDispatch();
    const router = useRouter();

    function handleLogout() {
        onClose();
        dispatch(logout());
        document.cookie = "accessToken=; path=/; max-age=0; SameSite=Strict";
        router.push("/");
    }

    return (
        <div className="flex flex-col gap-3">
            {/* User info */}
            <div className="flex items-center gap-3 rounded-xl border border-[#b4b4b4] px-4 py-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#34C759] text-sm font-bold text-white">
                    {getInitials(user.name)}
                </span>
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-neutral-800">
                        {user.name ?? "User"}
                    </p>
                    <p className="truncate text-xs text-neutral-500">
                        {user.email ?? ""}
                    </p>
                </div>
            </div>

            {/* Logout */}
            <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-6 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-100"
            >
                <LogOut size={15} />
                Logout
            </button>
        </div>
    );
}
