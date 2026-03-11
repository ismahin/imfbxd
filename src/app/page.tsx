"use client";

import Image from "next/image";
import Link from "next/link";
import MosqueIcon from "@mui/icons-material/Mosque";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CabinIcon from "@mui/icons-material/Cabin";
import CoverflowCarousel from "@/components/slider/CoverflowCarousel";
import { Mail, HomeIcon } from "lucide-react";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Objectives from "@/components/sections/Objectives";
import WhyIMF from "@/components/sections/WhyIMF";
import Rules from "@/components/sections/Rules";
import Gallery from "@/components/sections/Gallery";
import BoardManagement from "@/components/sections/BoardManagement";
import Contact from "@/components/sections/Contact";

const Home = () => {


	return (
		<div className="">
			{/* Header */}
			<Navbar />

			{/* Main - Content Section */}
			<main className="">
				<Hero />

				<div className="px-5 sm:px-0">
					<About />

					<Objectives />

					<WhyIMF />

					<Rules />

					<Gallery />

					<BoardManagement />

					<Contact />
				</div>
			</main>

			{/* Footer */}
			<Footer />
		</div>
	);
};

export default Home;
