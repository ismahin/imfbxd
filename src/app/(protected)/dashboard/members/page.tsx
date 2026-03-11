"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Modal from "@/components/dashboard/ui/Modal";
import ConfirmDialog from "@/components/dashboard/ui/ConfirmDialog";
import { FormField } from "@/components/dashboard/ui/FormFields";
import Pagination from "@/components/dashboard/ui/Pagination";
import {
    SearchBar,
    AddButton,
    StatusBadge,
    ActionMenu,
    TableWrapper,
    Th,
    Td,
} from "@/components/dashboard/ui/TableUtils";
import {
    useCreateUserMutation,
    useGetUsersQuery,
    useUpdateUserMutation,
    userApi,
} from "@/store/services/userApi";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { toast } from "sonner";

// ── Types ────────────────────────────────────────────────────────
type UserType = "Admin" | "Member";

interface MemberForm {
    email?: string;
    name?: string;
    password?: string;
    confirm_password?: string;
    phone?: string;
    account_number?: string;
    nominee_name?: string;
    nominee_phone?: string;
    permanent_address?: string;
    current_address?: string;
    nominee_address?: string;
    beneficiary_ref_id?: string;
    user_type?: UserType | string;
    joining_date?: string;
}

const EMPTY_FORM = {
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    phone: "",
    account_number: "",
    nominee_name: "",
    nominee_phone: "",
    permanent_address: "",
    current_address: "",
    nominee_address: "",
    beneficiary_ref_id: "",
    user_type: "",
    joining_date: "",
};

const PAGE_SIZE = 8;

const iCls =
    "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white " +
    "focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 " +
    "placeholder:text-gray-400 transition-colors";

const iDisabledCls =
    "w-full px-3 py-2.5 text-sm border border-gray-100 rounded-lg bg-gray-50 " +
    "text-gray-400 cursor-not-allowed";

