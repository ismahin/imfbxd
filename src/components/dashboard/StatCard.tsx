import { ReactNode } from "react";

interface StatCardProps {
    title: string;
    value: string;
    icon: ReactNode;
}

export default function StatCard({ title, value, icon }: StatCardProps) {
    return (
        <div className="group flex flex-col gap-3 rounded-xl border border-green-200 bg-green-50 p-5 transition-all duration-200 hover:border-green-300 hover:shadow-md md:p-6">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <span className="text-gray-500 transition-colors group-hover:text-green-600">
                    {icon}
                </span>
                {title}
            </div>
            <p className="text-2xl font-bold tracking-tight text-green-600 md:text-3xl">
                {value}
            </p>
        </div>
    );
}
