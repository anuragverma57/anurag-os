import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth/session";
import {
  deleteProgressTopic,
  getProgressTopicByIdAdmin,
  updateProgressTopic,
} from "@/lib/progress/server";
import type { ProgressTopicInput } from "@/lib/types/progress";
import { PROGRESS_STATUSES } from "@/lib/types/progress";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

function isStatus(s: string): s is ProgressTopicInput["status"] {
  return (PROGRESS_STATUSES as readonly string[]).includes(s);
}

function parsePartial(body: unknown): Partial<ProgressTopicInput> | null {
  if (!body || typeof body !== "object") return null;
  const o = body as Record<string, unknown>;
  const out: Partial<ProgressTopicInput> = {};

  if (typeof o.title === "string") out.title = o.title;
  if (typeof o.categorySlug === "string") out.categorySlug = o.categorySlug;
  if (typeof o.status === "string" && isStatus(o.status)) out.status = o.status;

  if (o.confidence === null) out.confidence = null;
  else if (typeof o.confidence === "number" && Number.isFinite(o.confidence)) {
    out.confidence = o.confidence;
  }

  if (o.detailNotes === null) out.detailNotes = null;
  else if (typeof o.detailNotes === "string") out.detailNotes = o.detailNotes;

  if (typeof o.sortOrder === "number" && Number.isFinite(o.sortOrder)) {
    out.sortOrder = o.sortOrder;
  }

  return Object.keys(out).length ? out : null;
}

export async function GET(_request: Request, context: RouteContext) {
  const session = await verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  const topic = await getProgressTopicByIdAdmin(id);
  if (!topic) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ topic });
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

  const existing = await getProgressTopicByIdAdmin(id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    await updateProgressTopic(id, partial);
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
  const existing = await getProgressTopicByIdAdmin(id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await deleteProgressTopic(id);
  return NextResponse.json({ ok: true });
}