// ── Component ────────────────────────────────────────────────────
export default function MembersPage() {
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [page, setPage] = useState(1);

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<{ uuid: string; profile_picture?: string }>();
    const [form, setForm] = useState(EMPTY_FORM);
    const [pwError, setPwError] = useState("");
    const [saving, setSaving] = useState(false);
    const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);

    const dispatch = useDispatch();
    const token = useSelector((state: RootState) => state.auth.accessToken);
    const baseUrl = (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE_URL) || "";

    function profileImageUrl(path: string | null | undefined): string | null {
        if (!path) return null;
        if (path.startsWith("http")) return path;
        const base = baseUrl.replace(/\/$/, "");
        const p = path.startsWith("/") ? path : `/${path}`;
        return base ? `${base}${p}` : null;
    }

    // const [deleteTarget, setDeleteTarget] = useState<Member | undefined>(undefined);
    const [deleting, setDeleting] = useState(false);

    // All User Related API Calling
    const { data: { results: members } = { results: [] } } = useGetUsersQuery();
    const [createUser] = useCreateUserMutation();
    const [updateUser] = useUpdateUserMutation();

    // console.log(members);
    // console.log("error", error);
    // console.log("editing: ", editing);

    // ── Filter ───────────────────────────────────────────────────
    const filtered = useMemo(
        () =>
            members.filter((m) => {
                const q = search.toLowerCase();
                const matchQ =
                    m.name?.toLowerCase().includes(q) ||
                    m.phone?.includes(q) ||
                    m.email?.toLowerCase().includes(q);
                const matchStatus =
                    filterStatus === "All" ||
                    (filterStatus === "Active" && m.is_active) ||
                    (filterStatus === "Inactive" && !m.is_active);
                return matchQ && matchStatus;
            }),
        [members, search, filterStatus],
    );

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    // ── Modal helpers ────────────────────────────────────────────
    function openAdd() {
        setEditing(undefined);
        setForm(EMPTY_FORM);
        setPwError("");
        setProfilePictureFile(null);
        setProfilePicturePreview(null);
        setModalOpen(true);
    }

    function openEdit(m: { uuid: string; name?: string; email?: string; phone?: string; account_number?: string; nominee_name?: string; nominee_phone?: string; permanent_address?: string; current_address?: string; nominee_address?: string; beneficiary_ref_id?: string | null; user_type?: string; joining_date?: string; profile_picture?: string }) {
        setEditing(m);
        setForm({
            name: m.name ?? "",
            email: m.email ?? "",
            password: "",
            confirm_password: "",
            phone: m.phone ?? "",
            account_number: m.account_number ?? "",
            nominee_name: m.nominee_name ?? "",
            nominee_phone: m.nominee_phone ?? "",
            permanent_address: m.permanent_address ?? "",
            current_address: m.current_address ?? "",
            nominee_address: m.nominee_address ?? "",
            beneficiary_ref_id: m.beneficiary_ref_id ?? "",
            user_type: m.user_type ?? "",
            joining_date: m.joining_date ?? "",
        });
        setPwError("");
        setProfilePictureFile(null);
        setProfilePicturePreview(profileImageUrl(m.profile_picture) || null);
        setModalOpen(true);
    }

    function handleProfilePictureChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file && /^image\/(jpeg|png|gif|webp)$/i.test(file.type)) {
            setProfilePictureFile(file);
            setProfilePicturePreview(URL.createObjectURL(file));
        } else if (!file) {
            setProfilePictureFile(null);
            setProfilePicturePreview(profileImageUrl(editing?.profile_picture) || null);
        }
    }

    // ── Submit ───────────────────────────────────────────────────
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setPwError("");

        if (!editing) {
            if ((form.password ?? "").length < 8) {
                setPwError("Password must be at least 8 characters.");
                return;
            }
            if (form.password !== form.confirm_password) {
                setPwError("Passwords do not match.");
                return;
            }
        } else if (form.password) {
            if (form.password !== form.confirm_password) {
                setPwError("Passwords do not match.");
                return;
            }
        }

        setSaving(true);

        const useFormData = Boolean(profilePictureFile);

        if (useFormData && !baseUrl) {
            toast.error("Cannot upload image", {
                description: "Set NEXT_PUBLIC_API_BASE_URL in .env (e.g. http://localhost:8000) and restart the app.",
            });
            setSaving(false);
            return;
        }

        try {
            if (useFormData && baseUrl) {
                const fd = new FormData();
                fd.append("name", form.name ?? "");
                fd.append("email", form.email ?? "");
                if (form.password) fd.append("password", form.password);
                fd.append("phone", form.phone ?? "");
                fd.append("account_number", form.account_number ?? "");
                fd.append("nominee_name", form.nominee_name ?? "");
                fd.append("nominee_phone", form.nominee_phone ?? "");
                fd.append("permanent_address", form.permanent_address ?? "");
                fd.append("current_address", form.current_address ?? "");
                fd.append("nominee_address", form.nominee_address ?? "");
                fd.append("beneficiary_ref_id", form.beneficiary_ref_id ?? "");
                fd.append("user_type", form.user_type ?? "Member");
                fd.append("joining_date", form.joining_date ?? "");
                if (profilePictureFile) fd.append("profile_picture", profilePictureFile);

                const url = editing
                    ? `${baseUrl}/api/web/v1/users/${editing.uuid}/update/`
                    : `${baseUrl}/api/web/v1/users/`;
                const method = editing ? "PATCH" : "POST";
                const headers: HeadersInit = {};
                if (token) headers["Authorization"] = `Bearer ${token}`;

                const res = await fetch(url, { method, body: fd, credentials: "include", headers });
                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error((data as { detail?: string }).detail ?? res.statusText);
                }
                dispatch(userApi.util.invalidateTags(["Users"]));
                toast.success(editing ? "Member updated" : "Member added", {
                    description: editing
                        ? `${form.name}'s profile has been saved successfully.`
                        : `${form.name} has been registered as a new member.`,
                });
                setModalOpen(false);
            } else {
                if (editing) {
                    await updateUser({ uuid: editing.uuid, body: form });
                    toast.success("Member updated", {
                        description: `${form.name}'s profile has been saved successfully.`,
                    });
                } else {
                    const { confirm_password, ...payload } = form;
                    await createUser({ ...payload });
                    toast.success("Member added", {
                        description: `${payload?.name} has been registered as a new member.`,
                    });
                }
                setModalOpen(false);
            }
        } catch (err) {
            const msg =
                err instanceof Error
                    ? err.message
                    : "Something went wrong. Please try again.";
            toast.error(editing ? "Update failed" : "Create failed", {
                description: msg,
            });
        } finally {
            setSaving(false);
        }
    }

    // ── Delete ───────────────────────────────────────────────────
    async function handleDelete() {
        // if (!deleteTarget) return;
        setDeleting(true);
        try {
            // await apiDelete(deleteTarget.id);
            // setMembers((p) => p.filter((m) => m.id !== deleteTarget.id));
            // setDeleteTarget(undefined);
        } finally {
            setDeleting(false);
        }
    }

    // ── Generic field updater ────────────────────────────────────
    function f(key: keyof MemberForm) {
        return (
            e: React.ChangeEvent<
                HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
            >,
        ) => setForm((p) => ({ ...p, [key]: e.target.value }));
    }

    return (
        <div className="space-y-6">
            {/* ── Toolbar ──────────────────────────────────────────────── */}
            <div className="flex flex-col justify-between gap-3 sm:flex-row">
                <div className="flex flex-1 gap-2">
                    <SearchBar
                        value={search}
                        onChange={(v) => {
                            setSearch(v);
                            setPage(1);
                        }}
                        placeholder="Search by name, phone or email…"
                    />
                    <select
                        value={filterStatus}
                        onChange={(e) => {
                            setFilterStatus(e.target.value);
                            setPage(1);
                        }}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-200 focus:outline-none"
                    >
                        {["All", "Active", "Inactive"].map((s) => (
                            <option key={s}>{s}</option>
                        ))}
                    </select>
                </div>
                <AddButton onClick={openAdd} label="Add Member" />
            </div>

            {/* ── Table ────────────────────────────────────────────────── */}
            <TableWrapper>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <Th>Member</Th>
                            <Th className="hidden md:table-cell">Phone</Th>
                            <Th className="hidden lg:table-cell">Email</Th>
                            <Th className="hidden lg:table-cell">Joined</Th>
                            <Th className="hidden sm:table-cell">Deposit</Th>
                            <Th>Status</Th>
                            <Th className="text-right">Actions</Th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {paginated.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-5 py-12 text-center text-sm text-gray-400"
                                >
                                    No members found.
                                </td>
                            </tr>
                        ) : (
                            paginated.map((m) => (
                                <tr
                                    key={m.user_id}
                                    className="transition-colors hover:bg-gray-50/60"
                                >
                                    <Td>
                                        <div className="flex items-center gap-3">
                                            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-green-100">
                                                {profileImageUrl(m.profile_picture) ? (
                                                    <img
                                                        src={profileImageUrl(m.profile_picture)!}
                                                        alt=""
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="flex h-full w-full items-center justify-center text-xs font-bold text-green-700">
                                                        {m.name?.charAt(0) ?? "?"}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">
                                                    {m.name}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    #{m.user_id}
                                                </p>
                                            </div>
                                        </div>
                                    </Td>
                                    <Td className="hidden text-gray-500 md:table-cell">
                                        {m.phone}
                                    </Td>
                                    <Td className="hidden text-gray-500 lg:table-cell">
                                        {m.email}
                                    </Td>
                                    <Td className="hidden text-gray-500 lg:table-cell">
                                        {m.joining_date}
                                    </Td>
                                    {/* Deposit column — wire to real data when available */}
                                    <Td className="hidden font-medium text-green-700 sm:table-cell">
                                        {m.total_deposits}
                                    </Td>
                                    <Td>
                                        <StatusBadge
                                            status={
                                                m.is_active
                                                    ? "Active"
                                                    : "Inactive"
                                            }
                                        />
                                    </Td>
                                    <Td className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={`/dashboard/members/${m.uuid}`}
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-green-700 transition-colors hover:bg-green-100"
                                                title="View profile"
                                            >
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
                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                    />
                                                </svg>
                                                <span className="hidden sm:inline">
                                                    Details
                                                </span>
                                            </Link>
                                            <ActionMenu
                                                onEdit={() => m.uuid && openEdit({ ...m, uuid: m.uuid })}
                                                onDeactivate={async () => {
                                                    try {
                                                        await updateUser({
                                                            uuid: m.uuid!,
                                                            body: { is_active: !m.is_active },
                                                        }).unwrap();
                                                        toast.success(m.is_active ? "Member de-activated." : "Member activated.");
                                                    } catch (e) {
                                                        toast.error(e && typeof e === "object" && "data" in e && typeof (e as { data: unknown }).data === "object" && (e as { data: { detail?: string } }).data?.detail
                                                            ? (e as { data: { detail: string } }).data.detail
                                                            : "Failed to update status.");
                                                    }
                                                }}
                                                isActive={m.is_active !== false}
                                            />
                                        </div>
                                    </Td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    totalItems={filtered.length}
                    pageSize={PAGE_SIZE}
                />
            </TableWrapper>

            {/* ── Add / Edit Modal ─────────────────────────────────────── */}
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editing ? "Edit Member" : "Add New Member"}
                maxWidth="max-w-2xl"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Profile Picture */}
                    <FormField label="Profile picture (optional)">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-50">
                                {profilePicturePreview ? (
                                    <img
                                        src={profilePicturePreview}
                                        alt="Preview"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="flex h-full w-full items-center justify-center text-2xl text-gray-400">
                                        ?
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col gap-1">
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/gif,image/webp"
                                    onChange={handleProfilePictureChange}
                                    className="text-sm text-gray-600 file:mr-2 file:rounded-lg file:border-0 file:bg-green-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-green-700 hover:file:bg-green-100"
                                />
                                <p className="text-xs text-gray-400">
                                    JPEG, PNG, GIF or WebP. Max 5MB.
                                </p>
                            </div>
                        </div>
                    </FormField>

                    {/* Name + Email */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField label="Name" required>
                            <input
                                required
                                value={form.name}
                                onChange={f("name")}
                                placeholder="Full name"
                                className={iCls}
                            />
                        </FormField>
                        <FormField label="Email" required>
                            {editing ? (
                                /* Email is NOT editable on edit */
                                <div>
                                    <input
                                        value={form.email}
                                        disabled
                                        className={iDisabledCls}
                                        title="Email cannot be changed"
                                    />
                                    <p className="mt-1 text-xs text-gray-400">
                                        Email cannot be changed after
                                        registration.
                                    </p>
                                </div>
                            ) : (
                                <input
                                    required
                                    type="email"
                                    value={form.email}
                                    onChange={f("email")}
                                    placeholder="email@example.com"
                                    className={iCls}
                                />
                            )}
                        </FormField>
                    </div>

                    {/* Mobile No. + Account No. */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField label="Mobile No." required>
                            <input
                                required
                                type="tel"
                                value={form.phone}
                                onChange={f("phone")}
                                placeholder="+880 17XX-XXXXXX"
                                className={iCls}
                            />
                        </FormField>
                        <FormField label="Account No." required>
                            <input
                                required
                                value={form.account_number}
                                onChange={f("account_number")}
                                placeholder="e.g. ACC-6465464"
                                className={iCls}
                            />
                        </FormField>
                    </div>

                    {/* Nominee Name (half width) */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField label="Nominee Name" required>
                            <input
                                required
                                value={form.nominee_name}
                                onChange={f("nominee_name")}
                                placeholder="Nominee full name"
                                className={iCls}
                            />
                        </FormField>
                    </div>

                    {/* Permanent Address */}
                    <FormField label="Permanent Address" required>
                        <textarea
                            required
                            rows={2}
                            value={form.permanent_address}
                            onChange={f("permanent_address")}
                            placeholder="Village / Road, Thana, District"
                            className={`${iCls} resize-none`}
                        />
                    </FormField>

                    {/* Current Address */}
                    <FormField label="Current Address" required>
                        <textarea
                            required
                            rows={2}
                            value={form.current_address}
                            onChange={f("current_address")}
                            placeholder="Village / Road, Thana, District"
                            className={`${iCls} resize-none`}
                        />
                    </FormField>

                    {/* Nominee Address */}
                    <FormField label="Nominee Address" required>
                        <textarea
                            required
                            rows={2}
                            value={form.nominee_address}
                            onChange={f("nominee_address")}
                            placeholder="Nominee's full address"
                            className={`${iCls} resize-none`}
                        />
                    </FormField>

                    {/* Joining Date + Beneficiary Ref ID */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField label="Joining Date" required>
                            <input
                                required
                                type="date"
                                value={form.joining_date}
                                onChange={f("joining_date")}
                                className={iCls}
                            />
                        </FormField>
                        <FormField
                            label="Beneficiary Ref. ID NO. (if exists)"
                            required
                        >
                            <input
                                required
                                value={form.beneficiary_ref_id}
                                onChange={f("beneficiary_ref_id")}
                                placeholder="e.g. IMF0802"
                                className={iCls}
                            />
                        </FormField>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-100" />

                    {/* Create Password + User Type */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField
                            label={editing ? "New Password" : "Create Password"}
                            required={!editing}
                        >
                            <input
                                required={!editing}
                                type="password"
                                value={form.password}
                                onChange={f("password")}
                                placeholder={
                                    editing
                                        ? "Leave blank to keep current"
                                        : "Min. 8 characters"
                                }
                                className={iCls}
                            />
                        </FormField>
                        <FormField label="User Type" required>
                            <select
                                required
                                value={form.user_type}
                                onChange={f("user_type")}
                                className={iCls}
                            >
                                <option value="Admin">Admin</option>
                                <option value="Member">Member</option>
                            </select>
                        </FormField>
                    </div>

                    {/* Confirm Password (half width) */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField label="Confirm Password" required={!editing}>
                            <input
                                required={!editing}
                                type="password"
                                value={form.confirm_password}
                                onChange={f("confirm_password")}
                                placeholder="Re-enter password"
                                className={iCls}
                            />
                        </FormField>
                    </div>

                    {/* Password error */}
                    {pwError && (
                        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-500">
                            {pwError}
                        </p>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                        <button
                            type="button"
                            onClick={() => setModalOpen(false)}
                            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-green-500 px-6 py-2.5 text-sm font-medium text-white shadow-sm shadow-green-200 transition-colors hover:bg-green-600 disabled:opacity-60"
                        >
                            {saving
                                ? "Saving…"
                                : editing
                                  ? "Save Changes"
                                  : "Submit"}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* ── Delete Confirm ───────────────────────────────────────── */}
            {/* <ConfirmDialog
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(undefined)}
                onConfirm={handleDelete}
                loading={deleting}
                title="Delete Member"
                message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
            /> */}
        </div>
    );
}
