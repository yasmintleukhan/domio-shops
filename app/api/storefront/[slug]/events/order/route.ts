import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const body = await request.json();
    const { session_id, product_ids, cart_total } = body;

    const shop = await prisma.shop.findUnique({ where: { slug } });
    if (!shop) return NextResponse.json({ ok: false }, { status: 404 });

    await prisma.orderEvent.create({
      data: {
        shop_id: shop.id,
        session_id: session_id || "unknown",
        product_ids: product_ids || [],
        cart_total: parseFloat(cart_total) || 0,
        whatsapp_clicked: true,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
