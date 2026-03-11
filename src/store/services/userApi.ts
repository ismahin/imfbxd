import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";
import type { CreateUserRequest, Member, MemberList } from "../types/userApiTypes";

const USERS_TAG = "Users" as const;

export const userApi = createApi({
	reducerPath: "userApi",
	baseQuery,
	tagTypes: [USERS_TAG],

	endpoints: (builder) => ({
		// ── Queries ────────────────────────────────────────────────────

		getUsers: builder.query<MemberList, { limit?: number; offset?: number } | void>({
			query: (params) => ({
				url: "api/web/v1/users/list/",
				method: "GET",
				params: {
					limit: params?.limit ?? 100,
					offset: params?.offset ?? 0,
				},
			}),
			providesTags: (result) =>
				result
					? [
						...result.results.map(({ uuid }) => ({ type: USERS_TAG, id: uuid } as const)),
						{ type: USERS_TAG, id: "LIST" },
					]
					: [{ type: USERS_TAG, id: "LIST" }],
		}),

		getUserDetails: builder.query<Member, string>({
			query: (uuid) => ({
				url: `api/web/v1/users/${uuid}/`,
				method: "GET",
			}),
			providesTags: (_result, _error, uuid) => [{ type: USERS_TAG, id: uuid }],
		}),

		// ── Mutations ──────────────────────────────────────────────────

		createUser: builder.mutation<Member, CreateUserRequest>({
			query: (body) => ({
				url: "api/web/v1/users/",
				method: "POST",
				body,
			}),
			// Invalidate the list so it refetches with the new member
			invalidatesTags: [{ type: USERS_TAG, id: "LIST" }],
		}),

		updateUser: builder.mutation<Member, { uuid: string; body: Partial<CreateUserRequest> }>({
			query: ({ uuid, body }) => ({
				url: `api/web/v1/users/${uuid}/update/`,
				method: "PATCH",
				body,
			}),
			// Invalidate both the individual record and the list
			invalidatesTags: (_result, _error, { uuid }) => [
				{ type: USERS_TAG, id: uuid },
				{ type: USERS_TAG, id: "LIST" },
			],
		}),

		deleteUser: builder.mutation<void, string>({
			query: (uuid) => ({
				url: `api/web/v1/users/${uuid}/`,
				method: "DELETE",
			}),
			invalidatesTags: (_result, _error, uuid) => [
				{ type: USERS_TAG, id: uuid },
				{ type: USERS_TAG, id: "LIST" },
			],
		}),
	}),
});

export const {
	useGetUsersQuery,
	useGetUserDetailsQuery,
	useCreateUserMutation,
	useUpdateUserMutation,
	useDeleteUserMutation,
} = userApi;