'use client';

import { useRef, useState } from 'react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeItem, updateItemQuantity, clearCart, getTotalPrice, getTotalItems } = useCart();
  const cartRef = useRef<HTMLDivElement | null>(null);
  const [itemAddresses, setItemAddresses] = useState<Record<string, string>>({});
  const [sharedAddress, setSharedAddress] = useState('');
  const [addressMode, setAddressMode] = useState<'individual' | 'shared'>('shared');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [facebookName, setFacebookName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [isSubmittingCheckout, setIsSubmittingCheckout] = useState(false);

  const applyAddressToAll = () => {
    if (!sharedAddress.trim()) {
      alert('Please enter an address first');
      return;
    }
    const newAddresses: Record<string, string> = {};
    cart.items.forEach(item => {
      newAddresses[item.id] = sharedAddress;
    });
    setItemAddresses(newAddresses);
    setAddressMode('shared');
  };

  const updateItemAddress = (itemId: string, address: string) => {
    setItemAddresses(prev => ({
      ...prev,
      [itemId]: address
    }));
    setAddressMode('individual');
  };

  const allAddressesSet = cart.items.every(item => itemAddresses[item.id]?.trim());

  const handleProceedCheckout = () => {
    if (!allAddressesSet) {
      alert('Please set delivery address for all items');
      return;
    }
    setShowCheckoutModal(true);
  };

  const handleCheckoutSubmit = async () => {
    if (!facebookName.trim()) {
      alert('Facebook name is required');
      return;
    }

    setIsSubmittingCheckout(true);
    try {
      if (!cartRef.current) throw new Error('Cart reference not found');
      const htmlToImage = await import('html-to-image');

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

      const imgs = Array.from(clone.querySelectorAll('img')) as HTMLImageElement[];
      await Promise.all(imgs.map(async (img) => {
        if (!img.src) return;
        const data = await toDataUrl(img.src);
        if (data) img.src = data;
      }));

      const elements = Array.from(clone.querySelectorAll<HTMLElement>('*'));
      await Promise.all(elements.map(async (el) => {
        const bg = getComputedStyle(el).backgroundImage;
        if (bg && bg !== 'none') {
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
          alert(`Order received!\n\nFull Name: ${facebookName}\nContact: ${contactNumber || 'Not provided'}\n\nCart image copied to clipboard. Paste into Facebook Messenger.`);
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
        alert(`Order received!\n\nFull Name: ${facebookName}\nContact: ${contactNumber || 'Not provided'}\n\nCart image downloaded as wfs-cart.png. Attach it to Messenger.`);
      }

      clearCart();
      setShowCheckoutModal(false);
      setFacebookName('');
      setContactNumber('');
      setItemAddresses({});
    } catch (err: any) {
      console.error('Checkout failed', err);
      alert('Checkout failed: ' + (err?.message || err));
    } finally {
      setIsSubmittingCheckout(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="rounded-[2rem] border border-pink-200 bg-pink-50/80 p-10 text-center shadow-[0_30px_80px_-40px_rgba(15,23,42,0.8)]">
          <h1 className="text-4xl font-semibold text-blue-950 mb-4">Shopping Cart</h1>
          <p className="text-gray-600 mb-8">Your cart is empty</p>
          <Link href="/bouquets">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-3xl shadow-sm transition-colors">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div ref={cartRef} className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-4xl font-semibold text-blue-950 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="rounded-[2rem] border border-pink-200 bg-white/80 overflow-hidden shadow-[0_15px_40px_-20px_rgba(15,23,42,0.8)]">
              {/* Main Item Card */}
              <div className="p-5 flex flex-col gap-6 lg:flex-row lg:items-start">
                {/* Product Image and wrapper images */}
                <div className="flex-shrink-0">
                  <div className="relative w-32 h-32 bg-pink-50 rounded-[1.5rem] overflow-hidden border border-pink-200">
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
                        <div key={i} className="w-10 h-10 relative rounded-[1rem] overflow-hidden border border-pink-300">
                          <Image src={w.variantImage} alt={w.variantId} fill className="object-cover" />
                        </div>
                      ))
                    ) : item.wrapperVariantImage ? (
                      <div className="w-10 h-10 relative rounded-[1rem] overflow-hidden border border-pink-300">
                        <Image src={item.wrapperVariantImage} alt={`${item.productTitle} wrapper`} fill className="object-cover" />
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Product Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-blue-950">{item.productTitle}</h2>
                    {item.wrapperSelections && item.wrapperSelections.length > 0 ? (
                      <div className="mt-2 text-sm text-gray-600">
                        <p className="font-semibold text-blue-950">Selected Wrappers:</p>
                        <ul className="list-disc ml-5">
                          {item.wrapperSelections.map((w, idx) => (
                            <li key={idx}>
                              <span className="font-semibold text-blue-950">Color:</span> {w.color} — <span className="font-semibold text-blue-950">Variant:</span> {w.variantId}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : item.wrapperColor && item.wrapperVariantId ? (
                      <div className="mt-2 text-sm text-gray-600">
                        <p><span className="font-semibold text-blue-950">Wrapper Color:</span> {item.wrapperColor}</p>
                        <p><span className="font-semibold text-blue-950">Variant:</span> {item.wrapperVariantId}</p>
                      </div>
                    ) : null}
                    {item.notes && (
                      <div className="mt-2 text-sm text-gray-600">
                        <p><span className="font-semibold text-blue-950">Notes:</span> {item.notes}</p>
                      </div>
                    )}
                    {item.groupItems && item.groupItems.length > 0 && (
                      <div className="mt-4 text-sm text-gray-700 bg-white/70 p-3 rounded-3xl border border-pink-200">
                        <p className="font-semibold mb-2">Group Items</p>
                        <div className="space-y-3">
                          {item.groupItems.map((groupItem, gi) => (
                            <div key={gi} className="flex gap-3">
                              <div className="w-16 h-16 relative rounded-[1rem] overflow-hidden bg-pink-50 border border-pink-200">
                                <Image src={groupItem.image} alt={groupItem.title} fill className="object-cover" />
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-blue-950">{groupItem.title}</p>
                                <p className="text-xs text-gray-600">Qty: {groupItem.qty}</p>
                                {groupItem.color && <p className="text-xs text-gray-600">Color: {groupItem.color}</p>}
                                {groupItem.description && <p className="text-xs text-gray-600">Note: {groupItem.description}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <p className="text-lg font-semibold text-blue-950 mt-2">₱{item.productPrice.toLocaleString()}</p>
                  </div>

                  {/* Quantity and Remove */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex items-center border border-pink-300 rounded-3xl overflow-hidden bg-pink-50">
                      <button onClick={() => updateItemQuantity(item.id, Math.max(1, item.quantity - 1))} className="px-4 py-2 text-blue-950 hover:bg-pink-100">−</button>
                      <input type="number" value={item.quantity} onChange={(e) => updateItemQuantity(item.id, Math.max(1, parseInt(e.target.value) || 1))} className="w-14 text-center border-l border-r border-pink-300 bg-white text-blue-950 focus:outline-none" min="1" />
                      <button onClick={() => updateItemQuantity(item.id, item.quantity + 1)} className="px-4 py-2 text-blue-950 hover:bg-pink-100">+</button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="rounded-3xl border border-pink-300 bg-pink-50 px-4 py-2 text-blue-950 hover:bg-pink-100 transition">Remove</button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <p className="text-sm text-gray-600">Subtotal</p>
                  <p className="text-xl font-bold text-blue-950">₱{(item.productPrice * item.quantity).toLocaleString()}</p>
                </div>
              </div>

              {/* Delivery Address for this item */}
              <div className="border-t border-pink-200 p-4 bg-white/70">
                <label className="block text-sm font-semibold text-blue-950 mb-2">Delivery Address</label>
                <textarea value={itemAddresses[item.id] || ''} onChange={(e) => updateItemAddress(item.id, e.target.value)} placeholder="Enter delivery address for this item..." className="w-full border border-pink-300 rounded-3xl p-3 text-sm bg-pink-50 text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={2} />
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Address Management + Order Summary */}
        <div className="lg:col-span-1 space-y-6">
          {/* Address Management Section */}
          <div className="rounded-[2rem] border border-pink-200 bg-white/80 p-6 shadow-[0_15px_30px_-10px_rgba(15,23,42,0.8)]">
            <h3 className="text-lg font-semibold text-blue-950 mb-4">Delivery Address</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="flex items-center gap-3 text-gray-600">
                  <input type="radio" name="addressMode" value="shared" checked={addressMode === 'shared'} onChange={(e) => setAddressMode(e.target.value as 'shared' | 'individual')} className="h-4 w-4 accent-blue-500" />
                  <span>Same address for all</span>
                </label>
                <label className="flex items-center gap-3 text-gray-600">
                  <input type="radio" name="addressMode" value="individual" checked={addressMode === 'individual'} onChange={(e) => setAddressMode(e.target.value as 'shared' | 'individual')} className="h-4 w-4 accent-blue-500" />
                  <span>Different per item</span>
                </label>
              </div>

              {addressMode === 'shared' && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Enter Address</label>
                  <textarea value={sharedAddress} onChange={(e) => setSharedAddress(e.target.value)} placeholder="Enter a delivery address..." className="w-full rounded-3xl border border-pink-300 bg-pink-50 p-3 text-sm text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={3} />
                  <button onClick={applyAddressToAll} className="mt-2 w-full rounded-3xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">Apply to All Items</button>
                </div>
              )}

              <div className="p-3 rounded-3xl border border-pink-200 bg-white/90">
                {allAddressesSet ? (
                  <p className="text-emerald-400 font-semibold text-sm">✓ All addresses set</p>
                ) : (
                  <p className="text-rose-400 font-semibold text-sm">✗ Some addresses missing</p>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="rounded-[2rem] border border-pink-200 bg-white/80 p-6 sticky top-4 shadow-[0_15px_30px_-10px_rgba(15,23,42,0.8)]">
            <h2 className="text-lg font-semibold text-blue-950 mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6 pb-6 border-b border-pink-200 text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₱{getTotalPrice().toLocaleString()}</span>
              </div>
              <div className="flex flex-col">
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="text-right text-sm">Message us on Facebook</span>
                </div>
                <div className="text-xs text-right text-gray-500 mt-1">Depends on location.</div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-semibold text-blue-950">Total:</span>
              <span className="text-2xl font-bold text-blue-400">₱{getTotalPrice().toLocaleString()}</span>
            </div>

            <button onClick={handleProceedCheckout} disabled={!allAddressesSet || isSubmittingCheckout} className="w-full rounded-3xl bg-blue-600 px-4 py-3 text-white font-semibold shadow-sm transition hover:bg-blue-700 disabled:bg-blue-300">
              {isSubmittingCheckout ? 'Processing...' : 'Proceed to Checkout'}
            </button>

            <button onClick={() => clearCart()} className="w-full rounded-3xl border border-pink-300 bg-pink-50 px-4 py-3 text-blue-950 font-semibold hover:bg-pink-100 transition-colors mb-4">Clear Cart</button>

            <Link href="/bouquets">
              <button className="w-full rounded-3xl border border-pink-300 px-4 py-3 text-blue-400 font-semibold hover:bg-pink-50 transition-colors">Continue Shopping</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[2rem] border border-pink-200 bg-white/95 p-8 shadow-[0_35px_80px_-30px_rgba(0,0,0,0.65)]">
            <h2 className="text-2xl font-semibold text-blue-950 mb-6">Order Summary</h2>

            <div className="mb-6 max-h-72 overflow-y-auto rounded-[1.75rem] border border-pink-200 bg-pink-50/80 p-4">
              {cart.items.map((item) => (
                <div key={item.id} className="mb-4 pb-4 border-b border-pink-200 last:border-b-0">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="font-semibold text-blue-950">{item.productTitle}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-blue-950">₱{(item.productPrice * item.quantity).toLocaleString()}</p>
                  </div>

                  <p className="text-sm text-gray-600 mt-1">Unit price: ₱{item.productPrice.toLocaleString()}</p>

                  {item.wrapperSelections && item.wrapperSelections.length > 0 ? (
                    <div className="mt-2 text-xs text-gray-600">
                      <p className="font-semibold text-blue-950">Wrappers:</p>
                      <ul className="list-disc ml-5">
                        {item.wrapperSelections.map((w, idx) => (
                          <li key={idx}>{w.color} — {w.variantId}</li>
                        ))}
                      </ul>
                    </div>
                  ) : item.wrapperColor && item.wrapperVariantId ? (
                    <p className="mt-2 text-xs text-gray-600">Wrapper: {item.wrapperColor} — {item.wrapperVariantId}</p>
                  ) : null}

                  {item.notes && (
                    <p className="mt-2 text-xs text-gray-600"><span className="font-semibold text-blue-950">Notes:</span> {item.notes}</p>
                  )}

                  {item.groupItems && item.groupItems.length > 0 && (
                    <div className="mt-3 rounded-3xl border border-pink-200 bg-pink-50 p-3 text-xs text-gray-600">
                      <p className="font-semibold text-blue-950 mb-2">Group Item Details</p>
                      <div className="space-y-2">
                        {item.groupItems.map((groupItem, idx) => (
                          <div key={idx} className="flex gap-2 items-start">
                            <div className="w-10 h-10 relative rounded-[1rem] overflow-hidden border border-pink-200">
                              <Image src={groupItem.image} alt={groupItem.title} fill className="object-cover" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-blue-950">{groupItem.title}</p>
                              <p>Color: {groupItem.color || 'N/A'}</p>
                              <p>Qty: {groupItem.qty}</p>
                              {groupItem.description && <p>Note: {groupItem.description}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {itemAddresses[item.id] && (
                    <p className="mt-2 text-xs text-gray-600"><span className="font-semibold text-blue-950">Delivery Address:</span> {itemAddresses[item.id]}</p>
                  )}
                </div>
              ))}
              <div className="pt-4 border-t border-pink-200">
                <p className="text-sm text-gray-600">Items: {getTotalItems()}</p>
                <p className="font-bold text-blue-950 mt-2">Total: ₱{getTotalPrice().toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-blue-950 mb-2">Full Name <span className="text-rose-400">*</span></label>
                <input type="text" value={facebookName} onChange={(e) => setFacebookName(e.target.value)} placeholder="Your full name" className="w-full rounded-3xl border border-pink-300 bg-pink-50 px-4 py-3 text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-950 mb-2">Contact Number <span className="text-gray-500">(optional)</span></label>
                <input type="tel" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} placeholder="Your contact number" className="w-full rounded-3xl border border-pink-300 bg-pink-50 px-4 py-3 text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button onClick={() => setShowCheckoutModal(false)} disabled={isSubmittingCheckout} className="flex-1 rounded-3xl border border-pink-300 bg-pink-50 px-4 py-3 text-blue-950 font-semibold hover:bg-pink-100 transition disabled:cursor-not-allowed disabled:opacity-50">Cancel</button>
              <button onClick={handleCheckoutSubmit} disabled={isSubmittingCheckout || !facebookName.trim()} className="flex-1 rounded-3xl bg-blue-600 px-4 py-3 text-white font-semibold shadow-sm transition hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed">{isSubmittingCheckout ? 'Processing...' : 'Complete Order'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
