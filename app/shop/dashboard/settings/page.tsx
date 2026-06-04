"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

interface ShopSettings {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  whatsapp_number: string;
  instagram_url: string | null;
  custom_domain: string | null;
  theme: { accent: string; button_color: string; font: string };
  whatsapp_template: string | null;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/shop/settings")
      .then((r) => r.json())
      .then((d) => { setSettings(d); setLoading(false); });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);

    const res = await fetch("/api/shop/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#C9A84C] border-t-transparent" />
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-[#f5f0e8]">Настройки</h2>
        <p className="text-[#888880] text-sm mt-1">Настройки вашего магазина</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Shop info */}
        <Card>
          <h3 className="text-[#f5f0e8] font-semibold mb-4">Информация о магазине</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-[#888880] block mb-1.5">Slug (URL)</label>
              <div className="flex items-center gap-2 px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-sm">
                <span className="text-[#888880]">domio.top/</span>
                <span className="text-[#f5f0e8]">{settings.slug}</span>
              </div>
              <p className="text-xs text-[#888880] mt-1">Slug нельзя изменить</p>
            </div>
            <Input
              label="Название магазина"
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
            />
            <Textarea
              label="Описание"
              value={settings.description || ""}
              onChange={(e) => setSettings({ ...settings, description: e.target.value })}
              rows={3}
            />
            <Input
              label="Ссылка на логотип"
              value={settings.logo_url || ""}
              onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
              placeholder="https://..."
            />
          </div>
        </Card>

        {/* Contacts */}
        <Card>
          <h3 className="text-[#f5f0e8] font-semibold mb-4">Контакты</h3>
          <div className="space-y-4">
            <Input
              label="Номер WhatsApp"
              value={settings.whatsapp_number}
              onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
              placeholder="+77771234567"
            />
            <Input
              label="Instagram"
              value={settings.instagram_url || ""}
              onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
              placeholder="https://instagram.com/yourshop"
            />
          </div>
        </Card>

        {/* Domain */}
        <Card>
          <h3 className="text-[#f5f0e8] font-semibold mb-4">Домен</h3>
          <Input
            label="Свой домен (необязательно)"
            value={settings.custom_domain || ""}
            onChange={(e) => setSettings({ ...settings, custom_domain: e.target.value })}
            placeholder="myshop.kz"
          />
          <p className="text-xs text-[#888880] mt-2">
            Настройте CNAME запись для вашего домена на <code className="text-[#C9A84C]">cname.domio.top</code>
          </p>
        </Card>

        {/* Theme */}
        <Card>
          <h3 className="text-[#f5f0e8] font-semibold mb-4">Тема оформления</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div>
                <label className="text-sm text-[#888880] block mb-1.5">Акцентный цвет</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.theme.accent}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        theme: { ...settings.theme, accent: e.target.value, button_color: e.target.value },
                      })
                    }
                    className="w-12 h-10 rounded-lg cursor-pointer bg-transparent border border-[#2a2a2a]"
                  />
                  <span className="text-sm text-[#f5f0e8]">{settings.theme.accent}</span>
                </div>
              </div>
              <div
                className="w-20 h-10 rounded-xl flex items-center justify-center text-sm font-semibold text-[#0d0d0d]"
                style={{ background: settings.theme.accent }}
              >
                Кнопка
              </div>
            </div>
          </div>
        </Card>

        {/* WhatsApp template */}
        <Card>
          <h3 className="text-[#f5f0e8] font-semibold mb-4">Шаблон WhatsApp</h3>
          <Textarea
            label="Шаблон сообщения"
            value={settings.whatsapp_template || ""}
            onChange={(e) => setSettings({ ...settings, whatsapp_template: e.target.value })}
            placeholder="Привет! Хочу заказать:\n{{items}}\nИтого: {{total}} ₸"
            rows={4}
          />
          <p className="text-xs text-[#888880] mt-2">
            Используйте {`{{items}}`} и {`{{total}}`} как плейсхолдеры
          </p>
        </Card>

        <div className="flex items-center gap-4">
          <Button type="submit" variant="gold" size="lg" loading={saving}>
            Сохранить изменения
          </Button>
          {saved && <span className="text-green-400 text-sm">Сохранено!</span>}
        </div>
      </form>
    </div>
  );
}
