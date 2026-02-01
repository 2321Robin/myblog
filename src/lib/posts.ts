import fs from "node:fs/promises";
import path from "node:path";
import GithubSlugger from "github-slugger";
import type { ComponentType } from "react";

const POSTS_DIR = path.join(process.cwd(), "src", "content", "posts");

export type PostMeta = {
  title: string;
  slug: string;
  date: string;
  summary?: string;
  tags?: string[];
};

export type Heading = {
  id: string;
  text: string;
  level: number;
};

export type PostModule = {
  default: ComponentType;
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

export async function getPostSlugs(): Promise<string[]> {
  const entries = await fs.readdir(POSTS_DIR, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
    .map((entry) => entry.name.replace(/\.mdx$/, ""));
}

export async function getPostBySlug(slug: string): Promise<PostModule> {
  const mod = (await import(`@/content/posts/${slug}.mdx`)) as PostModule;
  return mod;
}

export async function getPostHeadings(slug: string): Promise<Heading[]> {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  const content = await fs.readFile(filePath, "utf8");
  return extractHeadingsFromSource(content);
}

export async function getAllPosts(): Promise<PostMeta[]> {
  const slugs = await getPostSlugs();
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const mod = await getPostBySlug(slug);
      return mod.metadata;
    })
  );

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}
