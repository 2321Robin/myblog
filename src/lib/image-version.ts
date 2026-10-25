import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const cache = new Map<string, string>();

// Build-time companion of the rehype plugin in scripts/mdx-image-attributes.mjs:
// /images/** URLs get a content-hash query (?v=) so they can be cached as
// immutable while the files stay replaceable in place. Non-image paths (e.g.
// /og.png) pass through untouched, and a missing file degrades to the raw src.
export function versionedImageUrl(src: string): string {
  if (!src.startsWith("/images/")) return src;
  const known = cache.get(src);
  if (known) return known;
  let versioned = src;
  try {
    const buffer = fs.readFileSync(path.join(PUBLIC_DIR, src.replace(/^\//, "")));
    const version = crypto.createHash("sha1").update(buffer).digest("hex").slice(0, 8);
    versioned = `${src}?v=${version}`;
  } catch {
    versioned = src;
  }
  cache.set(src, versioned);
  return versioned;
}
