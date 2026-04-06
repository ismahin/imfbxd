import { createSlice } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";
import type { ProfileResponse, LoginResponse } from "../types/authApiTypes";
import { authApi } from "../services/authApi";

const defaultInitialState: ProfileResponse = {
	uuid: null,
	email: null,
	name: null,
	phone: null,
	nid_number: null,
	date_of_birth: null,
	user_id: null,
	account_number: null,
	beneficiary_ref_id: null,
	nominee_name: null,
	nominee_phone: null,
	nominee_nid_number: null,
	nominee_account_number: null,
	nominee_date_of_birth: null,
	current_address: null,
	permanent_address: null,
	nominee_address: null,
	profile_picture: null,
	user_type: null,
	is_active: false,
	created_at: null,
	isAuthenticated: false,
	accessToken: null,
	refreshToken: null,
};

// When skip-auth is enabled (e.g. no backend), act as logged-in Admin so you can open the dashboard
const skipAuth =
	typeof process !== "undefined" &&
	process.env.NEXT_PUBLIC_SKIP_AUTH === "true";

const initialState: ProfileResponse = skipAuth
	? {
			...defaultInitialState,
			isAuthenticated: true,
			user_type: "Admin",
			name: "Dev Admin",
			email: "admin@dev.local",
	  }
	: defaultInitialState;

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		logout: () => defaultInitialState,
	},
	extraReducers: (builder) => {
		builder.addMatcher(
			authApi.endpoints.login.matchFulfilled,
			(state, action) => {
				state.isAuthenticated = true;
				state.accessToken = action.payload.access;
				state.refreshToken = action.payload.refresh;
			}
		);

		builder.addMatcher(
			authApi.endpoints.getProfile.matchFulfilled,
			(state, action) => {
				state.uuid = action.payload.uuid;
				state.email = action.payload.email;
				state.name = action.payload.name;
				state.phone = action.payload.phone;
				state.nid_number = action.payload.nid_number;
				state.date_of_birth = action.payload.date_of_birth;
				state.user_id = action.payload.user_id;
				state.account_number = action.payload.account_number;
				state.beneficiary_ref_id = action.payload.beneficiary_ref_id;
				state.nominee_name = action.payload.nominee_name;
				state.nominee_phone = action.payload.nominee_phone;
				state.nominee_nid_number = action.payload.nominee_nid_number;
				state.nominee_account_number = action.payload.nominee_account_number;
				state.nominee_date_of_birth = action.payload.nominee_date_of_birth;
				state.current_address = action.payload.current_address;
				state.permanent_address = action.payload.permanent_address;
				state.nominee_address = action.payload.nominee_address;
				state.profile_picture = action.payload.profile_picture;
				state.user_type = action.payload.user_type;
				state.is_active = action.payload.is_active;
				state.created_at = action.payload.created_at;
			}
		)
		// When skip-auth is on, keep dev-admin state even after rehydration from localStorage
		.addMatcher(
			(action): action is { type: string } => action.type === REHYDRATE,
			(state) => {
				if (skipAuth) {
					state.isAuthenticated = true;
					state.user_type = "Admin";
					state.name = "Dev Admin";
					state.email = "admin@dev.local";
				}
			}
		);
	},
});

export const { logout } = authSlice.actions;


