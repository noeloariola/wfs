'use client';

import { useState } from 'react';
import { featuredArrangements } from "@/common/constants/app";
import Image from "next/image";
import ArrangementModal from "@/components/elements/modal";
import Carousel from "@/components/elements/carousel";

const bannerImages = [
  "/app/home-banner.jpg",
  "/app/featured_arrangement/ROSE25-1/ROSE25-1.1.jpg",
  "/app/featured_arrangement/REDBLK-1/REDBLK-1.1.jpg",
  "/app/featured_arrangement/SUN12-1/SUN12-1.1.jpg",
  "/app/featured_arrangement/T3-1/T3-1.1.jpg"
];

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
    <div className="mx-auto max-w-7xl px-4 py-10">
      <section className="grid gap-10 overflow-hidden rounded-[2rem] border border-[var(--surface-border)] bg-[var(--accent-strong)] p-8 shadow-[0_10px_30px_-10px_rgba(31,58,94,0.18)] lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-6">
          <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20">
            Wel&#39;s Flower Shop
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Premium custom bouquets with modern floral design.
          </h1>
          <p className="max-w-2xl text-[#dbe3ef] leading-8">
            Create a unique arrangement with fresh stems, elegant palettes, and thoughtful finishing touches. Our floral experience blends artisanal craftsmanship with a refined modern look.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] bg-[var(--surface)] p-5 ring-1 ring-[var(--surface-border)]">
              <p className="text-sm uppercase tracking-[0.3em] text-[#6c7a91]">Featured</p>
              <p className="mt-3 text-2xl font-semibold text-[var(--accent-strong)]">Curated blooms</p>
            </div>
            <div className="rounded-[1.75rem] bg-[var(--surface)] p-5 ring-1 ring-[var(--surface-border)]">
              <p className="text-sm uppercase tracking-[0.3em] text-[#6c7a91]">Design videos</p>
              <p className="mt-3 text-2xl font-semibold text-[var(--accent-strong)]">Inspiration</p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-[2rem] border border-[var(--surface-border)] bg-[var(--surface)] shadow-[inset_0_0_0_1px_rgba(31,58,94,0.05)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(31,58,94,0.14),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(138,151,120,0.12),_transparent_30%)]" />
          <div className="relative h-[420px] w-full">
            <Image src="/app/home-banner.jpg" alt="Wel's Flower Shop Banner" fill className="object-cover" />
            <div className="absolute inset-0 bg-[#1f3a5e]/20" />
            <div className="absolute bottom-8 left-8 z-10 rounded-[1.5rem] border border-[var(--surface-border)] bg-white/95 p-6 backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.3em] text-[var(--accent)]">Fresh Arrangements</p>
              <h2 className="mt-3 text-3xl font-semibold text-[var(--accent-strong)]">Bloom with confidence</h2>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 rounded-[2rem] border border-[var(--surface-border)] bg-[var(--surface-muted)] p-8 shadow-[0_10px_30px_-10px_rgba(31,58,94,0.12)]">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#6c7a91]">Featured Arrangements</p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">Discover our best sellers</h2>
          </div>
          <div className="rounded-full border border-[var(--surface-border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--foreground)]">
            {featuredArrangements.length} arrangements
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featuredArrangements.map((arrangement) => (
            <button key={arrangement.id} onClick={() => openModal(arrangement)} className="group overflow-hidden rounded-[1.75rem] border border-[var(--surface-border)] bg-[var(--surface)] p-4 text-left transition hover:-translate-y-1 hover:border-[var(--accent)] hover:bg-[var(--surface-muted)]">
              <div className="relative h-64 overflow-hidden rounded-[1.5rem] bg-gray-200">
                <Image src={arrangement.mainImage} alt={arrangement.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="mt-4">
                <p className="text-lg font-semibold text-[var(--accent-strong)]">{arrangement.title}</p>
                <p className="mt-2 text-sm text-gray-600">{arrangement.description}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-[2rem] border border-[var(--surface-border)] bg-[var(--surface-muted)] p-8 shadow-[0_10px_30px_-10px_rgba(31,58,94,0.12)]">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#6c7a91]">Floral Design Videos</p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">Watch our latest designs</h2>
          </div>
          <div className="rounded-full border border-[var(--surface-border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--foreground)]">
            {youtubeVideos.length} videos
          </div>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {youtubeVideos.map((video) => (
            <div key={video.id} className="overflow-hidden rounded-[1.75rem] border border-[var(--surface-border)] bg-[var(--surface)] shadow-[0_8px_30px_-15px_rgba(31,58,94,0.08)]">
              <div className="relative h-64 overflow-hidden bg-gray-200">
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  className="h-full w-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold text-[var(--accent-strong)]">{video.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{video.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedArrangement && (
        <ArrangementModal
          isOpen={isModalOpen}
          onClose={closeModal}
          arrangementImages={selectedArrangement.images}
          arrangementTitle={selectedArrangement.title}
          productId={selectedArrangement.id}
          productYoutubeId={selectedArrangement.youtubeId}
        />
      )}
    </div>
  );
}
