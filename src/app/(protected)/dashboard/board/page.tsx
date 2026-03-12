"use client";

import { useState, useRef } from "react";
import Modal from "@/components/dashboard/ui/Modal";
import ConfirmDialog from "@/components/dashboard/ui/ConfirmDialog";
import { FormField, SubmitButton } from "@/components/dashboard/ui/FormFields";
import { AddButton } from "@/components/dashboard/ui/TableUtils";
import {
    useGetBoardMembersQuery,
    useCreateBoardMemberMutation,
    useUpdateBoardMemberMutation,
    useDeleteBoardMemberMutation,
    type BoardMember,
} from "@/store/services/boardApi";
import { toast } from "sonner";

const EMPTY: Omit<BoardMember, "id" | "uuid" | "created_at"> = {
    name: "",
    role: "",
    phone: "",
    email: "",
    since: "",
    bio: "",
    order: 0,
    district: "",
};
const inputCls =
    "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 bg-white";

const roleColors: Record<string, string> = {
    President: "bg-yellow-100 text-yellow-800",
    "Vice President": "bg-orange-100 text-orange-800",
    "General Secretary": "bg-blue-100 text-blue-800",
    Treasurer: "bg-green-100 text-green-800",
    "Joint Secretary": "bg-purple-100 text-purple-700",
    "Executive Member": "bg-gray-100 text-gray-700",
};

function getImageUrl(url: string | undefined): string {
    if (!url) return "";
    const base = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_API_BASE_URL : "";
    if (!base) return url;
    return url.startsWith("http") ? url : `${base.replace(/\/$/, "")}${url.startsWith("/") ? "" : "/"}${url}`;
}

