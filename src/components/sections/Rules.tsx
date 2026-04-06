"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import Modal from "@/components/dashboard/ui/Modal";
import { useGetRulesQuery } from "@/store/services/rulesApi";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RuleCardProps {
	uuid?: string;
	title: string;
	body: string;
	icon?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const RULES: RuleCardProps[] = [
	{
		title: "পরিচালনা ও ব্যাবস্থাপনা",
		body: "IMF-BD প্রতিষ্ঠানটির পরিচালনা ও ব্যবস্থাপনার বিষয়ে বিবেচনা করে একটি বোর্ড তৈরি করা হয়। যেখানে সদস্যের সংখ্যা ১০ জন। এই ১০ জনের বোর্ড সদস্য দ্বারা প্রতিষ্ঠানটি পরিচালিত হবে। আর বাকি সদস্যগন পরামর্শ দাতা হিসেবে কাজ করবে। যুক্তিযুক্ত পরামর্শের ক্ষেত্রে সকল সদস্য গনের মতামত বিবেচনা সাপেক্ষ।",
	},
	{
		title: "লাভ ক্ষতির বন্টন পদ্ধতি",
		body: "IMF-BD যেহেতু একটি যৌথ প্রতিষ্ঠান, সেহেতু এর লাভ ক্ষতির অংশ সকল সদস্যগন সমান ভাবে বহন করিবে। কোন সদস্যের একাধিক শেয়ার থাকলে তার লাভ ও ক্ষতির বন্টন পদ্ধতি মোট শেয়ারের অনুপাতিক হারে বিবেচিত হবে।",
	},
	{
		title: "হিসাবরক্ষন পদ্ধতি ও নীতিমালা",
		body: "IMF-BD প্রতিষ্ঠানটির পরিচালনা ও ব্যবস্থাপনা বোর্ডের সিদ্ধান্ত অনুযায়ী এই প্রতিষ্ঠানের একটি যৌথ হিসাব খোলা হয়েছে যা চলমান। হিসাবের সুষ্ঠতার বিষয় বিবেচনা করে বোর্ড সদস্যগন এই প্রতিষ্ঠানের মহিলা সদস্যগন এর মধ্য থেকে ৪ জনকে বিবেচিত করে হিসাব খুলতে একমত হয়। যা বর্তমানে যৌথ হিসাব অনুসারে বাংলাদেশ ইসলামী ব্যাংক টঙ্গী কলেজ গেট শাখায় রেজিষ্টারকৃত।",
	},
	{
		title: "অনাকাক্ষিত বা মৃতজনিত কারন এর শর্তাবলী",
		body: "IMF-BD এই প্রতিষ্ঠানের বোর্ড সদস্য গনের সম্মতিক্রমে একটি সিদ্ধান্ত বিবেচনা করে। যে কোন সদস্য কোন অনাকাঙ্খিত ঘটনার স্বীকার হলে বা মৃত্যুজনিত কারন এর স্বীকার হলে IMF-BD এর বোর্ড সদস্যগন ঐ সদস্যের নমীনির সাথে যোগাযোগ করে একটি গ্রহনযোগ্য সিদ্ধান্ত নিবে যা ভুক্তভোগী সদস্যের অনুকুলে থাকবে। যদি ভুক্তভোগী সদস্যের নমীনি তা চলমান রাখতে চায় তার সুযোগ ও আছে।",
	},
	{
		title: "সদস্য অবসান",
		body: "IMF-BD যেহেতু একটি যৌথ প্রতিষ্ঠান এখানে দলমত নির্বিশেষে সবার সদস্য হওয়ার সুযোগ আছে। IMF-BD এর শৃংখলা ও নিয়মাবলী বিষয় অনেক গুরুত্বপূর্ন। কোন সদস্য যদি কোন কারন বসত IMF-BD এর নিয়ম নীতি লঙ্গন করে বা IMF-BD এর অপপ্রচার করে বা ভুল ভাবে উপস্থাপন করে। তাহলে ঐ সদস্য অবসানে IMF-BD কর্তৃপক্ষ অধীকার রাখে।",
	},
	{
		title: "সদস্য বৃদ্ধিকরন",
		body: "IMF-BD যেহেতু একটি যৌথ প্রতিষ্ঠান এর মূল লক্ষ্য ও উদ্দেশ্য বিষয় হিসেবে সদস্য বৃদ্ধিকরন একটি সবচেয়ে গুরুত্বপূর্ন কাজ। এ ক্ষেত্রে সদস্য বৃদ্ধিকরনই প্রতিষ্ঠানটির সাফল্যের একমাত্র উৎস। তাই IMF-BD সদস্য বৃদ্ধিকরনের জন্য একটি বিশেষ সুযোগ তৈরি করে।",
	},
];

// ─── RuleCard ─────────────────────────────────────────────────────────────────

function RuleCard({ title, body }: RuleCardProps) {
	const [open, setOpen] = useState(false);
	const hasOverflow = useMemo(() => body.length > 220, [body]);

	return (
		<div className="flex h-full flex-col gap-4 rounded-2xl border-2 border-green-400 p-4 sm:gap-5 sm:p-6">
			{/* Icon */}
			<div className="h-12 w-12 shrink-0 sm:h-14 sm:w-14 lg:h-16 lg:w-16">
				<Image
					src="/assets/images/question.png"
					alt=""
					aria-hidden="true"
					width={64}
					height={64}
					className="h-full w-full object-contain"
				/>
			</div>

			{/* Title */}
			<p className="text-lg font-bold sm:text-xl lg:text-2xl">
				{title}
			</p>

			{/* Body */}
			<p className="line-clamp-6 whitespace-pre-line text-sm font-light leading-relaxed text-gray-800 sm:text-base lg:text-lg">
				{body}
			</p>

			{hasOverflow && (
				<div className="mt-auto flex justify-end">
					<button
						type="button"
						onClick={() => setOpen(true)}
						className="inline-flex items-center gap-2 rounded-md border border-green-600 px-3 py-1.5 text-sm font-medium text-green-700 transition-colors hover:bg-green-50"
					>
						Read more
						<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
						</svg>
					</button>
				</div>
			)}

			<Modal open={open} onClose={() => setOpen(false)} title={title} maxWidth="max-w-2xl">
				<p className="whitespace-pre-line text-base leading-relaxed text-gray-700 sm:text-lg">
					{body}
				</p>
			</Modal>
		</div>
	);
}

// ─── Rules Section ────────────────────────────────────────────────────────────

export default function Rules() {
	const { data } = useGetRulesQuery();
	const liveRules = data?.results ?? [];
	const rules = liveRules.length > 0 ? liveRules : RULES;

	return (
		<section className="mx-auto py-8 sm:py-12 lg:py-16">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				{/* Heading */}
				<p className="mb-8 text-center text-4xl font-bold sm:mb-10 sm:text-5xl lg:mb-12 lg:text-6xl">
					Rules
				</p>

				{/* Grid: 1 col → 2 col → 3 col */}
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
					{rules.map((rule) => (
						<RuleCard key={rule.uuid ?? rule.title} title={rule.title} body={rule.body} />
					))}
				</div>
			</div>
		</section>
	);
}