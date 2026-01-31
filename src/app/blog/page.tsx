import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const metadata = {
  title: "博客文章",
  description: "最新文章列表，基于 MDX frontmatter 生成。",
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-12">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Blog</p>
        <h1 className="text-3xl font-bold">最新文章</h1>
        <p className="text-muted-foreground">基于仓库内 MDX frontmatter 的列表。</p>
      </div>

      <div className="grid gap-4">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="rounded-2xl border border-border bg-surface p-5 shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted">
              <span>{new Date(post.date).toLocaleDateString()}</span>
              {post.tags?.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-surface-muted px-2 py-0.5 text-[11px] font-medium text-brand"
                >
                  {tag}
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
    </div>
  );
}