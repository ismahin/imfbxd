"use client";

import type { AppDispatch } from "@/store";
import { useLazyGetProfileQuery, useLoginMutation } from "@/store/services/authApi";
import type { ProfileResponse } from "@/store/types/authApiTypes";
import type { FieldErrors, ParsedServerError } from "@/types/LoginErrorParserTypes";
import { parseServerError } from "@/utils/LoginErrorParser";
import { validateLoginForm } from "@/utils/LoginValidation";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

// ─── Hook Return Type ─────────────────────────────────────────────────────────

export interface UseLoginFormReturn {
	email: string;
	password: string;
	showPassword: boolean;
	fieldErrors: FieldErrors;
	bannerMessage: string | null;
	isBusy: boolean;
	isLoadingProfile: boolean;
	handleEmailChange: (value: string) => void;
	handlePasswordChange: (value: string) => void;
	toggleShowPassword: () => void;
	handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useLoginForm(): UseLoginFormReturn {
	const router = useRouter();
	const dispatch = useDispatch<AppDispatch>();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
	// Errors outside RTK Query (profile fetch failure, missing token, etc.)
	const [runtimeBanner, setRuntimeBanner] = useState<string | null>(null);

	const [login, { isLoading, error: loginError, reset: resetLogin }] = useLoginMutation();
	const [getProfile, { isLoading: isLoadingProfile }] = useLazyGetProfileQuery();

	const isBusy = isLoading || isLoadingProfile;

	// ── Helpers ───────────────────────────────────────────────────────────────

	const clearFieldError = useCallback(
		(field: keyof FieldErrors) =>
			setFieldErrors((prev) => ({ ...prev, [field]: undefined })),
		[],
	);

	const dismissServerErrors = useCallback(() => {
		setRuntimeBanner(null);
		resetLogin();
	}, [resetLogin]);

	// ── Field handlers ────────────────────────────────────────────────────────

	const handleEmailChange = useCallback(
		(value: string) => {
			setEmail(value);
			clearFieldError("email");
			dismissServerErrors();
		},
		[clearFieldError, dismissServerErrors],
	);

	const handlePasswordChange = useCallback(
		(value: string) => {
			setPassword(value);
			clearFieldError("password");
			dismissServerErrors();
		},
		[clearFieldError, dismissServerErrors],
	);

	const toggleShowPassword = useCallback(
		() => setShowPassword((prev) => !prev),
		[],
	);

	// ── Submit ────────────────────────────────────────────────────────────────

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setFieldErrors({});
		setRuntimeBanner(null);

		// Step 1: Client-side validation
		const clientErrors = validateLoginForm(email, password);
		if (Object.keys(clientErrors).length > 0) {
			setFieldErrors(clientErrors);
			return;
		}

		try {
			// Step 2: Login request
			const result = await login({ email: email.trim(), password }).unwrap();

			if (!result?.access) {
				// Defensive: successful HTTP but token missing in response
				setRuntimeBanner("Login succeeded but no session was returned. Please try again.");
				return;
			} else {
				document.cookie = `accessToken=${result.access}; path=/; SameSite=Strict`;
			}

			// Step 3: Fetch user profile
			try {
				const profile: ProfileResponse = await getProfile().unwrap();
				router.replace(profile?.user_type === "Admin" ? "/dashboard" : "/member");
			} catch (profileError) {
				// Login worked but profile load failed — surface a specific message
				const { banner } = parseServerError(profileError);
				setRuntimeBanner(
					banner !== "Login failed. Please try again."
						? banner
						: "Signed in, but we couldn't load your profile. Please refresh the page.",
				);
			}
		} catch (error) {
			// Login error surfaces via `loginError` from RTK Query.
			// Field-level errors are derived from it below.
			console.log("error: ", error);
		}
	};

	// ── Derived error state ───────────────────────────────────────────────────

	const parsedLoginError: ParsedServerError | null = loginError
		? parseServerError(loginError)
		: null;

	// Server field errors merged under client field errors (client wins)
	const mergedFieldErrors: FieldErrors = {
		...parsedLoginError?.fields,
		...fieldErrors,
	};

	// Banner priority: runtime errors > RTK Query login errors
	const bannerMessage = runtimeBanner ?? parsedLoginError?.banner ?? null;

	return {
		email,
		password,
		showPassword,
		fieldErrors: mergedFieldErrors,
		bannerMessage,
		isBusy,
		isLoadingProfile,
		handleEmailChange,
		handlePasswordChange,
		toggleShowPassword,
		handleSubmit,
	};
}