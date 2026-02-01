import { NextResponse } from "next/server";
import { getBaseUrl } from "@/lib/site";

export const revalidate = 3600;

export async function GET() {
  const base = getBaseUrl();
  const body = `User-agent: *
Allow: /
Sitemap: ${base}/sitemap.xml`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
