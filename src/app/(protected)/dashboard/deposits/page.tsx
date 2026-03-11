"use client";

import { useState, useMemo } from "react";
import Modal from "@/components/dashboard/ui/Modal";
import ConfirmDialog from "@/components/dashboard/ui/ConfirmDialog";
import { FormField } from "@/components/dashboard/ui/FormFields";
import Pagination from "@/components/dashboard/ui/Pagination";
import { SearchBar } from "@/components/dashboard/ui/TableUtils";
import {
    useGetDepositsQuery,
    useCreateDepositMutation,
    useUpdateDepositMutation,
    useDeleteDepositMutation,
    type Deposit,
} from "@/store/services/depositsApi";
import { useGetUsersQuery } from "@/store/services/userApi";
import { toast } from "sonner";

type MainTab = "list" | "recent" | "report";
type ReportPeriod = "Daily" | "Monthly" | "Yearly";

function aggregateByMember(entries: Deposit[]) {
    const map = new Map<
        string,
        { member_id: string; member_name: string; phone: string; email: string; total: number }
    >();
    entries.forEach((e) => {
        const key = e.member_uuid;
        const existing = map.get(key);
        if (existing) {
            existing.total += e.amount;
        } else {
            map.set(key, {
                member_id: e.member_id ?? e.member_uuid,
                member_name: e.member_name ?? "",
                phone: e.phone ?? "",
                email: e.email ?? "",
                total: e.amount,
            });
        }
    });
    return Array.from(map.values());
}

function aggregateReport(entries: Deposit[], period: ReportPeriod) {
    const map = new Map<string, number>();
    entries.forEach((e) => {
        let key = "";
        const d = new Date(e.date);
        if (period === "Daily") key = e.date;
        if (period === "Monthly")
            key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        if (period === "Yearly") key = String(d.getFullYear());
        map.set(key, (map.get(key) ?? 0) + e.amount);
    });
    return Array.from(map.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([key, total]) => ({ key, total }));
}

function formatReportKey(key: string, period: ReportPeriod) {
    if (period === "Daily") {
        const d = new Date(key);
        return d.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
    }
    if (period === "Monthly") {
        const [y, m] = key.split("-");
        return new Date(Number(y), Number(m) - 1).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
        });
    }
    return key;
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

const iCls =
    "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white " +
    "focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 " +
    "placeholder:text-gray-400 transition-colors";

const PAGE_SIZE = 8;
const CHANNELS = ["Cash", "Bank Transfer", "Mobile Banking", "Cheque"];

