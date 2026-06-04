import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create founder shop (system shop)
  const founderShop = await prisma.shop.upsert({
    where: { slug: "founder" },
    update: {},
    create: {
      slug: "founder",
      name: "Domio Platform",
      whatsapp_number: "+77770000000",
      status: "active",
    },
  });

  // Create founder user
  const founderHash = await bcrypt.hash("founder123", 12);
  await prisma.shopUser.upsert({
    where: { email: "founder@domio.top" },
    update: {},
    create: {
      shop_id: founderShop.id,
      email: "founder@domio.top",
      password_hash: founderHash,
      role: "founder",
    },
  });

  console.log("✅ Founder account created: founder@domio.top / founder123");

  // Demo shop 1
  const demoShop = await prisma.shop.upsert({
    where: { slug: "demo" },
    update: {},
    create: {
      slug: "demo",
      name: "Demo Shop",
      description: "Демонстрационный магазин на платформе Domio Shops",
      whatsapp_number: "+77771234567",
      instagram_url: "https://instagram.com/demoshop",
      status: "active",
      theme: { accent: "#C9A84C", button_color: "#C9A84C", font: "onest" },
    },
  });

  const demoHash = await bcrypt.hash("demo123", 12);
  await prisma.shopUser.upsert({
    where: { email: "demo@domio.top" },
    update: {},
    create: {
      shop_id: demoShop.id,
      email: "demo@domio.top",
      password_hash: demoHash,
      role: "shop_owner",
    },
  });

  // Demo products
  const demoProducts = [
    { name: "Платье летнее", description: "Лёгкое летнее платье из хлопка", price: 12500, category: "Одежда", images: ["https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400"] },
    { name: "Блузка шёлковая", description: "Элегантная шёлковая блузка", price: 8900, category: "Одежда", images: ["https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400"] },
    { name: "Джинсы slim", description: "Современные джинсы slim fit", price: 15000, category: "Одежда", images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=400"] },
    { name: "Кроссовки белые", description: "Классические белые кроссовки", price: 22000, category: "Обувь", images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"] },
    { name: "Сумка кожаная", description: "Натуральная кожаная сумка", price: 35000, category: "Аксессуары", images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400"] },
    { name: "Серьги золотые", description: "Позолоченные серьги ручной работы", price: 6500, category: "Украшения", images: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400"] },
  ];

  for (let i = 0; i < demoProducts.length; i++) {
    const p = demoProducts[i];
    await prisma.product.create({
      data: {
        shop_id: demoShop.id,
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category,
        images: p.images,
        in_stock: true,
        is_active: true,
        sort_order: i,
      },
    });
  }

  console.log("✅ Demo shop created: demo@domio.top / demo123 (slug: demo)");

  // Demo shop 2
  const fashionShop = await prisma.shop.upsert({
    where: { slug: "fashion-kz" },
    update: {},
    create: {
      slug: "fashion-kz",
      name: "Fashion KZ",
      description: "Модная одежда из Казахстана",
      whatsapp_number: "+77779876543",
      status: "trial",
      theme: { accent: "#E8A87C", button_color: "#E8A87C", font: "onest" },
    },
  });

  const fashionHash = await bcrypt.hash("fashion123", 12);
  await prisma.shopUser.upsert({
    where: { email: "fashion@domio.top" },
    update: {},
    create: {
      shop_id: fashionShop.id,
      email: "fashion@domio.top",
      password_hash: fashionHash,
      role: "shop_owner",
    },
  });

  const fashionProducts = [
    { name: "Пальто осеннее", description: "Тёплое пальто на осень", price: 45000, category: "Верхняя одежда", images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400"] },
    { name: "Шарф кашемировый", description: "Мягкий кашемировый шарф", price: 9800, category: "Аксессуары", images: ["https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400"] },
    { name: "Свитер оверсайз", description: "Уютный оверсайз свитер", price: 11500, category: "Одежда", images: ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400"] },
  ];

  for (let i = 0; i < fashionProducts.length; i++) {
    const p = fashionProducts[i];
    await prisma.product.create({
      data: {
        shop_id: fashionShop.id,
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category,
        images: p.images,
        in_stock: true,
        is_active: true,
        sort_order: i,
      },
    });
  }

  console.log("✅ Fashion KZ shop created: fashion@domio.top / fashion123 (slug: fashion-kz)");
  console.log("\n🎉 Seeding complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
