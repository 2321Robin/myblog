# 站点审查剩余项实施计划

**Goal:** 按 [`2026-10-22-site-audit-followups-design.md`](../specs/2026-10-22-site-audit-followups-design.md) 落地 D（响应头）、E（缓存）、G（分享元数据）、H（canonical/sitemap/SITE_URL）、I（检查）、J（手机首页布局）。

**Architecture:** 安全响应头与静态缓存集中在 `next.config.ts` 的 `headers()`；页面级元数据在 `layout.tsx` / `blog/page.tsx` / `blog/tags/page.tsx` / `blog/[slug]/page.tsx` 的 `metadata` / `generateMetadata`；站点地址校验收口在 `src/lib/site.ts`；一切断言加进 `scripts/check-site.mjs` 与 `tests/`。

**Tech Stack:** Next.js 16.4.2 App Router、TypeScript、node:test、GitHub Actions。

## 约束

- 只动这些文件：`next.config.ts`、`src/lib/site.ts`、`src/app/layout.tsx`、`src/app/blog/page.tsx`、`src/app/blog/tags/page.tsx`、`src/app/blog/[slug]/page.tsx`、`src/app/sitemap.xml/route.ts`、`src/app/globals.css`、`scripts/check-site.mjs`、`.github/workflows/ci.yml`、`tests/site-url.test.mjs`（新增）、`docs/deployment.md`、`docs/backlog.md`、spec/plan。
- 不碰文章正文与图片（F 属插图会话）；不动 A/B/C 已提交的实现，除非新检查暴露缺陷。
- 不 `git add -A`；工作区里他人的未提交改动原样保留。
- 每个字母一项独立提交，提交前跑对应验证。

## 执行步骤

### D. 安全响应头

- [ ] `next.config.ts`：加 `poweredByHeader: false`；加 `headers()` 返回全站一组头：HSTS `max-age=31536000`、`X-Content-Type-Options: nosniff`、`X-Frame-Options: SAMEORIGIN`、`Referrer-Policy: strict-origin-when-cross-origin`、`Permissions-Policy`、`Content-Security-Policy-Report-Only`（取值按 spec 第四节）。
- [ ] 验证：生产构建启动后 `curl -I` 首页/列表/文章，确认头齐全、`x-powered-by` 消失；浏览器打开首页确认页面与主题切换仍正常（Report-Only 不拦截）。

### E. 缓存

- [ ] `next.config.ts`：为 `/_next/static/:path*` 显式声明 `public, max-age=31536000, immutable`。
- [ ] `scripts/check-site.mjs`：断言首页引用的 `/_next/static/` 资源为该缓存值；断言不存在文章的 404 不带 `s-maxage=31536000`。
- [ ] `docs/deployment.md`：记录线上 `/_next/static/` 实测为 `max-age=60`，需在 Nginx/面板定位并改为长期缓存；记录 404 缓存待服务器侧处理。

### G. 文章分享元数据

- [ ] `src/app/blog/[slug]/page.tsx`：`generateMetadata` 输出 `openGraph`（`type: article`、`url`、`title`、`description`、`publishedTime`、`images`）与 `twitter`（`card`、`title`、`description`、`images`）；有 `cover` 用封面（1448×1086），否则回落 `/og.png`。
- [ ] 验证：`curl` 文章页 HTML 抓 `og:*` / `twitter:*`，确认指向文章自身。

### H. canonical、分页规范化、sitemap、SITE_URL

- [ ] `src/lib/site.ts`：生产环境校验 `SITE_URL`（必填、合法 URL、`https:`），否则抛错；非生产回退 localhost。
- [ ] `src/app/layout.tsx`：`alternates.canonical: "/"`。
- [ ] `src/app/blog/page.tsx`：越界页（`page > totalPages` 且 `totalPages > 1`）`notFound()`；其余非法值归一到第 1 页；输出 canonical（`/blog`、`/blog?page=N`、`/blog?tag=X`）。
- [ ] `src/app/blog/tags/page.tsx`：`alternates.canonical: "/blog/tags"`。
- [ ] `src/app/blog/[slug]/page.tsx`：`alternates.canonical: "/blog/<slug>"`。
- [ ] `src/app/sitemap.xml/route.ts`：补 `/blog`、`/blog/tags`；首页与列表条目去掉 `lastmod`。
- [ ] `.github/workflows/ci.yml`：Build 步骤显式 `SITE_URL=https://example.test`。
- [ ] `scripts/check-site.mjs`：canonical 各页断言；`/blog?page=999999` 断言 404；sitemap 含 `/blog`、`/blog/tags` 且首页条目无 `lastmod`。
- [ ] `tests/site-url.test.mjs`：生产缺值/非 https/非法 URL 抛错，合法值去尾斜杠，非生产回退。

### I. 检查汇总

- [ ] `scripts/check-site.mjs`：响应头断言（D 的六项 + 无 `x-powered-by`）；分享元数据断言（每篇已发布文章 `og:title`/`og:url`/`og:type`/`twitter:title` 指向自身，`og:image` 为绝对 URL）。
- [ ] CI 冒烟保持 `next start` 后跑脚本，确认新增断言在 CI 环境同样成立。

### J. 手机首页布局

- [ ] `src/app/globals.css`：新增 `@media (max-width: 430px)` 覆盖 `.recent-post` 与 `.recent-post:has(.recent-cover)` 为多行布局；431–700px 区间列距 18→12px、封面列 96→84px。
- [ ] 验证：浏览器在 375 / 390 / 430 / 431 / 768 五个宽度截图，确认标题无单字换行、摘要与阅读时间可读、无横向溢出。

### 收尾

- [ ] `npm test`、`npm run type-check`、`npm run lint`、`SITE_URL=https://example.test npm run build` 全绿；生产服务上跑 `node scripts/check-site.mjs`。
- [ ] `docs/backlog.md` 记录留待服务器侧的项目（Nginx 缓存、错误页缓存、HSTS preload、CSP 强制执行）。
- [ ] 按 D / E / G / H / I / J 分项提交。
