import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export interface BoardMember {
	id: string;
	uuid: string;
	name: string;
	role: string;
	phone?: string;
	email?: string;
	since?: string;
	bio?: string;
	order: number;
	district?: string;
	profile_picture?: string;
	created_at?: string;
}

export interface BoardListResponse {
	count: number;
	next: string | null;
	previous: string | null;
	results: BoardMember[];
}

export interface CreateBoardMemberRequest {
	name: string;
	role: string;
	phone?: string;
	email?: string;
	since?: string;
	bio?: string;
	order?: number;
	district?: string;
	profile_picture?: File;
}

const BOARD_TAG = "Board" as const;

export const boardApi = createApi({
	reducerPath: "boardApi",
	baseQuery,
	tagTypes: [BOARD_TAG],

	endpoints: (builder) => ({
		getBoardMembers: builder.query<BoardListResponse, void>({
			query: () => ({ url: "api/web/v1/board/list/" }),
			providesTags: (result) =>
				result
					? [
							...result.results.map((m) => ({ type: BOARD_TAG, id: m.uuid })),
							{ type: BOARD_TAG, id: "LIST" },
						]
					: [{ type: BOARD_TAG, id: "LIST" }],
		}),

		getBoardMember: builder.query<BoardMember, string>({
			query: (uuid) => ({ url: `api/web/v1/board/${uuid}/` }),
			providesTags: (_result, _err, uuid) => [{ type: BOARD_TAG, id: uuid }],
		}),

		createBoardMember: builder.mutation<BoardMember, CreateBoardMemberRequest>({
			query: (body) => {
				const formData = new FormData();
				formData.append("name", body.name);
				formData.append("role", body.role);
				if (body.phone != null) formData.append("phone", body.phone);
				if (body.email != null) formData.append("email", body.email);
				if (body.since != null) formData.append("since", body.since);
				if (body.bio != null) formData.append("bio", body.bio);
				if (body.order != null) formData.append("order", String(body.order));
				if (body.district != null) formData.append("district", body.district);
				if (body.profile_picture) formData.append("profile_picture", body.profile_picture);
				return {
					url: "api/web/v1/board/",
					method: "POST",
					body: formData,
				};
			},
			invalidatesTags: [{ type: BOARD_TAG, id: "LIST" }],
		}),

		updateBoardMember: builder.mutation<
			BoardMember,
			{ uuid: string; body: Partial<CreateBoardMemberRequest>; profile_picture?: File }
		>({
			query: ({ uuid, body, profile_picture }) => {
				const formData = new FormData();
				if (body.name != null) formData.append("name", body.name);
				if (body.role != null) formData.append("role", body.role);
				if (body.phone !== undefined) formData.append("phone", body.phone ?? "");
				if (body.email !== undefined) formData.append("email", body.email ?? "");
				if (body.since !== undefined) formData.append("since", body.since ?? "");
				if (body.bio !== undefined) formData.append("bio", body.bio ?? "");
				if (body.order !== undefined) formData.append("order", String(body.order));
				if (body.district !== undefined) formData.append("district", body.district ?? "");
				if (profile_picture) formData.append("profile_picture", profile_picture);
				return {
					url: `api/web/v1/board/${uuid}/`,
					method: "PATCH",
					body: formData,
				};
			},
			invalidatesTags: (_result, _err, { uuid }) => [
				{ type: BOARD_TAG, id: uuid },
				{ type: BOARD_TAG, id: "LIST" },
			],
		}),

		deleteBoardMember: builder.mutation<void, string>({
			query: (uuid) => ({
				url: `api/web/v1/board/${uuid}/`,
				method: "DELETE",
			}),
			invalidatesTags: (_result, _err, uuid) => [
				{ type: BOARD_TAG, id: uuid },
				{ type: BOARD_TAG, id: "LIST" },
			],
		}),
	}),
});

export const {
	useGetBoardMembersQuery,
	useGetBoardMemberQuery,
	useCreateBoardMemberMutation,
	useUpdateBoardMemberMutation,
	useDeleteBoardMemberMutation,
} = boardApi;
