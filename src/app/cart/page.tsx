'use client';

import { useRef, useState } from 'react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeItem, updateItemQuantity, clearCart, getTotalPrice, getTotalItems } = useCart();
  const cartRef = useRef<HTMLDivElement | null>(null);
  const [isCopying, setIsCopying] = useState(false);

  if (cart.items.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Shopping Cart</h1>
          <p className="text-gray-600 mb-8">Your cart is empty</p>
          <Link href="/bouquets">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div ref={cartRef} className="w-full max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg p-4 flex gap-4"
              >
                {/* Product Image and selected wrapper images below */}
                <div className="flex-shrink-0">
                  <div className="relative w-32 h-32 bg-gray-100 rounded overflow-hidden">
                    <Image
                      src={item.productImage}
                      alt={item.productTitle}
                      fill
                      className="object-cover rounded"
                    />
                  </div>

                  {/* Wrapper selections */}
                  <div className="mt-2 flex items-center gap-2">
                    {item.wrapperSelections && item.wrapperSelections.length > 0 ? (
                      item.wrapperSelections.map((w, i) => (
                        <div key={i} className="w-10 h-10 relative rounded overflow-hidden border">
                          <Image src={w.variantImage} alt={w.variantId} fill className="object-cover" />
                        </div>
                      ))
                    ) : item.wrapperVariantImage ? (
                      <div className="w-10 h-10 relative rounded overflow-hidden border">
                        <Image src={item.wrapperVariantImage} alt={`${item.productTitle} wrapper`} fill className="object-cover" />
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Product Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {item.productTitle}
                    </h2>
                    {item.wrapperSelections && item.wrapperSelections.length > 0 ? (
                      <div className="mt-2 text-sm text-gray-600">
                        <p className="font-semibold">Selected Wrappers:</p>
                        <ul className="list-disc ml-5">
                          {item.wrapperSelections.map((w, idx) => (
                            <li key={idx}>
                              <span className="font-semibold">Color:</span> {w.color} — <span className="font-semibold">Variant:</span> {w.variantId}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : item.wrapperColor && item.wrapperVariantId ? (
                      <div className="mt-2 text-sm text-gray-600">
                        <p>
                          <span className="font-semibold">Wrapper Color:</span>{' '}
                          {item.wrapperColor}
                        </p>
                        <p>
                          <span className="font-semibold">Variant:</span>{' '}
                          {item.wrapperVariantId}
                        </p>
                      </div>
                    ) : null}
                    {item.notes && (
                      <div className="mt-2 text-sm text-gray-600">
                        <p>
                          <span className="font-semibold">Notes:</span>{' '}
                          {item.notes}
                        </p>
                      </div>
                    )}
                    <p className="text-lg font-semibold text-gray-800 mt-2">
                      ₱{item.productPrice.toLocaleString()}
                    </p>
                  </div>

                  {/* Quantity and Remove */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() =>
                          updateItemQuantity(
                            item.id,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItemQuantity(
                            item.id,
                            Math.max(1, parseInt(e.target.value) || 1)
                          )
                        }
                        className="w-12 text-center border-l border-r border-gray-300 focus:outline-none"
                        min="1"
                      />
                      <button
                        onClick={() =>
                          updateItemQuantity(item.id, item.quantity + 1)
                        }
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 px-4 py-2 rounded"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <p className="text-sm text-gray-600">Subtotal</p>
                  <p className="text-xl font-bold text-gray-800">
                    ₱{(item.productPrice * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border border-gray-200 rounded-lg p-6 sticky top-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>₱{getTotalPrice().toLocaleString()}</span>
              </div>
              <div className="flex flex-col text-gray-600">
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>Message us on our Facebook page to know the shipping fee</span>
                </div>
                <div className="text-sm text-right text-gray-500 mt-1">
                  Shipping fee depends on the dropoff location.
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold text-gray-800">Total:</span>
              <span className="text-2xl font-bold text-blue-600">
                ₱{getTotalPrice().toLocaleString()}
              </span>
            </div>

            <button
              onClick={async () => {
                if (!cartRef.current) return;
                setIsCopying(true);
                try {
                  const htmlToImage = await import('html-to-image');

                  // Clone the cart node and inline images/background-images to avoid CORS/remote loading issues
                  const original = cartRef.current!;
                  const clone = original.cloneNode(true) as HTMLElement;

                  const toDataUrl = async (url: string) => {
                    try {
                      const resolved = url.startsWith('/') ? window.location.origin + url : url;
                      const res = await fetch(resolved);
                      const blob = await res.blob();
                      return await new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result as string);
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                      });
                    } catch (e) {
                      console.warn('Failed to fetch image for inlining:', url, e);
                      return null;
                    }
                  };

                  // Inline <img> elements
                  const imgs = Array.from(clone.querySelectorAll('img')) as HTMLImageElement[];
                  await Promise.all(imgs.map(async (img) => {
                    if (!img.src) return;
                    const data = await toDataUrl(img.src);
                    if (data) img.src = data;
                  }));

                  // Inline CSS background-images
                  const elements = Array.from(clone.querySelectorAll<HTMLElement>('*'));
                  await Promise.all(elements.map(async (el) => {
                    const bg = getComputedStyle(el).backgroundImage;
                    if (bg && bg !== 'none') {
                      // handle url("...") or url('...')
                      const m = bg.match(/url\(["']?(.*?)["']?\)/);
                      if (m && m[1]) {
                        const data = await toDataUrl(m[1]);
                        if (data) el.style.backgroundImage = `url(${data})`;
                      }
                    }
                  }));

                  const blob = await htmlToImage.toBlob(clone, { backgroundColor: '#ffffff' });
                  if (!blob) throw new Error('Failed to render cart image');

                  let copiedToClipboard = false;
                  if (navigator.clipboard && (navigator.clipboard as any).write) {
                    try {
                      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
                      copiedToClipboard = true;
                      alert('Cart image copied to clipboard. Paste into Facebook Messenger.');
                    } catch (clipboardErr) {
                      console.warn('Clipboard write failed, falling back to download:', clipboardErr);
                    }
                  }

                  if (!copiedToClipboard) {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'wfs-cart.png';
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    URL.revokeObjectURL(url);
                    alert('Clipboard copy not allowed — cart image downloaded as wfs-cart.png. Attach it to Messenger.');
                  }
                } catch (err: any) {
                  console.error('Copy cart image failed', err);
                  alert('Failed to create cart image: ' + (err?.message || err));
                }
                setIsCopying(false);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg mb-3 transition-colors"
            >
              {isCopying ? 'Copying...' : 'Proceed to Checkout'}
            </button>

            <button
              onClick={() => clearCart()}
              className="w-full border border-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors mb-4"
            >
              Clear Cart
            </button>

            <Link href="/bouquets">
              <button className="w-full text-blue-600 hover:text-blue-700 font-semibold py-2 px-4 rounded-lg">
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
