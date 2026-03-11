import React from 'react'
import MosqueIcon from "@mui/icons-material/Mosque";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CabinIcon from "@mui/icons-material/Cabin";

function Hero() {
	return (
		<section
			style={{ backgroundImage: "url('/assets/images/hero_bg.jpg')" }}
			className="w-full bg-cover bg-center"
		>
			<div className="container mx-auto flex flex-col justify-center gap-5 py-10">
				<div
					style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
					className="mx-auto flex flex-col gap-5 rounded-2xl p-5"
				>
					<p className="text-center text-2xl font-medium text-black sm:text-6xl">
						Islamic Mirco Finance
					</p>
					<p className="text-center text-2xl text-[#194700] sm:text-4xl italic leading-normal">
						আপনার স্বপ্ন বিনির্মানে <br />
						আমাদের যাত্রা অপ্রতিরোধ্য।
					</p>
				</div>

				<div className="flex flex-col rounded-2xl p-5">
					<p className="text-center text-xl font-medium text-white sm:text-[32px]">
						IMF-BD হলো একটি সমবায় ভিত্তিক আর্থিক প্রতিষ্ঠান যা সদস্যদের
						আর্থিক উন্নয়ন ও নিরাপত্তা নিশ্চিত করতে প্রতিশ্রুতিবদ্ধ
					</p>
				</div>

				<div className="flex flex-col flex-wrap items-center justify-center gap-4 px-5 sm:flex-row sm:px-0 lg:justify-between">
					<div className="flex min-h-37.5 w-full flex-col items-center gap-5 rounded-2xl bg-white px-6 py-8 sm:w-[48%] lg:w-[31%]">
						<MosqueIcon fontSize="large" className="text-[#34C759]" />
						<p className="text-center">শরীয়াহ ভিত্তিক শেয়ার কাঠামো</p>
					</div>

					<div className="flex min-h-37.5 w-full flex-col items-center gap-5 rounded-2xl bg-white px-6 py-8 sm:w-[48%] lg:w-[31%]">
						<HourglassEmptyIcon
							fontSize="large"
							className="text-[#34C759]"
						/>
						<p className="text-center">বিনিয়োগের সময়সীমা ও নমনীয়তা</p>
					</div>

					<div className="flex min-h-37.5 w-full flex-col items-center gap-5 rounded-2xl bg-white px-6 py-8 sm:w-[48%] lg:w-[31%]">
						<CabinIcon fontSize="large" className="text-[#34C759]" />
						<p className="text-center">রিয়েল স্টেট ভিত্তিক ব্যবসা</p>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Hero;
