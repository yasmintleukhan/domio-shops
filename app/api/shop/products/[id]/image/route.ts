import { NextRequest, NextResponse } from "next/server";
import { getShopSession, unauthorized } from "@/lib/session";
import { getPresignedUploadUrl } from "@/lib/r2";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getShopSession();
  if (!session) return unauthorized();

  const existing = await prisma.product.findFirst({
    where: { id: params.id, shop_id: session.shopId },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await request.json();
  const { filename, contentType } = body;

  if (!filename || !contentType) {
    return NextResponse.json({ error: "filename and contentType are required" }, { status: 400 });
  }

  const key = `shops/${session.shopId}/products/${params.id}/${Date.now()}-${filename}`;

  try {
    const uploadUrl = await getPresignedUploadUrl(key, contentType);
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;
    return NextResponse.json({ uploadUrl, publicUrl, key });
  } catch {
    return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
  }
}
