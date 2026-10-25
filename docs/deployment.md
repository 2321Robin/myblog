# 个人主页服务器部署记录

日期：2026-10-18。当前状态：新版本已部署至 `https://w2321.top`，正式服务与公网检查通过。

## 2026-10-25 第四篇文章发布（《Harness 横评》）

- 发布目录：`/www/wwwroot/w2321.top-releases/20261025T155106Z`（`20-release.conf` 已指向此目录，服务 active）。上一版本目录 `20261025T083331Z` 保留回退；切换前旧配置备份在 `/var/backups/personal-homepage/20261025T155106Z/previous-release.conf`。
- 源码包：`/root/myblog-deploy/myblog-20261025T155106Z.tar.gz`，SHA-256 `8ccc1e5cc3d2c5fbea9c25030c608a482c6d04836e1425fa744460dc0ed638d5`，本机与服务器一致；由 `git archive HEAD` 导出（提交 `c56497b`）。
- 内容变化：`harness-comparison` 正式发布（发布日期 2026-10-25，去掉 `published: false`）：封面 1 + 二次元风信息图 8 + 终端实机截图 3 + 官网截图 8，共 20 张 WebP（正文图合计约 2 MB）；阅读时长 23 分钟（6830 汉字 + 1051 拉丁词，按 10-24 修正后的统一算法）；CodeBuddy 截图按作者决定取消。本发布同时带上上一发布之后的仓库侧改动：站点美化第一步动效层（`c4fdd1b`）与 postcss/tailwind 构建链升级（`493e5b4`）。
- `scripts/check-site.mjs` 同步维护：路由、安全头、标题锚点、占位符、搜索索引、canonical、sitemap、分享卡、图片属性断言全部纳入 `harness-comparison`；草稿清单缩减为 `model-landscape-2026` 一篇。
- 依赖：`package.json` / `package-lock.json` 与上一发布目录不一致（构建链升级所致），新目录独立 `npm ci`（`.npm-cache` 留在发布目录内）。
- 服务器流程：以 `www` 用户 `SITE_URL=https://w2321.top` 生产构建；`npm test` 16 项、type-check、lint 通过；3011 预览与 `127.0.0.1:3010` 的 `check-site` 全部通过；公网 `check-site https://w2321.top` 全部通过。
- 插曲：3011 端口被上一发布（`083331Z`）验收时遗留的预览进程（PID 940723，cwd 在旧发布目录）占用，导致本轮首次预览绑定失败、旧构建对新文章返回 404；确认属遗留预览后已终止，生产服务（3010 systemd）未受影响。本轮验收后 3011 已按 runbook 停止。
- 公网确认：`/blog/harness-comparison` 200，`dateTime` 2026-10-25、正文「23 分钟阅读」、`og:image` 指向带 `?v=` 哈希的 `cover.webp`；页面共 21 处 `/images/posts/harness-comparison` 引用（20 张正文图 + 分享卡封面）；`/blog` 列表最新一篇为本文；`model-landscape-2026` 仍为草稿 404。
- 已知未处理（汇报不修）：HEAD 中 `model-landscape-2026` 草稿第 191 行一处加粗未渲染（`check-article` 报 1 处，草稿不上线，留待该篇自己的会话处理）；面板对非静态扩展名叠加双 `Cache-Control` 的旧待办不变。

## 2026-10-25 服务器侧待办集中处置与发布

