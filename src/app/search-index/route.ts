import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";

export const revalidate = 3600; // revalidate hourly

export async function GET() {
  const posts = await getAllPosts();
  const payload = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    summary: post.summary ?? "",
    tags: post.tags ?? [],
    date: post.date,
    cover: post.cover ?? null,
    readingTimeMinutes: post.readingTimeMinutes ?? null,
  }));

  return NextResponse.json({ posts: payload, generatedAt: new Date().toISOString() });
}
