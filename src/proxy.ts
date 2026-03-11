import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/dashboard", "/member"];
const LOGIN_ROUTE = "/login";

const skipAuth = process.env.NEXT_PUBLIC_SKIP_AUTH === "true";

export default function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const isProtected = PROTECTED_ROUTES.some((route) =>
		pathname.startsWith(route)
	);

	if (!isProtected) return NextResponse.next();

	if (skipAuth) return NextResponse.next();

	// redux-persist stores state as JSON in localStorage, but since middleware
	// runs on the edge (no localStorage), we use a cookie-based token instead.
	const token = request.cookies.get("accessToken")?.value;

	if (!token) {
		return NextResponse.redirect(new URL(LOGIN_ROUTE, request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard/:path*", "/member/:path*"],
};