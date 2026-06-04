import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const body = await request.json();
    const { session_id, product_id, page, referrer } = body;

    const shop = await prisma.shop.findUnique({ where: { slug } });
    if (!shop) return NextResponse.json({ ok: false }, { status: 404 });

    await prisma.pageView.create({
      data: {
        shop_id: shop.id,
        session_id: session_id || "unknown",
        product_id: product_id || null,
        page: page || "/",
        referrer: referrer || null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
