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
  const [notes, setNotes] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { cart, addItem } = useCart();

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

    const normalizeSelections = [...selectedWrappers]
      .sort((a, b) => (a.color.localeCompare(b.color) || a.variantId.localeCompare(b.variantId)))
      .map((selection) => `${selection.color}:${selection.variantId}`)
      .join('|');

    const cartItemId = `${productId}|${normalizeSelections}|${notes?.trim() || ''}`;

    const existingSameProductDifferentDetails = cart.items.some((item) => {
      return item.productId === productId && item.id !== cartItemId;
    });

    if (existingSameProductDifferentDetails) {
      const confirmAdd = window.confirm(
        'This product is already in the cart with different customization details. Add as a separate order?'
      );
      if (!confirmAdd) {
        return;
      }
    }

    setIsAddingToCart(true);

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
      notes: notes || undefined,
      addedAt: Date.now(),
    });

    setTimeout(() => {
      setIsAddingToCart(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-950/95 p-6 max-w-6xl w-full mx-4 relative shadow-[0_35px_80px_-30px_rgba(0,0,0,0.65)]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full border border-slate-700/60 bg-slate-900/80 p-2 text-slate-100 hover:bg-slate-800"
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Main content: image left, title/labels right on md+ */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image area (square on md+) */}
          <div className="w-full md:w-1/2">
            <div className="w-full aspect-square relative overflow-hidden rounded-[1.5rem] bg-slate-900 border border-slate-800">
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
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60">
                  <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-transparent animate-spin " aria-hidden="true" />
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
            <h2 className="md:text-2xl font-semibold text-slate-100 mb-2 text-left">{arrangementTitle}</h2>

            {/* Image counter */}
            <div className="text-sm text-slate-400 mb-4">{currentImageIndex + 1} of {arrangementImages.length}</div>

            {/* Description */}
            {arrangementDescription ? (
              <div className="text-slate-300 mb-4">{arrangementDescription}</div>
            ) : (
              <div className="text-slate-400 mb-4">No description available.</div>
            )}

            {/* Price */}
            {productPrice && (
              <div className="text-lg font-semibold text-slate-100 mb-4">₱{productPrice.toLocaleString()}</div>
            )}

            {/* Wrapper Selector (for bouquets) */}
            {hasWrappers && (
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

            {/* Notes (for all products) */}
            <div className="mb-6 rounded-3xl p-4 bg-slate-950/70 border border-slate-800">
              <label className="text-lg font-semibold text-slate-100 mb-2 block">Special Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter any special requests or notes for this order..."
                className="w-full rounded-3xl border border-slate-700 bg-slate-900 p-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                rows={4}
              />
            </div>

            {/* Quantity Selector */}
            <div className="mb-4 flex items-center gap-3">
              <label className="text-sm font-medium text-slate-200">Quantity:</label>
              <div className="flex items-center border border-slate-700 rounded-3xl overflow-hidden bg-slate-900">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-slate-100 hover:bg-slate-800"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-14 text-center border-l border-r border-slate-700 bg-slate-950 text-slate-100 focus:outline-none"
                  min="1"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 text-slate-100 hover:bg-slate-800"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || (hasWrappers && selectedWrappers.length === 0) || (!hasWrappers && !notes.trim())}
              className="w-full rounded-3xl bg-sky-500 px-4 py-3 text-white font-semibold shadow-sm transition hover:bg-sky-400 disabled:bg-slate-700 mb-4"
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
                    index === currentImageIndex ? 'bg-slate-200' : 'bg-slate-500/40 hover:bg-slate-400'
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
        <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-6">
          <button
            onClick={closeFullscreen}
            className="absolute top-6 right-6 rounded-full border border-slate-700 bg-slate-900/80 p-3 text-slate-100 z-50"
            aria-label="Close fullscreen"
          >
            ×
          </button>

          <div className="relative w-full h-full flex items-center justify-center">
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
                className="absolute left-6 top-1/2 transform -translate-y-1/2 rounded-full p-3 text-white bg-white/10 hover:bg-white/20"
                aria-label="Previous image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={() => { setIsImageLoading(true); nextImage(); }}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 rounded-full p-3 text-white bg-white/10 hover:bg-white/20"
                aria-label="Next image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 