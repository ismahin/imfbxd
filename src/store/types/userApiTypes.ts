export interface MemberList {
	count: number;
	next: string | null;
	previous: string | null;
	results: Member[];
}

export interface MemberReferral {
	uuid: string;
	user_id: string;
	name: string;
	phone?: string;
	email?: string;
}

export interface Member {
	uuid?: string;
	email?: string;
	name: string;
	phone?: string;
	nid_number?: string;
	date_of_birth?: string;
	user_id?: string;
	account_number?: string;
	beneficiary_ref_id?: string | null;
	nominee_name?: string;
	nominee_phone?: string;
	nominee_nid_number?: string;
	nominee_account_number?: string;
	nominee_date_of_birth?: string;
	current_address?: string;
	permanent_address?: string;
	nominee_address?: string;
	profile_picture?: string;
	user_type?: string;
	is_active?: boolean;
	joining_date?: string; // ISO date
	created_at?: string;   // ISO datetime
	total_deposits?: string;
	invest_amount?: string;
	referral_count?: number;
	referrals?: MemberReferral[];
}

export interface CreateUserRequest {
	email?: string;
	name?: string;
	password?: string;
	phone?: string;
	nid_number?: string;
	date_of_birth?: string;
	account_number?: string;
	nominee_name?: string;
	nominee_phone?: string;
	nominee_nid_number?: string;
	nominee_account_number?: string;
	nominee_date_of_birth?: string;
	permanent_address?: string;
	current_address?: string;
	nominee_address?: string;
	beneficiary_ref_id?: string;
	user_type?: string;
	joining_date?: string; // ISO date (YYYY-MM-DD)
	is_active?: boolean;
}
