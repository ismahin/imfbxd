import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from ".";

export const baseQuery = fetchBaseQuery({
	baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
	prepareHeaders: (headers, { getState }) => {
		const token = (getState() as RootState).auth.accessToken;

		if (token) {
			headers.set("Authorization", `Bearer ${token}`);
		}

		return headers;
	},
})