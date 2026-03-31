import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth/session";
import {
  createNoteCategory,
  listNoteCategoriesAdmin,
} from "@/lib/notes/server";
import type { NoteCategoryInput } from "@/lib/types/note";

export const runtime = "nodejs";

function parseCategory(body: unknown): NoteCategoryInput | null {
  if (!body || typeof body !== "object") return null;
  const o = body as Record<string, unknown>;
  const slug = typeof o.slug === "string" ? o.slug.trim() : "";
  const name = typeof o.name === "string" ? o.name.trim() : "";
  const sortOrder =
    typeof o.sortOrder === "number" && Number.isFinite(o.sortOrder)
      ? o.sortOrder
      : 0;
  if (!slug || !name) return null;
  return { slug, name, sortOrder };
}

export async function GET() {
  const session = await verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const categories = await listNoteCategoriesAdmin();
    return NextResponse.json({ categories });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const input = parseCategory(body);
  if (!input) {
    return NextResponse.json(
      { error: "Invalid body (need slug, name)" },
      { status: 400 },
    );
  }

  try {
    await createNoteCategory(input);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Create failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
