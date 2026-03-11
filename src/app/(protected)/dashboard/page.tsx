"use client";

import StatCard from "@/components/dashboard/StatCard";
import { useGetUsersQuery } from "@/store/services/userApi";
import { useGetDepositStatsQuery } from "@/store/services/depositsApi";

function formatBdt(n: number): string {
    return `BDT ${Number(n).toLocaleString("en-BD", { maximumFractionDigits: 0 })}`;
}

// ── Icons (inline SVG — no extra dependency needed) ─────────────
const MemberIcon = (
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
);

const CalendarIcon = (
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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
    </svg>
);

const WalletIcon = (
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
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
    </svg>
);

export default function DashboardPage() {
    const { data: usersData } = useGetUsersQuery({ limit: 1, offset: 0 });
    const { data: depositStats } = useGetDepositStatsQuery();

    const totalMembers = usersData?.count ?? 0;
    const totalDeposit = depositStats?.total_deposit ?? 0;
    const monthlyDeposit = depositStats?.monthly_deposit ?? 0;
    const yearlyDeposit = depositStats?.yearly_deposit ?? 0;

    const stats = [
        { title: "Total Members", value: String(totalMembers), icon: MemberIcon },
        { title: "Monthly Deposit", value: formatBdt(monthlyDeposit), icon: CalendarIcon },
        { title: "Yearly Deposit", value: formatBdt(yearlyDeposit), icon: CalendarIcon },
        { title: "Total Deposit", value: formatBdt(totalDeposit), icon: WalletIcon },
    ];

    return (
        <div className="space-y-8">
            {/* ── Stat Cards ──────────────────────────────────────────── */}
            <section>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 xl:grid-cols-4">
                    {stats.map((stat) => (
                        <StatCard key={stat.title} {...stat} />
                    ))}
                </div>
            </section>
        </div>
    );
}
