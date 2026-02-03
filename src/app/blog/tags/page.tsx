import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

type TagCount = { tag: string; count: number };

export const metadata = {
  title: "标签一览",
  description: "按标签浏览所有文章。",
};

function buildTagCounts(posts: Awaited<ReturnType<typeof getAllPosts>>): TagCount[] {
  const counts = new Map<string, number>();
  posts.forEach((post) => {
    post.tags?.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1));
  });
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export default async function TagsPage() {
  const posts = await getAllPosts();
  const tagCounts = buildTagCounts(posts);

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-12">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Link href="/blog" className="rounded-full border border-border px-3 py-1 transition hover:border-brand hover:text-brand">
          ← 返回博客列表
        </Link>
        <span className="text-muted">/</span>
        <span className="text-foreground">标签</span>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Tags</p>
        <h1 className="text-3xl font-bold">标签一览</h1>
        <p className="text-muted-foreground">按标签快速跳转到对应文章列表。</p>
      </div>

      {tagCounts.length === 0 ? (
        <p className="text-muted-foreground">还没有标签。</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {tagCounts.map((item) => (
            <Link
              key={item.tag}
              href={`/blog?tag=${encodeURIComponent(item.tag)}`}
              className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 text-foreground transition hover:-translate-y-0.5 hover:border-brand"
            >
              <span className="font-medium">{item.tag}</span>
              <span className="text-sm text-muted-foreground">{item.count} 篇</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
