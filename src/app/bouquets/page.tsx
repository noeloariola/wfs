"use client";

import { Boquets } from "@/common/constants/products";
import ArrangementModal from "@/components/elements/modal";
import LazyLoad from "@/components/elements/lazy-load";
import Placeholder from "@/components/elements/placeholder";
import Image from "next/image";
import { useState } from "react";

export default function BouquetsPage() {
    const [selectedArrangement, setSelectedArrangement] = useState<typeof Boquets[0] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (arrangement: typeof Boquets[0]) => {
        setSelectedArrangement(arrangement);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedArrangement(null);
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                <h2 className="text-3xl font-bold text-gray-800">Bouquets</h2>
                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <input
                    type="text"
                    placeholder="Search by name or code"
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-64"
                    // value={searchTerm}
                    // onChange={handleSearchChange}
                />
                <select
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 md:w-48"
                    // value={priceFilter}
                    // onChange={handlePriceFilterChange}
                >
                    <option value="">Sort by price</option>
                    <option value="high">High to Low</option>
                    <option value="low">Low to High</option>
                </select>
                </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Boquets.map((arrangement, index) => (
                    <LazyLoad 
                        key={arrangement.id}
                        threshold={0.1}
                        rootMargin="100px"
                        placeholder={<Placeholder />}
                    >
                        <div 
                            className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform duration-200" 
                            onClick={() => openModal(arrangement)}
                        >
                            <div className="w-full h-64 bg-gray-200 rounded-lg mb-4 overflow-hidden">
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
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{arrangement.title}</h3>
                            <p className="text-sm text-gray-600 text-center"><s>₱{arrangement.price}</s> &nbsp; ₱{(arrangement.price || 0) - (arrangement.discountPrice || 0)}</p>
                        </div>
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
                />
            )}
        </div>
        // <UnderMaintenanceModePage title="Bouquets Page"></UnderMaintenanceModePage>
    );
}