- 背景：`docs/backlog.md` 记录的 8 项服务器侧待办一次处理完毕。仓库侧四个提交：图片内容哈希版本化（be7585c）、关闭图片优化入口（0582762）、HSTS 覆盖子域 + CSP 转强制（d62d18f）、断言兼容代理叠加头（821aec1）。
- 发布目录：`/www/wwwroot/w2321.top-releases/20261025T083331Z`（`20-release.conf` 已指向此目录，服务 active/enabled）。上一版本目录 `20261024T151351Z` 保留回退；切换前旧配置备份在 `/var/backups/personal-homepage/20261025T083331Z/previous-release.conf`。
- 源码包：`/root/myblog-deploy/myblog-20261025T083331Z.tar.gz`，SHA-256 `45d1511ec1f1409ec4085678ad87094c39328862b3e3483bd8a0ef6c633b1949`，本机与服务器一致；由 `git archive HEAD` 全量导出。`package.json` / `package-lock.json` 与上一发布目录逐字节一致，复用其 `node_modules`。
- 服务器流程：以 `www` 用户 `SITE_URL=https://w2321.top` 构建，`npm test` 16 项、type-check、lint 通过；3011 预览与 `127.0.0.1:3010` 的 `check-site` 全部通过；临时预览已停止（预览日志写在发布目录内，`www` 用户不可写 `/tmp` 下 root 属主的旧日志）。
- 本轮变化：
  - 正文与封面图片 URL 构建期追加内容哈希 `?v=<sha1 前 8 位>`（rehype 插件 + `src/lib/image-version.ts`），`/images/**` 生产环境输出 `public, max-age=31536000, immutable`；og:image / twitter:image / 首页与列表封面背景 / 搜索索引同步带版本参数，图片仍可原路径覆盖更新。
  - `images.unoptimized: true`，页脚备案图标改原生 `<img>`，`/_next/image` 优化入口不再被任何页面引用。
  - HSTS 加 `includeSubDomains`：score / resume / minesweeper / covenant / count 五个子站 HTTPS 200、证书校验通过、http 均跳 https；knowquest.w2321.top 仍解析到本机（60.204.199.250）且 HTTPS 200（http 308 跳转）；projects.w2321.top 公网无解析。preload 明确不做。
  - CSP 由 Report-Only 转强制，追加 `report-uri /api/csp-report`；接收端把最小字段以单行 JSON 打到 stdout，经 journald 落盘（`journalctl -u personal-homepage` 查询，已实测收到公网探针报告）。补充（2507eac）：开发环境例外——React dev 需要 `eval()`，dev 下改发 Report-Only 并放宽 `unsafe-eval`，否则 `npm run dev` 会弹 eval 拦截浮层；生产行为不变，未重新发布。
- Nginx 修改（`/www/server/panel/vhost/nginx/proxy/w2321.top/efc4fea69d55a7f7d6ce144e04c7b151_w2321.top.conf`）：在 `location ^~ /` 之前新增 `location ^~ /_next/static/` 与 `location ^~ /images/` 两个透传 location（复制原有 proxy 头与 `proxy_cache off`，不带 `expires`、不叠加 `add_header`），绕开面板 `\.(gif|png|jpg|css|js|woff|woff2)$` 的 `expires 1m` 与非静态扩展名的 `add_header Cache-Control no-cache`。修改前备份：`/var/backups/personal-homepage/20261025T083331Z/proxy-before-static-cache-fix.conf`。`nginx -t` 通过后平滑重载。**面板重新生成代理配置时需保留这两个 location（连同既有 `proxy_cache off`）。**
- 公网验收：`node scripts/check-site.mjs https://w2321.top` 全部通过，`/_next/static/**` 年缓存断言对公网首次通过。抽查：静态资源与内容图片均为单条 `Cache-Control: public, max-age=31536000, immutable`；404 为单条 `private, no-cache, no-store, max-age=0, must-revalidate`；HSTS / 强制 CSP 响应头正确。
- 依赖公告（官方 registry）：`npm audit --omit=dev` 0 漏洞；全量 7 条（2 moderate、5 high）全在开发链（@humanfs/node、ajv、brace-expansion、flatted 及 ESLint 链），与 2026-10-23 记录的 12 条相比为公告库更新所致。未运行 `npm audit fix`，保持锁文件不变以复用依赖。
- 已知未处理（汇报不修）：面板对非静态扩展名统一 `add_header Cache-Control no-cache`，会给应用已带缓存头的首页 HTML 与 `/api/csp-report`、RSS、sitemap 等叠加出双 `Cache-Control`，功能无损（no-cache 只强制再验证）；已记入 backlog 待安排。

## 2026-10-24 第三篇文章发布（《上手第一个 Agent》）