export default function DepositsPage() {
    const [activeTab, setActiveTab] = useState<MainTab>("list");
    const [reportPeriod, setReportPeriod] = useState<ReportPeriod>("Daily");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [entryOpen, setEntryOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<Deposit | null>(null);
    const [entryForm, setEntryForm] = useState({
        member_uuid: "",
        channel: "Cash",
        date: "",
        amount: "",
    });
    const [entryError, setEntryError] = useState("");

    const [deleteTarget, setDeleteTarget] = useState<Deposit | null>(null);

    const { data: depositsData, isLoading: depositsLoading } = useGetDepositsQuery();
    const { data: membersData } = useGetUsersQuery();
    const [createDeposit, { isLoading: creating }] = useCreateDepositMutation();
    const [updateDeposit, { isLoading: updating }] = useUpdateDepositMutation();
    const [deleteDeposit, { isLoading: deleting }] = useDeleteDepositMutation();

    const entries = depositsData?.results ?? [];
    const members = membersData?.results ?? [];
    const saving = creating || updating;

    const totalDeposit = useMemo(() => entries.reduce((s, e) => s + e.amount, 0), [entries]);

    const memberAggregates = useMemo(() => {
        const agg = aggregateByMember(entries);
        const q = search.toLowerCase();
        return q
            ? agg.filter(
                  (a) =>
                      a.member_name?.toLowerCase().includes(q) ||
                      a.member_id?.toLowerCase().includes(q) ||
                      a.phone?.includes(q)
              )
            : agg;
    }, [entries, search]);

    const recentFiltered = useMemo(() => {
        const q = search.toLowerCase();
        return q
            ? entries.filter(
                  (e) =>
                      e.member_name?.toLowerCase().includes(q) ||
                      e.member_id?.toLowerCase().includes(q) ||
                      e.phone?.includes(q)
              )
            : entries;
    }, [entries, search]);

    const reportRows = useMemo(
        () => aggregateReport(entries, reportPeriod),
        [entries, reportPeriod]
    );

    const listPages = Math.max(1, Math.ceil(memberAggregates.length / PAGE_SIZE));
    const listRows = memberAggregates.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const recentPages = Math.max(1, Math.ceil(recentFiltered.length / PAGE_SIZE));
    const recentRows = recentFiltered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const reportPages = Math.max(1, Math.ceil(reportRows.length / PAGE_SIZE));
    const reportRowsPaginated = reportRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    function switchTab(tab: MainTab) {
        setActiveTab(tab);
        setPage(1);
        setSearch("");
    }

    function openAdd() {
        setEditTarget(null);
        setEntryForm({
            member_uuid: "",
            channel: "Cash",
            date: new Date().toISOString().slice(0, 10),
            amount: "",
        });
        setEntryError("");
        setEntryOpen(true);
    }

    function openEdit(e: Deposit) {
        setEditTarget(e);
        setEntryForm({
            member_uuid: e.member_uuid,
            channel: e.channel,
            date: e.date,
            amount: String(e.amount),
        });
        setEntryError("");
        setEntryOpen(true);
    }

    async function handleEntrySubmit(ev: React.FormEvent) {
        ev.preventDefault();
        setEntryError("");
        const amt = Number(entryForm.amount);
        if (!amt || amt <= 0) {
            setEntryError("Please enter a valid amount.");
            return;
        }
        if (!editTarget && !entryForm.member_uuid) {
            setEntryError("Please select a member.");
            return;
        }

        try {
            if (editTarget) {
                await updateDeposit({
                    uuid: editTarget.uuid,
                    body: {
                        amount: amt,
                        channel: entryForm.channel,
                        deposit_date: entryForm.date,
                    },
                }).unwrap();
                toast.success("Deposit updated");
                setEntryOpen(false);
            } else {
                await createDeposit({
                    member_uuid: entryForm.member_uuid,
                    amount: amt,
                    channel: entryForm.channel,
                    deposit_date: entryForm.date,
                }).unwrap();
                toast.success("Deposit recorded");
                setEntryOpen(false);
            }
        } catch (err) {
            const msg =
                err instanceof Error ? err.message : "Something went wrong. Please try again.";
            setEntryError(msg);
            toast.error("Failed to save deposit", { description: msg });
        }
    }

    async function handleDelete() {
        if (!deleteTarget) return;
        try {
            await deleteDeposit(deleteTarget.uuid).unwrap();
            toast.success("Deposit deleted");
            setDeleteTarget(null);
        } catch (err) {
            toast.error("Failed to delete deposit");
        }
    }

    function tabCls(tab: MainTab) {
        return activeTab === tab
            ? "px-5 py-2 rounded-lg text-sm font-semibold bg-green-500 text-white shadow-sm transition-colors"
            : "px-5 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors bg-white";
    }

    const thCls =
        "text-left py-3.5 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-200";
    const tdCls = "py-4 px-5 text-sm text-gray-700 border-b border-gray-100";

    if (depositsLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-gray-500">Loading deposits…</p>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                    <button onClick={() => switchTab("list")} className={tabCls("list")}>
                        Deposit List
                    </button>
                    <button onClick={() => switchTab("recent")} className={tabCls("recent")}>
                        Recent Deposits
                    </button>
                    <button onClick={() => switchTab("report")} className={tabCls("report")}>
                        Report
                    </button>
                </div>
                <button
                    onClick={openAdd}
                    className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold whitespace-nowrap text-white shadow-sm transition-colors hover:bg-blue-700"
                >
                    Entry Deposit
                </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="flex flex-col justify-between gap-3 border-b border-gray-100 px-5 pt-5 pb-4 sm:flex-row sm:items-center">
                    <div>
                        <p className="text-sm font-bold text-gray-800">Deposit List</p>
                        <p className="mt-0.5 text-sm font-semibold text-green-600">
                            Total Deposit BDT {totalDeposit.toLocaleString()}
                        </p>
                    </div>
                    {activeTab !== "report" && (
                        <SearchBar
                            value={search}
                            onChange={(v) => {
                                setSearch(v);
                                setPage(1);
                            }}
                            placeholder="Search by name, id or phone"
                        />
                    )}
                </div>

                {activeTab === "list" && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className={`${thCls} w-2/5`}>Member</th>
                                    <th className={`${thCls} hidden w-2/5 sm:table-cell`}>Contact</th>
                                    <th className={`${thCls} w-1/5 text-right`}>Total Deposit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listRows.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="py-12 text-center text-sm text-gray-400">
                                            No members with deposits yet.
                                        </td>
                                    </tr>
                                ) : (
                                    listRows.map((row) => (
                                        <tr key={row.member_id + row.total} className="transition-colors hover:bg-gray-50/80">
                                            <td className={tdCls}>
                                                <p className="text-sm font-semibold text-gray-800">{row.member_name}</p>
                                                <p className="mt-0.5 text-xs text-gray-400">{row.member_id}</p>
                                            </td>
                                            <td className={`${tdCls} hidden sm:table-cell`}>
                                                <p className="text-sm text-gray-700">{row.phone}</p>
                                                <p className="mt-0.5 text-xs text-gray-400">{row.email}</p>
                                            </td>
                                            <td className={`${tdCls} text-right`}>
                                                <span className="font-semibold text-gray-900">
                                                    BDT {row.total.toLocaleString()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        <div className="border-t border-gray-100">
                            <Pagination
                                page={page}
                                totalPages={listPages}
                                onPageChange={setPage}
                                totalItems={memberAggregates.length}
                                pageSize={PAGE_SIZE}
                            />
                        </div>
                    </div>
                )}

                {activeTab === "recent" && (
                    <div className="overflow-x-auto">
                        <table className="w-full table-fixed">
                            <thead>
                                <tr>
                                    <th className={`${thCls} hidden sm:table-cell`}>Date</th>
                                    <th className={thCls}>Member</th>
                                    <th className={thCls}>Deposit</th>
                                    <th className={`${thCls} text-right`}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentRows.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center text-sm text-gray-400">
                                            No deposits found.
                                        </td>
                                    </tr>
                                ) : (
                                    recentRows.map((e) => (
                                        <tr key={e.uuid} className="transition-colors hover:bg-gray-50/80">
                                            <td className={`${tdCls} hidden sm:table-cell`}>
                                                <span className="text-gray-600">{formatDate(e.date)}</span>
                                            </td>
                                            <td className={tdCls}>
                                                <p className="text-sm font-semibold text-gray-800">{e.member_name}</p>
                                                <p className="mt-0.5 text-xs text-gray-400">{e.member_id}</p>
                                            </td>
                                            <td className={tdCls}>
                                                <span className="font-semibold text-gray-900">
                                                    BDT {e.amount.toLocaleString()}
                                                </span>
                                            </td>
                                            <td className={`${tdCls} text-right`}>
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => openEdit(e)}
                                                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                                                        title="Edit"
                                                    >
                                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteTarget(e)}
                                                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                                                        title="Delete"
                                                    >
                                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        <div className="border-t border-gray-100">
                            <Pagination
                                page={page}
                                totalPages={recentPages}
                                onPageChange={setPage}
                                totalItems={recentFiltered.length}
                                pageSize={PAGE_SIZE}
                            />
                        </div>
                    </div>
                )}

                {activeTab === "report" && (
                    <div>
                        <div className="flex gap-1 px-5 pb-4">
                            {(["Daily", "Monthly", "Yearly"] as ReportPeriod[]).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => {
                                        setReportPeriod(p);
                                        setPage(1);
                                    }}
                                    className={`rounded-full px-5 py-1.5 text-sm font-medium transition-colors ${
                                        reportPeriod === p ? "bg-green-500 text-white shadow-sm" : "text-gray-600 hover:bg-green-100"
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th className={`${thCls} w-3/4`}>Date</th>
                                        <th className={`${thCls} text-right`}>Deposit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportRows.length === 0 ? (
                                        <tr>
                                            <td colSpan={2} className="py-12 text-center text-sm text-gray-400">
                                                No data.
                                            </td>
                                        </tr>
                                    ) : (
                                        reportRowsPaginated.map((row) => (
                                            <tr key={row.key} className="transition-colors hover:bg-gray-50/80">
                                                <td className={tdCls}>{formatReportKey(row.key, reportPeriod)}</td>
                                                <td className={`${tdCls} text-right`}>
                                                    <span className="font-semibold text-gray-900">
                                                        BDT {row.total.toLocaleString()}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                            <div className="border-t border-gray-100">
                                <Pagination
                                    page={page}
                                    totalPages={reportPages}
                                    onPageChange={setPage}
                                    totalItems={reportRows.length}
                                    pageSize={PAGE_SIZE}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Modal open={entryOpen} onClose={() => setEntryOpen(false)} title="Entry Deposit" maxWidth="max-w-sm">
                <form onSubmit={handleEntrySubmit} className="space-y-4">
                    <FormField label="Member" required>
                        <select
                            required
                            value={entryForm.member_uuid}
                            onChange={(e) => setEntryForm((p) => ({ ...p, member_uuid: e.target.value }))}
                            className={iCls}
                            disabled={!!editTarget}
                        >
                            <option value="">Select member</option>
                            {members.map((m) => (
                                <option key={m.uuid} value={m.uuid}>
                                    {m.user_id} — {m.name}
                                </option>
                            ))}
                        </select>
                    </FormField>
                    <FormField label="Channel" required>
                        <select
                            required
                            value={entryForm.channel}
                            onChange={(e) => setEntryForm((p) => ({ ...p, channel: e.target.value }))}
                            className={iCls}
                        >
                            {CHANNELS.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </FormField>
                    <FormField label="Date" required>
                        <input
                            required
                            type="date"
                            value={entryForm.date}
                            onChange={(e) => setEntryForm((p) => ({ ...p, date: e.target.value }))}
                            className={iCls}
                        />
                    </FormField>
                    <FormField label="Amount (BDT)" required>
                        <input
                            required
                            type="number"
                            min={1}
                            value={entryForm.amount}
                            onChange={(e) => setEntryForm((p) => ({ ...p, amount: e.target.value }))}
                            placeholder="Enter amount"
                            className={iCls}
                        />
                    </FormField>
                    {entryError && (
                        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-500">
                            {entryError}
                        </p>
                    )}
                    <button
                        type="submit"
                        disabled={saving}
                        className="mt-2 w-full rounded-lg bg-green-500 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-600 disabled:opacity-60"
                    >
                        {saving ? "Saving…" : "Submit"}
                    </button>
                </form>
            </Modal>

            <ConfirmDialog
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                loading={deleting}
                title="Delete Deposit"
                message={`Delete deposit of BDT ${deleteTarget?.amount.toLocaleString()} for ${deleteTarget?.member_name}? This cannot be undone.`}
            />
        </div>
    );
}
