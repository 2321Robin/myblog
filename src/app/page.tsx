import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { getAllPosts } from "@/lib/posts";

type IconName = "home" | "github" | "projects" | "bilibili" | "csdn" | "mail";

function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  const common = `h-4 w-4 ${className}`;
  switch (name) {
    case "github":
      return (
        <svg aria-hidden viewBox="0 0 24 24" className={common}>
          <path
            fill="currentColor"
            d="M12 .5a11.5 11.5 0 0 0-3.64 22.4c.57.1.78-.25.78-.56v-2c-3.18.7-3.85-1.37-3.85-1.37-.52-1.3-1.26-1.64-1.26-1.64-1.03-.7.08-.69.08-.69 1.15.08 1.75 1.2 1.75 1.2 1.01 1.74 2.66 1.23 3.31.94.1-.75.4-1.24.72-1.53-2.54-.29-5.22-1.28-5.22-5.7 0-1.26.45-2.29 1.2-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.75.81 1.2 1.84 1.2 3.1 0 4.43-2.68 5.4-5.24 5.68.41.35.77 1.05.77 2.13v3.16c0 .31.2.67.78.56A11.5 11.5 0 0 0 12 .5Z"
          />
        </svg>
      );
    case "bilibili":
      return (
        <svg aria-hidden viewBox="0 0 24 24" className={common}>
          <rect x="3" y="7" width="18" height="11" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8 5.5 6 7.5m10-2 2 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M9 11v3m6-3v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "csdn":
      return (
        <svg aria-hidden viewBox="0 0 24 24" className={common}>
          <path
            fill="currentColor"
            d="M19.5 7.5c-1.7-1.7-3.8-2.5-6.3-2.5-4.3 0-7.8 3.3-7.8 7s3.5 7 7.8 7c2 0 3.7-.6 5.2-1.9.4-.4.4-1 0-1.4l-.6-.6c-.4-.4-1-.4-1.5 0-1 .8-2.1 1.2-3.3 1.2-2.8 0-5-2.1-5-4.7 0-2.6 2.3-4.7 5-4.7 1.5 0 2.6.5 3.7 1.5l.5.5c.4.4 1 .4 1.4 0l.7-.7c.4-.4.4-1.1-.1-1.6Z"
          />
        </svg>
      );
    case "home":
      return (
        <svg aria-hidden viewBox="0 0 24 24" className={common}>
          <path
            fill="currentColor"
            d="M11 3.2a2 2 0 0 1 2 0l6.5 3.8c.3.17.5.5.5.86V18a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-4.5a1.5 1.5 0 0 0-3 0V19a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2V7.86c0-.36.19-.69.5-.86Z"
          />
        </svg>
      );
    case "projects":
      return (
        <svg aria-hidden viewBox="0 0 24 24" className={common}>
          <rect x="4" y="4" width="6" height="6" rx="1.2" fill="currentColor" />
          <rect x="14" y="4" width="6" height="6" rx="1.2" fill="currentColor" />
          <rect x="4" y="14" width="6" height="6" rx="1.2" fill="currentColor" />
          <rect x="14" y="14" width="6" height="6" rx="1.2" fill="currentColor" />
        </svg>
      );
    case "mail":
      return (
        <svg aria-hidden viewBox="0 0 24 24" className={common}>
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            d="M4 6h16a1 1 0 0 1 1 1.1v9.8a1 1 0 0 1-1 1.1H4a1 1 0 0 1-1-1.1V7.1A1 1 0 0 1 4 6Z"
          />
          <path d="m4 7 8 5 8-5" stroke="currentColor" strokeWidth="1.6" fill="none" />
        </svg>
      );
  }
}

const externalLinks = [
  {
    title: "主域名 / 主页",
    href: "https://w2321.top",
    description: "个人域名的首页入口。",
    icon: "home" as const,
  },
  {
    title: "GitHub",
    href: "https://github.com/2321Robin",
    description: "项目代码与开源贡献。",
    icon: "github" as const,
  },
  {
    title: "个人项目集合",
    href: "https://projects.w2321.top",
    description: "小工具、实验性产品和 Demo。",
    icon: "projects" as const,
  },
  {
    title: "哔哩哔哩",
    href: "https://space.bilibili.com/2062699686",
    description: "视频与内容更新。",
    icon: "bilibili" as const,
  },
  {
    title: "CSDN 博客",
    href: "https://blog.csdn.net/Robin2321",
    description: "技术文章与随笔。",
    icon: "csdn" as const,
  },
];