export default function BoardPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<BoardMember | null>(null);
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<BoardMember | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
    const [profilePreviewUrl, setProfilePreviewUrl] = useState<string>("");
    const fileRef = useRef<HTMLInputElement>(null);

    const { data, isLoading } = useGetBoardMembersQuery();
    const [createBoardMember] = useCreateBoardMemberMutation();
    const [updateBoardMember] = useUpdateBoardMemberMutation();
    const [deleteBoardMember] = useDeleteBoardMemberMutation();

    const members = data?.results ?? [];
    const sorted = [...members].sort((a, b) => a.order - b.order);

    function openAdd() {
        setEditing(null);
        setForm({ ...EMPTY, order: members.length + 1 });
        setProfilePictureFile(null);
        setProfilePreviewUrl("");
        setModalOpen(true);
    }

    function openEdit(m: BoardMember) {
        setEditing(m);
        setForm({
            name: m.name,
            role: m.role,
            phone: m.phone ?? "",
            email: m.email ?? "",
            since: m.since ?? "",
            bio: m.bio ?? "",
            order: m.order,
            district: m.district ?? "",
        });
        setProfilePictureFile(null);
        setProfilePreviewUrl(getImageUrl(m.profile_picture) || "");
        setModalOpen(true);
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setProfilePictureFile(file);
            setProfilePreviewUrl(URL.createObjectURL(file));
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        try {
            if (editing) {
                await updateBoardMember({
                    uuid: editing.uuid,
                    body: {
                        name: form.name,
                        role: form.role,
                        phone: form.phone || undefined,
                        email: form.email || undefined,
                        since: form.since || undefined,
                        bio: form.bio || undefined,
                        order: form.order,
                        district: form.district || undefined,
                    },
                    profile_picture: profilePictureFile ?? undefined,
                }).unwrap();
                toast.success("Board member updated.");
            } else {
                await createBoardMember({
                    name: form.name,
                    role: form.role,
                    phone: form.phone || undefined,
                    email: form.email || undefined,
                    since: form.since || undefined,
                    bio: form.bio || undefined,
                    order: form.order,
                    district: form.district || undefined,
                    profile_picture: profilePictureFile ?? undefined,
                }).unwrap();
                toast.success("Board member added.");
            }
            setModalOpen(false);
        } catch (err: unknown) {
            const msg =
                err && typeof err === "object" && "data" in err && typeof (err as { data: { detail?: string } }).data?.detail === "string"
                    ? (err as { data: { detail: string } }).data.detail
                    : "Something went wrong.";
            toast.error(editing ? "Update failed" : "Add failed", { description: msg });
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await deleteBoardMember(deleteTarget.uuid).unwrap();
            toast.success("Board member removed.");
            setDeleteTarget(null);
        } catch (err: unknown) {
            const msg =
                err && typeof err === "object" && "data" in err && typeof (err as { data: { detail?: string } }).data?.detail === "string"
                    ? (err as { data: { detail: string } }).data.detail
                    : "Delete failed.";
            toast.error(msg);
        } finally {
            setDeleting(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <AddButton onClick={openAdd} label="Add Board Member" />
            </div>

            {isLoading ? (
                <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
                    Loading…
                </div>
            ) : sorted.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
                    No board members yet. Add one to get started.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {sorted.map((m) => (
                        <div
                            key={m.uuid}
                            className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md"
                        >
                            <div className="mb-4 flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    {m.profile_picture ? (
                                        <img
                                            src={getImageUrl(m.profile_picture)}
                                            alt={m.name}
                                            className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-green-200"
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).style.display = "none";
                                            }}
                                        />
                                    ) : null}
                                    {!m.profile_picture && (
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-600 text-lg font-bold text-white shadow-sm">
                                            {m.name.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-800">{m.name}</h3>
                                        <span
                                            className={`mt-0.5 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${roleColors[m.role] ?? "bg-gray-100 text-gray-600"}`}
                                        >
                                            {m.role}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                    <button
                                        type="button"
                                        onClick={() => openEdit(m)}
                                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                                    >
                                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDeleteTarget(m)}
                                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                                    >
                                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {m.bio && (
                                <p className="mb-3 line-clamp-2 text-xs text-gray-500">{m.bio}</p>
                            )}

                            <div className="space-y-1.5 text-xs text-gray-500">
                                {m.phone && (
                                    <div className="flex items-center gap-2">
                                        <svg className="h-3.5 w-3.5 shrink-0 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        {m.phone}
                                    </div>
                                )}
                                {m.email && (
                                    <div className="flex items-center gap-2">
                                        <svg className="h-3.5 w-3.5 shrink-0 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        {m.email}
                                    </div>
                                )}
                                {(m.since || m.district) && (
                                    <div className="flex items-center gap-2">
                                        <svg className="h-3.5 w-3.5 shrink-0 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {[m.since && `Since ${m.since}`, m.district].filter(Boolean).join(" · ")}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editing ? "Edit Board Member" : "Add Board Member"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Profile picture */}
                    <div>
                        <p className="mb-1.5 text-xs font-medium text-gray-600">Profile picture (optional)</p>
                        <div
                            onClick={() => fileRef.current?.click()}
                            className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 p-3 transition-colors hover:border-green-300 hover:bg-green-50/30"
                        >
                            {(profilePreviewUrl || (editing?.profile_picture && !profilePictureFile)) ? (
                                <img
                                    src={profilePreviewUrl || getImageUrl(editing!.profile_picture)}
                                    alt="Preview"
                                    className="h-14 w-14 rounded-full object-cover"
                                />
                            ) : (
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            )}
                            <span className="text-sm text-gray-500">Click to {profilePreviewUrl || editing?.profile_picture ? "change" : "add"} photo</span>
                            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                        </div>
                    </div>

                    <FormField label="Full Name" required>
                        <input
                            required
                            value={form.name}
                            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                            placeholder="Full name"
                            className={inputCls}
                        />
                    </FormField>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Role / Position" required>
                            <input
                                required
                                value={form.role}
                                onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                                placeholder="e.g. President"
                                className={inputCls}
                            />
                        </FormField>
                        <FormField label="District">
                            <input
                                value={form.district}
                                onChange={(e) => setForm((p) => ({ ...p, district: e.target.value }))}
                                placeholder="e.g. Dhaka"
                                className={inputCls}
                            />
                        </FormField>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Phone">
                            <input
                                value={form.phone}
                                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                                placeholder="+880 17XX-XXXXXX"
                                className={inputCls}
                            />
                        </FormField>
                        <FormField label="Email">
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                                placeholder="email@imf.org"
                                className={inputCls}
                            />
                        </FormField>
                    </div>
                    <FormField label="Member Since">
                        <input
                            value={form.since}
                            onChange={(e) => setForm((p) => ({ ...p, since: e.target.value }))}
                            placeholder="e.g. 2022"
                            className={inputCls}
                        />
                    </FormField>
                    <FormField label="Display Order">
                        <input
                            type="number"
                            min={1}
                            value={form.order}
                            onChange={(e) => setForm((p) => ({ ...p, order: Number(e.target.value) || 0 }))}
                            className={inputCls}
                        />
                    </FormField>
                    <FormField label="Bio">
                        <textarea
                            rows={3}
                            value={form.bio}
                            onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                            placeholder="Short biography…"
                            className={`${inputCls} resize-none`}
                        />
                    </FormField>
                    <SubmitButton loading={saving} label={editing ? "Save Changes" : "Add Member"} />
                </form>
            </Modal>

            <ConfirmDialog
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                loading={deleting}
                title="Remove Board Member"
                message={`Remove "${deleteTarget?.name}" from the board? This cannot be undone.`}
            />
        </div>
    );
}
