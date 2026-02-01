import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";
import { getBaseUrl } from "@/lib/site";

export const revalidate = 3600;

export async function GET() {
  const base = getBaseUrl();
  const posts = await getAllPosts();
  const urls = [
    { loc: base, lastmod: new Date().toISOString() },
    ...posts.map((post) => ({ loc: `${base}/blog/${post.slug}`, lastmod: new Date(post.date).toISOString() })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`)
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
