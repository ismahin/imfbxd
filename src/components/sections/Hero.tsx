"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react'
import MosqueIcon from "@mui/icons-material/Mosque";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CabinIcon from "@mui/icons-material/Cabin";
import { useGetGalleryQuery } from "@/store/services/galleryApi";
import { useGetSettingsQuery } from "@/store/services/settingsApi";

function getImageUrl(url: string | undefined): string {
	if (!url) return "";
	const base = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_API_BASE_URL : "";
	if (!base) return url;
	return url.startsWith("http") ? url : `${base.replace(/\/$/, "")}${url.startsWith("/") ? "" : "/"}${url}`;
}

function Hero() {
	const { data: heroData } = useGetGalleryQuery({ category: "Hero", limit: 50 });
	const { data: settings } = useGetSettingsQuery();
	const [activeIndex, setActiveIndex] = useState(0);
	const [previousIndex, setPreviousIndex] = useState<number | null>(null);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const transitionTimeoutRef = useRef<number | null>(null);

	const heroImages = heroData?.results ?? [];
	const slideIntervalMs = useMemo(() => {
		const fromSettings = settings?.hero_slider_interval;
		const seconds = typeof fromSettings === "number" && fromSettings >= 1 ? fromSettings : 5;
		return seconds * 1000;
	}, [settings?.hero_slider_interval]);

	function animateToIndex(nextIndex: number) {
		if (heroImages.length <= 1 || nextIndex === activeIndex) return;
		setPreviousIndex(activeIndex);
		setActiveIndex(nextIndex);
		setIsTransitioning(true);
		window.requestAnimationFrame(() => {
			setIsTransitioning(false);
		});
		if (transitionTimeoutRef.current != null) {
			window.clearTimeout(transitionTimeoutRef.current);
		}
		transitionTimeoutRef.current = window.setTimeout(() => {
			setPreviousIndex(null);
			transitionTimeoutRef.current = null;
		}, 700);
	}

	useEffect(() => {
		if (heroImages.length <= 1) return;
		const timer = window.setInterval(() => {
			setActiveIndex((prev) => {
				const next = (prev + 1) % heroImages.length;
				setPreviousIndex(prev);
				setIsTransitioning(true);
				window.requestAnimationFrame(() => {
					setIsTransitioning(false);
				});
				if (transitionTimeoutRef.current != null) {
					window.clearTimeout(transitionTimeoutRef.current);
				}
				transitionTimeoutRef.current = window.setTimeout(() => {
					setPreviousIndex(null);
					transitionTimeoutRef.current = null;
				}, 700);
				return next;
			});
		}, slideIntervalMs);
		return () => window.clearInterval(timer);
	}, [heroImages.length, slideIntervalMs]);

	useEffect(() => {
		return () => {
			if (transitionTimeoutRef.current != null) {
				window.clearTimeout(transitionTimeoutRef.current);
			}
		};
	}, []);

	useEffect(() => {
		if (heroImages.length === 0) {
			setActiveIndex(0);
			setPreviousIndex(null);
				setIsTransitioning(false);
			return;
		}
		if (activeIndex >= heroImages.length) {
			setActiveIndex(0);
		}
	}, [heroImages.length, activeIndex]);

	useEffect(() => {
		if (heroImages.length <= 1) {
			setPreviousIndex(null);
			setIsTransitioning(false);
		}
	}, [heroImages.length]);

	const activeImage = heroImages[activeIndex];
	const backgroundImage = activeImage?.url ? getImageUrl(activeImage.url) : "/assets/images/hero_bg.jpg";

	return (
		<section className="relative w-full overflow-hidden bg-center bg-cover">
			<div className="absolute inset-0">
				<div
					className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out will-change-transform ${isTransitioning ? "opacity-0 translate-x-8 scale-105" : "opacity-100 translate-x-0 scale-100"}`}
					style={{ backgroundImage: `url('${backgroundImage}')` }}
				/>
				{previousIndex !== null && heroImages[previousIndex]?.url && (
					<div
						className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out will-change-transform ${isTransitioning ? "opacity-100 translate-x-0 scale-100" : "opacity-0 -translate-x-6 scale-105"}`}
						style={{ backgroundImage: `url('${getImageUrl(heroImages[previousIndex].url)}')` }}
					/>
				)}
				<div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/45" />
			</div>
			<div className="relative z-10 container mx-auto flex flex-col justify-center gap-5 py-10">
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
					{heroImages.length > 1 && (
						<div className="mt-4 flex items-center justify-center gap-2">
							{heroImages.map((img, idx) => (
								<button
									key={img.uuid}
									type="button"
									onClick={() => animateToIndex(idx)}
									className={`h-2.5 rounded-full transition-all duration-300 ${idx === activeIndex ? "w-8 bg-white shadow-[0_0_16px_rgba(255,255,255,0.45)]" : "w-2.5 bg-white/50 hover:bg-white/80"}`}
									aria-label={`Go to slide ${idx + 1}`}
								/>
							))}
						</div>
					)}
				</div>

				<div className="flex flex-col flex-wrap items-center justify-center gap-4 px-5 sm:flex-row sm:px-0 lg:justify-between">
					<div className="flex min-h-37.5 w-full items-center gap-3 rounded-2xl bg-white px-6 py-8 sm:w-[48%] lg:w-[31%]">
						<MosqueIcon fontSize="large" className="shrink-0 text-[#34C759]" />
						<p className="flex-1 text-left text-base leading-relaxed text-gray-900">
							শরীয়াহ ভিত্তিক শেয়ার কাঠামো
						</p>
					</div>

					<div className="flex min-h-37.5 w-full items-center gap-3 rounded-2xl bg-white px-6 py-8 sm:w-[48%] lg:w-[31%]">
						<HourglassEmptyIcon
							fontSize="large"
							className="shrink-0 text-[#34C759]"
						/>
						<p className="flex-1 text-left text-base leading-relaxed text-gray-900">
							বিনিয়োগের সময়সীমা ও নমনীয়তা
						</p>
					</div>

					<div className="flex min-h-37.5 w-full items-center gap-3 rounded-2xl bg-white px-6 py-8 sm:w-[48%] lg:w-[31%]">
						<CabinIcon fontSize="large" className="shrink-0 text-[#34C759]" />
						<p className="flex-1 text-left text-base leading-relaxed text-gray-900">
							রিয়েল স্টেট ভিত্তিক ব্যবসা
						</p>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Hero;
