"use client";

import Image from "next/image";
import { useState } from "react";
import { GetRawItems } from "@/repository/raw_items";
import ArrangementModal from "@/components/elements/modal";
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
  qtyType: 'piece' | 'bundle';
  description: string;
  color: string;
};

export default function CustomBouquetPage() {
  const rawItems = GetRawItems() as RawItem[];
  const BUNDLE_SIZE = 10;
  const [selections, setSelections] = useState<Selection[]>([]);
  const [groupDesc, setGroupDesc] = useState("");
  const [wrapper, setWrapper] = useState('white');
  const [wrapperSelections, setWrapperSelections] = useState<{ color: string; variantId: string; variantImage: string }[]>([]);
  const { addItem } = useCart();

  const addSelection = (itemId: string) => {
    const item = rawItems.find(r => r.id === itemId);
    const newSelection: Selection = {
      tempId: `${itemId}-${Date.now()}-${Math.random()}`,
      itemId,
      qty: 1,
      qtyType: 'piece',
      description: '',
      color: item?.colors?.[0] || '',
    };
    setSelections((prev) => [...prev, newSelection]);
  };

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
      return { item, qty: sel.qty, qtyType: sel.qtyType, description: sel.description, color: sel.color };
    });
    const computedPrice = items.reduce((s, it) => {
      const unitPrice = it.qtyType === 'bundle' ? (it.item.priceBundle || 0) : (it.item.pricePiece || 0);
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
      groupItems: newGroup.items.map(it => ({ id: it.item.id, title: it.item.title, image: it.item.mainImage, qty: it.qty, qtyType: it.qtyType, description: it.description || '', color: it.color || '' })),
      addedAt: Date.now(),
    };

    addItem(cartItem as any);
    setSelections([]);
    setGroupDesc("");
    setWrapperSelections([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 py-10 text-slate-100">
      <div className="mx-auto max-w-7xl px-4">
        <section className="mb-8 overflow-hidden rounded-[2rem] border border-slate-700/70 bg-slate-900/80 p-8 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.9)] backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.3em] text-sky-300/90">Custom Bouquet</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-50">Choose your preferred flower, color, and wrapper for a premium bouquet.</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
                Choose your preferred flower, color, and wrapper to create a crafted bouquet ready for checkout. Fresh stems, seasonal blooms, and elegant finishing touches for every special moment.
              </p>
            </div>
            <div className="grid w-full gap-4 sm:grid-cols-2 lg:w-auto">
              <div className="rounded-[1.75rem] border border-slate-700/70 bg-slate-950/80 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Group quantity</p>
                <p className="mt-3 text-3xl font-semibold text-slate-100">1</p>
                <p className="mt-2 text-sm text-slate-400">Fixed by design for curated custom bouquets.</p>
              </div>
              <div className="rounded-[1.75rem] border border-slate-700/70 bg-slate-950/80 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Selected stems</p>
                <p className="mt-3 text-3xl font-semibold text-slate-100">{selections.length}</p>
                <p className="mt-2 text-sm text-slate-400">Add at least one item to start.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.85fr_1.15fr]">
          <div className="grid gap-6">
            <section className="rounded-[2rem] border border-slate-700/70 bg-slate-900/80 p-6 shadow-[0_20px_45px_-20px_rgba(15,23,42,0.8)]">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-50">Raw stem selection</h2>
                  <p className="mt-1 text-sm text-slate-400">Choose premium blooms and greens for your bouquet.</p>
                </div>
                <div className="inline-flex items-center rounded-full border border-slate-700/70 bg-slate-950/80 px-4 py-2 text-sm text-slate-300">
                  {rawItems.length} items available
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {rawItems.map((r) => (
                  <div key={r.id} className="group overflow-hidden rounded-[1.75rem] border border-slate-700/70 bg-slate-950/80 p-4 transition duration-300 hover:-translate-y-0.5 hover:bg-slate-900/90">
                    <div className="relative h-44 overflow-hidden rounded-[1.75rem] bg-slate-800">
                      <Image src={r.mainImage} alt={r.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
                    </div>
                    <div className="mt-4 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-100">{r.title}</h3>
                        <p className="mt-1 text-sm text-slate-400">{r.description || 'Premium stem'}</p>
                      </div>
                      <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.24em] text-sky-300/90">{r.id}</span>
                    </div>
                    <div className="mt-5 flex items-center justify-between gap-3">
                      <div className="text-sm text-slate-300">₱{r.pricePiece} / ₱{r.priceBundle}</div>
                      <button type="button" onClick={() => addSelection(r.id)} className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400">
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-slate-700/70 bg-slate-900/80 p-6 shadow-[0_20px_45px_-20px_rgba(15,23,42,0.8)]">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-50">Selected items</h2>
                  <p className="mt-1 text-sm text-slate-400">Configure colors, quantities, and notes per stem.</p>
                </div>
                <div className="rounded-full border border-slate-700/70 bg-slate-950/80 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-400">
                  {selections.length} selected
                </div>
              </div>

              {selections.length === 0 ? (
                <div className="rounded-[1.75rem] border border-dashed border-slate-700/70 bg-slate-950/80 p-8 text-center text-slate-400">
                  Add a stem to start building your group.
                </div>
              ) : (
                <div className="space-y-4">
                  {selections.map((sel) => {
                    const item = rawItems.find((r) => r.id === sel.itemId)!;
                    return (
                      <div key={sel.tempId} className="rounded-[1.75rem] border border-slate-700/70 bg-slate-950/80 p-4 shadow-[inset_0_1px_0_rgba(148,163,184,0.08)]">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                          <div className="relative h-24 w-full overflow-hidden rounded-[1.75rem] bg-slate-800 lg:w-24">
                            <Image src={item.mainImage} alt={item.title} fill className="object-cover" />
                          </div>
                          <div className="flex-1 space-y-3">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <p className="text-lg font-semibold text-slate-100">{item.title}</p>
                                <p className="text-sm text-slate-400">{sel.qtyType === 'bundle' ? `Bundle (${BUNDLE_SIZE} stems)` : 'Piece (1 stem)'}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-slate-400">Unit price</p>
                                <p className="text-lg font-semibold text-slate-100">₱{sel.qtyType === 'bundle' ? item.priceBundle : item.pricePiece}</p>
                              </div>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div className="space-y-2">
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Color</p>
                                <div className="flex flex-wrap gap-2">
                                  {item.colors?.map((color) => (
                                    <button key={color} onClick={() => updateSelection(sel.tempId, { color })} className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${sel.color === color ? 'border-sky-400 bg-sky-500/15 text-sky-300' : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-400'}`}>
                                      {color}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Quantity</p>
                                <input type="number" min={1} value={sel.qty} onChange={(e) => updateSelection(sel.tempId, { qty: parseInt(e.target.value || '1') })} className="w-full rounded-3xl border border-slate-700/80 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/50" />
                              </div>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                              <select value={sel.qtyType} onChange={(e) => updateSelection(sel.tempId, { qtyType: e.target.value as 'piece' | 'bundle' })} className="rounded-3xl border border-slate-700/80 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/50">
                                <option value="piece">Piece (1 stem)</option>
                                <option value="bundle">Bundle (10 stems)</option>
                              </select>
                              <button onClick={() => removeSelection(sel.tempId)} className="rounded-3xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 hover:bg-rose-400">
                                Remove
                              </button>
                            </div>
                            <textarea placeholder="Item note" value={sel.description} onChange={(e) => updateSelection(sel.tempId, { description: e.target.value })} className="w-full rounded-3xl border border-slate-700/80 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/50 resize-none" rows={3} />
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
            <section className="rounded-[2rem] border border-slate-700/70 bg-slate-900/80 p-6 shadow-[0_20px_45px_-20px_rgba(15,23,42,0.8)]">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-slate-50">Custom Builder</h2>
                <p className="mt-1 text-sm text-slate-400">Finalize your custom bouquet for checkout.</p>
              </div>
              <div className="space-y-4">
                <div className="rounded-[1.75rem] border border-slate-700/70 bg-slate-950/80 p-4">
                  <label className="text-sm text-slate-400">Group notes</label>
                  <textarea value={groupDesc} onChange={(e) => setGroupDesc(e.target.value)} placeholder="Describe aroma, message or style" className="mt-2 w-full rounded-3xl border border-slate-700/80 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/50 resize-none" rows={4} />
                </div>
                <div className="rounded-[1.75rem] border border-slate-700/70 bg-slate-950/80 p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Wrapper selection</h3>
                  <WrapperSelector colors={(wrapperData as any).colors} onSelectWrappers={(s) => setWrapperSelections(s)} maxSelections={1} />
                </div>
                <div className="rounded-[1.75rem] border border-slate-700/70 bg-slate-950/80 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-100">Group quantity</h3>
                      <p className="text-xs text-slate-500">Fixed to 1 for Fluent-style curated groups.</p>
                    </div>
                    <div className="rounded-full bg-slate-950 px-3 py-2 text-sm text-slate-300 border border-slate-700/70">1</div>
                  </div>
                </div>
                <button disabled={selections.length === 0} onClick={createGroup} className="w-full rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-700">
                  Add to Cart
                </button>
              </div>
            </section>

          </aside>
        </div>
      </div>
    </div>
  );
}
