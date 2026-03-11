import Image from 'next/image'

const AimsObjectives = [
	{
		name: "জমি ক্রয় বিক্রয়",
		src: "/assets/images/land.png",
	},
	{
		name: "ফ্ল্যাট ক্রয় বিক্রয়",
		src: "/assets/images/flat.png",
	},
	{
		name: "আবাসিক হোটেল ও কমার্শিয়াল ভবন নির্মাণ",
		src: "/assets/images/hotel.png",
	},
]

function Objectives() {
	return (
		<section id='projects' className="mx-auto py-8">
			<div className="container mx-auto flex flex-col space-y-6">
				<p className="text-center text-3xl font-bold sm:text-6xl">
					Aims & Objectives
				</p>

				<p className="text-center text-xl font-bold sm:text-3xl">
					{
						"IMF-BD এর মূল লক্ষ্য উদ্দেশ্য ব্যবসা মাত্র। যা শুধু মাত্র কিছু নির্ধারিত ব্যবসা কার্যক্রমের মধ্যে সীমাবদ্দ।"
					}
				</p>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{/* <div
										style={{
											background:
												"linear-gradient(160deg, #d4edda 0%, #a8d5b5 40%, #6dbf82 100%)",
										}}
										className="flex flex-col items-center gap-8 rounded-2xl p-4"
									>
										<Image
											src="/assets/images/land.png"
											alt="Land for sale"
											width={360}
											height={360}
											className="h-auto w-full"
										/>
										<p className="text-center">জমি ক্রয় বিক্রয়</p>
									</div>
	
									<div
										style={{
											background:
												"linear-gradient(160deg, #d4edda 0%, #a8d5b5 40%, #6dbf82 100%)",
										}}
										className="flex flex-col items-center gap-8 rounded-2xl p-4"
									>
										<Image
											src="/assets/images/land.png"
											alt="Land for sale"
											width={360}
											height={360}
											className="h-auto w-full"
										/>
										<p className="text-center">জমি ক্রয় বিক্রয়</p>
									</div>
	
									<div
										style={{
											background:
												"linear-gradient(160deg, #d4edda 0%, #a8d5b5 40%, #6dbf82 100%)",
										}}
										className="flex flex-col items-center gap-8 rounded-2xl p-4 sm:col-span-2 lg:col-span-1"
									>
										<Image
											src="/assets/images/land.png"
											alt="Land for sale"
											width={360}
											height={360}
											className="h-auto w-full"
										/>
										<p className="text-center">জমি ক্রয় বিক্রয়</p>
									</div> */}
					{AimsObjectives.map((aims, i) => (
						<div
							key={i}
							style={{
								background:
									"linear-gradient(160deg, #d4edda 0%, #a8d5b5 40%, #6dbf82 100%)",
							}}
							className="flex flex-col items-center gap-8 rounded-2xl p-4"
						>
							<Image
								src={`${aims?.src}`}
								alt="Land for sale"
								width={360}
								height={360}
								className="h-auto w-full"
							/>
							<p className="text-center">{aims.name}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}

export default Objectives
