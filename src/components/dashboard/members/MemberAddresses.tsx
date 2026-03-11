import { InfoBox, SectionHeading } from "@/components/common";

export function MemberAddresses({
    permanentAddress,
    currentAddress,
}: {
    permanentAddress?: string | null;
    currentAddress?: string | null;
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
            <SectionHeading
                title="Addresses"
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
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                    </svg>
                }
            />
            <div className="space-y-3">
                <InfoBox label="Permanent Address:" value={permanentAddress} />
                <InfoBox label="Current Address:" value={currentAddress} />
            </div>
        </div>
    );
}