- 发布目录：`/www/wwwroot/w2321.top-releases/20261024T054707Z`（systemd `20-release.conf` 已指向此目录，服务 active/enabled）。上一版本目录 `20261021T062945Z` 保留用于回退；切换前的旧配置备份在 `/var/backups/personal-homepage/20261024T054707Z/previous-release.conf`。
- 源码包：`/root/myblog-deploy/myblog-20261024T054707Z.tar.gz`，SHA-256 `2f1374bc4d4ebfee541b8df7a8041ad373767ffe42f4fc49152232563810c66d`，本机与服务器核对一致。由 `git archive HEAD` 全量导出，草稿靠 `metadata.published` 隔离，不再手工剔除文件。
- 依赖：`package.json` / `package-lock.json` 与上一发布目录一致（均为 16.4.2 构建链），但服务器旧目录内文件为 CRLF 且哈希不同，无法据此判定可复用，故本次在新目录独立 `npm ci`（521 个包，`.npm-cache` 留在发布目录内）。
- 内容变化：`agent-getting-started` 去掉 `published: false` 正式发布，含 6 张正文截图（WebP，共 244 KB），无独立封面，分享图沿用 `/og.png`；`harness-comparison`、`model-landscape-2026` 仍为草稿，公网 404。
- `scripts/check-site.mjs` 同步维护：路由清单、安全头与图片断言、canonical、sitemap、搜索索引、分享信息、正文图属性全部纳入新文章，草稿清单缩减为两篇；新增两条正文断言（标题锚点 `第-1-步下载安装包` 存在、已删除的“直接同意”旧建议不再出现）。
- 服务器流程按 runbook 执行：以 `www` 用户 `SITE_URL=https://w2321.top` 生产构建；`npm test`（10 项）、`npm run type-check`、`npm run lint`、`check-article` 通过；3011 预览通过 `check-site` 全部路由；切换 `20-release.conf` 重启后 `127.0.0.1:3010` 全项通过。
- 公网确认：`/blog/agent-getting-started` 200，标题、canonical、`og:url`、6 张 `image/webp` 均正确；首页、`/blog`、`/blog/tags`、`/blog?tag=beginner`、RSS、sitemap、`/search-index` 均已收录，最新一篇排在首位；两篇草稿公网 404；安全头（HSTS / nosniff / SAMEORIGIN / Referrer-Policy / Permissions-Policy）齐全且无 `X-Powered-By`。
- 已知未解决：公网 `/_next/static/**` 仍为 `Cache-Control: max-age=60`，`check-site.mjs` 该条断言对公网不通过，根因是面板代理配置里 `\.(gif|png|jpg|css|js|woff|woff2)$` 的 `expires 1m` 覆盖了应用头，属 `docs/backlog.md` 记录的服务器侧待办，本轮未改 Nginx。
- 临时 3011 预览已停止；`personal-homepage.service` 为 active/enabled。
- 同日追加（封面，已部署）：`agent-getting-started` 补独立 4:3 封面 `public/images/posts/agent-getting-started/cover.webp`（1448×1086，31 KB，PNG 经 `compress-images.mjs` 转 WebP）并写入 `metadata.cover`；首页列表缩略图、文章 `og:image` / `twitter:image` 改指封面，`check-site.mjs` 的分享信息断言把该篇纳入。

### 封面发布（2026-10-24 11:33 UTC）

- 发布目录：`/www/wwwroot/w2321.top-releases/20261024T113352Z`（`20-release.conf` 已指向此目录，服务 active）。上一版本目录 `20261024T054707Z` 保留回退；切换前旧配置备份在 `/var/backups/personal-homepage/20261024T113352Z/previous-release.conf`。
- 源码包：`/root/myblog-deploy/myblog-20261024T113352Z.tar.gz`，SHA-256 `82670112076bf51bf8f3df9dda4afffc3ad4bc77e8f31bf04d7784621cb1537b`，本机与服务器一致；由 `git archive HEAD` 导出（提交 `96908ba`）。
- 依赖：`package.json` / `package-lock.json` 按 LF 归一后的哈希与上一发布目录一致，复用其 `node_modules`，未重跑 `npm ci`。
- 服务器流程：以 `www` 用户 `SITE_URL=https://w2321.top` 构建；`npm test`（10 项）、`npm run type-check`、`npm run lint` 通过；3011 预览与 `127.0.0.1:3010` 的 `check-site` 全部通过；公网检查除 `/_next/static/**` 缓存一条（已知 Nginx 覆盖，见 `docs/backlog.md`）外全部通过。
- 公网确认：`/images/posts/agent-getting-started/cover.webp` 200 `image/webp`（31714 字节）；文章页 `og:image`、`og:image:width/height`（1448×1086）、`twitter:image` 均指向封面；首页在 identity 与 gzip 两种变体下都输出该封面缩略图。
- `node scripts/check-article.mjs` 在服务器上报 9 处加粗未渲染，全部落在两篇仍为草稿的文章（`harness-comparison` 8 处、`model-landscape-2026` 1 处）；本地结果一致，与本轮封面改动无关，未在本轮修改，留待各篇自己的会话处理。
- 临时 3011 预览已停止；`personal-homepage.service` 为 active/enabled。

