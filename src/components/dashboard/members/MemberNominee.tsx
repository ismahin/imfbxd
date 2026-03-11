import { InfoBox, SectionHeading } from "@/components/common";

export function MemberNominee({
    nomineeName,
    nomineeAddress,
}: {
    nomineeName?: string | null;
    nomineeAddress?: string | null;
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
            <SectionHeading
                title="Nominee Information"
                icon={
                    <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                    </svg>
                }
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <InfoBox label="Nominee:" value={nomineeName} />
                <InfoBox label="Nominee Address:" value={nomineeAddress} />
            </div>
        </div>
    );
}
