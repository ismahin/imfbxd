"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import Modal from "@/components/dashboard/ui/Modal";
import ConfirmDialog from "@/components/dashboard/ui/ConfirmDialog";
import { FormField, SubmitButton } from "@/components/dashboard/ui/FormFields";
import { AddButton, TableWrapper, Th, Td } from "@/components/dashboard/ui/TableUtils";
import { useCreateRuleMutation, useDeleteRuleMutation, useGetRulesQuery } from "@/store/services/rulesApi";

const inputCls =
  "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 bg-white";

export default function ContentPage() {
  const { data, isLoading } = useGetRulesQuery();
  const [createRule] = useCreateRuleMutation();
  const [deleteRule] = useDeleteRuleMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", display_order: "0" });
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<{ uuid: string; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const rules = useMemo(() => data?.results ?? [], [data]);

  function openAdd() {
    setForm({ title: "", body: "", display_order: String(rules.length) });
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await createRule({
        title: form.title.trim(),
        body: form.body.trim(),
        display_order: Number(form.display_order) || 0,
      }).unwrap();
      toast.success("Rule added.");
      setModalOpen(false);
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err && typeof (err as { data?: { detail?: string } }).data?.detail === "string"
          ? (err as { data: { detail: string } }).data.detail
          : "Failed to add rule.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteRule(deleteTarget.uuid).unwrap();
      toast.success("Rule deleted.");
      setDeleteTarget(null);
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err && typeof (err as { data?: { detail?: string } }).data?.detail === "string"
          ? (err as { data: { detail: string } }).data.detail
          : "Failed to delete rule.";
      toast.error(msg);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Rules Management</h2>
          <p className="text-sm text-gray-500">Add or delete rules shown on the public Rules section.</p>
        </div>
        <AddButton onClick={openAdd} label="Add Rule" />
      </div>

      <TableWrapper>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <Th>Title</Th>
              <Th>Rule Text</Th>
              <Th>Order</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-sm text-gray-400">Loading rules...</td>
              </tr>
            ) : rules.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-sm text-gray-400">No rules added yet.</td>
              </tr>
            ) : (
              rules.map((rule) => (
                <tr key={rule.uuid} className="transition-colors hover:bg-gray-50/60">
                  <Td>
                    <p className="font-medium text-gray-800">{rule.title}</p>
                  </Td>
                  <Td>
                    <p className="line-clamp-2 text-gray-600">{rule.body}</p>
                  </Td>
                  <Td className="text-gray-500">{rule.display_order}</Td>
                  <Td className="text-right">
                    <button
                      type="button"
                      onClick={() => setDeleteTarget({ uuid: rule.uuid, title: rule.title })}
                      className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </TableWrapper>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Rule" maxWidth="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Rule Title" required>
            <input
              required
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="Enter rule title"
              className={inputCls}
            />
          </FormField>

          <FormField label="Rule Content" required>
            <textarea
              required
              rows={7}
              value={form.body}
              onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
              placeholder="Write rule details"
              className={`${inputCls} resize-y`}
            />
          </FormField>

          <FormField label="Display Order">
            <input
              type="number"
              min={0}
              value={form.display_order}
              onChange={(e) => setForm((p) => ({ ...p, display_order: e.target.value }))}
              className={inputCls}
            />
          </FormField>

          <SubmitButton loading={saving} label="Save Rule" />
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Rule"
        message={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
      />
    </div>
  );
}
