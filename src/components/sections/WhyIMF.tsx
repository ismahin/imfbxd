"use client";

import Image from 'next/image'
import { useMemo, useState } from 'react';
import Modal from '@/components/dashboard/ui/Modal';
import { useGetSettingsQuery } from '@/store/services/settingsApi';

const DEFAULT_WHY_TITLE = "Why IMF-BD?";
const DEFAULT_WHY_SUBTITLE = "IMF-BD কেন?";
const DEFAULT_WHY_TEXT = "IMF-BD এমন একটি প্রতিষ্ঠান যা আপনার স্বপ্ন বিনিয়োগ কে একটি বড় ব্যবসায় রূপান্তিত করবে। বিনিয়োগের প্রিমিয়াম বা কিস্তি ব্যবস্থা এমন ভাবে ধার্য করা হয়েছে যা নিম্নবিত্ত থেকে শুরু করে মধ্যবিত্ত যে কোন শ্রেনীর ব্যবসায়ী অথবা চাকরিজীবি সদস্যের জন্য পরিশোধ যোগ্য বর্তমান প্রেক্ষাপট অনুযায়ী মোট ধার্যকৃত টাকা দিয়ে যেখানে কোন ব্যবসা করা কাল্পনিক সেখানে IMF-BD আপনাকে একটি বড় গ্লোবাল ব্যবসায়ের সুযোগ করে দিচ্ছে।";

function WhyIMF() {
	const { data: settings } = useGetSettingsQuery();
	const [open, setOpen] = useState(false);

	const title = settings?.why_imf_title?.trim() || DEFAULT_WHY_TITLE;
	const subtitle = settings?.why_imf_subtitle?.trim() || DEFAULT_WHY_SUBTITLE;
	const description = settings?.why_imf_text?.trim() || DEFAULT_WHY_TEXT;
	const shouldShowMore = useMemo(() => description.length > 240, [description]);

	return (
		<section className="mx-auto py-8">
			<div className="container mx-auto flex flex-col gap-12">
				<p className="text-center text-6xl font-bold">{title}</p>

				<div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-center">
					<div className="flex flex-1 flex-col space-y-4">
						<p className="text-xl font-bold sm:text-2xl">{subtitle}</p>

						<div className="relative overflow-hidden rounded-2xl border border-green-200/70 bg-gradient-to-br from-white/75 via-[#f6f7ea] to-[#edf4df] p-5 shadow-sm sm:p-6">
							<p className="line-clamp-5 whitespace-pre-line text-base font-light sm:text-lg lg:text-2xl">
								{description}
							</p>
							{shouldShowMore && (
								<>
									<div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#f1f4e4] via-[#f1f4e4]/90 to-transparent" />
								</>
							)}
						</div>

						{shouldShowMore && (
							<div className="flex justify-end">
								<button
									type="button"
									onClick={() => setOpen(true)}
									className="inline-flex w-fit items-center gap-2 rounded-lg border border-green-600 bg-green-50 px-4 py-2 text-sm font-semibold text-green-800 transition-all hover:bg-green-100"
								>
									<span>Read more</span>
									<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
									</svg>
								</button>
							</div>
						)}
					</div>

					<div className="flex shrink-0 justify-center lg:justify-end">
						<Image
							src="/assets/images/question.png"
							alt="Land for sale"
							width={400}
							height={400}
							className="h-48 w-48 object-contain sm:h-64 sm:w-64 lg:h-100 lg:w-100"
						/>
					</div>
				</div>
			</div>

			<Modal open={open} onClose={() => setOpen(false)} title={subtitle} maxWidth="max-w-3xl">
				<p className="whitespace-pre-line text-base leading-relaxed text-gray-700 sm:text-lg">
					{description}
				</p>
			</Modal>
		</section>
	)
}

export default WhyIMF