### 阅读时长修正发布（2026-10-24 15:13 UTC）

- 问题：`computeReadingTimeMinutes` 只剔除代码块与 `<img>`，把图片 alt 文字（每篇约 300 字）、链接地址、frontmatter 也计入正文，全站阅读时长系统性偏高 1–3 分钟。
- 修正：新增 `stripNonProse`，剔除 frontmatter、围栏与行内代码、图片（含 alt）、链接地址（保留链接文字）、MDX 注释与 HTML 标签后再统计；`computeReadingTimeMinutes` 改为导出以便测试，新增 `tests/reading-time.test.mjs` 6 项。
- 影响：`agent-getting-started` 16→14、`agent-usage-ecosystem` 17→15、`ai-model-agent-harness` 15→13、`harness-comparison` 20→19、`model-landscape-2026` 24→21（分钟）。
- 发布目录：`/www/wwwroot/w2321.top-releases/20261024T151351Z`（`20-release.conf` 已指向此目录，服务 active）。上一版本目录 `20261024T113352Z` 保留回退；旧配置备份在 `/var/backups/personal-homepage/20261024T151351Z/previous-release.conf`。
- 源码包：`/root/myblog-deploy/myblog-20261024T151351Z.tar.gz`，SHA-256 `be7ae426c6e89fde51dd4221e08dd4a961029036b10c50bbbf4c46d4ce0be7ac`，本机与服务器一致（提交 `9e31ec6`）；依赖未变，复用上一发布目录的 `node_modules`。
- 验证：服务器 `npm test` 16 项、`type-check`、`lint` 通过；3011 预览与 `127.0.0.1:3010` 的 `check-site` 全部通过；公网检查除 `/_next/static/**` 缓存一条（已知 Nginx 覆盖）外全部通过；公网文章页显示 14 分钟，首页三篇为 14 / 15 / 13。
- 临时 3011 预览已停止；`personal-homepage.service` 为 active/enabled。

## 2026-10-22 依赖升级与草稿发布隔离（代码侧，未部署）

- 依赖：`next` / `@next/mdx` / `eslint-config-next` 由 16.1.6 升级到 16.4.2，React 保持 19.2.3。npm 的 `latest` 标签在 2026-10-22 指向 16.4.2；未使用 `npm audit fix --force`。
- 本地保存接口：`npm run dev` 绑定 `127.0.0.1`；`POST /api/dev/save-post` 增加每次 dev 启动生成的访问令牌（页面 `<meta name="dev-save-token">` 注入）、Host/Origin 同源校验、`application/json` 与 512 KB 请求体上限。2026-10-23 复审后把上限改为**流式累计**：边读边计数，超限即断开，不再整份读完再判断。生产环境仍直接 404。
- 草稿隔离：文章 metadata 新增 `published` 字段，`published: false` 不进入列表、静态参数、RSS、sitemap、搜索索引，直接访问 404。当前 `agent-getting-started`、`harness-comparison`、`model-landscape-2026` 三篇标记为草稿。**发布打包不再需要手工剔除草稿文件**，`git archive` 全量导出即可。
- 检查脚本 `scripts/check-site.mjs` 新增草稿 404、索引隔离与生产保存接口 404 断言；CI 在构建后启动生产服务跑同一脚本。
- 响应头与缓存：`next.config.ts` 增加 HSTS（`max-age=31536000`，不含 `includeSubDomains`）、`nosniff`、`SAMEORIGIN`、`strict-origin-when-cross-origin`、`Permissions-Policy`、CSP Report-Only，并关闭 `X-Powered-By`；`/_next/static/**` 显式声明 `public, max-age=31536000, immutable`。**线上实测 `/_next/static/**` 仍为 `max-age=60`，说明 Nginx 或面板规则覆盖了仓库设置，部署时需一并核对。**
- 文章 404：`/blog/[slug]` 设 `dynamicParams = false`，未在 `generateStaticParams` 中的 slug 直接 404，不再产生带 `s-maxage=31536000` 的缓存 404。
- SEO：首页、`/blog`、`/blog/tags`、每篇文章补 canonical；`/blog?page=` 越界返回 404、非法值归一到第 1 页；sitemap 补 `/blog` 与 `/blog/tags`，列表条目不再写 `lastmod`。
- 分享信息：每篇文章输出自身的 `og:title`/`og:url`/`og:type=article`/`og:image`（有封面用封面）与 `twitter:*`。
- 站点地址：生产构建缺 `SITE_URL`、非 `https` 或非法 URL 时直接失败；CI 构建显式传 `SITE_URL=https://example.test`。
- 手机首页：带封面的首页文章在 ≤1040px 时封面独占一行，≤430px 时整行堆叠，标题不再被挤成几个字一行。
- 2026-10-23 复审补充：`postcss` 升到 8.5.31、`@tailwindcss/postcss` 升到 4.3.3，锁文件里的 `source-map-js` 从 1.2.1 升到 1.2.2，官方 registry 上 `npm audit --omit=dev` 归零；剩余 12 条公告全在 ESLint / tinyglobby 开发链，不进生产产物。
- 2026-10-23 复审补充：正文图片改由构建期 rehype 插件（`scripts/mdx-image-attributes.mjs`）注入 `width`/`height`/`loading="lazy"`/`decoding="async"`，覆盖 Markdown 图片与正文内联 `<img>`（吉祥物）；文章页不再产生任何图片 preload。图片仍走原路径、可覆盖，缓存策略未变。
- 2026-10-23 复审补充：`/_next/static/:path*` 的 Cache-Control 覆盖改为仅生产启用，避免 Next 16 对开发态覆盖的告警；`scripts/check-site.mjs` 的生产保存探测改用不存在的 slug 与空内容，回归时也不会误伤真实文章。
- 本轮只改了代码与文档，未部署到服务器，未修改线上 Nginx。

