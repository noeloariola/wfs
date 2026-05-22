'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Cart } from '@/types/cart';

interface CartContextType {
  cart: Cart;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = 'wfs_cart';

const defaultCart: Cart = {
  items: [],
  lastUpdated: Date.now(),
};

const createDefaultContextValue = (): CartContextType => ({
  cart: defaultCart,
  addItem: () => {},
  removeItem: () => {},
  updateItemQuantity: () => {},
  clearCart: () => {},
  getTotalPrice: () => 0,
  getTotalItems: () => 0,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>(defaultCart);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setCart(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to parse cart from localStorage:', error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addItem = (newItem: CartItem) => {
    setCart((prev) => {
      const existingItem = prev.items.find((item) => item.id === newItem.id);
      if (existingItem) {
        return {
          items: prev.items.map((item) =>
            item.id === newItem.id
              ? { ...item, quantity: item.quantity + newItem.quantity }
              : item
          ),
          lastUpdated: Date.now(),
        };
      }
      return {
        items: [...prev.items, newItem],
        lastUpdated: Date.now(),
      };
    });
  };

  const removeItem = (itemId: string) => {
    setCart((prev) => ({
      items: prev.items.filter((item) => item.id !== itemId),
      lastUpdated: Date.now(),
    }));
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setCart((prev) => ({
      items: prev.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      ),
      lastUpdated: Date.now(),
    }));
  };

  const clearCart = () => {
    setCart(defaultCart);
  };

  const getTotalPrice = () => {
    return cart.items.reduce((total, item) => total + item.productPrice * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const value: CartContextType = {
    cart,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    // Return a default context value instead of throwing during SSR/build time
    if (typeof window === 'undefined') {
      return createDefaultContextValue();
    }
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
