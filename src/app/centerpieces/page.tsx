"use client";

import ArrangementModal from "@/components/elements/modal";
import LazyLoad from "@/components/elements/lazy-load";
import Placeholder from "@/components/elements/placeholder";
import Image from "next/image";
import { useState } from "react";
import { GetFlowerBox } from "@/repository/flower_box/flower_box";
import { ArrangementData } from "@/common/constants/app";

export default function CenterpiecesPage() {
    const [selectedArrangement, setSelectedArrangement] = useState<ArrangementData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [products, setProducts] = useState(GetFlowerBox());
    const [priceFilter, setPriceFilter] = useState("");

    const handlePriceFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setPriceFilter(value);

        const sortedProducts = [...GetFlowerBox()];
        if (value === "low") {
            sortedProducts.sort((a, b) => ((a.price || 0) - (a.discountPrice || 0)) - ((b.price || 0) - (b.discountPrice || 0)));
        } else if (value === "high") {
            sortedProducts.sort((a, b) => ((b.price || 0) - (b.discountPrice || 0)) - ((a.price || 0) - (a.discountPrice || 0)));
        } else {
            setProducts(GetFlowerBox());
            return;
        }
        setProducts(sortedProducts);
    };

    const openModal = (arrangement: ArrangementData) => {
        setSelectedArrangement(arrangement);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedArrangement(null);
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-10">
            <div className="mb-8 rounded-[2rem] border surface-muted-card p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.12)]">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <h2 className="text-4xl font-semibold text-[var(--foreground)]">Flower Box</h2>
                    <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Search by name or code"
                            className="w-full rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)] px-4 py-3 text-[var(--foreground)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 md:w-64"
                        />
                        <select
                            className="w-full rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)] px-4 py-3 text-[var(--foreground)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 md:w-48"
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

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-6 gap-6">
                {products.map((arrangement) => (
                    <LazyLoad 
                        key={arrangement.id}
                        threshold={0.1}
                        rootMargin="100px"
                        placeholder={<Placeholder />}
                    >
                        <button 
                            className="group flex w-full flex-col items-start overflow-hidden rounded-[1.75rem] bg-[var(--surface)] p-4 text-left transition hover:-translate-y-1 hover:shadow-lg shadow-md" 
                            onClick={() => openModal(arrangement)}
                        >
                            <div className="relative w-full h-64 overflow-hidden rounded-[1.5rem] bg-[var(--surface-border)] mb-4">
                                <Image
                                    src={arrangement.mainImage}
                                    alt={arrangement.title}
                                    fill
                                    sizes="100vw"
                                    className="object-cover"
                                    loading="lazy"
                                    placeholder="blur"
                                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                                />
                            </div>
                            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">{arrangement.title}</h3>
                            {
                                arrangement.showPrice && (<p className="text-sm text-[var(--foreground)]">₱{(arrangement.price || 0) - (arrangement.discountPrice || 0)}{arrangement.discountPrice && arrangement.discountPrice > 0 ? <span className="ml-2 text-xs line-through text-[var(--surface-border)]">₱{arrangement.price}</span> : null}</p> )
                            }
                        </button>
                    </LazyLoad>
                ))}
            </div>
            
            {selectedArrangement && (
                <ArrangementModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    arrangementImages={selectedArrangement.images}
                    arrangementTitle={selectedArrangement.title}
                    arrangementDescription={selectedArrangement.description}
                    productId={selectedArrangement.id}
                    productYoutubeId={selectedArrangement.youtubeId}
                    productPrice={(selectedArrangement.price || 0) - (selectedArrangement.discountPrice || 0)}
                />
            )}
        </div>
    );
}