## 2026-10-20 首篇正式文章发布（《AI、模型、Agent、Harness》）

- 发布目录：`/www/wwwroot/w2321.top-releases/20261019T165921Z`（systemd `20-release.conf` 已指向此目录，服务 active/enabled）。
- 上一版本目录：`/www/wwwroot/w2321.top-releases/20261018T111207Z`，保留用于回退；回退方式为把 `20-release.conf` 中的时间戳改回 `20261018T111207Z` 后 `daemon-reload` 并重启服务。
- 源码包：`/root/myblog-deploy/myblog-20261019T165921Z.tar.gz`，SHA-256 `5911de36d6c13a1fe0a36dbffdd0dd2b98dd74496c6950aa7bcba54faac5d408`，本机与服务器核对一致。
- 内容变化：发布《AI、模型、Agent、Harness：四个词到底什么关系？》；`hello-world.mdx`、`next-roadmap.mdx` 下线（对应路由 404）；全部配图转为 WebP（21.5MB→1.3MB）；博客新增 dev-only 本地编辑器与【】标注工作流（均不进入生产构建）。
- 服务器流程按 runbook 执行：解压后以 `www` 用户 `npm ci`（发布目录独立缓存）、`SITE_URL=https://w2321.top` 生产构建、ESLint / 类型检查 / 6 项测试通过；3011 预览通过 `check-site` 全部路由；切换 `20-release.conf` 重启后，服务器 `127.0.0.1:3010` 与本机公网 `https://w2321.top` 双向通过全部检查（含 gzip/identity 缓存变体）。
- 专项确认：新文章 `/blog/ai-model-agent-harness` 公网可访问且 RSS 已收录；`/blog/hello-world`、`/blog/next-roadmap` 公网返回 404；WebP 图片（`image/webp`）公网正常。
- 注意：`scripts/check-site.mjs` 的路由清单已随文章上下线更新，后续发布新增/下线文章时同样需要维护该清单。
- 同日追加（17:33 UTC）：发布文章专用封面图（`cover.webp`，67KB），`metadata.cover` 由概念图改为专用封面。发布目录 `20261019T173036Z`，源码包 SHA-256 `eb9e688f62c34154752b4ab07c0ae7d193886f98f84bc3631e9662dc0315c6cc`；lock 未变故复用上一发布目录的 `node_modules` 后重新构建，3011 预览与公网检查通过。上一发布目录 `20261019T165921Z` 保留回退。
- 同日追加（00:40 UTC+8 次日）：概念篇全文直引号改为全角弯引号（86 处）并清理残留半角标点。发布目录 `20261020T004055Z`，源码包 SHA-256 `54acf5af00432dcc005525c73799b2bb8f4bd3487afbb1a55c3136f0e8de2530`，复用 `node_modules` 重新构建，3011 预览与公网检查通过。**本次打包显式排除了 `docs/research` 之外仍在评审中的四篇草稿**（agent-getting-started / agent-usage-ecosystem / harness-comparison / model-landscape-2026），其路由公网 404；草稿文件已随引号修复提交进入 main 仓库（未上线），发布前需从工作区或按本包的 exclude 方式排除。上一发布目录 `20261019T173036Z` 保留回退。

