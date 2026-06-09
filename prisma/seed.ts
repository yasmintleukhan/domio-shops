import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── Founder ────────────────────────────────────────────────────────
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
  console.log("✅ Founder: founder@domio.top / founder123");

  // ── Demo Shop ──────────────────────────────────────────────────────
  const demoShop = await prisma.shop.upsert({
    where: { slug: "demo" },
    update: {
      name: "Domio Demo",
      description: "Демонстрационный магазин — всё что можно продать через Domio",
      whatsapp_number: "+77771234567",
      instagram_url: "https://instagram.com/domio.demo",
      status: "active",
      theme: { accent: "#C9A84C", button_color: "#C9A84C", font: "onest" },
    },
    create: {
      slug: "demo",
      name: "Domio Demo",
      description: "Демонстрационный магазин — всё что можно продать через Domio",
      whatsapp_number: "+77771234567",
      instagram_url: "https://instagram.com/domio.demo",
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

  // Delete existing demo products to avoid duplicates on re-seed
  await prisma.product.deleteMany({ where: { shop_id: demoShop.id } });

  const demoProducts = [
    // ── Кроссовки ──────────────────────────────────────────────────
    {
      name: "Nike Air Max 270",
      description: "Культовые кроссовки с большой воздушной подушкой. Амортизация на весь день, стильный силуэт. Подходят для повседневной носки и лёгких тренировок.",
      price: 42000,
      category: "Кроссовки",
      images: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80",
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80",
      ],
      options: [
        { name: "Размер", values: ["38", "39", "40", "41", "42", "43", "44"] },
        { name: "Цвет", values: ["Белый", "Чёрный", "Серый"] },
      ],
      sort_order: 0,
    },
    {
      name: "Adidas Ultraboost 22",
      description: "Профессиональные беговые кроссовки с технологией Boost. Возвращают энергию при каждом шаге. Идеальны для бега и активных прогулок.",
      price: 55000,
      category: "Кроссовки",
      images: [
        "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800&q=80",
        "https://images.unsplash.com/photo-1556906781-9a412961a28c?w=800&q=80",
      ],
      options: [
        { name: "Размер", values: ["39", "40", "41", "42", "43", "44", "45"] },
        { name: "Цвет", values: ["Белый/Синий", "Чёрный/Золотой", "Серый/Оранжевый"] },
      ],
      sort_order: 1,
    },
    {
      name: "New Balance 574",
      description: "Классика на все времена. Замшевый верх, мягкая подошва ENCAP. Сочетается с любым образом — от casual до спортивного.",
      price: 38000,
      category: "Кроссовки",
      images: [
        "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80",
        "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80",
      ],
      options: [
        { name: "Размер", values: ["37", "38", "39", "40", "41", "42", "43"] },
        { name: "Цвет", values: ["Серый", "Зелёный", "Бордо"] },
      ],
      sort_order: 2,
    },

    // ── Украшения ──────────────────────────────────────────────────
    {
      name: "Золотые серьги с жемчугом",
      description: "Элегантные серьги из позолоченного серебра 925 пробы с натуральным пресноводным жемчугом. Размер жемчужины 8мм. В подарочной коробке.",
      price: 18500,
      category: "Украшения",
      images: [
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
        "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=800&q=80",
      ],
      options: [
        { name: "Металл", values: ["Золото 585", "Серебро 925", "Позолота"] },
      ],
      sort_order: 3,
    },
    {
      name: "Браслет из розового золота",
      description: "Тонкий браслет из розового золота 14К с бриллиантовой крошкой. Длина 17-19 см, регулируемая застёжка. Гипоаллергенный материал.",
      price: 45000,
      category: "Украшения",
      images: [
        "https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=800&q=80",
        "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80",
      ],
      options: [
        { name: "Длина", values: ["16 см", "17 см", "18 см", "19 см"] },
      ],
      sort_order: 4,
    },
    {
      name: "Колье с подвеской «Луна»",
      description: "Минималистичное колье из стерлингового серебра с подвеской в форме полумесяца. Длина цепочки 45 см. Идеальный подарок.",
      price: 9800,
      category: "Украшения",
      images: [
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
      ],
      options: [],
      sort_order: 5,
    },

    // ── Одежда ────────────────────────────────────────────────────
    {
      name: "Платье миди из шёлка",
      description: "Роскошное платье миди из натурального шёлка. V-образный вырез, запахной силуэт, пояс в комплекте. Подходит для офиса и вечернего выхода.",
      price: 28000,
      category: "Одежда",
      images: [
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80",
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80",
      ],
      options: [
        { name: "Размер", values: ["XS", "S", "M", "L", "XL"] },
        { name: "Цвет", values: ["Бежевый", "Чёрный", "Пудровый", "Изумрудный"] },
      ],
      sort_order: 6,
    },
    {
      name: "Костюм оверсайз (пиджак + брюки)",
      description: "Трендовый брючный костюм оверсайз из премиальной вискозы. Свободный пиджак с широкими лацканами, прямые брюки. Можно носить по отдельности.",
      price: 52000,
      category: "Одежда",
      images: [
        "https://images.unsplash.com/photo-1594938298603-c8148c4b4809?w=800&q=80",
        "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80",
      ],
      options: [
        { name: "Размер", values: ["XS", "S", "M", "L", "XL", "XXL"] },
        { name: "Цвет", values: ["Молочный", "Серый меланж", "Чёрный", "Бежевый"] },
      ],
      sort_order: 7,
    },
    {
      name: "Джинсы Wide Leg",
      description: "Широкие джинсы с высокой посадкой из плотного денима. Не тянутся, держат форму. Длина по щиколотку. Эффект ретро-силуэта.",
      price: 19500,
      category: "Одежда",
      images: [
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80",
        "https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800&q=80",
      ],
      options: [
        { name: "Размер", values: ["25", "26", "27", "28", "29", "30", "31", "32"] },
        { name: "Цвет", values: ["Светло-голубой", "Тёмно-синий", "Чёрный"] },
      ],
      sort_order: 8,
    },
    {
      name: "Кашемировый свитер",
      description: "100% монгольский кашемир, плотность 2-PLY. Мягкий, тёплый, не колется. Крой оверсайз, рукав реглан. Машинная стирка при 30°.",
      price: 34000,
      category: "Одежда",
      images: [
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80",
      ],
      options: [
        { name: "Размер", values: ["S", "M", "L", "XL"] },
        { name: "Цвет", values: ["Карамельный", "Серый", "Белый", "Тёмно-зелёный", "Бордо"] },
      ],
      sort_order: 9,
    },

    // ── БАДы и здоровье ──────────────────────────────────────────
    {
      name: "Коллаген + Витамин C",
      description: "Морской коллаген I и III типа с витамином C для максимального усвоения. 5000 мг на порцию. 30 саше-стиков. Вкус: персик-манго. Укрепляет кожу, волосы и суставы.",
      price: 12800,
      category: "БАДы",
      images: [
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
        "https://images.unsplash.com/photo-1550572017-edd951b55104?w=800&q=80",
      ],
      options: [
        { name: "Объём", values: ["30 саше", "60 саше"] },
        { name: "Вкус", values: ["Персик-манго", "Клубника", "Без вкуса"] },
      ],
      sort_order: 10,
    },
    {
      name: "Омега-3 рыбий жир Premium",
      description: "Высококонцентрированный рыбий жир из дикого лосося. EPA 600 мг + DHA 400 мг на капсулу. 90 капсул. Без рыбного запаха. Поддерживает сердце, мозг и зрение.",
      price: 8500,
      category: "БАДы",
      images: [
        "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80",
      ],
      options: [
        { name: "Количество", values: ["90 капсул", "180 капсул"] },
      ],
      sort_order: 11,
    },
    {
      name: "Магний B6 + Глицин",
      description: "Комплекс для нервной системы и глубокого сна. Магний цитрат 300 мг + B6 + глицин 500 мг. 60 таблеток. Снимает тревогу, улучшает качество сна.",
      price: 6900,
      category: "БАДы",
      images: [
        "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800&q=80",
      ],
      options: [
        { name: "Количество", values: ["60 таблеток", "120 таблеток"] },
      ],
      sort_order: 12,
    },
    {
      name: "Протеин Whey Isolate",
      description: "Изолят сывороточного протеина 90% белка. 25 г белка на порцию, 0.5 г жира, без лактозы. 900 г — 30 порций. Быстрое восстановление после тренировок.",
      price: 22000,
      category: "БАДы",
      images: [
        "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&q=80",
      ],
      options: [
        { name: "Вкус", values: ["Шоколад", "Ваниль", "Клубника", "Без вкуса"] },
        { name: "Объём", values: ["900 г", "1.8 кг"] },
      ],
      sort_order: 13,
    },

    // ── Косметика и уход ──────────────────────────────────────────
    {
      name: "Сыворотка с ретинолом 0.5%",
      description: "Антивозрастная сыворотка с ретинолом 0.5% и гиалуроновой кислотой. 30 мл. Уменьшает морщины, выравнивает тон, сужает поры. Применять на ночь.",
      price: 15600,
      category: "Косметика",
      images: [
        "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80",
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",
      ],
      options: [],
      sort_order: 14,
    },
    {
      name: "Крем для лица SPF 50",
      description: "Дневной увлажняющий крем с защитой SPF 50+. Лёгкая текстура, не оставляет белого следа. Подходит для чувствительной кожи. 50 мл.",
      price: 9200,
      category: "Косметика",
      images: [
        "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80",
      ],
      options: [
        { name: "Тип кожи", values: ["Нормальная", "Жирная", "Сухая", "Комбинированная"] },
      ],
      sort_order: 15,
    },

    // ── Аксессуары ────────────────────────────────────────────────
    {
      name: "Сумка-тоут из кожи",
      description: "Вместительная сумка-тоут из зернистой натуральной кожи. Размер 40×30×12 см. Внутренний карман на молнии, карман для телефона. Длина ручек 55 см.",
      price: 48000,
      category: "Аксессуары",
      images: [
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
      ],
      options: [
        { name: "Цвет", values: ["Чёрный", "Кэмел", "Бордо", "Тёмно-синий"] },
      ],
      sort_order: 16,
    },
    {
      name: "Солнцезащитные очки Aviator",
      description: "Классические авиаторы с поляризованными линзами UV400. Оправа из нержавеющей стали. Чехол и салфетка в комплекте.",
      price: 14500,
      category: "Аксессуары",
      images: [
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80",
        "https://images.unsplash.com/photo-1582142306909-195724d33ffc?w=800&q=80",
      ],
      options: [
        { name: "Цвет линз", values: ["Серый", "Зеркальный золотой", "Коричневый"] },
      ],
      sort_order: 17,
    },
    {
      name: "Ремень кожаный",
      description: "Мужской ремень из полнозернистой кожи. Ширина 3.5 см, металлическая пряжка с антикварным покрытием. Длина 110-130 см.",
      price: 11000,
      category: "Аксессуары",
      images: [
        "https://images.unsplash.com/photo-1624623278313-a930126a11c3?w=800&q=80",
      ],
      options: [
        { name: "Размер", values: ["90 см", "100 см", "110 см", "120 см"] },
        { name: "Цвет", values: ["Чёрный", "Коричневый", "Тёмно-коричневый"] },
      ],
      sort_order: 18,
    },

    // ── Товары для дома ───────────────────────────────────────────
    {
      name: "Ароматическая свеча «Сандал и ваниль»",
      description: "Натуральная соевая свеча с деревянным фитилём. Время горения 50 часов. Объём 300 мл. Аромат: сандаловое дерево, ваниль, амбра. В стеклянном стакане.",
      price: 7800,
      category: "Для дома",
      images: [
        "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&q=80",
        "https://images.unsplash.com/photo-1602532305019-3dbbd482dae9?w=800&q=80",
      ],
      options: [
        { name: "Аромат", values: ["Сандал и ваниль", "Лаванда", "Цитрус", "Роза"] },
      ],
      sort_order: 19,
    },
    {
      name: "Набор постельного белья Satin",
      description: "Постельный комплект из 100% хлопкового сатина 400TC. Пододеяльник 200×220, простыня 240×260, 2 наволочки 50×70. Не мнётся, приятен на ощупь.",
      price: 32000,
      category: "Для дома",
      images: [
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
      ],
      options: [
        { name: "Размер", values: ["1.5 спальный", "2 спальный", "Евро"] },
        { name: "Цвет", values: ["Белый", "Серо-бежевый", "Пыльная роза", "Шалфей"] },
      ],
      sort_order: 20,
    },
  ];

  for (const p of demoProducts) {
    await prisma.product.create({
      data: {
        shop_id:    demoShop.id,
        name:       p.name,
        description: p.description,
        price:      p.price,
        category:   p.category,
        images:     p.images,
        options:    p.options,
        in_stock:   true,
        is_active:  true,
        sort_order: p.sort_order,
      },
    });
  }

  console.log(`✅ Demo shop: demo@domio.top / demo123 — ${demoProducts.length} товаров`);

  // ── Fashion KZ ────────────────────────────────────────────────────
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

  await prisma.product.deleteMany({ where: { shop_id: fashionShop.id } });

  const fashionProducts = [
    { name: "Пальто осеннее двубортное", description: "Тёплое пальто из шерстяного сукна. Двубортная застёжка, пояс в комплекте. Длина миди.", price: 68000, category: "Верхняя одежда", images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80"], options: [{ name: "Размер", values: ["XS","S","M","L","XL"] }, { name: "Цвет", values: ["Бежевый","Серый","Чёрный"] }], sort_order: 0 },
    { name: "Шарф кашемировый 180×30", description: "Мягкий кашемировый шарф. Размер 180×30 см.", price: 12800, category: "Аксессуары", images: ["https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&q=80"], options: [{ name: "Цвет", values: ["Кэмел","Серый","Бордо","Синий"] }], sort_order: 1 },
    { name: "Свитер оверсайз рубчик", description: "Уютный оверсайз свитер из рубчатой вязки. Высокий ворот.", price: 14500, category: "Одежда", images: ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80"], options: [{ name: "Размер", values: ["S","M","L","XL"] }, { name: "Цвет", values: ["Молочный","Серый","Горчичный","Хаки"] }], sort_order: 2 },
  ];

  for (const p of fashionProducts) {
    await prisma.product.create({
      data: { shop_id: fashionShop.id, name: p.name, description: p.description, price: p.price, category: p.category, images: p.images, options: p.options, in_stock: true, is_active: true, sort_order: p.sort_order },
    });
  }

  console.log("✅ Fashion KZ: fashion@domio.top / fashion123");
  console.log("\n🎉 Seeding complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
