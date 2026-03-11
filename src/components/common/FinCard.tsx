type FinCardColor = "green" | "blue" | "purple";

const colorStyles: Record<
    FinCardColor,
    { card: string; label: string; value: string }
> = {
    green: {
        card: "bg-green-50 border-green-200",
        label: "text-green-500",
        value: "text-green-600",
    },
    blue: {
        card: "bg-blue-50 border-blue-200",
        label: "text-blue-400",
        value: "text-blue-600",
    },
    purple: {
        card: "bg-purple-50 border-purple-200",
        label: "text-purple-400",
        value: "text-purple-600",
    },
};

export function FinCard({
    color,
    icon,
    label,
    value,
}: {
    color: FinCardColor;
    icon: React.ReactNode;
    label: string;
    value?: string | null;
}) {
    const styles = colorStyles[color];

    return (
        <div
            className={`flex flex-col gap-2 rounded-xl border p-4 ${styles.card}`}
        >
            <div
                className={`flex items-center gap-1.5 text-xs font-medium ${styles.label}`}
            >
                {icon}
                {label}
            </div>
            {value ? (
                <p className={`text-base font-bold ${styles.value}`}>{value}</p>
            ) : (
                <p className="text-sm text-gray-400 italic">N/A</p>
            )}
        </div>
    );
}
