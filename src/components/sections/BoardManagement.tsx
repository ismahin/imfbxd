"use client";

import Image from "next/image";
import { useGetBoardMembersQuery } from "@/store/services/boardApi";

function getImageUrl(url: string | undefined): string {
	if (!url) return "";
	const base = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_API_BASE_URL : "";
	if (!base) return url;
	return url.startsWith("http") ? url : `${base.replace(/\/$/, "")}${url.startsWith("/") ? "" : "/"}${url}`;
}

export default function BoardManagement() {
	const { data, isLoading } = useGetBoardMembersQuery();
	const members = data?.results ?? [];

	return (
		<section className="mx-auto py-8">
			<div className="container mx-auto flex flex-col space-y-6">
				<p className="text-center text-3xl font-bold sm:text-6xl">
					Board & Management
				</p>

				{isLoading ? (
					<p className="text-center text-sm text-gray-500">Loading board members…</p>
				) : members.length === 0 ? (
					<p className="text-center text-sm text-gray-500">No board members to display.</p>
				) : (
					<div className="flex flex-wrap gap-4 justify-center sm:justify-center">
						{members.map((member) => {
							const imageUrl = getImageUrl(member.profile_picture);
							return (
								<div
									key={member.uuid}
									style={{
										background:
											"linear-gradient(160deg, #f0faf0 0%, #d4edda 100%)",
									}}
									className="flex w-full max-w-44 flex-1 flex-col items-center gap-4 rounded-3xl p-4 sm:max-w-55 sm:gap-5 sm:p-6 md:max-w-65 lg:max-w-75 lg:p-8 xl:max-w-97.5"
								>
									{/* Avatar */}
									<div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full ring-4 ring-green-200 sm:h-36 sm:w-36 md:h-44 md:w-44 lg:h-52 lg:w-52 xl:h-56 xl:w-56">
										{imageUrl ? (
											<img
												src={imageUrl}
												alt={member.name}
												className="h-full w-full object-cover object-top"
												onError={(e) => {
													(e.currentTarget as HTMLImageElement).style.display = "none";
												}}
											/>
										) : null}
										{!imageUrl && (
											<Image
												src="/assets/images/question.png"
												alt={member.name}
												fill
												className="object-cover object-top"
											/>
										)}
									</div>

									{/* Info */}
									<div className="flex flex-col items-center gap-1 text-center sm:gap-2">
										<p className="text-sm font-semibold text-gray-900 sm:text-base lg:text-lg xl:text-xl">
											{member.name}
										</p>
										<p className="text-xs text-gray-600 sm:text-sm lg:text-base xl:text-lg">
											{member.role}
										</p>
										{member.district && (
											<p className="text-xs text-gray-600 sm:text-sm lg:text-base xl:text-lg">
												{member.district}
											</p>
										)}
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</section>
	);
}
