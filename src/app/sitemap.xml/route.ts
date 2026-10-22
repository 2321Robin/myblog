import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";
import { getBaseUrl } from "@/lib/site";

export const revalidate = 3600;

export async function GET() {
  const base = getBaseUrl();
  const posts = await getAllPosts();
  // Listing pages have no content-update timestamp, so they omit lastmod entirely.
  const urls: Array<{ loc: string; lastmod?: string }> = [
    { loc: base },
    { loc: `${base}/blog` },
    { loc: `${base}/blog/tags` },
    ...posts.map((post) => ({ loc: `${base}/blog/${post.slug}`, lastmod: new Date(post.date).toISOString() })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((u) => (u.lastmod ? `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>` : `  <url><loc>${u.loc}</loc></url>`))
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
