export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse {
	access: string;
	refresh: string
}

export interface ProfileResponse {
	uuid?: string | null,
	email?: string | null,
	name?: string | null,
	phone?: string | null,
	nid_number?: string | null,
	date_of_birth?: string | null,
	user_id?: string | null,
	account_number?: string | null,
	beneficiary_ref_id?: string | null,
	nominee_name?: string | null,
	nominee_phone?: string | null,
	nominee_nid_number?: string | null,
	nominee_account_number?: string | null,
	nominee_date_of_birth?: string | null,
	current_address?: string | null,
	permanent_address?: string | null,
	nominee_address?: string | null,
	profile_picture?: string | null,
	user_type?: string | null,
	is_active?: boolean | null,
	created_at?: string | null,
	isAuthenticated: boolean;
	accessToken: string | null;
	refreshToken: string | null;
}
