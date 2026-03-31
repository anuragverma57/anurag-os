import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth/session";
import { createNote, listNotesAdmin } from "@/lib/notes/server";
import type { NoteInput } from "@/lib/types/note";

export const runtime = "nodejs";

function parseNoteInput(body: unknown): NoteInput | null {
  if (!body || typeof body !== "object") return null;
  const o = body as Record<string, unknown>;
  const title = typeof o.title === "string" ? o.title.trim() : "";
  const slug = typeof o.slug === "string" ? o.slug.trim() : "";
  const contentMarkdown =
    typeof o.contentMarkdown === "string" ? o.contentMarkdown : "";
  const categorySlug =
    typeof o.categorySlug === "string" ? o.categorySlug.trim() : "";
  if (!title || !slug || !categorySlug) return null;

  let tags: string[] = [];
  if (Array.isArray(o.tags)) {
    tags = o.tags.filter((t): t is string => typeof t === "string");
  } else if (typeof o.tags === "string") {
    tags = o.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  const excerpt =
    o.excerpt === null || o.excerpt === undefined
      ? null
      : typeof o.excerpt === "string"
        ? o.excerpt
        : null;

  return {
    title,
    slug,
    contentMarkdown,
    excerpt,
    categorySlug,
    tags,
    isPublic: Boolean(o.isPublic),
  };
}

export async function GET() {
  const session = await verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const notes = await listNotesAdmin();
    return NextResponse.json({ notes });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load notes";
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

  const input = parseNoteInput(body);
  if (!input) {
    return NextResponse.json(
      { error: "Invalid body (need title, slug, categorySlug)" },
      { status: 400 },
    );
  }

  try {
    const id = await createNote(input);
    return NextResponse.json({ id });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Create failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
