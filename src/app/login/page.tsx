import Login from "@/components/login/Login";
import Link from "next/link";
import React from "react";

function page() {
	return (
		<div className="flex min-h-screen flex-col">
			<header className="bg-background/80 sticky top-0 z-40 w-full border-b border-[#b4b4b4] backdrop-blur-md">
				<div className="container mx-auto pl-3 sm:pl-0">
					<div className="flex h-16 items-center justify-between">
						{/* Logo */}
						<Link
							href="/"
							className="text-lg font-bold tracking-tight"
						>
							IMF-BD
						</Link>
					</div>
				</div>
			</header>

			<Login />
		</div>
	);
}

export default page;
