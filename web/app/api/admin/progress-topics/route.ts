import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth/session";
import {
  createProgressTopic,
  listProgressTopicsAdmin,
} from "@/lib/progress/server";
import type { ProgressTopicInput } from "@/lib/types/progress";
import { PROGRESS_STATUSES } from "@/lib/types/progress";

export const runtime = "nodejs";

function isStatus(s: string): s is ProgressTopicInput["status"] {
  return (PROGRESS_STATUSES as readonly string[]).includes(s);
}

function parseBody(body: unknown): ProgressTopicInput | null {
  if (!body || typeof body !== "object") return null;
  const o = body as Record<string, unknown>;
  const title = typeof o.title === "string" ? o.title.trim() : "";
  const categorySlug =
    typeof o.categorySlug === "string" ? o.categorySlug.trim() : "";
  const statusRaw = typeof o.status === "string" ? o.status : "";
  if (!title || !categorySlug || !isStatus(statusRaw)) return null;

  let confidence: number | null = null;
  if (o.confidence === null || o.confidence === undefined) {
    confidence = null;
  } else if (typeof o.confidence === "number" && Number.isFinite(o.confidence)) {
    confidence = o.confidence;
  }

  const detailNotes =
    o.detailNotes === null || o.detailNotes === undefined
      ? null
      : typeof o.detailNotes === "string"
        ? o.detailNotes
        : null;

  const sortOrder =
    typeof o.sortOrder === "number" && Number.isFinite(o.sortOrder)
      ? o.sortOrder
      : 0;

  return {
    title,
    categorySlug,
    status: statusRaw,
    confidence,
    detailNotes,
    sortOrder,
  };
}

export async function GET() {
  const session = await verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const topics = await listProgressTopicsAdmin();
    return NextResponse.json({ topics });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load topics";
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

  const input = parseBody(body);
  if (!input) {
    return NextResponse.json(
      { error: "Invalid body (title, categorySlug, status)" },
      { status: 400 },
    );
  }

  try {
    const id = await createProgressTopic(input);
    return NextResponse.json({ id });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Create failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