## 2026-10-21 第二篇文章发布（《给 Agent 配装备》）

- 发布目录：`/www/wwwroot/w2321.top-releases/20261021T054949Z`（systemd `20-release.conf` 已指向此目录，服务 active/enabled）。
- 上一版本目录：`/www/wwwroot/w2321.top-releases/20261020T004055Z`，保留用于回退；回退方式为把 `20-release.conf` 中的 `WorkingDirectory` 与 `ExecStart` 路径改回该时间戳后 `daemon-reload` 并重启服务。本次切换前的旧配置备份在 `/var/backups/personal-homepage/20261021T054949Z/previous-release.conf`。
- 源码包：`/root/myblog-deploy/myblog-20261021T054949Z.tar.gz`，SHA-256 `b71e1a60a187690de3a106b86c07e3d835210a7544535b8368482e992c3d1ab9`，本机与服务器核对一致。由 `git archive HEAD` 导出后在本地剔除草稿再打包，`package-lock.json` 与 `package.json` 哈希与上一发布目录一致，故复用其 `node_modules`。
- 内容变化：发布《给 Agent 配装备：指令、Skills、MCP、Hooks、插件、子智能体》（含封面与 7 张正文配图）；按两轮外部审查修订事实边界（Hooks 失败语义与 `onFailure`、插件权限、子智能体 fork 与文件隔离、MCP 接入与授权之分、指令作用域、事件首发与时间线措辞），`Hooks` 小节标题由“门禁卡”改为“门禁检查”。**agent-getting-started、harness-comparison、model-landscape-2026 三篇仍在评审，继续排除**，路由公网 404。
- 站点样式：`globals.css` 为表格单元格增加 `white-space: nowrap` 与 `font-variant-numeric: tabular-nums`，长串日期不再逐字折行；大事记分隔行改用 `:-------:` 让时间列按内容撑开。该规则对全站表格生效。
- `scripts/check-site.mjs` 已把 `/blog/agent-usage-ecosystem` 加入路由清单，并断言其标题锚点存在、旧措辞“门禁卡”不再出现、`/search-index` 收录该篇。
- 服务器流程按 runbook 执行：解压后复用 `node_modules`、以 `www` 用户 `SITE_URL=https://w2321.top` 生产构建、ESLint / 类型检查 / 6 项测试通过；3011 预览通过 `check-site` 全部路由，三篇草稿 404，9 张图片均为 `image/webp`；切换 `20-release.conf` 重启后，`127.0.0.1:3010` 与公网 `https://w2321.top` 双向通过全部检查（含 gzip/identity 缓存变体）。
- 专项确认：`/blog/agent-usage-ecosystem` 公网 200 且 RSS、sitemap 已收录；线上 CSS 分块含 `td:not(:has(br))` 与 `tabular-nums`，浏览器实测大事记时间列单行、无横向溢出；临时 3011 预览已停止。

## 运行方式

- 正式域名：`https://w2321.top`。
- 服务：`personal-homepage.service`，运行用户和组均为 `www`。
- Nginx 将主页请求转发到 `127.0.0.1:3010`。
- 当前版本目录：`/www/wwwroot/w2321.top-releases/20261025T083331Z`。
- 上一版本目录：`/www/wwwroot/w2321.top-releases/20261024T151351Z`，保留用于回退。
- 原版本保留在 `/www/wwwroot/w2321.top`。
- 构建和运行均使用 `SITE_URL=https://w2321.top`。

## 2026-10-18 网站与项目清单更新

按用户确认的范围新增卫戍协议网站，以及 Stronghold-Protocol、qq_bot、ScoreCard、count、MineSweeper 五个公开代码项目。Stronghold 标注 Fork、上游贡献者和 6 次合并（由用户提供）；count 网站和项目均注明暂未维护，有需要可联系站主。原“访问统计”已更正为精灵捕捉计数器，改用 HTTPS；无法解析的项目集合域名已由实际项目入口替代。

