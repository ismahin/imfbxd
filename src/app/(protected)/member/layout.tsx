import Navbar from "@/components/layout/Navbar";
import { AuthProvider } from "@/components/provider/AuthProvider";
import React from "react";

function MemberLayout({ children }: { children: React.ReactNode }) {
	return (
		<AuthProvider requiredRole="Member">
			<div className="flex min-h-screen flex-col space-y-6 bg-gray-50">
				<Navbar />
				{children}
			</div>
		</AuthProvider>
	);
}

export default MemberLayout;
