"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useGetUsersQuery } from "@/store/services/userApi";
import {
    useCreateNotificationMutation,
    useGetNotificationsQuery,
    type NotificationRecipientScope,
    type NotificationType,
} from "@/store/services/notificationsApi";

const TYPE_OPTIONS: NotificationType[] = ["General", "Reminder", "Alert", "Notice"];

const typeBadge: Record<NotificationType, string> = {
    Reminder: "bg-blue-100 text-blue-700",
    General: "bg-gray-100 text-gray-600",
    Alert: "bg-red-100 text-red-600",
    Notice: "bg-orange-100 text-orange-700",
};

const inputCls =
    "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 bg-white";

function formatDateTime(value: string | undefined) {
    if (!value) return "Just now";
    return new Date(value).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function getMemberLabel(member: {
    name?: string;
    user_id?: string;
    phone?: string;
    email?: string;
}) {
    const parts = [
        member.name || "Unnamed member",
        member.user_id ? `(${member.user_id})` : "",
        member.phone ? `• ${member.phone}` : "",
        member.email ? `• ${member.email}` : "",
    ];
    return parts.filter(Boolean).join(" ");
}

export default function NotificationsPage() {
    const [form, setForm] = useState({
        title: "",
        message: "",
        recipient_scope: "all" as NotificationRecipientScope,
        type: "General" as NotificationType,
        member_uuid: "",
    });
    const [memberSearch, setMemberSearch] = useState("");
    const [memberDropdownOpen, setMemberDropdownOpen] = useState(false);

    const { data: notificationsData, isLoading: notificationsLoading } = useGetNotificationsQuery({ limit: 100 });
    const { data: membersData } = useGetUsersQuery({ limit: 500 });
    const [createNotification, { isLoading: sending }] = useCreateNotificationMutation();

    const members = useMemo(
        () =>
            (membersData?.results ?? [])
                .filter((member) => member.user_type === "Member")
                .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? "")),
        [membersData],
    );

    const totalMembers = members.length;
    const activeMembers = members.filter((member) => member.is_active);
    const inactiveMembers = members.filter((member) => member.is_active === false);
    const history = notificationsData?.results ?? [];

    const selectedMember = useMemo(
        () => members.find((member) => member.uuid === form.member_uuid),
        [members, form.member_uuid],
    );

    const memberOptions = useMemo(() => {
        const query = memberSearch.trim().toLowerCase();
        const filtered = members.filter((member) => {
            if (!query) return true;
            const haystack = [member.name, member.user_id, member.phone, member.email]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();
            return haystack.includes(query);
        });
        return filtered.slice(0, 8);
    }, [members, memberSearch]);

    function handleRecipientScopeChange(scope: NotificationRecipientScope) {
        setForm((prev) => ({
            ...prev,
            recipient_scope: scope,
            member_uuid: scope === "custom" ? prev.member_uuid : "",
        }));
        if (scope !== "custom") {
            setMemberSearch("");
            setMemberDropdownOpen(false);
        }
    }

    function handleMemberSelect(member: { uuid?: string; name?: string; user_id?: string; phone?: string; email?: string }) {
        setForm((prev) => ({ ...prev, member_uuid: member.uuid ?? "" }));
        setMemberSearch(getMemberLabel(member));
        setMemberDropdownOpen(false);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const title = form.title.trim();
        const message = form.message.trim();
        if (!title || !message) {
            toast.error("Title and message are required.");
            return;
        }
        if (form.recipient_scope === "custom" && !form.member_uuid) {
            toast.error("Please select a custom member from the dropdown.");
            return;
        }

        try {
            const created = await createNotification({
                title,
                message,
                type: form.type,
                recipient_scope: form.recipient_scope,
                member_uuid: form.recipient_scope === "custom" ? form.member_uuid : undefined,
            }).unwrap();

            toast.success("Notification sent", {
                description: `${created.title} was delivered to ${created.recipients}.`,
            });

            setForm({
                title: "",
                message: "",
                recipient_scope: "all",
                type: "General",
                member_uuid: "",
            });
            setMemberSearch("");
            setMemberDropdownOpen(false);
        } catch (err) {
            const message =
                err && typeof err === "object" && "data" in err && typeof (err as { data?: { detail?: string } }).data?.detail === "string"
                    ? (err as { data: { detail: string } }).data.detail
                    : "Failed to send notification.";
            toast.error(message);
        }
    }

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="lg:col-span-2">
                <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-gray-800">
                        <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                            />
                        </svg>
                        Compose Notification
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Send To
                            </label>
                            <select
                                value={form.recipient_scope}
                                onChange={(e) => handleRecipientScopeChange(e.target.value as NotificationRecipientScope)}
                                className={inputCls}
                            >
                                <option value="all">All Members ({totalMembers})</option>
                                <option value="active">Active Members ({activeMembers.length})</option>
                                <option value="inactive">Inactive Members ({inactiveMembers.length})</option>
                                <option value="custom">Custom Member</option>
                            </select>
                        </div>

                        {form.recipient_scope === "custom" && (
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Select Member
                                </label>
                                <div className="relative">
                                    <input
                                        value={memberSearch}
                                        onChange={(e) => {
                                            setMemberSearch(e.target.value);
                                            setMemberDropdownOpen(true);
                                            setForm((prev) => ({ ...prev, member_uuid: "" }));
                                        }}
                                        onFocus={() => setMemberDropdownOpen(true)}
                                        onBlur={() => {
                                            window.setTimeout(() => setMemberDropdownOpen(false), 120);
                                        }}
                                        placeholder="Search by member ID, name, phone or email"
                                        className={inputCls}
                                    />
                                    {memberDropdownOpen && (
                                        <div className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-gray-200 bg-white p-1 shadow-lg">
                                            {memberOptions.length === 0 ? (
                                                <p className="px-3 py-2 text-sm text-gray-400">
                                                    No matching members found.
                                                </p>
                                            ) : (
                                                memberOptions.map((member) => (
                                                    <button
                                                        key={member.uuid}
                                                        type="button"
                                                        onMouseDown={(e) => {
                                                            e.preventDefault();
                                                            handleMemberSelect(member);
                                                        }}
                                                        className="flex w-full flex-col rounded-lg px-3 py-2 text-left transition-colors hover:bg-green-50"
                                                    >
                                                        <span className="text-sm font-medium text-gray-800">
                                                            {member.name}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {member.user_id}
                                                            {member.phone ? ` • ${member.phone}` : ""}
                                                            {member.email ? ` • ${member.email}` : ""}
                                                        </span>
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                                {selectedMember && (
                                    <p className="mt-2 text-xs font-medium text-green-700">
                                        Selected: {selectedMember.name} ({selectedMember.user_id})
                                    </p>
                                )}
                            </div>
                        )}

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Type
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {TYPE_OPTIONS.map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setForm((prev) => ({ ...prev, type }))}
                                        className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                                            form.type === type
                                                ? "border-green-500 bg-green-500 text-white"
                                                : "border-gray-200 bg-white text-gray-600 hover:border-green-300"
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                required
                                value={form.title}
                                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                                placeholder="Notification title"
                                className={inputCls}
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Message <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                required
                                rows={5}
                                maxLength={500}
                                value={form.message}
                                onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                                placeholder="Write your message here..."
                                className={`${inputCls} resize-none`}
                            />
                            <p className="mt-1 text-right text-xs text-gray-400">
                                {form.message.length} / 500
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={sending}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-600 disabled:opacity-60"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                />
                            </svg>
                            {sending ? "Sending..." : "Send Notification"}
                        </button>
                    </form>
                </div>
            </div>

            <div className="space-y-4 lg:col-span-3">
                <div className="flex items-center justify-between gap-3">
                    <h2 className="text-base font-semibold text-gray-800">
                        Sent History
                    </h2>
                    <p className="text-sm text-gray-400">
                        {history.length} notification{history.length === 1 ? "" : "s"}
                    </p>
                </div>

                {notificationsLoading ? (
                    <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
                        Loading notifications...
                    </div>
                ) : history.length === 0 ? (
                    <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-400 shadow-sm">
                        No notifications have been sent yet.
                    </div>
                ) : (
                    history.map((notification) => (
                        <div
                            key={notification.uuid}
                            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
                        >
                            <div className="mb-2 flex items-start justify-between gap-3">
                                <h3 className="text-sm font-semibold text-gray-800">
                                    {notification.title}
                                </h3>
                                <span
                                    className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium ${typeBadge[notification.type] ?? "bg-gray-100 text-gray-600"}`}
                                >
                                    {notification.type}
                                </span>
                            </div>
                            <p className="mb-3 whitespace-pre-wrap text-sm text-gray-500">
                                {notification.message}
                            </p>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                                <span className="flex items-center gap-1">
                                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                    {notification.recipients}
                                </span>
                                <span className="flex items-center gap-1">
                                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    {notification.delivered} delivered
                                </span>
                                <span>{formatDateTime(notification.created_at)}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
