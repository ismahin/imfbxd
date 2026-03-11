"use client";

import { useState, useMemo } from "react";
import Modal from "@/components/dashboard/ui/Modal";
import ConfirmDialog from "@/components/dashboard/ui/ConfirmDialog";
import { FormField, SubmitButton } from "@/components/dashboard/ui/FormFields";
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

type ContentStatus = "Published" | "Draft";
type ContentType = "Notice" | "News" | "Blog" | "Announcement";

interface Content {
    id: string;
    title: string;
    type: ContentType;
    author: string;
    date: string;
    status: ContentStatus;
    body: string;
}

const MOCK: Content[] = [
    {
        id: "1",
        title: "Annual General Meeting 2024",
        type: "Announcement",
        author: "Admin",
        date: "Feb 20, 2024",
        status: "Published",
        body: "The Annual General Meeting will be held on March 15, 2024.",
    },
    {
        id: "2",
        title: "New deposit policy update",
        type: "Notice",
        author: "Admin",
        date: "Feb 18, 2024",
        status: "Published",
        body: "Effective March 1, minimum monthly deposit increases to BDT 1,500.",
    },
    {
        id: "3",
        title: "IMF achieves 500 members milestone",
        type: "News",
        author: "Editor",
        date: "Feb 15, 2024",
        status: "Published",
        body: "We are proud to announce reaching 500 active members.",
    },
    {
        id: "4",
        title: "Eid special bonus scheme",
        type: "Notice",
        author: "Admin",
        date: "Feb 10, 2024",
        status: "Draft",
        body: "Draft content for Eid bonus scheme.",
    },
    {
        id: "5",
        title: "Office hours during Ramadan",
        type: "Notice",
        author: "Admin",
        date: "Feb 5, 2024",
        status: "Published",
        body: "Office will operate 9 AM – 3 PM during Ramadan.",
    },
    {
        id: "6",
        title: "Investment return Q4 2023",
        type: "Blog",
        author: "Finance",
        date: "Jan 30, 2024",
        status: "Published",
        body: "Q4 investment returns have been calculated and distributed.",
    },
    {
        id: "7",
        title: "Year-end summary 2023",
        type: "Blog",
        author: "Admin",
        date: "Jan 5, 2024",
        status: "Draft",
        body: "Year end summary draft.",
    },
];

const EMPTY = {
    title: "",
    type: "Notice" as ContentType,
    author: "",
    date: "",
    status: "Draft" as ContentStatus,
    body: "",
};
const PAGE_SIZE = 6;
const inputCls =
    "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 bg-white";

async function apiCreate(data: Omit<Content, "id">): Promise<Content> {
    // TODO: replace with real API call
    return { ...data, id: String(Date.now()) };
}
async function apiUpdate(item: Content): Promise<Content> {
    // TODO: replace with real API call
    return item;
}
async function apiDelete(_id: string): Promise<void> {
    // TODO: replace with real API call
}

