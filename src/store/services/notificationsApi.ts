import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export type NotificationType = "General" | "Reminder" | "Alert" | "Notice";
export type NotificationRecipientScope = "all" | "active" | "inactive" | "custom";

export interface SentNotification {
	id: string;
	uuid: string;
	title: string;
	message: string;
	type: NotificationType;
	recipient_scope: NotificationRecipientScope;
	recipients: string;
	delivered: number;
	created_by?: string;
	created_at?: string;
}

export interface ReceivedNotification {
	id: string;
	uuid: string;
	notification_uuid: string;
	title: string;
	message: string;
	type: NotificationType;
	recipient_scope: NotificationRecipientScope;
	recipients: string;
	is_read: boolean;
	read_at?: string;
	created_at?: string;
}

export interface NotificationsListResponse<TItem> {
	count: number;
	next: string | null;
	previous: string | null;
	results: TItem[];
}

export interface MyNotificationsResponse extends NotificationsListResponse<ReceivedNotification> {
	unread_count: number;
}

export interface GetMyNotificationsRequest {
	limit?: number;
	offset?: number;
	viewer_uuid?: string;
}

export interface CreateNotificationRequest {
	title: string;
	message: string;
	type: NotificationType;
	recipient_scope: NotificationRecipientScope;
	member_uuid?: string;
}

const NOTIFICATIONS_TAG = "Notifications" as const;
const MY_NOTIFICATIONS_TAG = "MyNotifications" as const;

export const notificationsApi = createApi({
	reducerPath: "notificationsApi",
	baseQuery,
	tagTypes: [NOTIFICATIONS_TAG, MY_NOTIFICATIONS_TAG],

	endpoints: (builder) => ({
		getNotifications: builder.query<
			NotificationsListResponse<SentNotification>,
			{ limit?: number; offset?: number } | void
		>({
			query: (params) => ({
				url: "api/web/v1/notifications/list/",
				params: {
					limit: params?.limit ?? 100,
					offset: params?.offset ?? 0,
				},
			}),
			providesTags: (result) =>
				result
					? [
							...result.results.map((item) => ({ type: NOTIFICATIONS_TAG, id: item.uuid } as const)),
							{ type: NOTIFICATIONS_TAG, id: "LIST" },
						]
					: [{ type: NOTIFICATIONS_TAG, id: "LIST" }],
		}),

		createNotification: builder.mutation<SentNotification, CreateNotificationRequest>({
			query: (body) => ({
				url: "api/web/v1/notifications/",
				method: "POST",
				body,
			}),
			invalidatesTags: [{ type: NOTIFICATIONS_TAG, id: "LIST" }, { type: MY_NOTIFICATIONS_TAG, id: "LIST" }],
		}),

		getMyNotifications: builder.query<MyNotificationsResponse, GetMyNotificationsRequest | void>({
			query: (params) => ({
				url: "api/web/v1/notifications/me/",
				params: {
					limit: params?.limit ?? 100,
					offset: params?.offset ?? 0,
				},
			}),
			providesTags: (result) =>
				result
					? [
							...result.results.map((item) => ({ type: MY_NOTIFICATIONS_TAG, id: item.uuid } as const)),
							{ type: MY_NOTIFICATIONS_TAG, id: "LIST" },
						]
					: [{ type: MY_NOTIFICATIONS_TAG, id: "LIST" }],
		}),

		markNotificationRead: builder.mutation<{ detail: string }, string>({
			query: (recipientUuid) => ({
				url: `api/web/v1/notifications/me/${recipientUuid}/read/`,
				method: "PATCH",
			}),
			invalidatesTags: (_result, _error, recipientUuid) => [
				{ type: MY_NOTIFICATIONS_TAG, id: recipientUuid },
				{ type: MY_NOTIFICATIONS_TAG, id: "LIST" },
			],
		}),

		markAllNotificationsRead: builder.mutation<{ detail: string; updated: number }, void>({
			query: () => ({
				url: "api/web/v1/notifications/me/read-all/",
				method: "PATCH",
			}),
			invalidatesTags: [{ type: MY_NOTIFICATIONS_TAG, id: "LIST" }],
		}),
	}),
});

export const {
	useGetNotificationsQuery,
	useCreateNotificationMutation,
	useGetMyNotificationsQuery,
	useMarkNotificationReadMutation,
	useMarkAllNotificationsReadMutation,
} = notificationsApi;
