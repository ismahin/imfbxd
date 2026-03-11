"use client";

import { useState } from "react";

interface SentNotification {
    id: string;
    title: string;
    message: string;
    recipients: string;
    type: string;
    sentAt: string;
    delivered: number;
}

const SENT_MOCK: SentNotification[] = [
    {
        id: "1",
        title: "Monthly deposit reminder",
        message: "Please complete your monthly deposit before the 5th.",
        recipients: "All Members (502)",
        type: "Reminder",
        sentAt: "Feb 15, 2024 · 10:00 AM",
        delivered: 498,
    },
    {
        id: "2",
        title: "New year message from board",
        message: "Wishing all our members a prosperous new year.",
        recipients: "All Members (502)",
        type: "General",
        sentAt: "Jan 1, 2024 · 9:00 AM",
        delivered: 501,
    },
    {
        id: "3",
        title: "Urgent: Board meeting this Friday",
        message: "All board members must attend the emergency meeting.",
        recipients: "Board Members (6)",
        type: "Alert",
        sentAt: "Dec 20, 2023 · 2:00 PM",
        delivered: 6,
    },
    {
        id: "4",
        title: "Office closed — public holiday",
        message: "The office will remain closed on February 21.",
        recipients: "All Members (502)",
        type: "Notice",
        sentAt: "Feb 19, 2024 · 8:00 AM",
        delivered: 495,
    },
];

const typeBadge: Record<string, string> = {
    Reminder: "bg-blue-100 text-blue-700",
    General: "bg-gray-100 text-gray-600",
    Alert: "bg-red-100 text-red-600",
    Notice: "bg-orange-100 text-orange-700",
};

async function apiSend(_data: object): Promise<void> {
    // TODO: await fetch("/api/notifications", { method: "POST", body: JSON.stringify(_data) })
    await new Promise((r) => setTimeout(r, 800)); // simulate delay
}

export default function NotificationsPage() {
    const [sent, setSent] = useState<SentNotification[]>(SENT_MOCK);
    const [form, setForm] = useState({
        title: "",
        message: "",
        recipients: "all",
        type: "General",
        customEmail: "",
    });
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSending(true);
        setSuccess(false);
        try {
            await apiSend(form);
            const newItem: SentNotification = {
                id: String(Date.now()),
                title: form.title,
                message: form.message,
                recipients:
                    form.recipients === "all"
                        ? "All Members (502)"
                        : form.recipients === "active"
                          ? "Active Members"
                          : form.customEmail,
                type: form.type,
                sentAt: new Date().toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                delivered: form.recipients === "all" ? 502 : 0,
            };
            setSent((p) => [newItem, ...p]);
            setForm({
                title: "",
                message: "",
                recipients: "all",
                type: "General",
                customEmail: "",
            });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 4000);
        } finally {
            setSending(false);
        }
    }

    const inputCls =
        "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 bg-white";

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            {/* ── Compose ────────────────────────────────────────────── */}
            <div className="lg:col-span-2">
                <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-gray-800">
                        <svg
                            className="h-4 w-4 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                            />
                        </svg>
                        Compose Notification
                    </h2>

                    {success && (
                        <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                            <svg
                                className="h-4 w-4 shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                            Notification sent successfully!
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Send To
                            </label>
                            <select
                                value={form.recipients}
                                onChange={(e) =>
                                    setForm((p) => ({
                                        ...p,
                                        recipients: e.target.value,
                                    }))
                                }
                                className={inputCls}
                            >
                                <option value="all">All Members (502)</option>
                                <option value="active">Active Members</option>
                                <option value="inactive">
                                    Inactive Members
                                </option>
                                <option value="board">Board Members</option>
                                <option value="custom">
                                    Custom (enter below)
                                </option>
                            </select>
                        </div>
                        {form.recipients === "custom" && (
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Member ID or Email
                                </label>
                                <input
                                    value={form.customEmail}
                                    onChange={(e) =>
                                        setForm((p) => ({
                                            ...p,
                                            customEmail: e.target.value,
                                        }))
                                    }
                                    placeholder="Enter member ID or email"
                                    className={inputCls}
                                />
                            </div>
                        )}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Type
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {["General", "Reminder", "Alert", "Notice"].map(
                                    (t) => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() =>
                                                setForm((p) => ({
                                                    ...p,
                                                    type: t,
                                                }))
                                            }
                                            className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                                                form.type === t
                                                    ? "border-green-500 bg-green-500 text-white"
                                                    : "border-gray-200 bg-white text-gray-600 hover:border-green-300"
                                            }`}
                                        >
                                            {t}
                                        </button>
                                    ),
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                required
                                value={form.title}
                                onChange={(e) =>
                                    setForm((p) => ({
                                        ...p,
                                        title: e.target.value,
                                    }))
                                }
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
                                value={form.message}
                                onChange={(e) =>
                                    setForm((p) => ({
                                        ...p,
                                        message: e.target.value,
                                    }))
                                }
                                placeholder="Write your message here…"
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
                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                />
                            </svg>
                            {sending ? "Sending…" : "Send Notification"}
                        </button>
                    </form>
                </div>
            </div>

            {/* ── Sent history ─────────────────────────────────────────── */}
            <div className="space-y-4 lg:col-span-3">
                <h2 className="text-base font-semibold text-gray-800">
                    Sent History
                </h2>
                {sent.map((n) => (
                    <div
                        key={n.id}
                        className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
                    >
                        <div className="mb-2 flex items-start justify-between gap-3">
                            <h3 className="text-sm font-semibold text-gray-800">
                                {n.title}
                            </h3>
                            <span
                                className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium ${typeBadge[n.type] ?? "bg-gray-100 text-gray-600"}`}
                            >
                                {n.type}
                            </span>
                        </div>
                        <p className="mb-3 line-clamp-2 text-sm text-gray-500">
                            {n.message}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                                <svg
                                    className="h-3.5 w-3.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                                {n.recipients}
                            </span>
                            <span className="flex items-center gap-1">
                                <svg
                                    className="h-3.5 w-3.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                                {n.delivered} delivered
                            </span>
                            <span>{n.sentAt}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
