import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAllPosts } from "@/lib/posts";

export const metadata = {
  title: "标签一览",
  description: "从感兴趣的主题开始阅读 Robin 的文章。",
  alternates: { canonical: "/blog/tags" },
};

export default async function TagsPage() {
  const posts = await getAllPosts();
  const counts = new Map<string, number>();
  posts.forEach((post) => post.tags?.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1)));
  const tags = Array.from(counts, ([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));

  return (
    <main id="main-content" className="site-width content-main">
      <nav className="breadcrumb" aria-label="面包屑"><Link href="/blog"><ArrowLeft size={14} aria-hidden="true" />&nbsp; 返回文章列表</Link><span aria-hidden="true">/</span><span aria-current="page">标签</span></nav>
      <header className="page-heading"><p className="eyebrow">BROWSE BY TOPIC</p><h1>从好奇的主题开始。</h1><p>不必按时间顺序，选一个感兴趣的标签，看看我写过什么。</p></header>
      {tags.length ? <div className="tag-index">{tags.map(({ tag, count }) => <Link href={`/blog?tag=${encodeURIComponent(tag)}`} key={tag}><span>#{tag}</span><span className="tag-count">{count} 篇 →</span></Link>)}</div> : <p className="empty-state">还没有标签，可以先去看看<Link className="text-link" href="/blog">全部文章</Link>。</p>}
    </main>
  );
}
