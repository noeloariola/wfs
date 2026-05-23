'use client';

import { useState } from 'react';
import Image from 'next/image';
import { WrapperColor, WrapperVariant } from '@/types/cart';

interface WrapperSelectorProps {
  colors: { [key: string]: WrapperColor };
  onSelectWrappers: (selections: { color: string; variantId: string; variantImage: string }[]) => void;
  selectedColorKey?: string;
  selectedVariant?: WrapperVariant;
  maxSelections?: number;
}

export default function WrapperSelector({
  colors,
  onSelectWrappers,
  selectedColorKey,
  selectedVariant,
  maxSelections = 1,
}: WrapperSelectorProps) {
  const [expanded, setExpanded] = useState<string | false>(false);
  const [selections, setSelections] = useState<{ color: string; variantId: string; variantImage: string }[]>([]);

  const toggleColorExpand = (colorKey: string) => {
    setExpanded((prev) => (prev === colorKey ? false : colorKey));
  };

  const handleSelectVariant = (colorKey: string, variant: WrapperVariant) => {
    const exists = selections.find((s) => s.color === colorKey);
    if (exists) {
      const updated = selections.map((s) =>
        s.color === colorKey ? { color: colorKey, variantId: variant.id, variantImage: variant.image } : s
      );
      setSelections(updated);
      onSelectWrappers(updated);
      return;
    }

    if (selections.length >= maxSelections) {
      // Do nothing if at max
      return;
    }

    const next = [...selections, { color: colorKey, variantId: variant.id, variantImage: variant.image }];
    setSelections(next);
    onSelectWrappers(next);
  };

  const removeSelection = (colorKey: string) => {
    const next = selections.filter((s) => s.color !== colorKey);
    setSelections(next);
    onSelectWrappers(next);
  };

  return (
    <div className="mb-6 rounded-[1.25rem] border border-slate-800 p-4 bg-slate-950/80">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Select Wrapper Color</h3>

      <div className="text-sm text-slate-300 mb-2">Selected: {selections.length} / {maxSelections}</div>

      {/* Color buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        {Object.entries(colors).map(([colorKey, colorData]) => {
          const isSelected = selections.some((s) => s.color === colorKey);
          return (
            <div key={colorKey} className="flex flex-col">
              <button
                onClick={() => {
                  toggleColorExpand(colorKey);
                }}
                className={`px-4 py-2 rounded-2xl font-medium transition-all text-sm ${
                  isSelected
                    ? 'bg-sky-500 text-white shadow-md'
                    : 'bg-slate-900 text-slate-100 border border-slate-700 hover:border-sky-400'
                }`}
              >
                {colorData.name}
              </button>
              {isSelected && (
                <button
                  onClick={() => removeSelection(colorKey)}
                  className="text-xs text-rose-400 mt-1"
                >
                  Remove
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Variant selector for expanded color */}
      {expanded && (
        <div className="mt-4">
          <p className="text-sm font-medium text-slate-300 mb-3">
            Variants for {colors[expanded].name}:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {colors[expanded].variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => handleSelectVariant(expanded as string, variant)}
                className={`relative overflow-hidden rounded-2xl border-2 transition-all ${
                  selections.find((s) => s.variantId === variant.id && s.color === expanded)
                    ? 'border-sky-500 shadow-md scale-105'
                    : 'border-slate-700 hover:border-sky-400'
                }`}
              >
                <div className="relative w-full h-24 bg-slate-800">
                  <Image
                    src={variant.image}
                    alt={variant.id}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%231e293b" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%23777" font-size="12"%3ENot Available%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
                <p className="text-xs font-medium text-slate-100 p-2 text-center bg-slate-900">{variant.id}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected wrapper previews */}
      {selections.length > 0 && (
        <div className="mt-4 p-3 bg-slate-900/60 rounded-2xl border border-slate-800">
          <p className="text-sm text-slate-300 font-semibold mb-2">Selected:</p>
          <div className="flex gap-2 overflow-x-auto">
            {selections.map((s) => (
              <div key={s.color} className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                <div className="w-10 h-10 relative rounded overflow-hidden">
                  <Image src={s.variantImage} alt={s.variantId} fill className="object-cover" />
                </div>
                <div className="text-xs text-slate-200">
                  <div className="font-medium">{colors[s.color].name}</div>
                  <div className="text-slate-400">{s.variantId}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
