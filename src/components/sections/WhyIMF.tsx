import Image from 'next/image'

function WhyIMF() {
	return (
		<section className="mx-auto py-8">
			<div className="container mx-auto flex flex-col gap-12">
				<p className="text-center text-6xl font-bold">Why IMF-BD?</p>

				<div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-center">
					<div className="flex flex-1 flex-col space-y-4">
						<p className="text-xl font-bold sm:text-2xl">IMF-BD কেন?</p>

						<p className="text-base font-light sm:text-lg lg:text-2xl">
							IMF-BD এমন একটি প্রতিষ্ঠান যা আপনার স্বপ্ন বিনিয়োগ কে একটি
							বড় ব্যবসায় রূপান্তিত করবে। বিনিয়োগের প্রিমিয়াম বা কিস্তি
							ব্যবস্থা এমন ভাবে ধার্য করা হয়েছে যা নিম্নবিত্ত থেকে শুরু
							করে মধ্যবিত্ত যে কোন শ্রেনীর ব্যবসায়ী অথবা চাকরিজীবি
							সদস্যের জন্য পরিশোধ যোগ্য বর্তমান প্রেক্ষাপট অনুযায়ী মোট
							ধার্যকৃত টাকা দিয়ে যেখানে কোন ব্যবসা করা কাল্পনিক সেখানে
							IMF-BD আপনাকে একটি বড় গ্লোবাল ব্যবসায়ের সুযোগ করে দিচ্ছে।
						</p>
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
		</section>
	)
}

export default WhyIMF
