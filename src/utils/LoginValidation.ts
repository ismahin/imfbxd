import type { FieldErrors } from "@/types/LoginFieldErrorTypes";

// ─── Constants ────────────────────────────────────────────────────────────────

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 128;
export const MAX_EMAIL_LENGTH = 254; // RFC 5321

// ─── Validator ────────────────────────────────────────────────────────────────

export function validateLoginForm(email: string, password: string): FieldErrors {
	const errors: FieldErrors = {};
	const trimmedEmail = email.trim();

	if (!trimmedEmail) {
		errors.email = "Email is required.";
	} else if (trimmedEmail.length > MAX_EMAIL_LENGTH) {
		errors.email = `Email must be under ${MAX_EMAIL_LENGTH} characters.`;
	} else if (!EMAIL_REGEX.test(trimmedEmail)) {
		errors.email = "Enter a valid email address.";
	}

	if (!password) {
		errors.password = "Password is required.";
	} else if (password.length < MIN_PASSWORD_LENGTH) {
		errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
	} else if (password.length > MAX_PASSWORD_LENGTH) {
		errors.password = `Password must be under ${MAX_PASSWORD_LENGTH} characters.`;
	}

	return errors;
}