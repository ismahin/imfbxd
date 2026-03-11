"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Sidebar from "@/components/dashboard/Sidebar";
import { AuthProvider } from "@/components/provider/AuthProvider";
import { logout } from "@/store/slices/authSlice";
import { LogOut } from "lucide-react";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const dispatch = useDispatch();
	const router = useRouter();

	function handleLogout() {
		dispatch(logout());
		document.cookie = "accessToken=; path=/; max-age=0; SameSite=Strict";
		router.replace("/login");
	}

	return (
		<AuthProvider requiredRole="Admin">
			<div className="flex min-h-screen bg-gray-50">
				<Sidebar
					mobileOpen={sidebarOpen}
					onClose={() => setSidebarOpen(false)}
					onLogout={handleLogout}
				/>

				{/* Main area — offset by sidebar on desktop */}
				<div className="flex min-h-screen flex-1 flex-col lg:ml-64">
					{/* Top bar */}
					<header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4 shadow-sm md:px-6">
						<div className="flex items-center gap-4">
							{/* Hamburger for mobile */}
							<button
								onClick={() => setSidebarOpen(true)}
								className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 lg:hidden"
								aria-label="Open sidebar"
							>
								<svg
									className="h-5 w-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 6h16M4 12h16M4 18h16"
									/>
								</svg>
							</button>
							<h1 className="text-xl font-semibold tracking-tight text-gray-800 md:text-2xl">
								Admin Panel
							</h1>
						</div>

						<div className="flex items-center gap-2 md:gap-3">
							{/* Notification bell */}
							<button className="relative hidden rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100">
								<svg
									className="h-5 w-5"
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
								<span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full border border-white bg-red-500" />
							</button>

							{/* Admin + Logout */}
							<div className="flex items-center gap-2 pl-2 md:gap-3 md:pl-3">
								<div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
									<svg
										className="h-4 w-4 text-green-600"
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
								</div>
								<span className="hidden text-sm font-medium text-gray-700 md:block">
									Admin
								</span>
								<button
									onClick={handleLogout}
									className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
									aria-label="Logout"
								>
									<LogOut className="h-4 w-4" />
									<span className="hidden sm:inline">Logout</span>
								</button>
							</div>
						</div>
					</header>

					{/* Page content */}
					<main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
				</div>
			</div>
		</AuthProvider>
	);
}
