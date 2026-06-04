import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  const shop = await prisma.shop.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      logo_url: true,
      whatsapp_number: true,
      instagram_url: true,
      theme: true,
      whatsapp_template: true,
      status: true,
    },
  });

  if (!shop) return NextResponse.json({ error: "Shop not found" }, { status: 404 });
  if (shop.status === "suspended") {
    return NextResponse.json({ error: "Shop is suspended" }, { status: 403 });
  }

  return NextResponse.json(shop);
}
