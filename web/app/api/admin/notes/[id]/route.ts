import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth/session";
import { deleteNote, getNoteByIdAdmin, updateNote } from "@/lib/notes/server";
import type { NoteInput } from "@/lib/types/note";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

function parsePartial(body: unknown): Partial<NoteInput> | null {
  if (!body || typeof body !== "object") return null;
  const o = body as Record<string, unknown>;
  const out: Partial<NoteInput> = {};

  if (typeof o.title === "string") out.title = o.title;
  if (typeof o.slug === "string") out.slug = o.slug;
  if (typeof o.contentMarkdown === "string") out.contentMarkdown = o.contentMarkdown;
  if (typeof o.categorySlug === "string") out.categorySlug = o.categorySlug;
  if (typeof o.isPublic === "boolean") out.isPublic = o.isPublic;

  if (o.excerpt === null) out.excerpt = null;
  else if (typeof o.excerpt === "string") out.excerpt = o.excerpt;

  if (Array.isArray(o.tags)) {
    out.tags = o.tags.filter((t): t is string => typeof t === "string");
  } else if (typeof o.tags === "string") {
    out.tags = o.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  return Object.keys(out).length ? out : null;
}

export async function GET(_request: Request, context: RouteContext) {
  const session = await verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  const note = await getNoteByIdAdmin(id);
  if (!note) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ note });
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const partial = parsePartial(body);
  if (!partial) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const existing = await getNoteByIdAdmin(id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    await updateNote(id, partial);
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
  const { id } = await context.params;
  const existing = await getNoteByIdAdmin(id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await deleteNote(id);
  return NextResponse.json({ ok: true });
}
