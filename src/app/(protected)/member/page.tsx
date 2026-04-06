"use client";

import Link from "next/link";
import { useState } from "react";
import { useGetUserDetailsQuery } from "@/store/services/userApi";
import { useGetDepositsByMemberQuery } from "@/store/services/depositsApi";
import Modal from "@/components/dashboard/ui/Modal";
import Pagination from "@/components/dashboard/ui/Pagination";
import { ErrorState, NotFoundState } from "@/components/common";
import {
    MemberHeroCard,
    MemberAddresses,
    MemberNominee,
    MemberFinancials,
    MemberBeneficiary,
    MemberTransactions,
    MemberProfileSkeleton,
    type Transaction,
} from "@/components/dashboard/members";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import {
    useGetMyNotificationsQuery,
    useMarkAllNotificationsReadMutation,
    useMarkNotificationReadMutation,
    type NotificationType,
} from "@/store/services/notificationsApi";
import { toast } from "sonner";

const notificationTypeBadge: Record<NotificationType, string> = {
    Reminder: "bg-blue-100 text-blue-700",
    General: "bg-gray-100 text-gray-600",
    Alert: "bg-red-100 text-red-600",
    Notice: "bg-orange-100 text-orange-700",
};
const NOTIFICATIONS_PAGE_SIZE = 5;

