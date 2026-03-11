export function InfoBox({
    label,
    value,
}: {
    label: string;
    value?: string | null;
}) {
    return (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <p className="mb-1 text-xs font-medium text-gray-500">{label}</p>
            {value ? (
                <p className="text-sm text-gray-700">{value}</p>
            ) : (
                <p className="text-sm text-gray-400 italic">Not provided</p>
            )}
        </div>
    );
}
