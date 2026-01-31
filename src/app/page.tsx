export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-10 sm:px-10">
        <header className="flex items-center justify-between gap-6 py-4">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600" aria-hidden />
            <span>MyBlog</span>
          </div>
          <nav className="flex items-center gap-4 text-sm font-medium text-zinc-600 dark:text-zinc-300">
            <a className="hover:text-zinc-900 dark:hover:text-white" href="#blog">
              博客
            </a>
            <a className="hover:text-zinc-900 dark:hover:text-white" href="#projects">
              作品
            </a>
            <a className="hover:text-zinc-900 dark:hover:text-white" href="#about">
              关于
            </a>
          </nav>
        </header>

        <main className="flex flex-1 flex-col justify-center gap-12 py-8">
          <section className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
              Personal Blog
            </p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              记录构建与思考，专注 Web、前端与产品体验。
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
              下一步将接入 MDX、分类/标签与搜索，逐步上线评论与订阅。本站由 Next.js + TypeScript + Tailwind 驱动。
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#blog"
                className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                查看文章
              </a>
              <a
                href="#about"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-600"
              >
                关于本站
              </a>
            </div>
          </section>

          <section
            id="blog"
            className="grid gap-4 rounded-2xl border border-zinc-200 bg-white/70 p-6 shadow-sm backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/60"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">近期更新</p>
                <h2 className="text-xl font-semibold">博客文章</h2>
              </div>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">占位数据，稍后接入 MDX</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <article
                  key={item}
                  className="rounded-xl border border-zinc-100 bg-white p-4 shadow-[0_6px_20px_-12px_rgba(0,0,0,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-14px_rgba(0,0,0,0.35)] dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-sky-500">标签</p>
                  <h3 className="mt-2 text-lg font-semibold">文章标题占位 {item}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-300">
                    简短摘要说明，后续将从 MDX frontmatter 读取。
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section id="about" className="grid gap-4 rounded-2xl border border-zinc-200 bg-white/70 p-6 shadow-sm backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/60">
            <h2 className="text-xl font-semibold">关于</h2>
            <p className="max-w-3xl text-zinc-600 dark:text-zinc-300">
              这里将介绍作者、技术栈与站点规划。接下来会补充作品集与联系方式入口。
            </p>
          </section>
        </main>

        <footer className="flex items-center justify-between border-t border-zinc-200 py-6 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          <span>© {new Date().getFullYear()} MyBlog. Built with Next.js.</span>
          <div className="flex items-center gap-3">
            <a className="hover:text-zinc-800 dark:hover:text-white" href="#">
              GitHub
            </a>
            <a className="hover:text-zinc-800 dark:hover:text-white" href="#">
              Twitter
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
