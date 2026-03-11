"use client";

import { useLoginForm } from "@/hooks/login/useLoginForm";
import { useId } from "react";
import { ErrorBanner } from "@/components/login/ui/ErrorBanner";
import { InputField } from "@/components/login/ui/InputField";
import { MAX_EMAIL_LENGTH, MAX_PASSWORD_LENGTH } from "@/utils/LoginValidation";
import { SubmitButton } from "./ui/SubmitButton";

// ─── Login Page ───────────────────────────────────────────────────────────────

export default function Login() {
	const uid = useId(); // Stable, SSR-safe ID prefix
	const ids = {
		email: `${uid}-email`,
		emailError: `${uid}-email-error`,
		password: `${uid}-password`,
		passwordError: `${uid}-password-error`,
	};

	const {
		email,
		password,
		showPassword,
		fieldErrors,
		bannerMessage,
		isBusy,
		isLoadingProfile,
		handleEmailChange,
		handlePasswordChange,
		toggleShowPassword,
		handleSubmit,
	} = useLoginForm();

	return (
		<div className="bg-background flex flex-1 items-center justify-center p-4 sm:p-6 md:p-8">
			<div className="xs:max-w-sm w-full max-w-[320px] rounded-2xl border border-gray-100 bg-white p-6 shadow-lg sm:max-w-md sm:rounded-3xl">

				{/* Header */}
				<div className="mb-6 text-center">
					<h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
						User Login
					</h1>
					<p className="mt-2 text-sm font-light text-gray-400 sm:mt-3 sm:text-base">
						Sign in to your account
					</p>
				</div>

				{/* Server / runtime error banner */}
				<ErrorBanner message={bannerMessage} />

				{/* Form */}
				<form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
					{/* Email */}
					<InputField
						id={ids.email}
						errorId={ids.emailError}
						label="Email"
						type="email"
						value={email}
						error={fieldErrors.email}
						disabled={isBusy}
						autoComplete="email"
						maxLength={MAX_EMAIL_LENGTH}
						onChange={handleEmailChange}
					/>

					{/* Password */}
					<InputField
						id={ids.password}
						errorId={ids.passwordError}
						label="Password"
						type={showPassword ? "text" : "password"}
						value={password}
						error={fieldErrors.password}
						disabled={isBusy}
						placeholder="••••••••"
						autoComplete="current-password"
						maxLength={MAX_PASSWORD_LENGTH}
						onChange={handlePasswordChange}
						rightSlot={
							<button
								type="button"
								onClick={toggleShowPassword}
								aria-label={showPassword ? "Hide password" : "Show password"}
								aria-pressed={showPassword}
								className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-gray-400 transition-colors select-none hover:text-gray-600 sm:right-4 sm:text-sm"
							>
								{showPassword ? "Hide" : "Show"}
							</button>
						}
					/>

					{/* Forgot password */}
					<div className="hidden -mt-1 justify-end">
						<a
							href="/forgot-password"
							className="text-xs text-green-500 transition-colors hover:text-green-700 sm:text-sm"
						>
							Forgot password?
						</a>
					</div>

					{/* Submit */}
					<SubmitButton isBusy={isBusy} isLoadingProfile={isLoadingProfile} />
				</form>

				{/* Footer */}
				<p className="hidden mt-5 text-center text-xs text-gray-400 sm:mt-6 sm:text-sm">
					Not a member?{" "}
					<a
						href="/register"
						className="font-medium text-green-500 transition-colors hover:text-green-700"
					>
						Create an account
					</a>
				</p>
			</div>
		</div>
	);
}