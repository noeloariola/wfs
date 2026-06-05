'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

function CartSidebarContent() {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, removeItem, updateItemQuantity, getTotalPrice, getTotalItems } = useCart();

  return (
    <>
      {/* Cart Toggle Button - Fixed at bottom right */}
      {getTotalItems() > 0 && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-4 right-4 bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-white rounded-full p-4 shadow-lg z-40 flex items-center justify-center"
          aria-label="Toggle cart"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
            <span className="absolute -top-2 -right-2 bg-green-200 text-green-950 text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
            {getTotalItems()}
          </span>
        </button>
      )}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed right-0 top-0 h-full w-full max-w-sm rounded-l-[2rem] border-l border-[var(--surface-border)] bg-white/95 shadow-xl z-50 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-[var(--surface-border)]">
              <h2 className="text-lg font-semibold text-[var(--accent-strong)]">Shopping Cart</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[var(--accent-strong)] hover:text-[var(--accent)] text-2xl"
              >
                ×
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-4">
              {cart.items.length === 0 ? (
                <p className="text-gray-600 text-center py-8">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 rounded-lg border border-[var(--surface-border)] p-3 bg-white/90"
                    >
                      {/* Product Image + selected wrappers below */}
                      <div className="flex-shrink-0">
                        <div className="relative w-20 h-20 flex-shrink-0 bg-green-50 rounded overflow-hidden border border-green-200">
                          {item.groupItems && item.groupItems.length > 0 ? (
                            <Image src={item.groupItems[0].image} alt={item.productTitle} fill className="object-cover rounded" />
                          ) : (
                            <Image
                              src={item.productImage}
                              alt={item.productTitle}
                              fill
                              className="object-cover rounded"
                            />
                          )}
                        </div>

                        <div className="mt-2 flex gap-2 overflow-x-auto">
                          {item.groupItems && item.groupItems.length > 0 ? (
                            item.groupItems.map((gi, i) => (
                              <div key={i} className="w-8 h-8 relative rounded overflow-hidden border border-green-200 flex-shrink-0">
                                <Image src={gi.image} alt={gi.title} fill className="object-cover" />
                              </div>
                            ))
                          ) : item.wrapperSelections && item.wrapperSelections.length > 0 ? (
                            item.wrapperSelections.map((w, i) => (
                              <div key={i} className="w-8 h-8 relative rounded overflow-hidden border border-green-200">
                                <Image src={w.variantImage} alt={w.variantId} fill className="object-cover" />
                              </div>
                            ))
                          ) : item.wrapperVariantImage ? (
                            <div className="w-8 h-8 relative rounded overflow-hidden border border-green-200">
                              <Image src={item.wrapperVariantImage} alt={`${item.productTitle} wrapper`} fill className="object-cover" />
                            </div>
                          ) : null}
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-[var(--accent-strong)] truncate">
                          {item.productTitle}
                        </h3>
                        {item.wrapperSelections && item.wrapperSelections.length > 0 ? (
                          <p className="text-xs text-gray-600">
                            Wrappers: {item.wrapperSelections.map(s => s.color).join(', ')}
                          </p>
                        ) : item.wrapperColor ? (
                          <p className="text-xs text-gray-600">Wrapper: {item.wrapperColor}</p>
                        ) : null}
                        {item.notes && (
                          <p className="text-xs text-gray-600 line-clamp-2">
                            Notes: {item.notes}
                          </p>
                        )}
                        <p className="text-sm font-semibold text-[var(--accent-strong)] mt-1">
                          ₱{item.productPrice.toLocaleString()}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1 mt-2">
                          <button
                            onClick={() =>
                              updateItemQuantity(
                                item.id,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            className="px-2 py-1 text-xs border border-green-300 rounded hover:bg-green-100 text-[var(--accent-strong)]"
                          >
                            −
                          </button>
                          <span className="px-2 text-xs font-semibold text-[var(--accent-strong)]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateItemQuantity(item.id, item.quantity + 1)
                            }
                            className="px-2 py-1 text-xs border border-green-300 rounded hover:bg-green-100 text-[var(--accent-strong)]"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-auto px-2 py-1 text-xs text-[var(--accent-strong)] hover:bg-green-100 rounded"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.items.length > 0 && (
              <div className="border-t border-[var(--surface-border)] p-4 space-y-3">
                <div className="flex justify-between items-center text-lg font-bold text-[var(--accent-strong)]">
                  <span>Total:</span>
                  <span className="text-[var(--accent)]">
                    ₱{getTotalPrice().toLocaleString()}
                  </span>
                </div>
                <Link href="/cart" passHref>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full rounded-3xl bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-white font-semibold py-2 px-4 shadow-sm transition-colors"
                  >
                    View Cart
                  </button>
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default function CartSidebar() {
  return (
    <Suspense fallback={null}>
      <CartSidebarContent />
    </Suspense>
  );
}
