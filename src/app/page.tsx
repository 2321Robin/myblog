import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Mail, Rss } from "lucide-react";
import { SiteDirectory } from "@/components/site-directory";
import { getLinkHost, siteLinks } from "@/lib/site-links";
import { getAllPosts } from "@/lib/posts";
import { versionedImageUrl } from "@/lib/image-version";
import { formatDate } from "@/lib/utils";

export default async function Home() {
  const posts = await getAllPosts();
  const tags = Array.from(new Set(posts.flatMap((post) => post.tags ?? []))).sort();
  const tools = siteLinks.filter((link) => link.category === "tools");

  return (
    <main id="main-content" className="site-width home-main">
      <section className="home-intro" aria-labelledby="home-title">
        <div className="intro-copy">
          <p className="intro-greeting"><span className="greeting-line" />你好，我是 Robin</p>
          <h1 id="home-title">一些想法，<br />一些<span className="title-accent">正在做的事。</span></h1>
          <p className="intro-description">写作、构建，把想法落到可用的界面里。<br className="desktop-break" />这里收录了我的工具、项目和日常记录，欢迎随意逛逛。</p>
          <a href="#projects" className="intro-link">探索我的站点 <ArrowDown size={16} aria-hidden="true" /></a>
        </div>
        <div className="intro-index" aria-label="站点索引">
          <div className="index-top"><span className="index-favicon" aria-hidden="true">r.</span><span translate="no">w2321.top</span><span className="index-label">个人空间</span></div>
          <div className="index-body">
            <p>把好奇心，<br />变成可以打开的链接<span>↗</span></p>
            <div className="index-branches" aria-hidden="true">{tools.map((link) => <span key={link.id}>{getLinkHost(link.href).split(".")[0]}.</span>)}</div>
          </div>
          <div className="index-bottom"><span>Web · 工具 · 生活</span><span>保持好奇 <span aria-hidden="true">✳</span></span></div>
        </div>
      </section>

      <SiteDirectory links={siteLinks} />

      <section id="blog" className="home-writing" aria-labelledby="writing-title">
        <div className="section-heading">
          <div><p className="eyebrow">NOTES & THOUGHTS</p><h2 id="writing-title">最近写了什么</h2></div>
          <Link href="/blog" className="text-link">全部文章 <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
        <div className="writing-layout">
          <div className="recent-posts">
            {posts.length ? posts.slice(0, 4).map((post) => (
              <article key={post.slug} className="recent-post">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                {post.cover && <div className="recent-cover"><div className="recent-cover-image" role="img" aria-label={`${post.title} 封面图`} style={{ backgroundImage: `url(${versionedImageUrl(post.cover)})` }} /></div>}
                <div className="recent-body"><h3><Link href={`/blog/${post.slug}`}>{post.title}<ArrowUpRight size={18} aria-hidden="true" /></Link></h3>{post.summary && <p>{post.summary}</p>}</div>
                <span className="reading-time">{post.readingTimeMinutes ?? 1} 分钟阅读</span>
              </article>
            )) : <p className="empty-state">还没有文章，过段时间再来看看。</p>}
          </div>
          <aside className="writing-aside">
            <h3>从一个主题开始</h3>
            <div className="tag-list">{tags.map((tag) => <Link className="tag" key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>#{tag}</Link>)}</div>
            <div className="aside-links"><Link href="/blog/tags">全部标签 <ArrowUpRight size={14} aria-hidden="true" /></Link><a href="/rss.xml"><Rss size={14} aria-hidden="true" /> 订阅更新</a></div>
          </aside>
        </div>
      </section>

      <section id="about" className="about-section" aria-labelledby="about-title">
        <div><p className="eyebrow">A LITTLE ABOUT ME</p><h2 id="about-title">在屏幕这边</h2><a href="mailto:2932547376@qq.com" className="about-email"><Mail size={17} aria-hidden="true" />2932547376@qq.com<ArrowUpRight size={15} aria-hidden="true" /></a></div>
        <div className="about-copy"><p>专注 Web 前端与产品体验，喜欢把想法做成可用的产品与工具。熟悉 Next.js / TypeScript / Tailwind，偶尔写写后端与自动化脚本。</p><p>目前在维护个人博客与若干小工具，关注 Web 体验、工程效率和产品落地。欢迎交流合作，或把你的想法和反馈发给我。</p><div className="about-topics"><span>Web 开发</span><span>产品体验</span><span>自动化</span></div></div>
      </section>
    </main>
  );
}
