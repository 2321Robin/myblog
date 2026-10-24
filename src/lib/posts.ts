import fs from "node:fs/promises";
import path from "node:path";
import GithubSlugger from "github-slugger";
import type { ComponentProps, ComponentType } from "react";

const POSTS_DIR = path.join(process.cwd(), "src", "content", "posts");
const postSourceCache = new Map<string, Promise<string>>();
const postCache = new Map<string, PostModule>();

export type PostMeta = {
  title: string;
  slug: string;
  date: string;
  summary?: string;
  tags?: string[];
  cover?: string;
  readingTimeMinutes?: number;
  published: boolean;
};

export type Heading = {
  id: string;
  text: string;
  level: number;
};

export type PostModule = {
  default: ComponentType<{ components?: { h1?: ComponentType<ComponentProps<"h1">> } }>;
  metadata: PostMeta;
};

function extractHeadingsFromSource(source: string): Heading[] {
  const matcher = /^(#{2,3})\s+(.+)$/gm;
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  let match: RegExpExecArray | null;

  while ((match = matcher.exec(source))) {
    const hashes = match[1];
    const text = match[2].trim();
    const level = hashes.length;
    const id = slugger.slug(text);
    headings.push({ id, text, level });
  }

  return headings;
}

// 阅读时长按「读者真正要读的字」估算：frontmatter、代码块、图片（含 alt 文字）、
// 链接地址、HTML 标签和 MDX 注释都不计入。旧实现只去掉代码块与 <img>，
// 把图片 alt（每篇几百字）和链接 URL 也当正文数，结果系统性偏高。
function stripNonProse(source: string) {
  return source
    .replace(/^export const metadata[\s\S]*?\n\};/m, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`\n]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/<img\b[^>]*>/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ")
    .replace(/<[^>]+>/g, " ");
}

export function computeReadingTimeMinutes(source: string) {
  const prose = stripNonProse(source);
  const cjkChars = (prose.match(/[\u4e00-\u9fff]/g) ?? []).length;
  const latinWords = (prose.match(/[A-Za-z0-9]+(?:[-'’][A-Za-z0-9]+)*/g) ?? []).length;
  return Math.max(1, Math.ceil(cjkChars / 400 + latinWords / 200));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireString(metadata: Record<string, unknown>, field: string, slug: string) {
  const value = metadata[field];
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Post "${slug}" metadata.${field} must be a non-empty string.`);
  }
  return value;
}

function optionalString(metadata: Record<string, unknown>, field: string, slug: string) {
  const value = metadata[field];
  if (value === undefined) return undefined;
  if (typeof value !== "string") {
    throw new Error(`Post "${slug}" metadata.${field} must be a string when provided.`);
  }
  return value;
}

function optionalTags(metadata: Record<string, unknown>, slug: string) {
  const value = metadata.tags;
  if (value === undefined) return undefined;
  if (!Array.isArray(value) || value.some((tag) => typeof tag !== "string" || !tag.trim())) {
    throw new Error(`Post "${slug}" metadata.tags must be an array of non-empty strings when provided.`);
  }
  return value;
}

function optionalReadingTime(metadata: Record<string, unknown>, slug: string) {
  const value = metadata.readingTimeMinutes;
  if (value === undefined) return undefined;
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new Error(`Post "${slug}" metadata.readingTimeMinutes must be a positive number when provided.`);
  }
  return value;
}

function optionalPublished(metadata: Record<string, unknown>, slug: string) {
  const value = metadata.published;
  if (value === undefined) return true;
  if (typeof value !== "boolean") {
    throw new Error(`Post "${slug}" metadata.published must be a boolean when provided.`);
  }
  return value;
}

function validatePostMetadata(metadata: unknown, slug: string): PostMeta {
  if (!isRecord(metadata)) {
    throw new Error(`Post "${slug}" must export a metadata object.`);
  }

  const title = requireString(metadata, "title", slug);
  const metadataSlug = requireString(metadata, "slug", slug);
  const date = requireString(metadata, "date", slug);

  if (metadataSlug !== slug) {
    throw new Error(`Post "${slug}" metadata.slug must match its file name.`);
  }
  if (Number.isNaN(Date.parse(date))) {
    throw new Error(`Post "${slug}" metadata.date must be a valid date string.`);
  }

  return {
    title,
    slug: metadataSlug,
    date,
    summary: optionalString(metadata, "summary", slug),
    tags: optionalTags(metadata, slug),
    cover: optionalString(metadata, "cover", slug),
    readingTimeMinutes: optionalReadingTime(metadata, slug),
    published: optionalPublished(metadata, slug),
  };
}

function readPostSource(slug: string) {
  const cached = postSourceCache.get(slug);
  if (cached) return cached;

  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  const sourcePromise = fs.readFile(filePath, "utf8");
  postSourceCache.set(slug, sourcePromise);
  return sourcePromise;
}

export async function getPostSource(slug: string): Promise<string> {
  return readPostSource(slug);
}

export async function getPostSlugs(): Promise<string[]> {
  const entries = await fs.readdir(POSTS_DIR, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
    .map((entry) => entry.name.replace(/\.mdx$/, ""));
}

export async function getPostBySlug(slug: string): Promise<PostModule | null> {
  const cached = postCache.get(slug);
  if (cached) return cached;
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const exists = await fs.access(path.join(POSTS_DIR, `${slug}.mdx`)).then(() => true, () => false);
  if (!exists) return null;
  // Post files are selected by slug at runtime, so a dynamic specifier is required.
  const mod = (await import(`@/content/posts/${slug}.mdx`)) as PostModule;
  const content = await readPostSource(slug);
  const readingTimeMinutes = computeReadingTimeMinutes(content);
  const metadata = validatePostMetadata(mod.metadata, slug);
  const post: PostModule = { ...mod, metadata: { ...metadata, readingTimeMinutes } };
  postCache.set(slug, post);
  return post;
}

// Single gate for every public read: drafts resolve to null outside the dev editor.
export async function getPublishedPostBySlug(slug: string): Promise<PostModule | null> {
  const mod = await getPostBySlug(slug);
  return mod?.metadata.published ? mod : null;
}

export async function getPostHeadings(slug: string): Promise<Heading[]> {
  const content = await readPostSource(slug);
  return extractHeadingsFromSource(content);
}

export async function getAllPosts(): Promise<PostMeta[]> {
  const slugs = await getPostSlugs();
  const modules = await Promise.all(slugs.map((slug) => getPostBySlug(slug)));
  return modules
    .filter((mod): mod is PostModule => Boolean(mod?.metadata.published))
    .map((mod) => mod.metadata)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
