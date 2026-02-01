import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";
import { getBaseUrl, siteMetadata } from "@/lib/site";

export const revalidate = 3600;

export async function GET() {
  const base = getBaseUrl();
  const posts = await getAllPosts();

  const items = posts
    .map((post) => {
      const url = `${base}/blog/${post.slug}`;
      return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.summary ?? ""}]]></description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title><![CDATA[${siteMetadata.title}]]></title>
    <link>${base}</link>
    <description><![CDATA[${siteMetadata.description}]]></description>
    <language>zh-CN</language>
${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
