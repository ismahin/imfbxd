import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export interface ContactMessage {
	id: string;
	uuid: string;
	name: string;
	email: string;
	website?: string;
	message: string;
	created_at?: string;
}

export interface MessagesListResponse {
	count: number;
	next: string | null;
	previous: string | null;
	results: ContactMessage[];
}

export interface SubmitMessageRequest {
	name: string;
	email: string;
	website?: string;
	message: string;
}

const MESSAGES_TAG = "Messages" as const;

export const messagesApi = createApi({
	reducerPath: "messagesApi",
	baseQuery,
	tagTypes: [MESSAGES_TAG],

	endpoints: (builder) => ({
		getMessages: builder.query<MessagesListResponse, { limit?: number; offset?: number } | void>({
			query: (params) => ({
				url: "api/web/v1/messages/list/",
				params: { limit: params?.limit ?? 100, offset: params?.offset ?? 0 },
			}),
			providesTags: (result) =>
				result
					? [
							...result.results.map((m) => ({ type: MESSAGES_TAG, id: m.uuid })),
							{ type: MESSAGES_TAG, id: "LIST" },
						]
					: [{ type: MESSAGES_TAG, id: "LIST" }],
		}),

		submitMessage: builder.mutation<ContactMessage, SubmitMessageRequest>({
			query: (body) => ({
				url: "api/web/v1/messages/",
				method: "POST",
				body: {
					name: body.name,
					email: body.email,
					...(body.website != null && body.website !== "" && { website: body.website }),
					message: body.message,
				},
			}),
			invalidatesTags: [{ type: MESSAGES_TAG, id: "LIST" }],
		}),
	}),
});

export const { useGetMessagesQuery, useSubmitMessageMutation } = messagesApi;
