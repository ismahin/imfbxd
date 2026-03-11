"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetUserDetailsQuery } from "@/store/services/userApi";
import { useGetDepositsByMemberQuery } from "@/store/services/depositsApi";
import { ErrorState, NotFoundState } from "@/components/common";
import {
    MemberHeroCard,
    MemberAddresses,
    MemberNominee,
    MemberFinancials,
    MemberBeneficiary,
    MemberTransactions,
    MemberProfileSkeleton,
    type Transaction,
} from "@/components/dashboard/members";

function formatTxDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default function MemberProfilePage() {
    const { id } = useParams() as { id: string };

    const {
        data: Member,
        isLoading,
        isError,
        error,
        refetch,
    } = useGetUserDetailsQuery(id);

    const { data: deposits = [] } = useGetDepositsByMemberQuery(Member?.uuid ?? "", {
        skip: !Member?.uuid,
    });

    const transactions: Transaction[] = deposits.map((d) => ({
        id: d.uuid,
        date: formatTxDate(d.date),
        amount: `BDT ${d.amount.toLocaleString()}`,
        channel: d.channel,
        status: d.status as Transaction["status"],
    }));

    if (isLoading) return <MemberProfileSkeleton />;

    if (isError) {
        const errorMessage =
            "status" in (error as object)
                ? `Server error (${(error as { status: number }).status}). Please try again.`
                : ((error as { message?: string })?.message ??
                  "An unexpected error occurred.");

        return <ErrorState message={errorMessage} onRetry={refetch} />;
    }

    if (!Member)
        return (
            <NotFoundState
                title="Member not found"
                description="This member profile doesn't exist or may have been removed."
            />
        );

    return (
        <div className="mx-auto max-w-3xl space-y-6 pb-8">
            <Link
                href="/dashboard/members"
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-green-600"
            >
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
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
                Back to Members
            </Link>

            <MemberHeroCard
                uuid={Member.uuid}
                name={Member.name}
                profilePicture={
                    Member.profile_picture
                        ? Member.profile_picture.startsWith("http")
                            ? Member.profile_picture
                            : process.env.NEXT_PUBLIC_API_BASE_URL
                              ? `${process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, "")}${Member.profile_picture.startsWith("/") ? "" : "/"}${Member.profile_picture}`
                              : undefined
                        : undefined
                }
                userId={Member.user_id}
                phone={Member.phone}
                accountNumber={Member.account_number}
                email={Member.email}
            />

            <MemberAddresses
                permanentAddress={Member.permanent_address}
                currentAddress={Member.current_address}
            />

            <MemberNominee
                nomineeName={Member.nominee_name}
                nomineeAddress={Member.nominee_address}
            />

            <MemberFinancials
                investAmount={Member.invest_amount}
                joiningDate={Member.joining_date}
                totalDeposits={Member.total_deposits}
            />

            <MemberBeneficiary beneficiaryRefId={Member.beneficiary_ref_id} />

            <MemberTransactions transactions={transactions} />

            {Member.referrals && Member.referrals.length > 0 && (
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
                    <h2 className="mb-3 text-base font-semibold text-gray-800">
                        Referred Members
                    </h2>
                    <p className="mb-3 text-sm text-gray-600">
                        <span className="font-semibold">
                            {Member.referrals.length}
                        </span>{" "}
                        {Member.referrals.length === 1
                            ? "member has"
                            : "members have"}{" "}
                        used this Member ID as their Beneficiary Ref. ID.
                    </p>
                    <div className="overflow-hidden rounded-xl border border-gray-100">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr className="text-left text-xs font-semibold text-gray-500">
                                    <th className="px-3 py-2.5">Member ID</th>
                                    <th className="px-3 py-2.5">Name</th>
                                    <th className="px-3 py-2.5 hidden sm:table-cell">
                                        Phone
                                    </th>
                                    <th className="px-3 py-2.5 hidden md:table-cell">
                                        Email
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {Member.referrals.map((r) => (
                                    <tr
                                        key={r.uuid}
                                        className="border-t border-gray-100 hover:bg-gray-50/60"
                                    >
                                        <td className="px-3 py-2.5 font-medium text-gray-800">
                                            {r.user_id}
                                        </td>
                                        <td className="px-3 py-2.5 text-gray-700">
                                            {r.name}
                                        </td>
                                        <td className="px-3 py-2.5 text-gray-600 hidden sm:table-cell">
                                            {r.phone || "–"}
                                        </td>
                                        <td className="px-3 py-2.5 text-gray-600 text-xs hidden md:table-cell break-all">
                                            {r.email || "–"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
