import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth/session";
import { seedProjectsFromFallback } from "@/lib/projects/server";

export const runtime = "nodejs";

export async function POST() {
  const session = await verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { inserted } = await seedProjectsFromFallback();
  return NextResponse.json({ inserted });
}
