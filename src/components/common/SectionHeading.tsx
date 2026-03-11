export function SectionHeading({
    icon,
    title,
}: {
    icon: React.ReactNode;
    title: string;
}) {
    return (
        <div className="mb-4 flex items-center gap-2">
            <span className="text-green-500">{icon}</span>
            <h2 className="text-base font-semibold text-gray-800">{title}</h2>
        </div>
    );
}
