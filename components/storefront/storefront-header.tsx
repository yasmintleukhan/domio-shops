"use client";
import { useCart } from "./cart-context";
import { ShoppingCart } from "lucide-react";

interface StorefrontHeaderProps {
  name: string;
  logoUrl: string | null;
  instagramUrl: string | null;
  accentColor?: string;
}

export function StorefrontHeader({
  name,
  logoUrl,
  instagramUrl,
  accentColor = "#C9A84C",
}: StorefrontHeaderProps) {
  const { count, setIsOpen } = useCart();

  return (
    <header className="sticky top-0 z-30 bg-[#141414]/90 backdrop-blur-md border-b border-[#2a2a2a]">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <img src={logoUrl} alt={name} className="w-9 h-9 rounded-xl object-cover" />
          ) : (
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-[#0d0d0d] font-bold text-sm"
              style={{ background: accentColor }}
            >
              {name[0]?.toUpperCase()}
            </div>
          )}
          <span className="font-bold text-[#f5f0e8] text-lg">{name}</span>
        </div>

        <div className="flex items-center gap-2">
          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-[#888880] hover:text-[#f5f0e8] transition-colors cursor-pointer"
              aria-label="Instagram"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
          )}
          <button
            onClick={() => setIsOpen(true)}
            className="relative p-2 text-[#f5f0e8] hover:text-[#C9A84C] transition-colors cursor-pointer"
            aria-label={`Корзина: ${count} товаров`}
          >
            <ShoppingCart size={22} />
            {count > 0 && (
              <span
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold text-[#0d0d0d] flex items-center justify-center"
                style={{ background: accentColor }}
              >
                {count > 9 ? "9+" : count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
