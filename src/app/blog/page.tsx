import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

type Props = {
  searchParams?: Promise<{ page?: string; tag?: string }>;
};

const PAGE_SIZE = 5;

export const metadata = {
  title: "博客文章",
  description: "最新文章列表，基于 MDX frontmatter 生成。",
};

function uniqueTags(posts: { tags?: string[] }[]) {
  const set = new Set<string>();
  posts.forEach((p) => p.tags?.forEach((t) => set.add(t)));
  return Array.from(set).sort();
}

export default async function BlogPage({ searchParams }: Props) {
  const params = (await searchParams) || {};
  const page = Math.max(1, Number(params.page) || 1);
  const tag = params.tag?.toLowerCase();

  const posts = await getAllPosts();
  const filtered = tag
    ? posts.filter((p) => p.tags?.some((t) => t.toLowerCase() === tag))
    : posts;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);
  const tags = uniqueTags(posts);

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-12">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Blog</p>
        <h1 className="text-3xl font-bold">最新文章</h1>
        <p className="text-muted-foreground">基于仓库内 MDX frontmatter 的列表，支持按标签过滤。</p>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 text-sm">
          <Link
            href="/blog"
            className={`rounded-full border px-3 py-1 transition ${!tag ? "border-brand text-brand" : "border-border text-muted-foreground hover:border-brand hover:text-brand"}`}
          >
            全部
          </Link>
          {tags.map((t) => (
            <Link
              key={t}
              href={`/blog?tag=${encodeURIComponent(t)}`}
              className={`rounded-full border px-3 py-1 transition ${tag === t.toLowerCase() ? "border-brand text-brand" : "border-border text-muted-foreground hover:border-brand hover:text-brand"}`}
            >
              {t}
            </Link>
          ))}
        </div>
      )}

      <div className="grid gap-4">
        {pageItems.map((post) => (
          <article
            key={post.slug}
            className="rounded-2xl border border-border bg-surface p-5 shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted">
              <span>{new Date(post.date).toLocaleDateString()}</span>
              {post.tags?.map((tagItem) => (
                <span
                  key={tagItem}
                  className="rounded-full bg-surface-muted px-2 py-0.5 text-[11px] font-medium text-brand"
                >
                  {tagItem}
                </span>
              ))}
            </div>
            <h2 className="mt-2 text-xl font-semibold text-foreground">
              <Link href={`/blog/${post.slug}`} className="hover:text-brand">
                {post.title}
              </Link>
            </h2>
            {post.summary ? (
              <p className="mt-2 text-sm text-muted-foreground">{post.summary}</p>
            ) : null}
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            第 {currentPage} / {totalPages} 页（共 {filtered.length} 篇）
          </span>
          <div className="flex items-center gap-2">
            {currentPage > 1 && (
              <Link
                href={`/blog?page=${currentPage - 1}${tag ? `&tag=${encodeURIComponent(tag)}` : ""}`}
                className="rounded-full border border-border px-3 py-1 hover:border-brand hover:text-brand"
              >
                上一页
              </Link>
            )}
            {currentPage < totalPages && (
              <Link
                href={`/blog?page=${currentPage + 1}${tag ? `&tag=${encodeURIComponent(tag)}` : ""}`}
                className="rounded-full border border-border px-3 py-1 hover:border-brand hover:text-brand"
              >
                下一页
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}