function About() {
	return (
		<section id="about" className="mx-auto py-8">
			<div className="container mx-auto flex flex-col gap-5">
				<p className="text-secondary font-noto text-center text-4xl font-medium sm:text-7xl">
					What is IMF-BD?
				</p>

				<div className="flex flex-wrap gap-8">
					<div className="font-noto flex flex-col space-y-4 sm:flex-1">
						<p className="text-2xl sm:font-bold">
							IMF-BD(ISLAMIC MICRO FINANCE-BD) কি?
						</p>

						<p className="font-light lg:text-2xl">
							মূলত IMF-BD এটি একটি ডেভেলপমেন্ট কোম্পানী যা সম্পূর্ন <br />
							রূপে ইসলামী শরীয়াহ ভিত্তিক ভাবে পরিচালিত এই কোম্পানীর <br />
							মোট শেয়ার এর সংখ্যা ১০০০ (এক হাজার) মাত্র যার <br />
							প্রতিটি শেয়ারের মূল্য ৪০০,০০০/- টাকা যা পরিশোধের সময় সীমা ৫
							বছর বিবেচনা করা হয়েছে।
							<br />
							<br />
							প্রতি মাসে ৫০০০ * ১১ = ৫৫০০০ টাকা <br />
							এক মাসে ২৫০০০* ১ = ২৫০০০ টাকা <br />
							মোট ১২ মাসে ৮০,০০০/- টাকা পরিশোধ যোগ্য। কোন সদস্য চাইলে{" "}
							<br />
							এককালীন অথবা বছরে ২/৪ বারেও জমা করার সুযোগ বিদ্যামান।
						</p>
					</div>

					<div
						style={{
							background:
								"linear-gradient(160deg, #d4edda 0%, #a8d5b5 40%, #6dbf82 100%)",
						}}
						className="font-noto flex w-full flex-col gap-10 rounded-2xl py-8 sm:flex-1"
					>
						<div className="text-center">
							<p className="font-noto text-5xl font-bold sm:text-8xl">
								২০০+
							</p>
							<p className="text-xl font-bold sm:text-2xl">
								সক্রিয় সদস্য
							</p>
						</div>

						<div className="font-noto flex flex-row gap-10 px-4">
							<div className="flex flex-1 flex-col rounded-2xl bg-white py-4 text-center">
								<p className="font-noto text-3xl font-bold sm:text-6xl">
									৫০ লক্ষ
								</p>
								<p className="text-xl font-bold sm:text-2xl">মোট সঞ্চয়</p>
							</div>

							<div className="flex flex-1 flex-col rounded-2xl bg-white text-center">
								<p className="text-4xl font-bold sm:text-8xl">২০+</p>
								<p className="text-xl font-bold sm:text-2xl">
									প্রজেক্ট চলমান
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default About
