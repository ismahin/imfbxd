import { Skeleton } from "@/components/common";

function HeroSkeleton() {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <Skeleton className="h-24 w-24 shrink-0 rounded-2xl" />
                <div className="min-w-0 flex-1 space-y-3">
                    <Skeleton className="h-7 w-56" />
                    <div className="flex flex-wrap gap-x-6 gap-y-3 pt-1">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="space-y-1.5">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-4 w-28" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function TwoRowCardSkeleton() {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-4 flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-32" />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[1, 2].map((i) => (
                    <div
                        key={i}
                        className="space-y-2 rounded-xl border border-gray-200 bg-gray-50 p-4"
                    >
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}

function ThreeColCardSkeleton() {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-4 flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-40" />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="space-y-2 rounded-xl border border-gray-200 bg-gray-50 p-4"
                    >
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-5 w-32" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function MemberProfileSkeleton() {
    return (
        <div className="mx-auto max-w-3xl space-y-6 pb-8">
            <Skeleton className="h-5 w-32" />
            <HeroSkeleton />
            <TwoRowCardSkeleton />
            <TwoRowCardSkeleton />
            <ThreeColCardSkeleton />
        </div>
    );
}
