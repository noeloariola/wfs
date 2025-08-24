"use client";

import { Boquets } from "@/common/constants/products";
import UnderMaintenanceModePage from "@/common/maintenance";
import ArrangementModal from "@/components/elements/modal";
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
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Bouquets
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Boquets.map((arrangement) => (
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