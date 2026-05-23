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

type Group = {
  id: string;
  name: string;
  description?: string;
  items: { item: RawItem; qty: number; qtyType: 'piece' | 'bundle'; description?: string; color: string }[];
  wrapper?: string;
  wrapperSelections?: { color: string; variantId: string; variantImage: string }[];
  pricePerUnit: number;
  quantity: number;
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
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const [quantity, setQuantity] = useState(1);
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
    const g: Group = {
      id: `group-${groups.length + 1}`,
      name: `group-${groups.length + 1}`,
      description: groupDesc,
      items,
      wrapper: wrapperSelections[0]?.variantId || wrapper,
      pricePerUnit: computedPrice,
      quantity,
    };
    setGroups((prev) => [...prev, g]);
    setSelections([]);
    setGroupName("");
    setGroupDesc("");
    setQuantity(1);
    setWrapperSelections([]);
  };

  const addGroupToCart = (g: Group) => {
    const cartItem = {
      id: `CUSTOM|${g.id}|${Date.now()}`,
      productId: `CUSTOM-${g.id}`,
      productTitle: g.name,
      productPrice: g.pricePerUnit,
      productImage: g.items[0]?.item.mainImage || '',
      quantity: g.quantity,
      wrapperId: g.wrapper,
      wrapperColor: g.wrapper,
      wrapperSelections: wrapperSelections,
      notes: g.description,
      groupItems: g.items.map(it => ({ id: it.item.id, title: it.item.title, image: it.item.mainImage, qty: it.qty, qtyType: it.qtyType, description: it.description || '', color: it.color || '' })),
      addedAt: Date.now(),
    };
    addItem(cartItem as any);
    setGroups((prev) => prev.filter(group => group.id !== g.id));
  };

  const removeGroup = (id: string) => setGroups((prev) => prev.filter(g => g.id !== id));

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Custom Bouquet</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="grid grid-cols-3 gap-4">
            {rawItems.map((r) => (
              <div key={r.id} className="border rounded p-2 text-center">
                <div className="w-full h-40 relative mb-2">
                  <Image src={r.mainImage} alt={r.title} fill className="object-cover rounded" />
                </div>
                <h3 className="font-semibold">{r.title}</h3>
                <p className="text-sm text-gray-500">₱{r.pricePiece} / ₱{r.priceBundle}</p>
                <button
                  className="mt-2 px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => addSelection(r.id)}
                >
                  Add
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 border rounded">
            <h4 className="font-semibold mb-2">Create Group from Selected Items ({selections.length})</h4>
            <textarea className="border p-2 w-full mb-2" placeholder="Group description / notes" value={groupDesc} onChange={(e)=>setGroupDesc(e.target.value)} />

            {/* Selected items editor */}
            {selections.length > 0 && (
              <div className="mb-4 space-y-3">
                {selections.map((sel) => {
                  const item = rawItems.find(r => r.id === sel.itemId)!;
                  return (
                    <div key={sel.tempId} className="flex gap-2 items-start border p-2 rounded">
                      <div className="w-16 h-16 relative">
                        <Image src={item.mainImage} alt={item.title} fill className="object-cover rounded" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{item.title}</div>
                          <div className="text-sm text-gray-600 font-semibold">₱{sel.qtyType === 'bundle' ? item.priceBundle : item.pricePiece}</div>
                        </div>
                        {item.colors && item.colors.length > 0 && (
                          <div className="mt-1 flex gap-1 flex-wrap">
                            {item.colors.map(color => (
                              <button
                                key={color}
                                onClick={() => updateSelection(sel.tempId, { color })}
                                className={`text-xs px-2 py-1 rounded capitalize ${sel.color === color ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                              >
                                {color}
                              </button>
                            ))}
                          </div>
                        )}
                        <div className="mt-2 flex gap-2">
                          <input type="number" min={1} value={sel.qty} onChange={(e)=>updateSelection(sel.tempId, {qty:parseInt(e.target.value||'1')})} className="border p-1 w-20" />
                          <select value={sel.qtyType} onChange={(e)=>updateSelection(sel.tempId, {qtyType: e.target.value as 'piece' | 'bundle'})} className="border p-1">
                            <option value="piece">per piece</option>
                            <option value="bundle">per bundle</option>
                          </select>
                          <div className="text-xs text-gray-500 self-center">
                            {sel.qtyType === 'bundle' ? `1 bundle = ${BUNDLE_SIZE} stems` : 'per piece = 1 stem'}
                          </div>
                          <input placeholder="Item note" value={sel.description} onChange={(e)=>updateSelection(sel.tempId, {description: e.target.value})} className="border p-1 flex-1" />
                          <button onClick={() => removeSelection(sel.tempId)} className="text-red-600 text-sm font-semibold hover:bg-red-50 px-2 rounded">Remove</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mb-4">
              <WrapperSelector colors={(wrapperData as any).colors} onSelectWrappers={(s)=>setWrapperSelections(s)} maxSelections={1} />
            </div>

            <div className="flex gap-2 mb-2">
              <input type="number" className="border p-2 w-32" min={1} value={quantity} onChange={(e)=>setQuantity(parseInt(e.target.value||'1'))} />
            </div>
            <div className="flex gap-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={createGroup}>Create Group</button>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Groups</h4>
          <div className="space-y-4">
            {groups.length === 0 && (<p className="text-sm text-gray-500">No groups yet. Select items and create a group.</p>)}
            {groups.map((g) => (
              <div key={g.id} className="border rounded p-3">
                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 relative">
                    <Image src={g.items[0].item.mainImage} alt={g.name} fill className="object-cover rounded" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h5 className="font-semibold">{g.name}</h5>
                      <div className="text-sm">₱{g.pricePerUnit} x {g.quantity}</div>
                    </div>
                    <p className="text-sm text-gray-500">{g.description}</p>
                    <p className="text-sm mt-2">Items: {g.items.map(i=>i.item.title).join(', ')}</p>
                    <p className="text-sm">Wrapper: {g.wrapper}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={()=>addGroupToCart(g)}>Add to Cart</button>
                  <button className="bg-gray-200 px-3 py-1 rounded" onClick={()=>removeGroup(g.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
