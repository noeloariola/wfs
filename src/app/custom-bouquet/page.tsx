"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { GetRawItems } from "@/repository/raw_items";
import WrapperSelector from '@/components/elements/wrapper-selector';
import wrapperData from '@/repository/bouquet/wrappers.json';
import { useCart } from "@/context/CartContext";

type RawItem = {
  id: string;
  title: string;
  mainImage: string;
  images: string[];
  description?: string;
  pricePiece?: number;
  priceBundle?: number;
  colors?: string[];
};

type Selection = {
  tempId: string;
  itemId: string;
  qty: number;
  description: string;
  color: string;
};

export default function CustomBouquetPage() {
  const rawItems = GetRawItems() as RawItem[];
  const [selections, setSelections] = useState<Selection[]>([]);
  const [groupDesc, setGroupDesc] = useState("");
  const [wrapper, setWrapper] = useState('white');
  const [wrapperSelections, setWrapperSelections] = useState<{ color: string; variantId: string; variantImage: string }[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const [selectedRawItem, setSelectedRawItem] = useState<RawItem | null>(null);
  const [isRawItemModalOpen, setIsRawItemModalOpen] = useState(false);
  const clickTimerRef = useRef<number | null>(null);
  const { addItem } = useCart();

  const addSelection = (itemId: string) => {
    const item = rawItems.find(r => r.id === itemId);
    const newSelection: Selection = {
      tempId: `${itemId}-${Date.now()}-${Math.random()}`,
      itemId,
      qty: 1,
      description: '',
      color: item?.colors?.[0] || '',
    };
    setSelections((prev) => [...prev, newSelection]);
    if (item) setToastMessage(`${item.title} added to custom bouquet`);
    // visual feedback for the Add button
    setJustAddedId(itemId);
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    clickTimerRef.current = window.setTimeout(() => {
      setJustAddedId(null);
      clickTimerRef.current = null;
    }, 800);
  };

  const openRawItemModal = (item: RawItem) => {
    setSelectedRawItem(item);
    setIsRawItemModalOpen(true);
  };

  const closeRawItemModal = () => {
    setIsRawItemModalOpen(false);
    setSelectedRawItem(null);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(null), 3000);
    return () => clearTimeout(t);
  }, [toastMessage]);

  const updateSelection = (tempId: string, updates: Partial<Selection>) => {
    setSelections((prev) => prev.map(s => s.tempId === tempId ? { ...s, ...updates } : s));
  };

  const removeSelection = (tempId: string) => {
    setSelections((prev) => prev.filter(s => s.tempId !== tempId));
  };

  const createGroup = () => {
    if (selections.length === 0) return;
    const items = selections.map((sel) => {
      const item = rawItems.find(r => r.id === sel.itemId) as RawItem;
      return { item, qty: sel.qty, description: sel.description, color: sel.color };
    });
    const computedPrice = items.reduce((s, it) => {
      const unitPrice = it.item.pricePiece || 0;
      return s + unitPrice * it.qty;
    }, 0);
    const newGroup = {
      id: `group-${Date.now()}`,
      name: `Custom bouquet`,
      description: groupDesc,
      items,
      wrapper: wrapperSelections[0]?.variantId || wrapper,
      wrapperSelections: wrapperSelections.length > 0 ? wrapperSelections : undefined,
      pricePerUnit: computedPrice,
      quantity: 1,
    };

    const selectedWrapper = newGroup.wrapperSelections?.[0];
    const cartItem = {
      id: `CUSTOM|${newGroup.id}|${Date.now()}`,
      productId: `CUSTOM-${newGroup.id}`,
      productTitle: newGroup.name,
      productPrice: newGroup.pricePerUnit,
      productImage: newGroup.items[0]?.item.mainImage || '',
      quantity: newGroup.quantity,
      wrapperId: newGroup.wrapper,
      wrapperColor: selectedWrapper?.color,
      wrapperVariantId: selectedWrapper?.variantId,
      wrapperVariantImage: selectedWrapper?.variantImage,
      wrapperSelections: newGroup.wrapperSelections,
      notes: newGroup.description,
      groupItems: newGroup.items.map(it => ({ id: it.item.id, title: it.item.title, image: it.item.mainImage, qty: it.qty, description: it.description || '', color: it.color || '' })),
      addedAt: Date.now(),
    };

    addItem(cartItem as any);
    setSelections([]);
    setGroupDesc("");
    setWrapperSelections([]);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] py-10 text-[var(--foreground)]">
      <div className="mx-auto max-w-7xl px-4">
        <section className="mb-8 overflow-hidden rounded-[2rem] border-[var(--surface-border)] bg-[var(--surface-muted)] p-8 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.08)] backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.3em] text-[var(--accent)]">Custom Bouquet</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--foreground)]">Choose your preferred flower, color, and wrapper for a premium bouquet.</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-600">
                Choose your preferred flower, color, and wrapper to create a crafted bouquet ready for checkout. Fresh stems, seasonal blooms, and elegant finishing touches for every special moment.
              </p>
            </div>
            <div className="grid w-full gap-4 sm:grid-cols-1 lg:w-auto">
              <div className="rounded-[1.75rem] border-[var(--surface-border)] bg-[var(--surface)]/80 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Selected stems</p>
                <p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">{selections.length}</p>
                <p className="mt-2 text-sm text-gray-600">Add at least one item to start.</p>
              </div>
            </div>
          </div>
        </section>
        {toastMessage && (
          <div role="status" aria-live="polite" className="fixed right-6 bottom-6 z-50 flex max-w-md items-center gap-4 rounded-2xl bg-emerald-600/95 px-5 py-3 shadow-2xl border border-emerald-400/40 ring-2 ring-emerald-400/20 transform transition-all duration-300">
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white animate-pulse" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-white">{toastMessage}</div>
            </div>
            <button aria-label="Dismiss notification" onClick={() => setToastMessage(null)} className="-mr-1 rounded-full bg-white/10 p-1 text-white hover:bg-white/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[1.85fr_1.15fr]">
          <div className="grid gap-6">
            <section className="rounded-[2rem] border-[var(--surface-border)] bg-[var(--surface-muted)] p-6 shadow-[0_20px_45px_-20px_rgba(0,0,0,0.08)]">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[var(--foreground)]">Raw stem selection</h2>
                  <p className="mt-1 text-sm text-gray-600">Choose premium blooms and greens for your bouquet.</p>
                </div>
                <div className="inline-flex items-center rounded-full border-[var(--surface-border)] bg-[var(--surface)]/80 px-4 py-2 text-sm text-gray-700">
                  {rawItems.length} items available
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {rawItems.map((r) => (
                  <div key={r.id} className="group overflow-hidden rounded-[1.75rem] border-[var(--surface-border)] bg-[var(--surface)]/80 p-4 transition duration-300 hover:-translate-y-0.5 hover:bg-[var(--surface-muted)]">
                    <button
                      type="button"
                      onClick={() => openRawItemModal(r)}
                      className="relative h-44 w-full overflow-hidden rounded-[1.75rem] bg-[var(--accent-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    >
                      <Image src={r.mainImage} alt={r.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition hover:bg-black/20">
                        <span className="text-sm font-semibold text-[var(--foreground)] opacity-0 transition hover:opacity-100">View</span>
                      </div>
                    </button>
                    <div className="mt-4 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--foreground)]">{r.title}</h3>
                        <p className="mt-1 text-sm text-gray-600">{r.description || 'Premium stem'}</p>
                      </div>
                      <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs uppercase tracking-[0.24em] text-[var(--accent)]">{r.id}</span>
                    </div>
                    <div className="mt-5 text-sm text-gray-700">₱{r.pricePiece}</div>
                    <div className="mt-3 text-xs uppercase tracking-[0.24em] text-gray-500">Tap the image to view details and add this stem.</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border-[var(--surface-border)] bg-[var(--surface-muted)] p-6 shadow-[0_20px_45px_-20px_rgba(0,0,0,0.08)]">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[var(--foreground)]">Selected items</h2>
                  <p className="mt-1 text-sm text-gray-600">Configure colors, quantities, and notes per stem.</p>
                </div>
                <div className="rounded-full border border-[var(--surface-border)] bg-[var(--surface)]/80 px-3 py-1 text-xs uppercase tracking-[0.24em] text-gray-600">
                  {selections.length} selected
                </div>
              </div>

              {selections.length === 0 ? (
                <div className="rounded-[1.75rem] border-dashed border-[var(--surface-border)] bg-[var(--surface)]/80 p-8 text-center text-gray-600">
                  Add a stem to start building your group.
                </div>
              ) : (
                <div className="space-y-4">
                  {selections.map((sel) => {
                    const item = rawItems.find((r) => r.id === sel.itemId)!;
                    return (
                      <div key={sel.tempId} className="rounded-[1.75rem] border border-[var(--surface-border)] bg-[var(--surface)]/80 p-4 shadow-[inset_0_1px_0_rgba(148,163,184,0.08)]">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                          <div className="relative h-24 w-full overflow-hidden rounded-[1.75rem] bg-[var(--accent-soft)] lg:w-24">
                            <Image src={item.mainImage} alt={item.title} fill className="object-cover" />
                          </div>
                          <div className="flex-1 space-y-3">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <p className="text-lg font-semibold text-[var(--foreground)]">{item.title}</p>
                                <p className="text-sm text-gray-600">Piece (1 stem)</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600">Unit price</p>
                                <p className="text-lg font-semibold text-[var(--foreground)]">₱{item.pricePiece}</p>
                              </div>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div className="space-y-2">
                                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Color</p>
                                <div className="flex flex-wrap gap-2">
                                  {item.colors?.map((color) => (
                                    <button key={color} onClick={() => updateSelection(sel.tempId, { color })} className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${sel.color === color ? 'border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--accent)]' : 'border-[var(--surface-border)] bg-[var(--surface)] text-gray-700 hover:border-[var(--accent)]'}`}>
                                      {color}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Quantity</p>
                                <div className="flex items-center rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)]/70">
                                  <button type="button" onClick={() => updateSelection(sel.tempId, { qty: Math.max(1, sel.qty - 1) })} className="px-4 py-2 text-[var(--foreground)] hover:bg-[var(--surface-muted)]">−</button>
                                  <input type="number" min={1} value={sel.qty} onChange={(e) => updateSelection(sel.tempId, { qty: Math.max(1, parseInt(e.target.value || '1')) })} className="w-20 text-center border-x border-[var(--surface-border)] bg-[var(--surface)]/70 px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none" />
                                  <button type="button" onClick={() => updateSelection(sel.tempId, { qty: sel.qty + 1 })} className="px-4 py-2 text-[var(--foreground)] hover:bg-[var(--surface-muted)]">+</button>
                                </div>
                              </div>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                              <button onClick={() => removeSelection(sel.tempId)} className="rounded-3xl bg-[var(--accent-strong)] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[rgba(4,120,87,0.2)] hover:bg-[var(--accent)]">
                                Remove
                              </button>
                            </div>
                            <textarea placeholder="Item note" value={sel.description} onChange={(e) => updateSelection(sel.tempId, { description: e.target.value })} className="w-full rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)]/70 px-4 py-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 resize-none" rows={3} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[2rem] border-[var(--surface-border)] bg-[var(--surface-muted)] p-6 shadow-[0_20px_45px_-20px_rgba(0,0,0,0.08)]">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-[var(--foreground)]">Custom Builder</h2>
                <p className="mt-1 text-sm text-gray-600">Finalize your custom bouquet for checkout.</p>
              </div>
              <div className="space-y-4">
                <div className="rounded-[1.75rem] border-[var(--surface-border)] bg-[var(--surface)]/80 p-4">
                  <label className="text-sm text-gray-600">Group notes</label>
                  <textarea value={groupDesc} onChange={(e) => setGroupDesc(e.target.value)} placeholder="Describe aroma, message or style" className="mt-2 w-full rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)]/70 px-4 py-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 resize-none" rows={4} />
                </div>
                <div className="rounded-[1.75rem] border-[var(--surface-border)] bg-[var(--surface)]/80 p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Wrapper selection</h3>
                  <WrapperSelector colors={(wrapperData as any).colors} onSelectWrappers={(s) => setWrapperSelections(s)} maxSelections={1} />
                </div>
                <div className="rounded-[1.75rem] border-[var(--surface-border)] bg-[var(--surface)]/80 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-[var(--foreground)]">Group quantity</h3>
                      <p className="text-xs text-gray-500">Fixed to 1 for Fluent-style curated groups.</p>
                    </div>
                    <div className="rounded-full bg-[var(--surface)] px-3 py-2 text-sm text-gray-700 border border-[var(--surface-border)]">1</div>
                  </div>
                </div>
                <button disabled={selections.length === 0} onClick={createGroup} className="w-full rounded-full bg-[var(--accent-strong)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[rgba(4,120,87,0.2)] transition hover:bg-[var(--accent)] disabled:cursor-not-allowed disabled:bg-[var(--accent)]/40">
                  Add to Cart
                </button>
              </div>
            </section>

          </aside>
        </div>
      </div>

      {selectedRawItem && isRawItemModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 px-4 py-6 backdrop-blur-sm">
          <div className="relative mx-auto w-full max-w-[95vw] rounded-[2rem] bg-[var(--surface)]/95 border border-[var(--surface-border)] p-4 sm:p-6 shadow-[0_35px_80px_-30px_rgba(0,0,0,0.65)]">
            <button
              onClick={closeRawItemModal}
              className="absolute right-4 top-4 z-10 rounded-full border border-[var(--surface-border)] bg-[var(--surface-muted)]/90 p-2 text-[var(--foreground)] shadow-lg shadow-black/40 hover:bg-[var(--surface-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              aria-label="Close preview"
            >
              ×
            </button>

            <div className="relative w-full overflow-hidden rounded-[1.75rem] border border-[var(--surface-border)] bg-[var(--surface-muted)]">
              <div className="relative h-[55vh] min-h-[320px] w-full">
                <Image
                  src={selectedRawItem.images.length > 0 ? selectedRawItem.images[0] : selectedRawItem.mainImage}
                  alt={selectedRawItem.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <h2 className="text-2xl font-semibold text-[var(--foreground)]">{selectedRawItem.title}</h2>
                <p className="mt-2 text-sm text-gray-600">{selectedRawItem.description || 'Premium stem'}</p>
              </div>

              <div className="rounded-3xl border border-[var(--surface-border)] bg-[var(--surface-muted)] p-4">
                <p className="text-sm text-gray-600">Price</p>
                <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">₱{selectedRawItem.pricePiece?.toLocaleString() ?? '0'}</p>
              </div>

              <button
                onClick={() => {
                  addSelection(selectedRawItem.id);
                  closeRawItemModal();
                }}
                className="w-full rounded-3xl bg-[var(--accent-strong)] px-4 py-3 text-white font-semibold shadow-sm transition hover:bg-[var(--accent)]"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