此次只更新主页展示，没有修改其它子站。源码包 SHA-256 为 `f1cb8d1da1905418f949921debb22bf75ce7c80e200fa412bb31465e7285f531`。新旧 `package-lock.json` 一致，因此在独立发布目录复制上次安装的依赖后，以 `www` 用户重新构建。

本地与服务器的 6 项测试、ESLint、类型检查和生产构建均通过。服务器预览端口、正式端口和公网域名，以及本机访问公网域名，均通过 17 项路由检查和项目名单、状态说明、排除入口及压缩缓存变体检查。五份本次更新文件的本地与服务器 SHA-256 一致；正式服务为 active/running、enabled，临时预览已停止。

本地首次受限环境构建停留在编译阶段，停止后在正常本机进程环境重跑，生产构建成功。

## 发布过程

1. 上传不含私密环境文件的源码压缩包，并校验 SHA-256。
2. 在新的发布目录中，以 `www` 用户执行 `npm ci`。
3. 使用发布目录自己的 `.npm-cache`，保持全局 npm 缓存配置不变。
4. 构建生产代码并运行测试、类型检查和 ESLint。
5. 在本机临时端口 `3011` 启动新版本，检查页面、接口及正式域名元数据。
6. 通过 systemd 的 `20-release.conf` 覆盖工作目录与启动路径，重启主页服务。
7. 检查正式端口和 HTTPS 域名；失败时自动恢复旧版本配置。

## 本次验证结果

- 上传压缩包 SHA-256 核对通过。
- 初次部署的服务器端 `npm ci` 通过；本次复用同锁文件依赖，生产构建、类型检查、6 项测试与 ESLint 通过。
- 临时预览端口、正式服务端口、公网域名均通过 17 项路由及数据检查。
- 从本机网络再次访问正式域名，同样通过全部检查。
- RSS 和 sitemap 的绝对链接均使用 `https://w2321.top`。
- `personal-homepage.service` 为 `active/running`，开机启动为 `enabled`。
- 临时预览服务已停止；正式服务监听端口与原 Nginx 配置保持一致。
- 本次使用 systemd 覆盖文件 `/etc/systemd/system/personal-homepage.service.d/20-release.conf` 指向新版本。
- 应用内浏览器两次打开线上站点均遇到工具超时，未取得新的线上截图；部署与健康结果由服务器及本机的实际 HTTPS 检查确认。

## 旧首页缓存问题修复

用户反馈线上与本地不一致后，复现了正式服务返回新版、Nginx 公网入口却在部分压缩请求下返回旧版 `MyBlog` 的情况。此前检查的默认请求命中了新版变体，没有覆盖旧缓存变体。

根因是 `/www/server/nginx/conf/proxy.conf` 在全局开启 `proxy_cache cache_one`，站点的反向代理继承了该缓存。不同 `Accept-Encoding` 请求对应不同缓存版本。

已在本域名的代理 location 中增加 `proxy_cache off;`，保留其它站点策略。原代理配置备份为服务器私有文件：

```text
/var/backups/personal-homepage/20261018T102844Z/proxy-before-cache-fix.conf
```

`nginx -t` 通过后已平滑重载。补充的回归检查先复现 `identity` 压缩变体仍返回旧版的失败，再确认修复后全部通过。检查脚本现在验证首页品牌、导航区以及 `identity` 和 `gzip, deflate, br` 请求的版本。

额外核对的 8 份关键部署源码与本地 SHA-256 一致；公网首页引用的 12 个 CSS / JavaScript 文件与正式服务的内容哈希一致。以后通过宝塔重新生成代理配置时，需要保留本站 `proxy_cache off;`，避免再次继承全局页面缓存。

## 回退

服务器上的私有回退快照位于：

```text
/var/backups/personal-homepage/20261018T111207Z
```

在服务器 root 会话中执行：

```sh
bash /root/myblog-deploy/rollback-release-20261018T111207Z.sh
```

回退脚本恢复上一次 `20-release.conf`，将主页服务切回 `20261018T102844Z`。初次部署的回退记录和原网站目录仍保留，其他子站不参与切换。

## 内容保留核对

此前已核对服务器与本地的 `hello-world.mdx`、`next-roadmap.mdx` 在规范化 CRLF/LF 后的 SHA-256 一致。现有两篇原文保留；本次导航目标按用户确认的清单调整。

连接凭据、私钥内容、密码、令牌和数据库内容不写入此文档。
