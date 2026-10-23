import fs from "node:fs";
import path from "node:path";
import { visit } from "unist-util-visit";
import sharp from "sharp";

// Runs inside the MDX loader at build time, so the rendered HTML carries real
// intrinsic dimensions and lazy loading without any runtime cost. Applies to
// markdown images and to the inline <img> tags the author writes for mascots,
// which MDX compiles as JSX rather than routing through components.img.
const PUBLIC_DIR = path.join(process.cwd(), "public");
const dimensionCache = new Map();

async function dimensionsFor(src) {
  if (dimensionCache.has(src)) return dimensionCache.get(src);
  let dimensions = null;
  try {
    const filePath = path.join(PUBLIC_DIR, src.replace(/^\//, ""));
    if (fs.existsSync(filePath)) {
      const metadata = await sharp(filePath).metadata();
      if (metadata.width && metadata.height) dimensions = { width: metadata.width, height: metadata.height };
    }
  } catch {
    dimensions = null;
  }
  dimensionCache.set(src, dimensions);
  return dimensions;
}

function readSrc(node) {
  if (node.type === "element") return typeof node.properties?.src === "string" ? node.properties.src : undefined;
  for (const attribute of node.attributes ?? []) {
    if (attribute.name === "src") return typeof attribute.value === "string" ? attribute.value : undefined;
  }
  return undefined;
}

function setAttribute(node, name, value) {
  if (node.type === "element") {
    if (name in node.properties) return;
    node.properties[name] = value;
    return;
  }
  if ((node.attributes ?? []).some((attribute) => attribute.name === name)) return;
  node.attributes.push({ type: "mdxJsxAttribute", name, value });
}
export default function rehypeImageAttributes() {
  return async (tree) => {
    const pending = [];

    visit(tree, (node) => {
      const isImg = node.type === "element" && node.tagName === "img";
      const isJsxImg = node.type === "mdxJsxFlowElement" && node.name === "img";
      if (!isImg && !isJsxImg) return;
      const src = readSrc(node);
      if (!src || !src.startsWith("/images/")) return;

      pending.push(
        (async () => {
          const dimensions = await dimensionsFor(src);
          if (dimensions) {
            setAttribute(node, "width", dimensions.width);
            setAttribute(node, "height", dimensions.height);
          }
          setAttribute(node, "loading", "lazy");
          setAttribute(node, "decoding", "async");
        })()
      );
    });

    await Promise.all(pending);
  };
}
