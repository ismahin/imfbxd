import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export interface Deposit {
	id: string;
	uuid: string;
	member_uuid: string;
	member_id?: string;
	member_name?: string;
	phone?: string;
	email?: string;
	amount: number;
	channel: string;
	date: string;
	deposit_date: string;
	status: "Completed" | "Pending" | "Failed";
	proof_image?: string;
	created_at?: string;
}

export interface DepositListResponse {
	count: number;
	next: string | null;
	previous: string | null;
	results: Deposit[];
}

export interface CreateDepositRequest {
	member_uuid: string;
	amount: number;
	channel: string;
	deposit_date: string;
	status?: "Completed" | "Pending" | "Failed";
	proof_image?: File;
}

export interface DepositStats {
	total_deposit: number;
	monthly_deposit: number;
	yearly_deposit: number;
}

const DEPOSITS_TAG = "Deposits" as const;
const DEPOSITS_STATS_TAG = "DepositsStats" as const;

function buildDepositFormData(body: Partial<CreateDepositRequest>) {
	const formData = new FormData();
	if (body.member_uuid != null) formData.append("member_uuid", body.member_uuid);
	if (body.amount != null) formData.append("amount", String(body.amount));
	if (body.channel != null) formData.append("channel", body.channel);
	if (body.deposit_date != null) formData.append("deposit_date", body.deposit_date);
	if (body.status != null) formData.append("status", body.status);
	if (body.proof_image) formData.append("proof_image", body.proof_image);
	return formData;
}

export const depositsApi = createApi({
	reducerPath: "depositsApi",
	baseQuery,
	tagTypes: [DEPOSITS_TAG, DEPOSITS_STATS_TAG],

	endpoints: (builder) => ({
		getDeposits: builder.query<
			DepositListResponse,
			{ limit?: number; offset?: number; member_uuid?: string } | void
		>({
			query: (params) => ({
				url: "api/web/v1/deposits/list/",
				params: {
					limit: params?.limit ?? 100,
					offset: params?.offset ?? 0,
					...(params?.member_uuid && { member_uuid: params.member_uuid }),
				},
			}),
			providesTags: (result, _err, arg) =>
				result
					? [
							...result.results.map((d) => ({ type: DEPOSITS_TAG, id: d.uuid })),
							{ type: DEPOSITS_TAG, id: arg?.member_uuid ? `MEMBER-${arg.member_uuid}` : "LIST" },
						]
					: [{ type: DEPOSITS_TAG, id: "LIST" }],
		}),

		getDepositStats: builder.query<DepositStats, void>({
			query: () => ({ url: "api/web/v1/deposits/stats/" }),
			providesTags: [{ type: DEPOSITS_STATS_TAG }],
		}),

		getDepositsByMember: builder.query<Deposit[], string>({
			query: (memberUuid) => ({
				url: "api/web/v1/deposits/list/",
				params: { member_uuid: memberUuid, limit: 500 },
			}),
			transformResponse: (response: DepositListResponse) => response.results ?? [],
			providesTags: (_result, _err, memberUuid) => [
				{ type: DEPOSITS_TAG, id: `MEMBER-${memberUuid}` },
				{ type: DEPOSITS_TAG, id: "LIST" },
			],
		}),

		createDeposit: builder.mutation<Deposit, CreateDepositRequest>({
			query: (body) => ({
				url: "api/web/v1/deposits/",
				method: "POST",
				body: buildDepositFormData(body),
			}),
			invalidatesTags: (result) => [
				{ type: DEPOSITS_TAG, id: "LIST" },
				{ type: DEPOSITS_STATS_TAG },
				...(result?.member_uuid ? [{ type: DEPOSITS_TAG, id: `MEMBER-${result.member_uuid}` }] : []),
			],
		}),

		updateDeposit: builder.mutation<
			Deposit,
			{ uuid: string; body: Partial<CreateDepositRequest> }
		>({
			query: ({ uuid, body }) => ({
				url: `api/web/v1/deposits/${uuid}/`,
				method: "PATCH",
				body: buildDepositFormData(body),
			}),
			invalidatesTags: (_result, _err, { uuid }) => [
				{ type: DEPOSITS_TAG, id: uuid },
				{ type: DEPOSITS_TAG, id: "LIST" },
				{ type: DEPOSITS_STATS_TAG },
			],
		}),

		deleteDeposit: builder.mutation<void, string>({
			query: (uuid) => ({
				url: `api/web/v1/deposits/${uuid}/`,
				method: "DELETE",
			}),
			invalidatesTags: (_result, _err, uuid) => [
				{ type: DEPOSITS_TAG, id: uuid },
				{ type: DEPOSITS_TAG, id: "LIST" },
				{ type: DEPOSITS_STATS_TAG },
			],
		}),
	}),
});

export const {
	useGetDepositsQuery,
	useGetDepositStatsQuery,
	useGetDepositsByMemberQuery,
	useCreateDepositMutation,
	useUpdateDepositMutation,
	useDeleteDepositMutation,
} = depositsApi;
