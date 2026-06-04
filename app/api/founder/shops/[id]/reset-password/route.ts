import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getFounderSession, unauthorized } from "@/lib/session";
import bcrypt from "bcryptjs";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getFounderSession();
  if (!session) return unauthorized();

  const body = await request.json();
  const { email, new_password } = body;

  if (!email || !new_password) {
    return NextResponse.json({ error: "email and new_password required" }, { status: 400 });
  }

  const user = await prisma.shopUser.findFirst({
    where: { shop_id: params.id, email },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const hash = await bcrypt.hash(new_password, 12);
  await prisma.shopUser.update({
    where: { id: user.id },
    data: { password_hash: hash },
  });

  return NextResponse.json({ ok: true });
}