export default async function Home() {
  const latestPosts = (await getAllPosts()).slice(0, 4);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-10 sm:px-10">
        <header className="flex items-center justify-between gap-6 py-4">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand to-brand-strong" aria-hidden />
            <span>Robin · Personal Site</span>
          </div>
          <div className="flex items-center gap-3">
            <nav className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
              <Link className="hover:text-foreground" href="/blog">
                博客
              </Link>
              <Link className="hover:text-foreground" href="/blog/tags">
                标签
              </Link>
              <a className="hover:text-foreground" href="#projects">
                作品
              </a>
              <a className="hover:text-foreground" href="#about">
                关于
              </a>
            </nav>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex flex-1 flex-col justify-center gap-12 py-8">
          <section className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
              Personal · Builder · Writer
            </p>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              关注 Web 体验、工程效率和产品落地。这里收录了我的文章、项目和常用链接，也可以通过下面的方式联系我。
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-strong"
              >
                浏览文章
              </Link>
              <a
                href="mailto:2932547376@qq.com"
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-brand hover:text-foreground"
              >
                <Icon name="mail" className="text-brand" /> 给我发邮件
              </a>
              <a
                href="https://github.com/2321Robin"
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-brand hover:text-foreground"
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="github" className="text-brand" /> GitHub
              </a>
              <a
                href="https://space.bilibili.com/2062699686"
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-brand hover:text-foreground"
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="bilibili" className="text-brand" /> 哔哩哔哩
              </a>
              <a
                href="https://blog.csdn.net/Robin2321"
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-brand hover:text-foreground"
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="csdn" className="text-brand" /> CSDN
              </a>
            </div>
          </section>

          <section
            id="blog"
            className="grid gap-4 rounded-2xl border border-border bg-surface p-6 shadow-sm backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted">近期更新</p>
                <h2 className="text-xl font-semibold">博客文章</h2>
              </div>
              <Link href="/blog" className="text-sm text-brand hover:underline">
                查看全部 →
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {latestPosts.length === 0 ? (
                <p className="text-sm text-muted-foreground">暂无文章，稍后再来看看。</p>
              ) : (
                latestPosts.map((post) => (
                  <article
                    key={post.slug}
                    className="rounded-xl border border-border bg-card p-4 shadow-[0_6px_20px_-12px_rgba(0,0,0,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-14px_rgba(0,0,0,0.35)]"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted">
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                      {post.readingTimeMinutes ? <span>· {post.readingTimeMinutes} 分钟</span> : null}
                    </div>
                    <h3 className="mt-2 text-lg font-semibold">
                      <Link href={`/blog/${post.slug}`} className="hover:text-brand">
                        {post.title}
                      </Link>
                    </h3>
                    {post.summary ? (
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.summary}</p>
                    ) : null}
                    {post.tags?.length ? (
                      <div className="mt-3 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.14em] text-muted">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-surface-muted px-2 py-0.5 text-brand"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </article>
                ))
              )}
            </div>
          </section>

          <section id="about" className="grid gap-4 rounded-2xl border border-border bg-surface p-6 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted">About</p>
                <h2 className="text-xl font-semibold">关于我</h2>
              </div>
              <a
                href="mailto:2932547376@qq.com"
                className="text-sm text-brand underline-offset-4 hover:underline"
              >
                2932547376@qq.com
              </a>
            </div>
            <div className="space-y-3 text-muted-foreground">
              <p>专注 Web 前端与产品体验，喜欢把想法做成可用的产品与工具。熟悉 Next.js/TypeScript/Tailwind，偶尔写写后端与自动化脚本。</p>
              <p>目前在维护个人博客与若干小工具，欢迎交流合作或反馈想法。</p>
            </div>
          </section>

          <section id="links" className="grid gap-4 rounded-2xl border border-border bg-surface p-6 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Links</p>
                <h2 className="text-xl font-semibold">其它网站与入口</h2>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {externalLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 transition hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
                >
                  <span className="flex items-center gap-2 text-base font-semibold text-foreground">
                    <Icon name={item.icon} className="text-brand" />
                    {item.title}
                  </span>
                  <span className="text-sm text-muted-foreground">{item.description}</span>
                  <span className="text-xs text-brand">访问 →</span>
                </a>
              ))}
            </div>
          </section>
        </main>

        <footer className="flex items-center justify-between border-t border-border py-6 text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} Robin · Personal Site.</span>
          <div className="flex items-center gap-3">
            <a className="hover:text-foreground" href="mailto:2932547376@qq.com">
              <span className="inline-flex items-center gap-1"><Icon name="mail" className="text-brand" /> 邮箱</span>
            </a>
            <a className="hover:text-foreground" href="https://github.com/2321Robin" target="_blank" rel="noreferrer">
              <span className="inline-flex items-center gap-1"><Icon name="github" className="text-brand" /> GitHub</span>
            </a>
            <a className="hover:text-foreground" href="https://space.bilibili.com/2062699686" target="_blank" rel="noreferrer">
              <span className="inline-flex items-center gap-1"><Icon name="bilibili" className="text-brand" /> 哔哩哔哩</span>
            </a>
            <a className="hover:text-foreground" href="https://blog.csdn.net/Robin2321" target="_blank" rel="noreferrer">
              <span className="inline-flex items-center gap-1"><Icon name="csdn" className="text-brand" /> CSDN</span>
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
