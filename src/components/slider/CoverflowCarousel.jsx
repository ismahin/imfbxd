// components/CoverflowCarousel.jsx
'use client'; // This is important for Next.js App Router to use client-side features

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Import custom styles (create a CSS file as shown below)
import './CoverflowCarousel.css';

const CoverflowCarousel = ({ images }) => {
	return (
		<Swiper
			effect={'coverflow'}
			grabCursor={true}
			centeredSlides={true}
			slidesPerView={'auto'}
			coverflowEffect={{
				rotate: 50,
				stretch: 0,
				depth: 100,
				modifier: 1,
				slideShadows: true,
			}}
			pagination={{ clickable: true }}
			navigation={true}
			modules={[EffectCoverflow, Pagination, Navigation]}
			className="mySwiper"
		>
			{images.map((image, index) => (
				<SwiperSlide key={index}>
					<img src={image.src} alt={image.alt} />
				</SwiperSlide>
			))}
		</Swiper>
	);
};

export default CoverflowCarousel;
