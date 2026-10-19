import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Fragment } from "react";
import type { ComponentProps } from "react";
import GithubSlugger from "github-slugger";
import { ShareBar } from "./share-bar";
import { TableOfContents } from "./table-of-contents";
import type { Heading, PostMeta, PostModule } from "@/lib/posts";
import { formatDate } from "@/lib/utils";

export type Neighbor = PostMeta | null;
type Props = { Content: PostModule["default"]; metadata: PostMeta; slug: string; prev: Neighbor; next: Neighbor; headings: Heading[] };

export function PostContent({ Content, metadata, slug, prev, next, headings }: Props) {
  const titleId = new GithubSlugger().slug(metadata.title);
  const titleParts = metadata.title.split("：");
  function BodyHeading({ children, ...props }: ComponentProps<"h1">) {
    return children === metadata.title && props.id === titleId ? null : <h2 {...props}>{children}</h2>;
  }

  return (
    <main id="main-content" className="site-width content-main">
      <nav className="breadcrumb" aria-label="面包屑"><Link href="/blog"><ArrowLeft size={14} aria-hidden="true" />&nbsp; 返回文章列表</Link><span aria-hidden="true">/</span><span aria-current="page">{metadata.title}</span></nav>
      <header className="post-heading">
        <p className="eyebrow">FROM ROBIN’S NOTEBOOK</p>
        <h1>
          {titleParts.map((part, index) => (
            <Fragment key={index}>
              {part}
              {index < titleParts.length - 1 && (
                <>
                  {"："}
                  <br className="title-break" aria-hidden="true" />
                </>
              )}
            </Fragment>
          ))}
        </h1>
        {metadata.summary && <p>{metadata.summary}</p>}
        <div className="post-meta"><time dateTime={metadata.date}>{formatDate(metadata.date)}</time><span>{metadata.readingTimeMinutes ?? 1} 分钟阅读</span></div>
        <div className="tag-list">{metadata.tags?.map((tag) => <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`} className="tag">#{tag}</Link>)}</div>
      </header>
      <div className="post-layout">
        <article className="article-prose" data-mdx><Content components={{ h1: BodyHeading }} /></article>
        {headings.length > 0 && <div className="post-sidebar"><TableOfContents headings={headings} /></div>}
      </div>
      <ShareBar key={slug} title={metadata.title} url={`/blog/${slug}`} />
      {(prev || next) && <nav className="neighbor-posts" aria-label="相邻文章">
        {prev ? <Link href={`/blog/${prev.slug}`}><p>← 较新文章</p><p>{prev.title}</p></Link> : <div className="neighbor-empty">已经是最新文章</div>}
        {next ? <Link href={`/blog/${next.slug}`}><p>较早文章 →</p><p>{next.title}</p></Link> : <div className="neighbor-empty">已经是最早文章</div>}
      </nav>}
      <Link href="/blog" className="text-link">查看全部文章 <ArrowRight size={14} aria-hidden="true" /></Link>
    </main>
  );
}
