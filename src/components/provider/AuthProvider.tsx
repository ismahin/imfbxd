"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

const skipAuth =
	typeof process !== "undefined" &&
	process.env.NEXT_PUBLIC_SKIP_AUTH === "true";

interface AuthProviderProps {
	children: React.ReactNode;
	requiredRole: "Admin" | "Member";
}

export function AuthProvider({ children, requiredRole }: AuthProviderProps) {
	const router = useRouter();
	const { isAuthenticated, user_type } = useSelector(
		(state: RootState) => state.auth
	);

	useEffect(() => {
		if (skipAuth) return;

		// Not logged in → go to login
		if (!isAuthenticated) {
			router.replace("/login");
			return;
		}

		// Wrong role → redirect to their correct page
		if (user_type !== requiredRole) {
			router.replace(user_type === "Admin" ? "/dashboard" : "/member");
		}
	}, [isAuthenticated, user_type, requiredRole, router]);

	// When skip-auth is on, always allow access; otherwise require matching auth/role
	if (!skipAuth && (!isAuthenticated || user_type !== requiredRole)) return null;

	return <>{children}</>;
}