export default function ContentPage() {
    const [items, setItems] = useState<Content[]>(MOCK);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("All");
    const [filterStatus, setFilterStatus] = useState("All");
    const [page, setPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Content | null>(null);
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Content | null>(null);
    const [deleting, setDeleting] = useState(false);

    const filtered = useMemo(
        () =>
            items.filter((c) => {
                const matchSearch =
                    c.title.toLowerCase().includes(search.toLowerCase()) ||
                    c.author.toLowerCase().includes(search.toLowerCase());
                const matchType = filterType === "All" || c.type === filterType;
                const matchStatus =
                    filterStatus === "All" || c.status === filterStatus;
                return matchSearch && matchType && matchStatus;
            }),
        [items, search, filterType, filterStatus],
    );

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    function openAdd() {
        setEditing(null);
        setForm(EMPTY);
        setModalOpen(true);
    }
    function openEdit(c: Content) {
        setEditing(c);
        setForm({
            title: c.title,
            type: c.type,
            author: c.author,
            date: c.date,
            status: c.status,
            body: c.body,
        });
        setModalOpen(true);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        try {
            if (editing) {
                const updated = await apiUpdate({ ...editing, ...form });
                setItems((p) =>
                    p.map((c) => (c.id === updated.id ? updated : c)),
                );
            } else {
                const created = await apiCreate(form);
                setItems((p) => [created, ...p]);
            }
            setModalOpen(false);
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await apiDelete(deleteTarget.id);
            setItems((p) => p.filter((c) => c.id !== deleteTarget.id));
            setDeleteTarget(null);
        } finally {
            setDeleting(false);
        }
    }

    const typeBadge: Record<string, string> = {
        Notice: "bg-orange-100 text-orange-700",
        News: "bg-blue-100 text-blue-700",
        Blog: "bg-purple-100 text-purple-700",
        Announcement: "bg-teal-100 text-teal-700",
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row">
                <div className="flex flex-1 flex-wrap gap-2">
                    <SearchBar
                        value={search}
                        onChange={(v) => {
                            setSearch(v);
                            setPage(1);
                        }}
                        placeholder="Search by title or author…"
                    />
                    <select
                        value={filterType}
                        onChange={(e) => {
                            setFilterType(e.target.value);
                            setPage(1);
                        }}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-200 focus:outline-none"
                    >
                        {["All", "Notice", "News", "Blog", "Announcement"].map(
                            (t) => (
                                <option key={t}>{t}</option>
                            ),
                        )}
                    </select>
                    <select
                        value={filterStatus}
                        onChange={(e) => {
                            setFilterStatus(e.target.value);
                            setPage(1);
                        }}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-200 focus:outline-none"
                    >
                        {["All", "Published", "Draft"].map((s) => (
                            <option key={s}>{s}</option>
                        ))}
                    </select>
                </div>
                <AddButton onClick={openAdd} label="Add Content" />
            </div>

            <TableWrapper>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <Th>Title</Th>
                            <Th className="hidden sm:table-cell">Type</Th>
                            <Th className="hidden md:table-cell">Author</Th>
                            <Th className="hidden lg:table-cell">Date</Th>
                            <Th>Status</Th>
                            <Th className="text-right">Actions</Th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {paginated.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-5 py-12 text-center text-sm text-gray-400"
                                >
                                    No content found.
                                </td>
                            </tr>
                        ) : (
                            paginated.map((c) => (
                                <tr
                                    key={c.id}
                                    className="transition-colors hover:bg-gray-50/60"
                                >
                                    <Td>
                                        <p className="line-clamp-1 font-medium text-gray-800">
                                            {c.title}
                                        </p>
                                        <p className="mt-0.5 line-clamp-1 text-xs text-gray-400">
                                            {c.body}
                                        </p>
                                    </Td>
                                    <Td className="hidden sm:table-cell">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${typeBadge[c.type] ?? "bg-gray-100 text-gray-600"}`}
                                        >
                                            {c.type}
                                        </span>
                                    </Td>
                                    <Td className="hidden text-gray-500 md:table-cell">
                                        {c.author}
                                    </Td>
                                    <Td className="hidden text-gray-500 lg:table-cell">
                                        {c.date}
                                    </Td>
                                    <Td>
                                        <StatusBadge status={c.status} />
                                    </Td>
                                    <Td className="text-right">
                                        <ActionMenu
                                            onEdit={() => openEdit(c)}
                                            onDelete={() => setDeleteTarget(c)}
                                        />
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

            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editing ? "Edit Content" : "Add Content"}
                maxWidth="max-w-2xl"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <FormField label="Title" required>
                        <input
                            required
                            value={form.title}
                            onChange={(e) =>
                                setForm((p) => ({
                                    ...p,
                                    title: e.target.value,
                                }))
                            }
                            placeholder="Content title"
                            className={inputCls}
                        />
                    </FormField>
                    <div className="grid grid-cols-3 gap-4">
                        <FormField label="Type">
                            <select
                                value={form.type}
                                onChange={(e) =>
                                    setForm((p) => ({
                                        ...p,
                                        type: e.target.value as ContentType,
                                    }))
                                }
                                className={inputCls}
                            >
                                {["Notice", "News", "Blog", "Announcement"].map(
                                    (t) => (
                                        <option key={t}>{t}</option>
                                    ),
                                )}
                            </select>
                        </FormField>
                        <FormField label="Author">
                            <input
                                value={form.author}
                                onChange={(e) =>
                                    setForm((p) => ({
                                        ...p,
                                        author: e.target.value,
                                    }))
                                }
                                placeholder="Author name"
                                className={inputCls}
                            />
                        </FormField>
                        <FormField label="Status">
                            <select
                                value={form.status}
                                onChange={(e) =>
                                    setForm((p) => ({
                                        ...p,
                                        status: e.target.value as ContentStatus,
                                    }))
                                }
                                className={inputCls}
                            >
                                <option>Draft</option>
                                <option>Published</option>
                            </select>
                        </FormField>
                    </div>
                    <FormField label="Body" required>
                        <textarea
                            required
                            rows={6}
                            value={form.body}
                            onChange={(e) =>
                                setForm((p) => ({ ...p, body: e.target.value }))
                            }
                            placeholder="Write content here…"
                            className={`${inputCls} resize-none`}
                        />
                    </FormField>
                    <SubmitButton
                        loading={saving}
                        label={editing ? "Save Changes" : "Publish Content"}
                    />
                </form>
            </Modal>

            <ConfirmDialog
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                loading={deleting}
                title="Delete Content"
                message={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
            />
        </div>
    );
}
