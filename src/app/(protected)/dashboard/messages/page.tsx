"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useGetMessagesQuery } from "@/store/services/messagesApi";

function formatTime(iso: string | undefined): string {
	if (!iso) return "";
	try {
		const d = new Date(iso);
		const now = new Date();
		const sameDay = d.toDateString() === now.toDateString();
		if (sameDay) return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
		const yesterday = new Date(now);
		yesterday.setDate(yesterday.getDate() - 1);
		if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
		return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
	} catch {
		return "";
	}
}

function formatFullDate(iso: string | undefined): string {
	if (!iso) return "—";
	try {
		return new Date(iso).toLocaleString(undefined, {
			dateStyle: "medium",
			timeStyle: "short",
		});
	} catch {
		return iso;
	}
}

function preview(text: string, maxLen: number): string {
	const t = text.replace(/\s+/g, " ").trim();
	return t.length <= maxLen ? t : t.slice(0, maxLen) + "…";
}

export default function MessagesPage() {
	const [search, setSearch] = useState("");
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const bottomRef = useRef<HTMLDivElement>(null);
	const { data, isLoading } = useGetMessagesQuery({ limit: 200 });
	const messages = data?.results ?? [];

	const filtered = useMemo(() => {
		if (!search.trim()) return messages;
		const q = search.toLowerCase();
		return messages.filter(
			(m) =>
				m.name?.toLowerCase().includes(q) ||
				m.email?.toLowerCase().includes(q) ||
				m.message?.toLowerCase().includes(q) ||
				m.website?.toLowerCase().includes(q)
		);
	}, [messages, search]);

	const selected = useMemo(
		() => (selectedId ? filtered.find((m) => m.uuid === selectedId) : null),
		[filtered, selectedId]
	);

	// Auto-select first message when list loads or search changes
	useEffect(() => {
		if (filtered.length > 0 && (!selectedId || !filtered.some((m) => m.uuid === selectedId))) {
			setSelectedId(filtered[0].uuid);
		} else if (filtered.length === 0) {
			setSelectedId(null);
		}
	}, [filtered, selectedId]);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [selected?.uuid]);

	if (isLoading) {
		return (
			<div className="flex h-[calc(100vh-8rem)] min-h-[400px] items-center justify-center rounded-2xl border border-gray-200 bg-white">
				<div className="flex flex-col items-center gap-3 text-gray-500">
					<svg className="h-10 w-10 animate-spin text-green-500" fill="none" viewBox="0 0 24 24">
						<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
						<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
					</svg>
					<span className="text-sm">Loading messages…</span>
				</div>
			</div>
		);
	}

	if (messages.length === 0) {
		return (
			<div className="flex h-[calc(100vh-8rem)] min-h-[400px] flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white text-center">
				<div className="rounded-full bg-gray-100 p-4">
					<svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
					</svg>
				</div>
				<p className="mt-4 text-sm font-medium text-gray-700">No messages yet</p>
				<p className="mt-1 text-xs text-gray-500">Messages from the contact form will appear here.</p>
			</div>
		);
	}

	return (
		<div className="flex h-[calc(100vh-8rem)] min-h-[500px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
			{/* ── Conversation list (left) ───────────────────────────────── */}
			<div className="flex w-80 shrink-0 flex-col border-r border-gray-200 bg-gray-50/80 md:w-96">
				<div className="shrink-0 border-b border-gray-200 bg-white px-4 py-4">
					<h2 className="mb-3 text-base font-semibold text-gray-800">Messages</h2>
					<div className="relative">
						<svg
							className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
						<input
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search messages…"
							className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm placeholder:text-gray-400 focus:border-green-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-100"
						/>
					</div>
				</div>
				<div className="flex-1 overflow-y-auto">
					{filtered.length === 0 ? (
						<div className="p-4 text-center text-sm text-gray-500">No matches</div>
					) : (
						filtered.map((m) => (
							<button
								key={m.uuid}
								type="button"
								onClick={() => setSelectedId(m.uuid)}
								className={`flex w-full items-start gap-3 border-b border-gray-100 px-4 py-3.5 text-left transition-colors hover:bg-white ${m.uuid === selectedId ? "border-l-4 border-l-green-500 bg-white" : ""}`}
							>
								<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-700">
									{m.name?.charAt(0)?.toUpperCase() ?? "?"}
								</div>
								<div className="min-w-0 flex-1">
									<div className="flex items-center justify-between gap-2">
										<span className={`truncate text-sm ${m.uuid === selectedId ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}>
											{m.name}
										</span>
										<span className="shrink-0 text-xs text-gray-400">
											{formatTime(m.created_at)}
										</span>
									</div>
									<p className="mt-0.5 truncate text-xs text-gray-500">
										{preview(m.message, 45)}
									</p>
								</div>
							</button>
						))
					)}
				</div>
			</div>

			{/* ── Chat view (right) ────────────────────────────────────── */}
			<div className="flex min-w-0 flex-1 flex-col bg-white">
				{selected ? (
					<>
						{/* Chat header */}
						<div className="flex shrink-0 items-center gap-3 border-b border-gray-200 px-5 py-4">
							<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-700">
								{selected.name?.charAt(0)?.toUpperCase() ?? "?"}
							</div>
							<div className="min-w-0 flex-1">
								<p className="font-semibold text-gray-800">{selected.name}</p>
								<p className="truncate text-xs text-gray-500">{selected.email}</p>
								{selected.website && (
									<p className="mt-0.5 truncate text-xs text-green-600">{selected.website}</p>
								)}
							</div>
						</div>

						{/* Message thread (single incoming message) */}
						<div className="flex-1 space-y-2 overflow-y-auto bg-gray-50/50 px-5 py-5">
							<div className="flex justify-start">
								<div className="max-w-[85%] rounded-2xl rounded-tl-md bg-white px-4 py-3 shadow-sm ring-1 ring-gray-100">
									<p className="whitespace-pre-wrap text-sm text-gray-800">{selected.message}</p>
									<p className="mt-2 text-xs text-gray-400">{formatFullDate(selected.created_at)}</p>
								</div>
							</div>
							<div ref={bottomRef} />
						</div>

						{/* No reply — subtle hint */}
						<div className="shrink-0 border-t border-gray-100 px-5 py-3 text-center">
							<p className="text-xs text-gray-400">View only — replies are not sent from here.</p>
						</div>
					</>
				) : (
					<div className="flex flex-1 flex-col items-center justify-center text-gray-400">
						<svg className="h-14 w-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
						</svg>
						<p className="mt-3 text-sm">Select a message</p>
					</div>
				)}
			</div>
		</div>
	);
}
