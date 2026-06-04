"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { generateSessionId } from "@/lib/utils";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
  sessionId: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children, shopSlug }: { children: React.ReactNode; shopSlug: string }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [sessionId, setSessionId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const key = `cart_${shopSlug}`;
    const sid = localStorage.getItem("session_id") || generateSessionId();
    localStorage.setItem("session_id", sid);
    setSessionId(sid);

    const stored = localStorage.getItem(key);
    if (stored) {
      try { setItems(JSON.parse(stored)); } catch {}
    }
  }, [shopSlug]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(`cart_${shopSlug}`, JSON.stringify(items));
  }, [items, shopSlug, mounted]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });

    // Fire analytics
    fetch(`/api/storefront/${shopSlug}/events/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, product_id: item.id, page: "cart" }),
    }).catch(() => {});
  }, [shopSlug, sessionId]);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      setItems((prev) => prev.map((i) => i.id === id ? { ...i, quantity: qty } : i));
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, count, sessionId, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
