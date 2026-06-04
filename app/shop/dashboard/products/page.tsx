"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { Plus, Edit2, Trash2, Image as ImageIcon } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string;
  images: string[];
  category: string | null;
  in_stock: boolean;
  is_active: boolean;
  sort_order: number;
}

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  in_stock: true,
  is_active: true,
  images: [] as string[],
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string>("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/shop/products");
    if (res.ok) {
      const data = await res.json();
      setProducts(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const openAdd = () => {
    setEditProduct(null);
    setForm(emptyForm);
    setImageUrls("");
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditProduct(p);
    setForm({
      name: p.name,
      description: p.description || "",
      price: p.price,
      category: p.category || "",
      in_stock: p.in_stock,
      is_active: p.is_active,
      images: p.images,
    });
    setImageUrls(p.images.join("\n"));
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) return;
    setSaving(true);

    const images = imageUrls
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean)
      .slice(0, 5);

    const body = { ...form, images, price: parseFloat(form.price) };

    let res;
    if (editProduct) {
      res = await fetch(`/api/shop/products/${editProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      res = await fetch("/api/shop/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    setSaving(false);
    if (res?.ok) {
      setModalOpen(false);
      fetchProducts();
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/shop/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      setDeleteId(null);
      fetchProducts();
    }
  };

  const toggleActive = async (p: Product) => {
    await fetch(`/api/shop/products/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !p.is_active }),
    });
    fetchProducts();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#f5f0e8]">Каталог</h2>
          <p className="text-[#888880] text-sm mt-1">{products.length} товаров</p>
        </div>
        <Button variant="gold" onClick={openAdd}>
          <Plus size={16} className="mr-1" /> Добавить товар
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#C9A84C] border-t-transparent" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-[#888880]">
          <Package2 className="mx-auto mb-4 opacity-40" size={48} />
          <p>Товаров пока нет</p>
          <Button variant="outline" onClick={openAdd} className="mt-4">
            Добавить первый товар
          </Button>
        </div>
      ) : (
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2a2a]">
                <th className="text-left px-4 py-3 text-[#888880] font-medium">Фото</th>
                <th className="text-left px-4 py-3 text-[#888880] font-medium">Название</th>
                <th className="text-left px-4 py-3 text-[#888880] font-medium hidden md:table-cell">Категория</th>
                <th className="text-right px-4 py-3 text-[#888880] font-medium">Цена</th>
                <th className="text-center px-4 py-3 text-[#888880] font-medium hidden md:table-cell">Склад</th>
                <th className="text-center px-4 py-3 text-[#888880] font-medium">Активен</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-[#2a2a2a] last:border-0 hover:bg-[#1a1a1a] transition-colors">
                  <td className="px-4 py-3">
                    {p.images[0] ? (
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-[#2a2a2a] flex items-center justify-center">
                        <ImageIcon size={16} className="text-[#888880]" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[#f5f0e8] font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-[#888880] hidden md:table-cell">
                    {p.category || "—"}
                  </td>
                  <td className="px-4 py-3 text-right text-[#C9A84C] font-semibold">
                    {formatPrice(p.price)} ₸
                  </td>
                  <td className="px-4 py-3 text-center hidden md:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.in_stock ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                      {p.in_stock ? "Есть" : "Нет"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleActive(p)}
                      className={`w-10 h-6 rounded-full transition-colors cursor-pointer relative ${p.is_active ? "bg-[#C9A84C]" : "bg-[#2a2a2a]"}`}
                      aria-label={p.is_active ? "Деактивировать" : "Активировать"}
                    >
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${p.is_active ? "translate-x-5" : "translate-x-1"}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-1.5 text-[#888880] hover:text-[#f5f0e8] hover:bg-[#2a2a2a] rounded-lg transition-colors cursor-pointer"
                        aria-label="Редактировать"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteId(p.id)}
                        className="p-1.5 text-[#888880] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                        aria-label="Удалить"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editProduct ? "Редактировать товар" : "Новый товар"}
        className="max-w-2xl"
      >
        <div className="space-y-4">
          <Input
            label="Название *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Название товара"
          />
          <Textarea
            label="Описание"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Описание товара"
            rows={3}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Цена (₸) *"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="0"
              min="0"
            />
            <Input
              label="Категория"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Одежда, Обувь..."
            />
          </div>
          <Textarea
            label="Ссылки на изображения (по одной на строку, до 5)"
            value={imageUrls}
            onChange={(e) => setImageUrls(e.target.value)}
            placeholder="https://example.com/image.jpg"
            rows={4}
          />
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.in_stock}
                onChange={(e) => setForm({ ...form, in_stock: e.target.checked })}
                className="w-4 h-4 rounded accent-[#C9A84C]"
              />
              <span className="text-sm text-[#f5f0e8]">В наличии</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="w-4 h-4 rounded accent-[#C9A84C]"
              />
              <span className="text-sm text-[#f5f0e8]">Активен</span>
            </label>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Отмена
            </Button>
            <Button variant="gold" onClick={handleSave} loading={saving}>
              {editProduct ? "Сохранить" : "Добавить"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Удалить товар?">
        <p className="text-[#888880] mb-6">Это действие нельзя отменить.</p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => setDeleteId(null)}>Отмена</Button>
          <Button variant="danger" onClick={() => deleteId && handleDelete(deleteId)}>
            Удалить
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function Package2({ className, size }: { className?: string; size?: number }) {
  return (
    <svg
      className={className}
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}
