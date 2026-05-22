'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import WrapperSelector from '../wrapper-selector';
import { useCart } from '@/context/CartContext';
import { WrapperColor, WrapperVariant } from '@/types/cart';
import wrapperData from '@/repository/bouquet/wrappers.json';
import bouquetData from '@/repository/bouquet/index.json';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  arrangementImages: string[];
  arrangementTitle: string;
  arrangementDescription?: string;
  productId?: string;
  productPrice?: number;
  hasWrappers?: boolean;
}

export default function ArrangementModal({ 
  isOpen, 
  onClose, 
  arrangementImages, 
  arrangementTitle, 
  arrangementDescription,
  productId,
  productPrice,
  hasWrappers = false
}: ModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedColorKey, setSelectedColorKey] = useState<string | undefined>();
  const [selectedVariant, setSelectedVariant] = useState<WrapperVariant | undefined>();
  const [selectedWrappers, setSelectedWrappers] = useState<{ color: string; variantId: string; variantImage: string }[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addItem } = useCart();

  if (!isOpen) return null;

  const nextImage = () => {
    setIsImageLoading(true);
    setCurrentImageIndex((prev) => {
      const i = (prev + 1) % arrangementImages.length
      console.log('Next image index:', i);
      return i;
    });
  };

  const prevImage = () => {
    setIsImageLoading(true);
    setCurrentImageIndex((prev) => 
      prev === 0 ? arrangementImages.length - 1 : prev - 1
    );
  };

  const openFullscreen = () => {
    setIsImageLoading(true);
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    setIsImageLoading(false);
  };

  // Close fullscreen on Escape and lock body scroll while fullscreen
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) closeFullscreen();
        else onClose();
      }
    };
    document.addEventListener('keydown', onKey);
    if (isFullscreen) document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  const handleAddToCart = () => {
    if (!productId || !productPrice) return;
    
    setIsAddingToCart(true);
    const cartItemId = selectedVariant 
      ? `${productId}-${selectedVariant.id}-${quantity}`
      : `${productId}-${quantity}`;

    addItem({
      id: cartItemId,
      productId,
      productTitle: arrangementTitle,
      productPrice,
      productImage: arrangementImages[0],
      quantity,
      wrapperColor: selectedColorKey,
      wrapperVariantId: selectedVariant?.id,
      wrapperVariantImage: selectedVariant?.image,
      wrapperSelections: selectedWrappers,
      addedAt: Date.now(),
    });

    setTimeout(() => {
      setIsAddingToCart(false);
      onClose();
    }, 500);
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
              <div className="w-full h-full cursor-zoom-in" onClick={openFullscreen}>
                <Image
                  src={arrangementImages[currentImageIndex]}
                  alt={`${arrangementTitle} - Image ${currentImageIndex + 1}`}
                  fill={true}
                  className="relative object-contain"
                  onLoad={() => setIsImageLoading(false)}
                />
              </div>

              {/* Loading overlay */}
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                  <div className="w-12 h-12 rounded-full border-4 border-gray-300 border-t-transparent animate-spin " aria-hidden="true" />
                  <span className="sr-only">Loading image</span>
                </div>
              )}

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

          {/* Details area (title, description, indicators, wrappers, cart) */}
          <div className="w-full md:w-1/2 flex flex-col justify-start overflow-y-auto max-h-[80vh]">
            <h2 className="md:text-2xl font-bold text-gray-800 mb-2 text-left">{arrangementTitle}</h2>

            {/* Image counter */}
            <div className="text-sm text-gray-600 mb-4">{currentImageIndex + 1} of {arrangementImages.length}</div>

            {/* Description */}
            {arrangementDescription ? (
              <div className="text-gray-700 mb-4">{arrangementDescription}</div>
            ) : (
              <div className="text-gray-500 mb-4">No description available.</div>
            )}

            {/* Price */}
            {productPrice && (
              <div className="text-lg font-semibold text-gray-800 mb-4">₱{productPrice.toLocaleString()}</div>
            )}

            {/* Wrapper Selector */}
            {true && (
              <WrapperSelector
                colors={wrapperData.colors}
                onSelectWrappers={(selections) => {
                  setSelectedWrappers(selections);
                  if (selections.length > 0) {
                    setSelectedColorKey(selections[0].color);
                    const colorMap = wrapperData.colors as Record<string, WrapperColor>;
                    const variant = colorMap[selections[0].color]?.variants.find(v => v.id === selections[0].variantId);
                    setSelectedVariant(variant);
                  } else {
                    setSelectedColorKey(undefined);
                    setSelectedVariant(undefined);
                  }
                }}
                selectedColorKey={selectedColorKey}
                selectedVariant={selectedVariant}
                maxSelections={(() => {
                  // prefer explicit capacity field from bouquet data
                  try {
                    if (productId) {
                      const found = (bouquetData as any[]).find((b) => b.id === productId);
                      if (found && typeof found.capacity === 'number') return found.capacity;
                    }
                  } catch (e) {
                    // ignore
                  }
                  return 2;
                })()}
              />
            )}

            {/* Quantity Selector */}
            <div className="mb-4 flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Quantity:</label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 hover:bg-gray-100"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 text-center border-l border-r border-gray-300 focus:outline-none"
                  min="1"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || (hasWrappers && selectedWrappers.length === 0)}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors mb-4"
            >
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </button>

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
      {/* Fullscreen viewer */}
      {isFullscreen && (
        <div className="fixed inset-0 z-60 bg-black bg-opacity-90 flex items-center justify-center">
          <button
            onClick={closeFullscreen}
            className="absolute top-4 right-4 text-white text-4xl z-70"
            aria-label="Close fullscreen"
          >
            ×
          </button>

          <div className="relative w-full h-full flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center">
              <div className="relative max-w-[100vw] max-h-[100vh] w-full h-full">
                <Image
                  src={arrangementImages[currentImageIndex]}
                  alt={`${arrangementTitle} - Image ${currentImageIndex + 1}`}
                  fill
                  className="object-contain"
                  onLoadingComplete={() => setIsImageLoading(false)}
                />

                {/* Loading overlay for fullscreen */}
                {isImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="w-16 h-16 rounded-full border-4 border-white border-t-transparent animate-spin" aria-hidden="true" />
                    <span className="sr-only">Loading image</span>
                  </div>
                )}

                {/* Prev/Next in fullscreen */}
                <button
                  onClick={() => { setIsImageLoading(true); prevImage(); }}
                  className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-10 hover:bg-opacity-30 rounded-full p-3 text-white"
                  aria-label="Previous image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  onClick={() => { setIsImageLoading(true); nextImage(); }}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-10 hover:bg-opacity-30 rounded-full p-3 text-white"
                  aria-label="Next image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 