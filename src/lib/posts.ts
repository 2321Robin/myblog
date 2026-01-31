import fs from "node:fs/promises";
import path from "node:path";
import type { ComponentType } from "react";

const POSTS_DIR = path.join(process.cwd(), "src", "content", "posts");

export type PostMeta = {
  title: string;
  slug: string;
  date: string;
  summary?: string;
  tags?: string[];
};

export type PostModule = {
  default: ComponentType;
  metadata: PostMeta;
};

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
