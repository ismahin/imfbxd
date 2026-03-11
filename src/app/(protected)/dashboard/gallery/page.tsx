"use client";

import { useState, useRef } from "react";
import Modal from "@/components/dashboard/ui/Modal";
import ConfirmDialog from "@/components/dashboard/ui/ConfirmDialog";
import { FormField, SubmitButton } from "@/components/dashboard/ui/FormFields";
import { AddButton } from "@/components/dashboard/ui/TableUtils";
import {
    useGetGalleryQuery,
    useCreateGalleryMutation,
    useUpdateGalleryMutation,
    useDeleteGalleryMutation,
    type GalleryItem,
} from "@/store/services/galleryApi";
import { toast } from "sonner";

const CATEGORIES = [
    "All",
    "Events",
    "Meetings",
    "Awards",
    "Office",
    "Community",
];

const EMPTY = { title: "", category: "Events", date: "", alt: "" };
const inputCls =
    "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 bg-white";

function getImageUrl(url: string | undefined): string {
    if (!url) return "";
    const base = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_API_BASE_URL : "";
    if (!base) return url;
    return url.startsWith("http") ? url : `${base.replace(/\/$/, "")}${url.startsWith("/") ? "" : "/"}${url}`;
}

export default function GalleryPage() {
    const [filterCategory, setFilterCategory] = useState("All");
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<GalleryItem | null>(null);
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [preview, setPreview] = useState<GalleryItem | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
    const fileRef = useRef<HTMLInputElement>(null);

    const { data, isLoading } = useGetGalleryQuery({
        category: filterCategory === "All" ? undefined : filterCategory,
        limit: 500,
    });
    const [createGallery] = useCreateGalleryMutation();
    const [updateGallery] = useUpdateGalleryMutation();
    const [deleteGallery] = useDeleteGalleryMutation();

    const items = data?.results ?? [];
    const filtered = items;

    function openAdd() {
        setEditing(null);
        setForm(EMPTY);
        setImageFile(null);
        setImagePreviewUrl("");
        setModalOpen(true);
    }

    function openEdit(item: GalleryItem) {
        setEditing(item);
        setForm({
            title: item.title,
            category: item.category,
            date: item.date ?? "",
            alt: item.alt ?? "",
        });
        setImageFile(null);
        setImagePreviewUrl("");
        setModalOpen(true);
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreviewUrl(URL.createObjectURL(file));
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        try {
            if (editing) {
                await updateGallery({
                    uuid: editing.uuid,
                    body: {
                        title: form.title,
                        category: form.category,
                        date: form.date || undefined,
                        alt: form.alt || undefined,
                    },
                    image: imageFile ?? undefined,
                }).unwrap();
                toast.success("Image updated.");
            } else {
                if (!imageFile) {
                    toast.error("Please select an image file.");
                    setSaving(false);
                    return;
                }
                await createGallery({
                    title: form.title,
                    category: form.category,
                    date: form.date || undefined,
                    alt: form.alt || undefined,
                    image: imageFile,
                }).unwrap();
                toast.success("Image uploaded.");
            }
            setModalOpen(false);
        } catch (err: unknown) {
            const msg =
                err && typeof err === "object" && "data" in err && typeof (err as { data: { detail?: string } }).data?.detail === "string"
                    ? (err as { data: { detail: string } }).data.detail
                    : "Something went wrong.";
            toast.error(editing ? "Update failed" : "Upload failed", { description: msg });
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await deleteGallery(deleteTarget.uuid).unwrap();
            toast.success("Image deleted.");
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
            {/* Toolbar */}
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilterCategory(cat)}
                            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                                filterCategory === cat
                                    ? "bg-green-500 text-white shadow-sm"
                                    : "border border-gray-200 bg-white text-gray-600 hover:border-green-200 hover:bg-green-50"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <AddButton onClick={openAdd} label="Upload Image" />
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
                    Loading…
                </div>
            ) : filtered.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-400">
                    No images in this category.
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {filtered.map((item) => (
                        <div
                            key={item.uuid}
                            className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md"
                        >
                            <img
                                src={getImageUrl(item.url)}
                                alt={item.alt}
                                className="h-36 w-full cursor-pointer object-cover"
                                onClick={() => setPreview(item)}
                            />
                            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/30 group-hover:opacity-100">
                                <button
                                    onClick={() => setPreview(item)}
                                    className="rounded-lg bg-white p-1.5 text-gray-700 transition-colors hover:bg-gray-100"
                                    type="button"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => openEdit(item)}
                                    className="rounded-lg bg-white p-1.5 text-blue-600 transition-colors hover:bg-blue-50"
                                    type="button"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setDeleteTarget(item)}
                                    className="rounded-lg bg-white p-1.5 text-red-500 transition-colors hover:bg-red-50"
                                    type="button"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-2.5">
                                <p className="truncate text-xs font-medium text-gray-700">{item.title}</p>
                                <div className="mt-1 flex items-center justify-between">
                                    <span className="text-xs text-gray-400">{item.category}</span>
                                    <span className="text-xs text-gray-400">{item.date ?? "—"}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload / Edit Modal */}
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editing ? "Edit Image" : "Upload Image"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!editing && (
                        <div
                            onClick={() => fileRef.current?.click()}
                            className="cursor-pointer rounded-xl border-2 border-dashed border-gray-200 p-8 text-center transition-colors hover:border-green-300 hover:bg-green-50/30"
                        >
                            <svg
                                className="mx-auto mb-2 h-8 w-8 text-gray-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm text-gray-500">Click to select image</p>
                            <p className="mt-1 text-xs text-gray-400">PNG, JPG, WEBP up to 5MB</p>
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>
                    )}
                    {editing && (
                        <div
                            onClick={() => fileRef.current?.click()}
                            className="cursor-pointer rounded-xl border-2 border-dashed border-gray-200 p-4 text-center text-sm text-gray-500 hover:border-green-300"
                        >
                            Optional: click to replace image
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>
                    )}
                    {(imagePreviewUrl || (editing && editing.url)) && (
                        <img
                            src={imagePreviewUrl || (editing ? getImageUrl(editing.url) : "")}
                            alt="preview"
                            className="h-40 w-full rounded-lg border border-gray-200 object-cover"
                        />
                    )}
                    <FormField label="Title" required>
                        <input
                            required
                            value={form.title}
                            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                            placeholder="Image title"
                            className={inputCls}
                        />
                    </FormField>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Category">
                            <select
                                value={form.category}
                                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                                className={inputCls}
                            >
                                {["Events", "Meetings", "Awards", "Office", "Community"].map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </FormField>
                        <FormField label="Date">
                            <input
                                type="date"
                                value={form.date}
                                onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                                className={inputCls}
                            />
                        </FormField>
                    </div>
                    <FormField label="Alt text">
                        <input
                            value={form.alt}
                            onChange={(e) => setForm((p) => ({ ...p, alt: e.target.value }))}
                            placeholder="Description for accessibility"
                            className={inputCls}
                        />
                    </FormField>
                    <SubmitButton
                        loading={saving}
                        label={editing ? "Save Changes" : "Upload"}
                    />
                </form>
            </Modal>

            {/* Preview lightbox */}
            <Modal
                open={!!preview}
                onClose={() => setPreview(null)}
                title={preview?.title ?? ""}
                maxWidth="max-w-2xl"
            >
                {preview && (
                    <img
                        src={getImageUrl(preview.url)}
                        alt={preview.alt}
                        className="w-full rounded-lg"
                    />
                )}
            </Modal>

            <ConfirmDialog
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                loading={deleting}
                title="Delete Image"
                message={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
            />
        </div>
    );
}
