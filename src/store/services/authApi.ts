import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { LoginRequest, LoginResponse, ProfileResponse } from "../types/authApiTypes";
import type { RootState } from "..";
import { baseQuery } from "../baseQuery";

export const authApi = createApi({
	reducerPath: "authApi",
	baseQuery: baseQuery,

	endpoints: (builder) => ({
		login: builder.mutation<LoginResponse, LoginRequest>({
			query: (credentials) => ({
				url: "api/web/v1/authentication/login/",
				method: "POST",
				body: credentials,
			}),
			// Accept both { access, refresh } and { access_token, refresh_token }
			transformResponse: (raw: unknown): LoginResponse => {
				const data = raw as Record<string, unknown>;
				return {
					access: (data.access ?? data.access_token) as string,
					refresh: (data.refresh ?? data.refresh_token) as string,
				};
			},
		}),

		getProfile: builder.query<ProfileResponse, void>({
			query: () => ({
				url: `api/web/v1/users/me/`,
				method: "GET",
			})
		})
	}),
});

export const { useLoginMutation, useGetProfileQuery, useLazyGetProfileQuery } = authApi;