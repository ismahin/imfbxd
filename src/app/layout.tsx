import type { Metadata } from "next";
import { Montserrat, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/components/provider/StoreProvider";
import { Toaster } from "sonner";

const montserrat = Montserrat({
	subsets: ["latin"], // include characters you need
	weight: ["400", "500", "700"], // optional: choose font weights
});

const notoSansBengali = Noto_Sans_Bengali({
	subsets: ["bengali"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-noto-bengali",
});

export const metadata: Metadata = {
	title: "Islamic Micro Finance",
	description:
		"IMF-BD - একটি স্বচ্ছ ও জবাবদিহিমূলক সমবায় আর্থিক প্রতিষ্ঠান। সদস্যদের জন্য শেয়ার, বিনিয়োগ ও আর্থিক সেবা।",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			style={{ scrollBehavior: "smooth" }}
			lang="en"
			className={`${montserrat.className} ${notoSansBengali.variable}`}
		>
			<body className="bg-background">
				<StoreProvider>{children}</StoreProvider>
				<Toaster position="top-right" richColors />
			</body>
		</html>
	);
}
