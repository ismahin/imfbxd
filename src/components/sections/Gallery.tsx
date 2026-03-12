"use client";

import { useGetGalleryQuery } from "@/store/services/galleryApi";
import CoverflowCarousel from "@/components/slider/CoverflowCarousel";

function getImageUrl(url: string | undefined): string {
	if (!url) return "";
	const base = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_API_BASE_URL : "";
	if (!base) return url;
	return url.startsWith("http") ? url : `${base.replace(/\/$/, "")}${url.startsWith("/") ? "" : "/"}${url}`;
}

export default function Gallery() {
	const { data, isLoading } = useGetGalleryQuery({ limit: 50 });

	const images =
		data?.results?.map((item) => ({
			src: getImageUrl(item.url) || "/assets/images/question.png",
			alt: item.alt || item.title,
		})) ?? [];

	return (
		<section className="mx-auto py-8">
			<div>
				<p className="text-center text-4xl font-bold">Gallery</p>
				{isLoading ? (
					<p className="mt-4 text-center text-sm text-gray-500">Loading gallery…</p>
				) : images.length === 0 ? (
					<p className="mt-4 text-center text-sm text-gray-500">No images in gallery yet.</p>
				) : (
					<div className="-mt-10 sm:mt-0">
						<CoverflowCarousel images={images} />
					</div>
				)}
			</div>
		</section>
	);
}
