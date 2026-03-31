import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth/session";
import {
  deleteNoteCategory,
  getNoteCategoryBySlug,
  updateNoteCategory,
} from "@/lib/notes/server";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ slug: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const session = await verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const o = body as Record<string, unknown>;
  const partial: { name?: string; sortOrder?: number } = {};
  if (typeof o.name === "string") partial.name = o.name;
  if (typeof o.sortOrder === "number" && Number.isFinite(o.sortOrder)) {
    partial.sortOrder = o.sortOrder;
  }
  if (!Object.keys(partial).length) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const existing = await getNoteCategoryBySlug(slug);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    await updateNoteCategory(slug, partial);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug } = await context.params;
  const existing = await getNoteCategoryBySlug(slug);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  try {
    await deleteNoteCategory(slug);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
