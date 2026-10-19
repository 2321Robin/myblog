import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const POSTS_DIR = path.join(process.cwd(), "src", "content", "posts");

// Local-only companion of the dev-mode article editor; production requests are rejected.
export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Only available in development." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const slug = typeof body?.slug === "string" ? body.slug : "";
  const content = typeof body?.content === "string" ? body.content : "";

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "Invalid slug." }, { status: 400 });
  }
  if (!content.trim()) {
    return NextResponse.json({ error: "Content must not be empty." }, { status: 400 });
  }

  const target = path.join(POSTS_DIR, `${slug}.mdx`);
  try {
    await fs.access(target);
  } catch {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  await fs.writeFile(target, content, "utf8");
  return NextResponse.json({ ok: true });
}
