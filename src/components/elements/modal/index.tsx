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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 px-3 py-6 backdrop-blur-sm">
      <div className="relative mx-auto w-full max-w-[95vw] rounded-[2rem] border border-[var(--surface-border)] bg-[var(--surface)]/98 p-4 sm:p-6 shadow-[0_35px_80px_-30px_rgba(15,23,42,0.2)]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full border border-[var(--surface-border)] bg-[var(--surface-muted)]/90 p-2 text-[var(--foreground)] shadow-lg shadow-black/10 hover:bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Main content: image top, title/labels below on mobile; side-by-side on md+ */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          {/* Image area */}
          <div className="w-full md:w-1/2">
            <div className="relative w-full overflow-hidden rounded-[1.5rem] border border-[var(--surface-border)] bg-[var(--surface-muted)]">
              <div className="relative h-[55vh] min-h-[340px] w-full cursor-zoom-in sm:h-[60vh] md:aspect-square" onClick={openFullscreen}>
                <Image
                  src={arrangementImages[currentImageIndex]}
                  alt={`${arrangementTitle} - Image ${currentImageIndex + 1}`}
                  fill={true}
                  className="relative object-cover"
                  onLoad={() => setIsImageLoading(false)}
                />
              </div>

              {/* Loading overlay */}
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface)]/70">
                  <div className="w-12 h-12 rounded-full border-4 border-[var(--surface-border)] border-t-transparent animate-spin" aria-hidden="true" />
                  <span className="sr-only">Loading image</span>
                </div>
              )}

              {/* Navigation buttons (overlay) */}
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 z-10 transform -translate-y-1/2 rounded-full bg-[var(--surface)]/90 p-2 shadow-lg transition hover:bg-[var(--surface)]"
                aria-label="Previous image"
              >
                <svg className="w-6 h-6 text-[var(--foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 z-10 transform -translate-y-1/2 rounded-full bg-[var(--surface)]/90 p-2 shadow-lg transition hover:bg-[var(--surface)]"
                aria-label="Next image"
              >
                <svg className="w-6 h-6 text-[var(--foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Details area (title, description, indicators, wrappers, cart) */}
          <div className="w-full md:w-1/2 flex flex-col justify-start overflow-y-auto max-h-[80vh]">
            <h2 className="md:text-2xl font-semibold text-[var(--foreground)] mb-2 text-left">{arrangementTitle}</h2>

            {/* Image counter */}
            <div className="text-sm text-[var(--surface-border)] mb-4">{currentImageIndex + 1} of {arrangementImages.length}</div>

            {/* Description */}
            {arrangementDescription ? (
              <div className="text-[var(--foreground)] mb-4">{arrangementDescription}</div>
            ) : (
              <div className="text-[var(--surface-border)] mb-4">No description available.</div>
            )}

            {/* Price */}
            {productPrice && (
              <div className="text-lg font-semibold text-[var(--accent)] mb-4">₱{productPrice.toLocaleString()}</div>
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
            <div className="mb-6 rounded-3xl p-4 bg-[var(--surface-muted)] border border-[var(--surface-border)]">
              <label className="text-lg font-semibold text-[var(--foreground)] mb-2 block">Special Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter any special requests or notes for this order..."
                className="w-full rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)] p-3 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none"
                rows={4}
              />
            </div>

            {/* Quantity Selector */}
            <div className="mb-4 flex items-center gap-3">
              <label className="text-sm font-medium text-[var(--foreground)]">Quantity:</label>
              <div className="flex items-center border border-[var(--surface-border)] rounded-3xl overflow-hidden bg-[var(--surface)]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-[var(--foreground)] hover:bg-[var(--surface-muted)]"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-14 text-center border-l border-r border-[var(--surface-border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none"
                  min="1"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 text-[var(--foreground)] hover:bg-[var(--surface-muted)]"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || (hasWrappers && selectedWrappers.length === 0) || (!hasWrappers && !notes.trim())}
              className="w-full rounded-3xl bg-[var(--accent)] px-4 py-3 text-[var(--surface)] font-semibold shadow-sm transition hover:bg-[var(--accent-strong)] disabled:bg-[var(--surface-border)] mb-4"
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
                    index === currentImageIndex ? 'bg-[var(--accent)]' : 'bg-[var(--surface-border)] hover:bg-[var(--accent)]/70'
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
        <div className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-6">
          <button
            onClick={closeFullscreen}
            aria-label="Close fullscreen"
            className="absolute rounded-full border border-[var(--surface)]/30 bg-[var(--surface)]/20 p-3 text-[var(--surface)] shadow-xl shadow-black/50 backdrop-blur-sm transition hover:bg-[var(--surface)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            style={{ top: 'calc(env(safe-area-inset-top, 1rem) + 0.5rem)', right: 'calc(env(safe-area-inset-right, 1rem) + 0.5rem)' }}
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
                className="absolute left-6 top-1/2 transform -translate-y-1/2 rounded-full p-3 text-[var(--surface)] bg-[var(--surface)]/10 hover:bg-[var(--surface)]/20"
                aria-label="Previous image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={() => { setIsImageLoading(true); nextImage(); }}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 rounded-full p-3 text-[var(--surface)] bg-[var(--surface)]/10 hover:bg-[var(--surface)]/20"
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