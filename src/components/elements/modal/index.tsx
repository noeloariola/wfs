'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  arrangementImages: string[];
  arrangementTitle: string;
  arrangementDescription?: string;
}

export default function ArrangementModal({ isOpen, onClose, arrangementImages, arrangementTitle, arrangementDescription }: ModalProps) {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 h-screen overflow-auto">
      <div className="bg-white rounded-lg p-4 max-w-6xl w-full mx-4 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="fixed top-4 right-4 text-gray-500 hover:text-gray-700 text-5xl font-bold"
        >
          ×
        </button>

        {/* Main content: image left, title/labels right on md+ */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image area (square on md+) */}
          <div className="w-full md:w-1/2">
            <div className="w-full aspect-square relative overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={arrangementImages[currentImageIndex]}
                alt={`${arrangementTitle} - Image ${currentImageIndex + 1}`}
                fill
                className="object-contain"
              />

              {/* Navigation buttons (overlay) */}
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200"
                aria-label="Previous image"
              >
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200"
                aria-label="Next image"
              >
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Details area (title, description, indicators) */}
          <div className="w-full md:w-1/2 flex flex-col justify-start">
            <h2 className="md:text-2xl font-bold text-gray-800 mb-2 text-left">{arrangementTitle}</h2>

            {/* Image counter */}
            <div className="text-sm text-gray-600 mb-4">{currentImageIndex + 1} of {arrangementImages.length}</div>

            {/* Description */}
            {arrangementDescription ? (
              <div className="text-gray-700 mb-4">{arrangementDescription}</div>
            ) : (
              <div className="text-gray-500 mb-4">No description available.</div>
            )}

            {/* Image indicators */}
            <div className="flex items-center space-x-2 mt-auto">
              {arrangementImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentImageIndex ? 'bg-gray-800' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 