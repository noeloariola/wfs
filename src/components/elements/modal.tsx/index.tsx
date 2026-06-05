'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  arrangementImages: string[];
  arrangementTitle: string;
}

export default function ArrangementModal({ isOpen, onClose, arrangementImages, arrangementTitle }: ModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % arrangementImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? arrangementImages.length - 1 : prev - 1
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="rounded-[1.5rem] border border-[var(--surface-border)] bg-white/98 p-6 max-w-4xl w-full mx-4 relative shadow-[0_30px_60px_-20px_rgba(0,0,0,0.12)]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full border border-green-200/60 bg-green-50/90 p-2 text-[var(--accent-strong)] hover:bg-green-100"
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-[var(--accent-strong)] mb-4 text-center">
          {arrangementTitle}
        </h2>

        {/* Image carousel */}
        <div className="relative">
          <div className="w-full h-96 relative overflow-hidden rounded-[1rem] bg-gray-100 border border-green-200">
            <Image
              src={arrangementImages[currentImageIndex]}
              alt={`${arrangementTitle} - Image ${currentImageIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>

          {/* Navigation buttons */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200"
          >
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200"
          >
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Image indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {arrangementImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentImageIndex 
                    ? 'bg-[var(--accent)]' 
                    : 'bg-green-200 hover:bg-green-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Image counter */}
        <div className="text-center mt-4 text-gray-600">
          {currentImageIndex + 1} of {arrangementImages.length}
        </div>
      </div>
    </div>
  );
} 