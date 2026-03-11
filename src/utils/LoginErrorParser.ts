import type {
	ApiErrorBody,
	ApiFieldErrorBody,
	ApiNonFieldErrorBody,
	FieldErrors,
	ParsedServerError,
} from "@/types/LoginErrorParserTypes";

// ─── HTTP Status → Human Message ─────────────────────────────────────────────

const HTTP_STATUS_MESSAGES: Record<number, string> = {
	400: "The request was invalid. Please check your details.",
	401: "Incorrect email or password.",
	403: "Your account doesn't have permission to access this.",
	404: "Account not found. Please check your email.",
	409: "A conflict occurred. Please try again.",
	422: "The submitted data was invalid.",
	429: "Too many attempts. Please wait a moment and try again.",
	500: "Server error. Please try again later.",
	502: "Service temporarily unavailable. Please try again.",
	503: "Service is down for maintenance. Please try again later.",
	504: "Request timed out. Please check your connection and try again.",
};

// ─── RTK Query Non-HTTP Status → Human Message ───────────────────────────────

const RTK_STATUS_MESSAGES: Record<string, string> = {
	FETCH_ERROR:
		"Network error. Ensure your backend is running and NEXT_PUBLIC_API_BASE_URL is correct (e.g. http://localhost:8000). Or set NEXT_PUBLIC_SKIP_AUTH=true in .env.local to use the app without a backend.",
	TIMEOUT_ERROR: "Request timed out. Check that the backend is running and reachable.",
	PARSING_ERROR:
		"Unexpected response from server. If using a separate backend, set NEXT_PUBLIC_API_BASE_URL in .env.local (e.g. http://localhost:8000) and ensure the login API returns JSON.",
	CUSTOM_ERROR: "An unexpected error occurred. Please try again.",
};

// ─── Type Guards ──────────────────────────────────────────────────────────────

function isApiErrorBody(data: unknown): data is ApiErrorBody {
	return (
		typeof data === "object" &&
		data !== null &&
		"success" in data &&
		(data as ApiErrorBody).success === false &&
		"type" in data
	);
}

function isFieldError(body: ApiErrorBody): body is ApiFieldErrorBody {
	return body.type === "field_error" && Array.isArray(body.details);
}

function isNonFieldError(body: ApiErrorBody): body is ApiNonFieldErrorBody {
	return body.type === "non_field_error" && typeof body.details === "object";
}

// ─── Per-type Parsers ─────────────────────────────────────────────────────────

function parseFieldError(body: ApiFieldErrorBody): ParsedServerError {
	const fields: FieldErrors = {};

	for (const item of body.details) {
		// Only surface the first error message per field
		if (item.field === "email" && item.errors.length > 0) {
			fields.email = item.errors[0];
		}
		if (item.field === "password" && item.errors.length > 0) {
			fields.password = item.errors[0];
		}
	}

	const banner =
		Object.keys(fields).length > 0
			? "Please correct the errors below."
			: (body.error_message ?? "Invalid input. Please try again.");

	return { banner, fields };
}

function parseNonFieldError(body: ApiNonFieldErrorBody): ParsedServerError {
	// Prefer the nested details.message — it's more descriptive than error_message.
	// e.g. "No active account found with the given credentials" > "Incorrect authentication credentials."
	const banner =
		body.details?.message ??
		body.error_message ??
		HTTP_STATUS_MESSAGES[body.code] ??
		"Login failed. Please try again.";

	return { banner, fields: {} };
}

// ─── Main Parser ──────────────────────────────────────────────────────────────

const FALLBACK: ParsedServerError = {
	banner: "Login failed. Please try again.",
	fields: {},
};

export function parseServerError(error: unknown): ParsedServerError {
	if (!error || typeof error !== "object") return FALLBACK;

	const err = error as { status?: unknown; data?: unknown };

	// 1. RTK Query string statuses (no response body)
	if (typeof err.status === "string") {
		const message = RTK_STATUS_MESSAGES[err.status];
		if (message) return { banner: message, fields: {} };
	}

	// 2. Parse structured API error body [ this is needed on the developement time]
	// if (isApiErrorBody(err.data)) {
	// 	const body = err.data;

	// 	if (isFieldError(body)) return parseFieldError(body);
	// 	if (isNonFieldError(body)) return parseNonFieldError(body);
	// }

	// 3. Fall back to HTTP status code (body was missing or unrecognised shape)
	if (typeof err.status === "number") {
		const banner =
			HTTP_STATUS_MESSAGES[err.status] ?? `Error ${err.status}. Please try again.`;
		return { banner, fields: {} };
	}

	return FALLBACK;
}