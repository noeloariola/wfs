'use client';

import { useState } from 'react';
import { featuredArrangements } from "@/common/constants/app";
import Image from "next/image";
import ArrangementModal from "@/components/elements/modal";
import Carousel from "@/components/elements/carousel";

// Banner images for carousel
const bannerImages = [
  "/app/home-banner.jpg",
  "/app/featured_arrangement/R12A.jpeg",
  "/app/featured_arrangement/R14.jpg",
  "/app/featured_arrangement/S9RO.jpg",
  "/app/featured_arrangement/T3.jpg"
];

// YouTube video data
const youtubeVideos = [
  {
    id: "4E-HjMycMkg",
    title: "50pcs Purple Carnation",
    description: "Big bouquet of purple carnations"
  },
  {
    id: "LkPz1f4H4JE",
    title: "Assorted Flowers",
    description: "Beautiful assorted flowers"
  },
  {
    id: "4yhHUzhNFjc",
    title: "1 Dozen White Roses",
    description: "Beautiful bouquet of white roses"
  }
];

export default function Home() {
  const [selectedArrangement, setSelectedArrangement] = useState<typeof featuredArrangements[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (arrangement: typeof featuredArrangements[0]) => {
    setSelectedArrangement(arrangement);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArrangement(null);
  };

  return (
    <div>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex justify-center relative w-full h-full">
          {/* Mobile Carousel - Hidden on Desktop */}
          <div className="md:hidden w-full h-[50vh]">
            <Carousel
              images={bannerImages}
              alt="Wel's Flower Shop Banner"
              autoPlay={true}
              interval={4000}
              className="w-full h-full"
            />
          </div>

          {/* Desktop Single Image - Hidden on Mobile */}
          <div className="hidden md:block w-full">
            <Image
              src="/app/home-banner.jpg"
              alt="Wel's Flower Shop Banner"
              width={1000}
              height={1000}
              quality={90}
              className="w-full"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-bold drop-shadow-md text-7xl duration-300  hover:scale-110">
                Wel's Flower Shop
              </span>
            </div>
          </div>
        </div>
        
        {/* Featured Arrangements Section */}
        <div className="w-full max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Featured Arrangements
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredArrangements.map((arrangement) => (
              <div 
                className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform duration-200" 
                key={arrangement.id}
                onClick={() => openModal(arrangement)}
              >
                <div className="w-full h-64 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  <Image
                    src={arrangement.mainImage}
                    alt={arrangement.title}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{arrangement.title}</h3>
                <p className="text-sm text-gray-600 text-center">{arrangement.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* YouTube Videos Section */}
        <div className="w-full max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Floral Design Videos
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {youtubeVideos.map((video) => (
              <div key={video.id} className="flex flex-col">
                <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden mb-4">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{video.title}</h3>
                <p className="text-sm text-gray-600">{video.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Modal */}
        {selectedArrangement && (
          <ArrangementModal
            isOpen={isModalOpen}
            onClose={closeModal}
            arrangementImages={selectedArrangement.images}
            arrangementTitle={selectedArrangement.title}
          />
        )}
      </main>
    </div>
  );
}
