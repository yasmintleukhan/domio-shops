"use client";
import { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Store, Edit2, Key, BarChart2, Plus } from "lucide-react";

interface Shop {
  id: string;
  slug: string;
  name: string;
  status: string;
  subscription_ends_at: string | null;
  created_at: string;
  users: { id: string; email: string; role: string }[];
  _count: { products: number; order_events: number };
}

const statusOptions = ["active", "trial", "expired", "suspended"];

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  // Status modal
  const [statusModal, setStatusModal] = useState<{ open: boolean; shop: Shop | null }>({ open: false, shop: null });
  const [newStatus, setNewStatus] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);

  // Password modal
  const [pwModal, setPwModal] = useState<{ open: boolean; shop: Shop | null }>({ open: false, shop: null });
  const [pwEmail, setPwEmail] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [savingPw, setSavingPw] = useState(false);
  const [pwMsg, setPwMsg] = useState("");

  // Create shop modal
  const [createModal, setCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ slug: "", name: "", whatsapp_number: "", owner_email: "", owner_password: "" });
  const [creating, setCreating] = useState(false);

  const fetchShops = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/founder/shops");
    if (res.ok) setShops(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchShops(); }, [fetchShops]);

  const handleStatusSave = async () => {
    if (!statusModal.shop) return;
    setSavingStatus(true);
    await fetch(`/api/founder/shops/${statusModal.shop.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setSavingStatus(false);
    setStatusModal({ open: false, shop: null });
    fetchShops();
  };

  const handlePwSave = async () => {
    if (!pwModal.shop) return;
    setSavingPw(true);
    const res = await fetch(`/api/founder/shops/${pwModal.shop.id}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: pwEmail, new_password: pwNew }),
    });
    setSavingPw(false);
    if (res.ok) {
      setPwMsg("Пароль успешно изменён");
      setTimeout(() => { setPwModal({ open: false, shop: null }); setPwMsg(""); }, 2000);
    } else {
      setPwMsg("Ошибка");
    }
  };

  const handleCreate = async () => {
    setCreating(true);
    const res = await fetch("/api/founder/shops", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createForm),
    });
    setCreating(false);
    if (res.ok) {
      setCreateModal(false);
      setCreateForm({ slug: "", name: "", whatsapp_number: "", owner_email: "", owner_password: "" });
      fetchShops();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#f5f0e8]">Магазины</h2>
          <p className="text-[#888880] text-sm mt-1">{shops.length} магазинов</p>
        </div>
        <Button variant="gold" onClick={() => setCreateModal(true)}>
          <Plus size={16} className="mr-1" /> Создать магазин
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#C9A84C] border-t-transparent" />
        </div>
      ) : (
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2a2a]">
                <th className="text-left px-4 py-3 text-[#888880] font-medium">Магазин</th>
                <th className="text-left px-4 py-3 text-[#888880] font-medium">Статус</th>
                <th className="text-left px-4 py-3 text-[#888880] font-medium hidden md:table-cell">Подписка до</th>
                <th className="text-right px-4 py-3 text-[#888880] font-medium hidden md:table-cell">Товары</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {shops.map((shop) => (
                <tr key={shop.id} className="border-b border-[#2a2a2a] last:border-0 hover:bg-[#1a1a1a] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center flex-shrink-0">
                        <Store size={14} className="text-[#C9A84C]" />
                      </div>
                      <div>
                        <p className="text-[#f5f0e8] font-medium">{shop.name}</p>
                        <p className="text-xs text-[#888880]">{shop.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={shop.status as any}>{shop.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-[#888880] hidden md:table-cell">
                    {shop.subscription_ends_at
                      ? new Date(shop.subscription_ends_at).toLocaleDateString("ru-KZ")
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right text-[#f5f0e8] hidden md:table-cell">
                    {shop._count.products}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => { setStatusModal({ open: true, shop }); setNewStatus(shop.status); }}
                        className="p-1.5 text-[#888880] hover:text-[#f5f0e8] hover:bg-[#2a2a2a] rounded-lg transition-colors cursor-pointer"
                        title="Изменить статус"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => { setPwModal({ open: true, shop }); setPwEmail(shop.users[0]?.email || ""); setPwNew(""); }}
                        className="p-1.5 text-[#888880] hover:text-[#f5f0e8] hover:bg-[#2a2a2a] rounded-lg transition-colors cursor-pointer"
                        title="Сбросить пароль"
                      >
                        <Key size={15} />
                      </button>
                      <Link
                        href={`/founder/dashboard/shops/${shop.id}`}
                        className="p-1.5 text-[#888880] hover:text-[#f5f0e8] hover:bg-[#2a2a2a] rounded-lg transition-colors cursor-pointer"
                        title="Аналитика"
                      >
                        <BarChart2 size={15} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Status modal */}
      <Modal open={statusModal.open} onClose={() => setStatusModal({ open: false, shop: null })} title="Изменить статус">
        <div className="space-y-4">
          <p className="text-[#888880] text-sm">{statusModal.shop?.name}</p>
          <div className="grid grid-cols-2 gap-2">
            {statusOptions.map((s) => (
              <button
                key={s}
                onClick={() => setNewStatus(s)}
                className={`p-3 rounded-xl border text-sm font-medium transition-colors cursor-pointer ${
                  newStatus === s
                    ? "border-[#C9A84C] text-[#C9A84C] bg-[#C9A84C]/10"
                    : "border-[#2a2a2a] text-[#888880] hover:border-[#444]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setStatusModal({ open: false, shop: null })}>Отмена</Button>
            <Button variant="gold" onClick={handleStatusSave} loading={savingStatus}>Сохранить</Button>
          </div>
        </div>
      </Modal>

      {/* Password modal */}
      <Modal open={pwModal.open} onClose={() => setPwModal({ open: false, shop: null })} title="Сбросить пароль">
        <div className="space-y-4">
          <Input label="Email пользователя" value={pwEmail} onChange={(e) => setPwEmail(e.target.value)} />
          <Input label="Новый пароль" type="password" value={pwNew} onChange={(e) => setPwNew(e.target.value)} />
          {pwMsg && <p className={`text-sm ${pwMsg.includes("Ошибка") ? "text-red-400" : "text-green-400"}`}>{pwMsg}</p>}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setPwModal({ open: false, shop: null })}>Отмена</Button>
            <Button variant="gold" onClick={handlePwSave} loading={savingPw}>Сохранить</Button>
          </div>
        </div>
      </Modal>

      {/* Create shop modal */}
      <Modal open={createModal} onClose={() => setCreateModal(false)} title="Создать магазин" className="max-w-lg">
        <div className="space-y-4">
          <Input label="Slug (URL)" value={createForm.slug} onChange={(e) => setCreateForm({ ...createForm, slug: e.target.value })} placeholder="myshop" />
          <Input label="Название" value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} />
          <Input label="WhatsApp номер" value={createForm.whatsapp_number} onChange={(e) => setCreateForm({ ...createForm, whatsapp_number: e.target.value })} placeholder="+77771234567" />
          <Input label="Email владельца" type="email" value={createForm.owner_email} onChange={(e) => setCreateForm({ ...createForm, owner_email: e.target.value })} />
          <Input label="Пароль владельца" type="password" value={createForm.owner_password} onChange={(e) => setCreateForm({ ...createForm, owner_password: e.target.value })} />
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setCreateModal(false)}>Отмена</Button>
            <Button variant="gold" onClick={handleCreate} loading={creating}>Создать</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
