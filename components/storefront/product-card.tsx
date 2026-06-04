"use client";
import { useCart } from "./cart-context";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, Package } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  description: string | null;
  price: number;
  images: string[];
  in_stock: boolean;
  accentColor?: string;
}

export function ProductCard({
  id,
  name,
  description,
  price,
  images,
  in_stock,
  accentColor = "#C9A84C",
}: ProductCardProps) {
  const { addItem, setIsOpen } = useCart();

  const handleAdd = () => {
    if (!in_stock) return;
    addItem({ id, name, price, image: images[0] || null });
    setIsOpen(true);
  };

  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl overflow-hidden flex flex-col hover:border-[#3a3a3a] transition-colors">
      {/* Image */}
      <div className="aspect-square relative overflow-hidden bg-[#1a1a1a]">
        {images[0] ? (
          <img
            src={images[0]}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={32} className="text-[#2a2a2a]" />
          </div>
        )}
        {!in_stock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-sm text-white font-medium bg-[#333] px-3 py-1.5 rounded-full">
              Нет в наличии
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        <h3 className="text-sm font-medium text-[#f5f0e8] line-clamp-2 leading-snug">{name}</h3>
        {description && (
          <p className="text-xs text-[#888880] line-clamp-2 leading-relaxed">{description}</p>
        )}
        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className="font-bold text-[#f5f0e8]" style={{ color: accentColor }}>
            {formatPrice(price)} ₸
          </span>
          <button
            onClick={handleAdd}
            disabled={!in_stock}
            className="p-2 rounded-xl transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 text-xs font-semibold text-[#0d0d0d]"
            style={{ background: in_stock ? accentColor : "#2a2a2a" }}
            aria-label={`В корзину: ${name}`}
          >
            <ShoppingCart size={14} />
            <span className="hidden sm:inline">В корзину</span>
          </button>
        </div>
      </div>
    </div>
  );
}
