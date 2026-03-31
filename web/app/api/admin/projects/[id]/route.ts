import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth/session";
import {
  deleteProject,
  getProjectByIdAdmin,
  updateProject,
} from "@/lib/projects/server";
import type { ProjectInput } from "@/lib/types/project";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

function parsePartial(body: unknown): Partial<ProjectInput> | null {
  if (!body || typeof body !== "object") return null;
  const o = body as Record<string, unknown>;
  const out: Partial<ProjectInput> = {};

  if (typeof o.title === "string") out.title = o.title.trim();
  if (typeof o.description === "string") out.description = o.description.trim();
  if (typeof o.href === "string") out.href = o.href.trim();
  if (o.repo === null || typeof o.repo === "string")
    out.repo = o.repo === null || o.repo === "" ? null : o.repo.trim();
  if (o.linkLabel === null || typeof o.linkLabel === "string")
    out.linkLabel =
      o.linkLabel === null || o.linkLabel === "" ? null : o.linkLabel.trim();
  if (typeof o.featured === "boolean") out.featured = o.featured;
  if (typeof o.isPublic === "boolean") out.isPublic = o.isPublic;
  if (typeof o.sortOrder === "number" && Number.isFinite(o.sortOrder)) {
    out.sortOrder = o.sortOrder;
  }
  if (Array.isArray(o.stack)) {
    out.stack = o.stack.filter((s): s is string => typeof s === "string");
  } else if (typeof o.stack === "string") {
    out.stack = o.stack
      .split(",")
      .map((s) => s.trim())
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
  const project = await getProjectByIdAdmin(id);
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ project });
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

  const existing = await getProjectByIdAdmin(id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await updateProject(id, partial);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  const existing = await getProjectByIdAdmin(id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await deleteProject(id);
  return NextResponse.json({ ok: true });
}
