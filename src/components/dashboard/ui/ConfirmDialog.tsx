"use client";

import Modal from "./Modal";

interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    loading?: boolean;
}

export default function ConfirmDialog({
    open,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = "Delete",
    loading = false,
}: ConfirmDialogProps) {
    return (
        <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-sm">
            <p className="text-sm text-gray-600">{message}</p>
            <div className="mt-6 flex justify-end gap-3">
                <button
                    onClick={onClose}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    disabled={loading}
                    className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-60"
                >
                    {loading ? "Deleting…" : confirmLabel}
                </button>
            </div>
        </Modal>
    );
}