function getProfilePictureUrl(path: string | null | undefined): string | undefined {
    if (!path) return undefined;
    if (path.startsWith("http")) return path;
    const base = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_API_BASE_URL : "";
    if (!base) return path;
    return `${base.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;
}

function formatTxDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function formatNotificationDate(value: string | undefined) {
    if (!value) return "Just now";
    return new Date(value).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function MemberProfilePage() {
    const { uuid } = useSelector((state: RootState) => state.auth) as {
        uuid: string | null;
    };
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [notificationsPage, setNotificationsPage] = useState(1);

    const {
        data: Member,
        isLoading,
        isError,
        error,
        refetch,
    } = useGetUserDetailsQuery(uuid!, { skip: !uuid });

    const { data: deposits = [] } = useGetDepositsByMemberQuery(Member?.uuid ?? "", {
        skip: !Member?.uuid,
    });
    const { data: notificationsData, isLoading: notificationsLoading } = useGetMyNotificationsQuery(
        {
            limit: NOTIFICATIONS_PAGE_SIZE,
            offset: (notificationsPage - 1) * NOTIFICATIONS_PAGE_SIZE,
            viewer_uuid: uuid ?? undefined,
        },
        { skip: !uuid, refetchOnMountOrArgChange: true },
    );
    const [markAllNotificationsRead, { isLoading: markingAllNotificationsRead }] =
        useMarkAllNotificationsReadMutation();
    const [markNotificationRead, { isLoading: markingNotificationRead }] = useMarkNotificationReadMutation();

    const transactions: Transaction[] = deposits.map((d) => ({
        id: d.uuid,
        date: formatTxDate(d.date),
        amount: `BDT ${d.amount.toLocaleString()}`,
        channel: d.channel,
        status: d.status as Transaction["status"],
    }));

    if (!uuid) {
        return (
            <NotFoundState
                backHref="/"
                backLabel="Back to Home"
                title="Session required"
                description="Please log in to view your dashboard."
            />
        );
    }

    if (isLoading) return <MemberProfileSkeleton />;

    if (isError) {
        const errorMessage =
            "status" in (error as object)
                ? `Server error (${(error as { status: number }).status}). Please try again.`
                : ((error as { message?: string })?.message ??
                  "An unexpected error occurred.");

        return <ErrorState message={errorMessage} onRetry={refetch} />;
    }

    if (!Member)
        return (
            <NotFoundState
                backHref="/"
                backLabel="Back to Home"
                title="Member not found"
                description="This member profile doesn't exist or may have been removed."
            />
        );

    const profilePictureUrl = getProfilePictureUrl(Member.profile_picture);
    const notifications = notificationsData?.results ?? [];
    const unreadCount = notificationsData?.unread_count ?? 0;
    const notificationsTotal = notificationsData?.count ?? 0;
    const notificationsTotalPages = Math.max(
        1,
        Math.ceil(notificationsTotal / NOTIFICATIONS_PAGE_SIZE),
    );

    async function handleMarkRead(notificationUuid: string) {
        try {
            await markNotificationRead(notificationUuid).unwrap();
        } catch (err) {
            toast.error("Failed to mark notification as read.");
        }
    }

    async function handleMarkAllRead() {
        try {
            const result = await markAllNotificationsRead().unwrap();
            toast.success(result.detail);
            if (notificationsPage !== 1) {
                setNotificationsPage(1);
            }
        } catch (err) {
            toast.error("Failed to mark all notifications as read.");
        }
    }

    function openNotifications() {
        setNotificationsPage(1);
        setNotificationsOpen(true);
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6 pb-8">
            <div className="flex items-center justify-between gap-3">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-green-600"
                >
                    <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    Back to Home
                </Link>

                <button
                    type="button"
                    onClick={openNotifications}
                    className="relative inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                    </svg>
                    Notifications
                    {unreadCount > 0 && (
                        <span className="absolute -top-2 -right-2 inline-flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </button>
            </div>

            <MemberHeroCard
                name={Member.name}
                profilePicture={profilePictureUrl}
                userId={Member.user_id}
                phone={Member.phone}
                nidNumber={Member.nid_number}
                dateOfBirth={Member.date_of_birth}
                accountNumber={Member.account_number}
                email={Member.email}
            />

            <MemberAddresses
                permanentAddress={Member.permanent_address}
                currentAddress={Member.current_address}
            />

            <MemberNominee
                nomineeName={Member.nominee_name}
                nomineePhone={Member.nominee_phone}
                nomineeNidNumber={Member.nominee_nid_number}
                nomineeAccountNumber={Member.nominee_account_number}
                nomineeDateOfBirth={Member.nominee_date_of_birth}
                nomineeAddress={Member.nominee_address}
            />

            <MemberFinancials
                joiningDate={Member.joining_date}
                totalDeposits={Member.total_deposits}
            />

            <MemberBeneficiary beneficiaryRefId={Member.beneficiary_ref_id} />

            <MemberTransactions transactions={transactions} />

            {Member.referrals && Member.referrals.length > 0 && (
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
                    <h2 className="mb-3 text-base font-semibold text-gray-800">
                        Referred Members
                    </h2>
                    <p className="mb-3 text-sm text-gray-600">
                        <span className="font-semibold">
                            {Member.referrals.length}
                        </span>{" "}
                        {Member.referrals.length === 1
                            ? "person has"
                            : "people have"}{" "}
                        used your Member ID as their Beneficiary Ref. ID.
                    </p>
                    <div className="overflow-hidden rounded-xl border border-gray-100">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr className="text-left text-xs font-semibold text-gray-500">
                                    <th className="px-3 py-2.5">Member ID</th>
                                    <th className="px-3 py-2.5">Name</th>
                                    <th className="px-3 py-2.5 hidden sm:table-cell">
                                        Phone
                                    </th>
                                    <th className="px-3 py-2.5 hidden md:table-cell">
                                        Email
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {Member.referrals.map((r) => (
                                    <tr
                                        key={r.uuid}
                                        className="border-t border-gray-100 hover:bg-gray-50/60"
                                    >
                                        <td className="px-3 py-2.5 font-medium text-gray-800">
                                            {r.user_id}
                                        </td>
                                        <td className="px-3 py-2.5 text-gray-700">
                                            {r.name}
                                        </td>
                                        <td className="px-3 py-2.5 text-gray-600 hidden sm:table-cell">
                                            {r.phone || "–"}
                                        </td>
                                        <td className="px-3 py-2.5 text-gray-600 text-xs hidden md:table-cell break-all">
                                            {r.email || "–"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <Modal
                open={notificationsOpen}
                onClose={() => setNotificationsOpen(false)}
                title="Notifications"
                maxWidth="max-w-2xl"
            >
                {notificationsLoading ? (
                    <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
                        Loading notifications...
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-400">
                        No notifications received yet.
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                        <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3">
                            <p className="text-sm text-gray-500">
                                {unreadCount} unread notification{unreadCount === 1 ? "" : "s"}
                            </p>
                            <button
                                type="button"
                                onClick={handleMarkAllRead}
                                disabled={unreadCount === 0 || markingAllNotificationsRead}
                                className="rounded-lg border border-green-200 bg-white px-3 py-1.5 text-xs font-medium text-green-700 transition-colors hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {markingAllNotificationsRead ? "Marking..." : "Mark all as read"}
                            </button>
                        </div>
                        <div className="space-y-3 p-4">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.uuid}
                                    className={`rounded-xl border p-4 shadow-sm ${
                                        notification.is_read
                                            ? "border-gray-200 bg-white"
                                            : "border-green-200 bg-green-50/60"
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="text-sm font-semibold text-gray-800">
                                                    {notification.title}
                                                </p>
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${notificationTypeBadge[notification.type]}`}
                                                >
                                                    {notification.type}
                                                </span>
                                                {!notification.is_read && (
                                                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">
                                                        New
                                                    </span>
                                                )}
                                            </div>
                                            <p className="whitespace-pre-wrap text-sm text-gray-600">
                                                {notification.message}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
                                                <span>{notification.recipients}</span>
                                                <span>{formatNotificationDate(notification.created_at)}</span>
                                            </div>
                                        </div>
                                        {!notification.is_read && (
                                            <button
                                                type="button"
                                                onClick={() => handleMarkRead(notification.uuid)}
                                                disabled={markingNotificationRead}
                                                className="shrink-0 rounded-lg border border-green-200 bg-white px-3 py-1.5 text-xs font-medium text-green-700 transition-colors hover:bg-green-100 disabled:opacity-60"
                                            >
                                                Mark as read
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {notificationsTotal > NOTIFICATIONS_PAGE_SIZE && (
                            <Pagination
                                page={notificationsPage}
                                totalPages={notificationsTotalPages}
                                onPageChange={setNotificationsPage}
                                totalItems={notificationsTotal}
                                pageSize={NOTIFICATIONS_PAGE_SIZE}
                            />
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
}
