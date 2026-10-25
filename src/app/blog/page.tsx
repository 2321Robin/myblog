import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { getAllPosts } from "@/lib/posts";
import { versionedImageUrl } from "@/lib/image-version";
import { cn, formatDate } from "@/lib/utils";

type SearchParams = { page?: string | string[]; tag?: string | string[] };
type Props = { searchParams?: Promise<SearchParams> };
const PAGE_SIZE = 5;

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

// Out-of-range pages are soft 404s; invalid values collapse to the first page.
async function resolveListing(searchParams: SearchParams | undefined) {
  const parsedPage = Number(readParam(searchParams?.page));
  const requestedPage = Number.isFinite(parsedPage) ? Math.max(1, Math.floor(parsedPage)) : 1;
  const tag = readParam(searchParams?.tag)?.toLowerCase() || undefined;
  const posts = await getAllPosts();
  const filtered = tag ? posts.filter((post) => post.tags?.some((item) => item.toLowerCase() === tag)) : posts;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  return { posts, filtered, tag, totalPages, currentPage: Math.min(requestedPage, totalPages), requestedPage };
}

function listingPath(tag: string | undefined, page: number) {
  const query = new URLSearchParams();
  if (tag) query.set("tag", tag);
  if (page > 1) query.set("page", String(page));
  const search = query.toString();
  return search ? `/blog?${search}` : "/blog";
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { tag, currentPage } = await resolveListing(await searchParams);
  return {
    title: "博客文章",
    description: "关于 Web、产品与日常的构建记录和思考。",
    alternates: { canonical: listingPath(tag, currentPage) },
  };
}

export default async function BlogPage({ searchParams }: Props) {
  const { posts, filtered, tag, totalPages, currentPage, requestedPage } = await resolveListing(await searchParams);
  if (requestedPage > totalPages) notFound();
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const tags = Array.from(new Set(posts.flatMap((post) => post.tags ?? []))).sort();

  return (
    <main id="main-content" className="site-width content-main">
      <nav className="breadcrumb" aria-label="面包屑"><Link href="/"><ArrowLeft size={14} aria-hidden="true" />&nbsp; 返回主页</Link><span aria-hidden="true">/</span><span aria-current="page">文章</span></nav>
      <header className="page-heading">
        <p className="eyebrow">NOTES & THOUGHTS</p>
        <div className="archive-heading"><h1>写下来，慢慢想。</h1><span className="archive-count">{filtered.length} 篇{tag ? ` · #${tag}` : "文章"}</span></div>
        <p>关于 Web、产品与日常的构建记录和思考。</p>
      </header>
      <nav className="archive-filters" aria-label="标签筛选">
        <Link href="/blog" aria-current={!tag ? "page" : undefined} className={cn("tag", !tag && "tag-active")}>全部文章</Link>
        {tags.map((item) => <Link key={item} href={`/blog?tag=${encodeURIComponent(item)}`} aria-current={tag === item.toLowerCase() ? "page" : undefined} className={cn("tag", tag === item.toLowerCase() && "tag-active")}>#{item}</Link>)}
        <Link className="text-link" href="/blog/tags">标签一览 <ArrowUpRight size={14} aria-hidden="true" /></Link>
      </nav>
      <section aria-label="文章列表">
        {pageItems.length === 0 ? <div className="empty-state"><p>这个标签下还没有文章。</p><Link href="/blog" className="text-link">查看全部文章 <ArrowRight size={14} aria-hidden="true" /></Link></div> : pageItems.map((post) => (
          <article className="archive-post" key={post.slug}>
            <div className="archive-cover" aria-hidden="true">{post.cover ? <div className="archive-cover-image" style={{ backgroundImage: `url(${versionedImageUrl(post.cover)})` }} /> : <span>{post.title.slice(0, 2)}</span>}</div>
            <div className="min-w-0">
              <div className="post-meta"><time dateTime={post.date}>{formatDate(post.date)}</time><span>{post.readingTimeMinutes ?? 1} 分钟阅读</span></div>
              <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
              {post.summary && <p className="archive-summary">{post.summary}</p>}
              <div className="tag-list">{post.tags?.map((item) => <Link key={item} className="tag" href={`/blog?tag=${encodeURIComponent(item)}`}>#{item}</Link>)}</div>
            </div>
          </article>
        ))}
      </section>
      {totalPages > 1 && <nav className="archive-pagination" aria-label="分页"><span>第 {currentPage} / {totalPages} 页 · 共 {filtered.length} 篇</span><div>{currentPage > 1 && <Link className="button" href={`/blog?page=${currentPage - 1}${tag ? `&tag=${encodeURIComponent(tag)}` : ""}`}><ArrowLeft size={14} aria-hidden="true" />上一页</Link>}{currentPage < totalPages && <Link className="button" href={`/blog?page=${currentPage + 1}${tag ? `&tag=${encodeURIComponent(tag)}` : ""}`}>下一页<ArrowRight size={14} aria-hidden="true" /></Link>}</div></nav>}
    </main>
  );
}
