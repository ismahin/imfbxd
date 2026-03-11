"use client";

import { useState } from "react";
import { HomeIcon, Mail } from "lucide-react";
import { useSubmitMessageMutation } from "@/store/services/messagesApi";
import { useGetSettingsQuery } from "@/store/services/settingsApi";
import { toast } from "sonner";

const DEFAULT_CONTACT = {
	contact_email: "Imfbd@gmail.com",
	contact_uae_address: "Fatima Al Khadim Building, Shop No. #18, (Ind. Area 17 Sharjah), United Arab Emirates.",
	contact_uae_phone: "+971526114454",
	contact_bd_address: "Holy Garden Complex 12/D Utter Auch Para Tongi West, Gazipur, Dhaka, Bangladesh.",
	contact_bd_phone: "+8801624757838",
};

export default function Contact() {
	const [form, setForm] = useState({ name: "", email: "", message: "" });
	const [submitMessage, { isLoading }] = useSubmitMessageMutation();
	const { data: settings } = useGetSettingsQuery();
	const c = settings
		? {
				contact_email: settings.contact_email || DEFAULT_CONTACT.contact_email,
				contact_uae_address: settings.contact_uae_address || DEFAULT_CONTACT.contact_uae_address,
				contact_uae_phone: settings.contact_uae_phone || DEFAULT_CONTACT.contact_uae_phone,
				contact_bd_address: settings.contact_bd_address || DEFAULT_CONTACT.contact_bd_address,
				contact_bd_phone: settings.contact_bd_phone || DEFAULT_CONTACT.contact_bd_phone,
			}
		: DEFAULT_CONTACT;

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const { name, email, message } = form;
		if (!name.trim() || !email.trim() || !message.trim()) {
			toast.error("Please fill in name, email, and message.");
			return;
		}
		try {
			await submitMessage({
				name: name.trim(),
				email: email.trim(),
				message: message.trim(),
			}).unwrap();
			toast.success("Message sent. We will get back to you soon.");
			setForm({ name: "", email: "", message: "" });
		} catch (err: unknown) {
			const msg =
				err && typeof err === "object" && "data" in err && typeof (err as { data: { detail?: string } }).data?.detail === "string"
					? (err as { data: { detail: string } }).data.detail
					: "Failed to send message. Please try again.";
			toast.error(msg);
		}
	}

	return (
		<section id="contact" className="mx-auto py-8">
			<div className="container mx-auto flex flex-row flex-wrap gap-6 sm:flex-nowrap">
				{/* Contact Us */}
				<section className="">
					<h1 className="mb-3 text-2xl font-medium text-gray-500 sm:text-4xl">
						Contact Us
					</h1>
					<p className="mb-4 max-w-xs text-sm leading-relaxed text-gray-400 sm:mb-6 sm:max-w-sm sm:text-base md:max-w-md lg:max-w-lg lg:text-lg">
						We are committed to processing the information in order to
						contact you and talk about your project.
					</p>
					<div className="flex flex-col gap-2">
						{c.contact_email && (
							<div className="flex items-center gap-4 sm:gap-4">
								<div className="shrink-0">
									<Mail className="h-6 w-6 text-green-500" />
								</div>
								<p className="text-[16px] text-gray-700 md:text-lg">
									{c.contact_email}
								</p>
							</div>
						)}
						{(c.contact_uae_address || c.contact_uae_phone) && (
							<div className="flex items-start gap-4 sm:gap-4">
								<div className="mt-1 shrink-0">
									<HomeIcon className="h-6 w-6 text-green-500" />
								</div>
								<p className="text-[16px] leading-relaxed text-gray-700 md:text-lg">
									UAE Address: {c.contact_uae_address || "—"}{" "}
									{c.contact_uae_phone && (
										<span className="block text-[16px] sm:inline md:text-lg">
											Mobile No.: {c.contact_uae_phone}
										</span>
									)}
								</p>
							</div>
						)}
						{(c.contact_bd_address || c.contact_bd_phone) && (
							<div className="flex items-start gap-4 sm:gap-4">
								<div className="mt-1 shrink-0">
									<HomeIcon className="h-6 w-6 text-green-500" />
								</div>
								<p className="text-[16px] leading-relaxed md:text-lg text-gray-700 ">
									BD Address: {c.contact_bd_address || "—"}{" "}
									{c.contact_bd_phone && (
										<span className="block sm:inline">
											Mobile No.: {c.contact_bd_phone}
										</span>
									)}
								</p>
							</div>
						)}
					</div>
				</section>

				{/* Form */}
				<form onSubmit={handleSubmit} className="flex w-full flex-col gap-3 sm:gap-4">
					<input
						type="text"
						placeholder="Name*"
						required
						value={form.name}
						onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
						className="border-primary w-full rounded-xl border-2 px-4 py-3 text-sm text-gray-500 transition-all duration-200 outline-none placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-100 sm:rounded-2xl sm:px-6 sm:text-base lg:text-lg"
					/>
					<input
						type="email"
						placeholder="Email*"
						required
						value={form.email}
						onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
						className="border-primary w-full rounded-xl border-2 px-4 py-3 text-sm text-gray-500 transition-all duration-200 outline-none placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-100 sm:rounded-2xl sm:px-6 sm:text-base lg:text-lg"
					/>
					<textarea
						placeholder="Message*"
						rows={5}
						required
						value={form.message}
						onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
						className="border-primary w-full resize-none rounded-xl border-2 px-4 py-3 text-sm text-gray-500 transition-all duration-200 outline-none placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-100 sm:rounded-2xl sm:px-6 sm:text-base lg:text-lg"
					/>
					<button
						type="submit"
						disabled={isLoading}
						className="bg-primary w-full cursor-pointer rounded-xl py-4 text-sm font-medium text-white transition-colors duration-200 hover:bg-green-500 active:bg-green-600 disabled:opacity-60 sm:rounded-2xl sm:text-base lg:text-lg xl:text-xl"
					>
						{isLoading ? "Sending…" : "Submit"}
					</button>
				</form>
			</div>
		</section>
	);
}
