import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth/session";
import { seedNoteCategoriesIfEmpty } from "@/lib/notes/server";

export const runtime = "nodejs";

export async function POST() {
  const session = await verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { inserted } = await seedNoteCategoriesIfEmpty();
    return NextResponse.json({ inserted });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Seed failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
