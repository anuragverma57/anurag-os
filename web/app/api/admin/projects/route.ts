import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth/session";
import {
  createProject,
  getAllProjectsAdmin,
} from "@/lib/projects/server";
import type { ProjectInput } from "@/lib/types/project";

export const runtime = "nodejs";

function parseInput(body: unknown): ProjectInput | null {
  if (!body || typeof body !== "object") return null;
  const o = body as Record<string, unknown>;
  const title = typeof o.title === "string" ? o.title.trim() : "";
  const description =
    typeof o.description === "string" ? o.description.trim() : "";
  const href = typeof o.href === "string" ? o.href.trim() : "";
  if (!title || !href) return null;

  let stack: string[] = [];
  if (Array.isArray(o.stack)) {
    stack = o.stack.filter((s): s is string => typeof s === "string");
  } else if (typeof o.stack === "string") {
    stack = o.stack
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  return {
    title,
    description,
    stack,
    href,
    repo: typeof o.repo === "string" && o.repo.trim() ? o.repo.trim() : null,
    linkLabel:
      typeof o.linkLabel === "string" && o.linkLabel.trim()
        ? o.linkLabel.trim()
        : null,
    featured: Boolean(o.featured),
    isPublic: Boolean(o.isPublic),
    sortOrder:
      typeof o.sortOrder === "number" && Number.isFinite(o.sortOrder)
        ? o.sortOrder
        : 0,
  };
}

export async function GET() {
  const session = await verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const projects = await getAllProjectsAdmin();
  return NextResponse.json({ projects });
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

  const input = parseInput(body);
  if (!input) {
    return NextResponse.json(
      { error: "Invalid body (need title, href)" },
      { status: 400 },
    );
  }

  const id = await createProject(input);
  return NextResponse.json({ id });
}
