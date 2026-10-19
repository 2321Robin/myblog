import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { getAllPosts } from "@/lib/posts";
import { cn, formatDate } from "@/lib/utils";

type Props = { searchParams?: Promise<{ page?: string | string[]; tag?: string | string[] }> };
const PAGE_SIZE = 5;
export const metadata = { title: "博客文章", description: "关于 Web、产品与日常的构建记录和思考。" };

export default async function BlogPage({ searchParams }: Props) {
  const params = (await searchParams) || {};
  const parsedPage = Number(Array.isArray(params.page) ? params.page[0] : params.page);
  const page = Number.isFinite(parsedPage) ? Math.max(1, Math.floor(parsedPage)) : 1;
  const tag = (Array.isArray(params.tag) ? params.tag[0] : params.tag)?.toLowerCase();
  const posts = await getAllPosts();
  const filtered = tag ? posts.filter((post) => post.tags?.some((item) => item.toLowerCase() === tag)) : posts;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
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
            <div className="archive-cover" aria-hidden="true">{post.cover ? <div className="archive-cover-image" style={{ backgroundImage: `url(${post.cover})` }} /> : <span>{post.title.slice(0, 2)}</span>}</div>
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
