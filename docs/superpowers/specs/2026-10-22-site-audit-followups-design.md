# 站点审查剩余项设计：响应头、缓存、分享元数据、SEO 与手机布局

依据：[`docs/reviews/public-site-audit-2026-10-22.md`](../reviews/public-site-audit-2026-10-22.md) 的 D、E、G、H、I、J 六项。A、B、C 已在 [`2026-10-22-site-hardening-design.md`](2026-10-22-site-hardening-design.md) 落地并提交。

设计目标：能在仓库里做对的部分全部落到代码与自动检查；只有真正依赖线上 Nginx 的部分（HSTS 之外的代理层行为、图片文件缓存）留给服务器侧，并在文档里写清边界，不假装已生效。

## 一、浏览器安全响应头（D）

现状：`next.config.ts` 无 `headers()`，线上响应没有 `Strict-Transport-Security`、`X-Content-Type-Options`、`X-Frame-Options`、`Referrer-Policy`、`Permissions-Policy`、`Content-Security-Policy`，且对外输出 `X-Powered-By: Next.js`。

设计（全部写在 `next.config.ts` 的 `headers()`，对所有路由生效）：

| 头 | 值 | 说明 |
| --- | --- | --- |
| `Strict-Transport-Security` | `max-age=31536000` | **不带** `includeSubDomains` / `preload`：其它子站未逐一核验，不能全域启用 |
| `X-Content-Type-Options` | `nosniff` | 无副作用 |
| `X-Frame-Options` | `SAMEORIGIN` | 与 `frame-ancestors 'self'` 等价；本站无合法被嵌需求 |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | 站外只发 origin |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()` | 本站不使用这些能力 |
| `Content-Security-Policy-Report-Only` | 见下 | **只上报不拦截**，本轮不强制 |
| `X-Powered-By` | 关闭 | `poweredByHeader: false` |

CSP（Report-Only）取值，必须能兼容 Next.js 的内联 RSC 数据、`next-themes` 的主题初始化内联脚本与现有内联 `style`：

```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' data:;
font-src 'self';
connect-src 'self';
frame-ancestors 'self';
base-uri 'self';
form-action 'self';
object-src 'none'
```

- 不引入 nonce：App Router 的 RSC 载荷与 `next-themes` 内联脚本需要 `'unsafe-inline'`；改用 nonce 会把整站变成动态渲染，收益与代价不成比例。Report-Only 阶段的目的是先观察违规，而不是立刻收紧。
- 不加 `upgrade-insecure-requests`：站内无 http 资源，加了在本地 dev 反而会干扰。

`X-Powered-By` 的隐藏属低优先级整理，顺手做，不当成安全措施。

## 二、缓存策略（E）

现状实测（本地生产构建，2026-10-22）：

| 资源 | 当前 `Cache-Control` |
| --- | --- |
| `/_next/static/**` | `public, max-age=31536000, immutable`（Next 已正确设置） |
| `/`、`/blog/<slug>` | `s-maxage=31536000` |
| `/blog`（含 `_rsc` 请求） | `private, no-cache, no-store, max-age=0, must-revalidate` |
| `/sitemap.xml`、`/rss.xml`、`/robots.txt`、`/search-index` | `public, max-age=3600` |
| `/og.png` 等 `public/` 静态文件 | `public, max-age=0` |
| 不存在文章的 404 | `s-maxage=31536000` |

线上 `/_next/static/**` 只有 `max-age=60`，与本地构建结果不一致 → 说明线上被 Nginx 或面板统一规则覆盖，**仓库侧改不动**。

设计：

1. **仓库侧显式声明**（`next.config.ts` `headers()`），让本地构建与自托管行为可预期、可断言：
   - `/_next/static/:path*` → `public, max-age=31536000, immutable`（哈希文件名，长期缓存）。
   - `/:path*` → 不覆盖 Next 计算出的页面头（避免与 ISR / 动态渲染语义打架）。
2. **错误响应**：`/blog/<不存在>` 的 404 不能带一年期的共享缓存。Next 的 404 由 `not-found` 渲染，仓库内无法逐条改写状态码分支的头；改为在 `scripts/check-site.mjs` 里**断言** 404 的 `Cache-Control` 不含 `s-maxage=31536000`，一旦仓库侧能控制（升级后或加 `proxy.ts`）就立刻被检查捕获；当前线上由 Nginx 处理，写入 `docs/deployment.md` 待办。
3. **不做的**：不恢复全局代理缓存（历史上曾导致旧首页），不改 `public/` 图片文件名（可原路径覆盖，套 `immutable` 会永久缓存旧图），不引入 CDN。
4. `Vary`：RSC 请求的 `Vary` 由 Next 负责，脚本只断言 HTML 响应存在 `Vary`（若 Next 未输出则不加断言，改为记录）。

## 三、文章分享元数据（G）

现状：文章页只覆盖 `title` / `description`，`og:title`、`og:url`、`og:image`、`og:type`、`twitter:*` 全部继承根布局的首页值。

设计：`/blog/[slug]` 的 `generateMetadata` 输出完整文章级元数据：

```ts
{
  title, description: summary,
  alternates: { canonical: `/blog/${slug}` },
  openGraph: {
    type: "article",
    url: `/blog/${slug}`,
    title, description,
    siteName,
    publishedTime: date,
    images: cover ? [{ url: cover, width: 1448, height: 1086, alt: `${title} 封面` }] : [{ url: "/og.png", width: 1200, height: 630, ... }],
  },
  twitter: { card: "summary_large_image", title, description, images: [cover ?? "/og.png"] },
}
```

- 封面尺寸取自实际文件（`sharp metadata`：1448×1086）。
- 无封面的文章回落到 `/og.png`，不新增插画。
- 根布局的首页 `openGraph` 保持不动，只在其中补 `alternates.canonical: "/"`。
- 草稿不产出任何 metadata（已在 C 里 404）。

## 四、SEO 与站点地址（H）

1. **canonical**：
   - 根布局：`alternates.canonical: "/"`；`metadataBase` 已由 `SITE_URL` 提供。
   - 文章页：`/blog/<slug>`。
   - `/blog`：`/blog`；带 `page` 参数时：`page <= 1` 或非法 → `/blog`，有效分页 → `/blog?page=N`；带 `tag` 时保留 `tag`，且 `page` 只在 >1 时出现。
   - `/blog/tags`：`/blog/tags`。
2. **参数规范化**：`?page=999999` 现在返回 200 且内容与第一页相同。改为**越界页返回 404**（`page > totalPages` 且 `totalPages > 1`），`page <= 0`、`NaN`、`Infinity` 归一到第 1 页。理由：越界页是软 404 的主要来源；不改成 404 而只加 canonical，会让无限多的 URL 都渲染同一内容。
3. **sitemap**：补 `/blog`、`/blog/tags`；首页与列表类条目不写 `lastmod`（构建时间不是内容更新时间），文章条目保留 `post.date`。
4. **`SITE_URL` 校验**：`src/lib/site.ts` 在 `NODE_ENV === "production"` 时要求 `SITE_URL` 存在、为合法 URL 且协议为 `https:`，否则抛错让构建失败；开发/测试环境继续回退 `http://localhost:3000`。CI 的构建步骤显式传 `SITE_URL=https://example.test`。

## 五、自动检查（I）

在 `scripts/check-site.mjs` 增加：

- 响应头：`/`、`/blog`、`/blog/<slug>` 必须含 `x-content-type-options: nosniff`、`x-frame-options: SAMEORIGIN`、`referrer-policy: strict-origin-when-cross-origin`、`permissions-policy` 含 `camera=()`、`strict-transport-security: max-age=31536000`（不含 `includeSubDomains`）、`content-security-policy-report-only` 含 `default-src 'self'`；且**不含** `x-powered-by`。
- 缓存：`/_next/static/` 资源为 `public, max-age=31536000, immutable`；404 响应的 `Cache-Control` 不含 `s-maxage=31536000`。
- 分享元数据：每篇已发布文章页的 `og:title` / `og:url` / `og:type=article` / `twitter:title` 指向自身；`og:image` 存在且为绝对 URL。
- canonical：首页、`/blog`、`/blog/tags`、文章页各一条 `<link rel="canonical">` 且指向自身；`/blog?page=1` 与 `/blog?page=999999` 的行为按第四节断言（前者 200 且 canonical 为 `/blog`，后者 404）。
- sitemap：包含 `/blog`、`/blog/tags` 与两篇文章；首页条目无 `lastmod`。

新增 `tests/site-url.test.mjs`：直接 `import` `src/lib/site.ts`（纯 TS，可被 node:test 加载），断言：
- 生产环境缺 `SITE_URL` / 非 https / 非法 URL 时抛错；
- 生产环境合法值时返回去尾斜杠的地址；
- 非生产环境缺值时回退 localhost。

## 六、手机首页布局（J）

现状：361–700px 下带封面的首页文章仍是 `84px 96px minmax(0,1fr) auto` 四列 + 18px 列距。390px 视口内容宽 354px，固定列与间距先占 234px，正文列只剩约 100px 再减阅读时间列。

设计：把多行布局的断点从 360px 提前到 **430px**：

- `max-width: 430px`：`.recent-post` 与 `.recent-post:has(.recent-cover)` 改为两行/三行布局（`"time time" / "content content" / "reading reading"`，带封面时封面独占一行、`max-width: 200px`）。
- 431–700px 保持现有四列，但列距从 18px 收到 12px，封面列从 96px 收到 84px，避免 431–460px 区间过窄。
- 保留 360px 的既有覆盖（`.site-width`、导航等），不合并。

验证：用浏览器在 375 / 390 / 430 / 431 / 768 五个宽度截图，检查标题不出现单字换行、摘要与阅读时间可读、无横向溢出。这是本项唯一需要渲染证据的部分。

## 七、明确不做

- HSTS 的 `includeSubDomains` / `preload`：其它子站未核验。
- CSP 强制执行：先 Report-Only，观察期结束后另案。
- 线上 Nginx 的 `location` 级缓存与错误页缓存：需要服务器上下文，写入 `docs/deployment.md` 待办。
- 正文图片 `width/height` / `loading=lazy`（F）：属插图会话。
- 关闭 `/_next/image`：本站不使用 `next/image` 组件，但框架升级到 16.4.2 后该入口仍存在；是否关闭取决于后续是否引入图片优化，本轮不动。

## 八、验证口径

- `npm test`、`npm run type-check`、`npm run lint`、`npm run build`（`SITE_URL=https://example.test`）全绿。
- 生产服务启动后 `node scripts/check-site.mjs http://127.0.0.1:<port>` 全绿，覆盖响应头、缓存、分享元数据、canonical、sitemap。
- 浏览器在 375 / 390 / 430 / 431 / 768 五个宽度截图核对首页布局。
- 提交按 D / E / G / H / I / J 拆分成独立提交，不带 `git add -A`。
