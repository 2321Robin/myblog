import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getDevSaveToken } from "@/lib/dev-save-token";

const POSTS_DIR = path.join(process.cwd(), "src", "content", "posts");
const MAX_BODY_BYTES = 512 * 1024;
const LOOPBACK_HOST = /^(?:127\.0\.0\.1|localhost|\[::1\])(?::(\d+))?$/;

function allowedOrigin(request: Request): string | null {
  const host = request.headers.get("host") ?? "";
  const match = LOOPBACK_HOST.exec(host);
  return match ? `http://${match[0]}` : null;
}

function rejection(request: Request): NextResponse | null {
  const origin = allowedOrigin(request);
  if (!origin) return NextResponse.json({ error: "Requests must target loopback." }, { status: 403 });
  const requestOrigin = request.headers.get("origin");
  if (requestOrigin && requestOrigin !== origin) {
    return NextResponse.json({ error: "Cross-origin request rejected." }, { status: 403 });
  }
  const site = request.headers.get("sec-fetch-site");
  if (site && site !== "same-origin" && site !== "none") {
    return NextResponse.json({ error: "Cross-origin request rejected." }, { status: 403 });
  }
  return null;
}

async function readJsonBody(request: Request): Promise<{ ok: true; value: unknown } | { ok: false; status: 413 | 400 }> {
  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) return { ok: false, status: 413 };
  const raw = await request.text();
  if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) return { ok: false, status: 413 };
  try {
    return { ok: true, value: JSON.parse(raw) };
  } catch {
    return { ok: false, status: 400 };
  }
}

// Local-only companion of the dev-mode article editor; production requests are rejected.
export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Only available in development." }, { status: 404 });
  }

  const provided = request.headers.get("x-dev-save-token");
  if (!provided || provided !== getDevSaveToken()) {
    return NextResponse.json({ error: "Invalid dev token." }, { status: 403 });
  }
  const rejected = rejection(request);
  if (rejected) return rejected;
  if ((request.headers.get("content-type") ?? "").split(";")[0].trim() !== "application/json") {
    return NextResponse.json({ error: "Content-Type must be application/json." }, { status: 415 });
  }

  const parsed = await readJsonBody(request);
  if (!parsed.ok) {
    return NextResponse.json(
      { error: parsed.status === 413 ? "Payload must be under 512 KB." : "Payload must be valid JSON." },
      { status: parsed.status },
    );
  }

  const { slug, content } = (parsed.value ?? {}) as { slug?: unknown; content?: unknown };

  if (typeof slug !== "string" || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "Invalid slug." }, { status: 400 });
  }
  if (typeof content !== "string" || !content.trim()) {
    return NextResponse.json({ error: "Content must not be empty." }, { status: 400 });
  }

  const target = path.join(POSTS_DIR, `${slug}.mdx`);
  try {
    await fs.access(target);
  } catch {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  await fs.writeFile(target, content, "utf8");
  const annotations = content.match(/【[^】]*】/g)?.length ?? 0;
  return NextResponse.json({ ok: true, annotations });
}
