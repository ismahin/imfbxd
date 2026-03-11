// ─── Login Feature — Shared Types ────────────────────────────────────────────

export interface FieldErrors {
	email?: string;
	password?: string;
}

export interface ParsedServerError {
	/** Top-level message shown in the error banner */
	banner: string;
	/** Field-level messages merged into inline input errors */
	fields: FieldErrors;
}

// ─── API Error Envelope ───────────────────────────────────────────────────────
//
// The server returns one of two shapes depending on `type`:
//
// non_field_error (e.g. wrong credentials):
//   {
//     success: false,
//     code: 401,
//     type: "non_field_error",
//     error_message: "Incorrect authentication credentials.",
//     details: {
//       exception: "AuthenticationFailed",
//       message: "No active account found with the given credentials",
//       code: "no_active_account"
//     }
//   }
//
// field_error (e.g. blank fields):
//   {
//     success: false,
//     code: 400,
//     type: "field_error",
//     error_message: "Invalid input.",
//     details: [
//       { field: "email",    errors: ["This field may not be blank."] },
//       { field: "password", errors: ["This field may not be blank."] }
//     ]
//   }

export type ApiErrorType = "field_error" | "non_field_error";

export interface ApiFieldErrorDetail {
	field: keyof FieldErrors;
	errors: string[];
}

export interface ApiNonFieldErrorDetail {
	exception?: string;
	message?: string;
	code?: string;
}

interface ApiErrorBodyBase {
	success: false;
	code: number;
	error_message?: string;
}

export interface ApiFieldErrorBody extends ApiErrorBodyBase {
	type: "field_error";
	details: ApiFieldErrorDetail[];
}

export interface ApiNonFieldErrorBody extends ApiErrorBodyBase {
	type: "non_field_error";
	details: ApiNonFieldErrorDetail;
}

export type ApiErrorBody = ApiFieldErrorBody | ApiNonFieldErrorBody;