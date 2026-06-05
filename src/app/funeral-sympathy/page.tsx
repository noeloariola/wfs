"use client";

import { Boquets } from "@/common/constants/products";
import ArrangementModal from "@/components/elements/modal";
import LazyLoad from "@/components/elements/lazy-load";
import Placeholder from "@/components/elements/placeholder";
import Image from "next/image";
import { useState } from "react";
import { GetFuneralAndSympathy } from "@/repository/funeral";

export default function FuneralAndSympathyPage() {
    const [selectedArrangement, setSelectedArrangement] = useState<typeof Boquets[0] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [products, setProducts] = useState(GetFuneralAndSympathy());
    const [priceFilter, setPriceFilter] = useState("");

    const handlePriceFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setPriceFilter(value);

        const sortedProducts = [...GetFuneralAndSympathy()];
        if (value === "low") {
            sortedProducts.sort((a, b) => ((a.price || 0) - (a.discountPrice || 0)) - ((b.price || 0) - (b.discountPrice || 0)));
        } else if (value === "high") {
            sortedProducts.sort((a, b) => ((b.price || 0) - (b.discountPrice || 0)) - ((a.price || 0) - (a.discountPrice || 0)));
        } else {
            setProducts(GetFuneralAndSympathy());
            return;
        }
        setProducts(sortedProducts);
    };

    const openModal = (arrangement: typeof Boquets[0]) => {
        setSelectedArrangement(arrangement);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedArrangement(null);
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-10">
            <div className="mb-8 rounded-[2rem] border border-pink-200 bg-pink-50/80 p-8 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.8)]">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <h2 className="text-4xl font-semibold text-blue-950">Funeral & Sympathy</h2>
                    <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Search by name or code"
                            className="w-full rounded-3xl border border-pink-300/70 bg-white/70 px-4 py-3 text-blue-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 md:w-64"
                        />
                        <select
                            className="w-full rounded-3xl border border-pink-300/70 bg-white/70 px-4 py-3 text-blue-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 md:w-48"
                            value={priceFilter}
                            onChange={handlePriceFilterChange}
                        >
                            <option value="">Sort by price</option>
                            <option value="high">High to Low</option>
                            <option value="low">Low to High</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((arrangement) => (
                    <LazyLoad 
                        key={arrangement.id}
                        threshold={0.1}
                        rootMargin="100px"
                        placeholder={<Placeholder />}
                    >
                        <button 
                            className="group flex flex-col items-start overflow-hidden rounded-[1.75rem] border border-pink-200 bg-white/80 p-4 text-left transition hover:-translate-y-1 hover:border-rose-300/40 hover:bg-pink-50/95" 
                            onClick={() => openModal(arrangement)}
                        >
                            <div className="relative w-full h-64 overflow-hidden rounded-[1.5rem] bg-pink-100 mb-4">
                                <Image
                                    src={arrangement.mainImage}
                                    alt={arrangement.title}
                                    width={400}
                                    height={400}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                    placeholder="blur"
                                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                                />
                            </div>
                            <h3 className="text-lg font-semibold text-blue-950 mb-2">{arrangement.title}</h3>
                            {arrangement.description && (
                                <p className="text-sm text-gray-600 mb-2">{arrangement.description}</p>
                            )}
                            {
                                arrangement.showPrice && (<p className="text-sm text-gray-700">₱{(arrangement.price || 0) - (arrangement.discountPrice || 0)}{arrangement.discountPrice && arrangement.discountPrice > 0 ? <span className="ml-2 text-xs line-through text-gray-500">₱{arrangement.price}</span> : null}</p> )
                            }
                        </button>
                    </LazyLoad>
                ))}
            </div>
            
            {/* Modal */}
            {selectedArrangement && (
                <ArrangementModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    arrangementImages={selectedArrangement.images}
                    arrangementTitle={selectedArrangement.title}
                    arrangementDescription={selectedArrangement.description}
                    productId={selectedArrangement.id}
                    productPrice={(selectedArrangement.price || 0) - (selectedArrangement.discountPrice || 0)}
                    hasWrappers={Boolean(selectedArrangement.wrappers)}
                />
            )}
        </div>
    );
}