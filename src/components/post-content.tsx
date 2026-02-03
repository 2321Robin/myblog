import Link from "next/link";
import type { ComponentType } from "react";
import { TableOfContents } from "./table-of-contents";
import { ShareBar } from "./share-bar";
import type { Heading, PostMeta } from "@/lib/posts";

export type Neighbor = PostMeta | null;

type Props = {
  Content: ComponentType;
  metadata: PostMeta;
  slug: string;
  prev: Neighbor;
  next: Neighbor;
  headings: Heading[];
};

export function PostContent({ Content, metadata, slug, prev, next, headings }: Props) {
  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-12">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Link href="/blog" className="rounded-full border border-border px-3 py-1 transition hover:border-brand hover:text-brand">
          ← 返回博客列表
        </Link>
        <span className="text-muted">/</span>
        <span className="text-foreground">{metadata.title}</span>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Article</p>
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl">{metadata.title}</h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>{new Date(metadata.date).toLocaleDateString()}</span>
          {metadata.readingTimeMinutes ? <span>· {metadata.readingTimeMinutes} 分钟阅读</span> : null}
          {metadata.tags?.map((tag) => (
            <span key={tag} className="rounded-full bg-surface-muted px-2 py-0.5 text-xs font-medium text-brand">
              {tag}
            </span>
          ))}
        </div>
        {metadata.summary ? <p className="text-muted-foreground">{metadata.summary}</p> : null}
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(220px,1fr)] lg:items-start">
        <article className="prose prose-zinc max-w-none dark:prose-invert" data-mdx>
          <Content />
        </article>

        <div className="lg:sticky lg:top-24">
          <TableOfContents headings={headings} />
        </div>
      </div>

      <ShareBar title={metadata.title} url={`/blog/${slug}`} />

      {(prev || next) && (
        <div className="grid gap-4 border-t border-border pt-6 md:grid-cols-2">
          {prev ? (
            <Link
              href={`/blog/${prev.slug}`}
              className="group block rounded-xl border border-border bg-surface p-4 transition hover:-translate-y-0.5 hover:border-brand"
            >
              <p className="text-xs uppercase tracking-[0.14em] text-muted">上一篇</p>
              <p className="mt-1 text-base font-semibold text-foreground group-hover:text-brand">{prev.title}</p>
            </Link>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">没有更早的文章</div>
          )}

          {next ? (
            <Link
              href={`/blog/${next.slug}`}
              className="group block rounded-xl border border-border bg-surface p-4 transition hover:-translate-y-0.5 hover:border-brand"
            >
              <p className="text-xs uppercase tracking-[0.14em] text-muted">下一篇</p>
              <p className="mt-1 text-base font-semibold text-foreground group-hover:text-brand">{next.title}</p>
            </Link>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">没有更晚的文章</div>
          )}
        </div>
      )}
    </div>
  );
}
