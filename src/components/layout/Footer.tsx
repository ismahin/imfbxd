"use client";

import Link from "next/link";
import { RiInstagramLine, RiLinkedinLine, RiFacebookLine, RiTwitterXLine } from "react-icons/ri";
import { useGetSettingsQuery } from "@/store/services/settingsApi";

const footerLinks = {
	Blog: ["Company", "Career", "Mobile", "How it works"],
	About: ["Contacts", "About us", "FAQ", "Our Team", "Terms of service"],
	Product: ["Terms of use", "Privacy policy", "Log in"],
};

export default function Footer() {
	const { data: settings } = useGetSettingsQuery();
	const brandName = settings?.org_name || "IMF-BD";
	const footerEmail = settings?.footer_email || "imfbd@gmail.com";
	const footerPhone = settings?.footer_phone || "+971526114454";
	const social = {
		instagram: settings?.instagram_url || "#",
		linkedin: settings?.linkedin_url || "#",
		facebook: settings?.facebook_url || "#",
		twitter: settings?.twitter_url || "#",
	};

	return (
		<footer className="w-full bg-white border-t py-8 border-gray-100">
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-6 xl:gap-10 container mx-auto px-5 sm:px-0">
				{/* Brand Column */}
				<div className="col-span-2 sm:col-span-3 lg:col-span-1 flex flex-col gap-3">
					<h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
						{brandName}
					</h2>
					{footerEmail && (
						<p className="text-sm sm:text-base text-gray-500">
							{footerEmail}
						</p>
					)}
					{footerPhone && (
						<p className="text-sm sm:text-base text-gray-500">
							{footerPhone}
						</p>
					)}

					{/* Social Icons */}
					<div className="flex items-center gap-4 mt-2">
						<Link href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
							<RiInstagramLine className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500 hover:text-purple-700 transition-colors" />
						</Link>
						<Link href={social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
							<RiLinkedinLine className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500 hover:text-purple-700 transition-colors" />
						</Link>
						<Link href={social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
							<RiFacebookLine className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500 hover:text-purple-700 transition-colors" />
						</Link>
						<Link href={social.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter / X">
							<RiTwitterXLine className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500 hover:text-purple-700 transition-colors" />
						</Link>
					</div>
				</div>

				{/* Link Columns */}
				{Object.entries(footerLinks).map(([heading, links]) => (
					<div key={heading} className="flex flex-col gap-3">
						<h3 className="text-sm sm:text-base font-bold text-gray-900">
							{heading}
						</h3>
						<ul className="flex flex-col gap-2 sm:gap-3">
							{links.map((link) => (
								<li key={link}>
									<Link
										href="#"
										className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 transition-colors"
									>
										{link}
									</Link>
								</li>
							))}
						</ul>
					</div>
				))}

				{/* Download App Column */}
				<div className="flex flex-col gap-3">
					<h3 className="text-sm sm:text-base font-bold text-gray-900">
						Download App
					</h3>
					<ul className="flex flex-col gap-3">
						<li>
							<Link
								href="#"
								className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 hover:text-gray-900 transition-colors"
							>
								{/* Google Play Icon */}
								<svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
									<path d="M3 20.5v-17c0-.83 1-.83 1.5-.5l15 8.5-15 8.5C3.5 20.5 3 20.5 3 20.5z" fill="#7C3AED" />
									<path d="M3 3.5L13.5 14 3 20.5V3.5z" fill="#9333EA" opacity="0.5" />
								</svg>
								Google Play
							</Link>
						</li>
						<li>
							<Link
								href="#"
								className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 hover:text-gray-900 transition-colors"
							>
								{/* Apple Icon */}
								<svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" viewBox="0 0 24 24" fill="#7C3AED">
									<path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
								</svg>
								Apple Store
							</Link>
						</li>
					</ul>
				</div>
			</div>

			{/* Bottom bar */}
			<div className="mt-4 border-t border-[#b4b4b4] text-center">
				<p className="text-xs sm:text-sm text-gray-400">
					© {new Date().getFullYear()} {brandName}. All rights reserved.
				</p>
			</div>
		</footer>
	);
}