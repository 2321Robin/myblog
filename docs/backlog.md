# 站点改进待办备忘

> 记录文章选题之外的改进想法。只记录不动手；动手时先出方案再实现。

## 美观改版（2026-10-20 记录）

> 2026-10-20 已实施 P0 可读性，见下方记录。

目标：让站点更有个性、更好看，先记录方向，具体效果待定。

### 主题色：用户已指定 #93b5cf（2026-10-20）

用户选定的主色 `#93b5cf` 作为**填充色**：图标底、品牌块、`--brand-soft` 一类色块。前景文字用深墨（对比 7.26:1）。

- 浅色背景下**不能**直接拿 `#93b5cf` 做正文链接色（对 `#F3F6FB` 只有 1.99:1）。链接与可交互文字需派生更深的同系色（如 `#2F5D7E` 6.49:1、`#3A6686` 5.66:1）。
- 深色主题下 `#93b5cf` 作为文字色可用（对 `#101723` 8.34:1、对 `#182131` 7.5:1）。
- 纯白文字压在 `#93b5cf` 上只有 2.15:1，按钮不要用"白字 + `#93b5cf` 底"。
- 改造仍属于"美观改版"阶段，本轮 P0 可读性未动任何色值。

- [ ] 主题与配色：调整现有主题的气质（主色 / 强调色 / 整体风格）；主色定 `#93b5cf`，浅色主题需派生深色链接变体
- [ ] 背景：页面背景样式（纯色 / 渐变 / 图案 / 动态背景等，方案待定）
- [ ] 鼠标光标：自定义光标样式
- [ ] 鼠标特效：移动 / 拖动鼠标时的跟随特效（轨迹、粒子等）
- [ ] 其它美观相关：想到再补充

### 实现时的注意点

- 站点已支持浅色 / 深色主题与 `prefers-reduced-motion`，新样式和特效要同时适配这两者，减少动画偏好下应关闭动态特效
- 触屏设备没有光标，鼠标特效需要降级或跳过
- 样式集中在 `src/app/globals.css`，动手前先看现有主题变量的组织方式
- 换主色时同步检查：正文链接、`--brand-soft` 底上的文字、主按钮、`::selection`、焦点环

## 已完成：P0 可读性（2026-10-20）

只动字号、栏宽与断行，未改任何颜色、间距节奏与布局结构。

- 站点基准字号 15 → 16px；文章正文 16 → 17px，行高 1.95 → 1.85，移动端正文保持 16px、行高 1.9
- 文章页正文栏 885 → 724px（桌面），`post-heading` 与正文同宽，外层 `post-shell` 上限 1028px 含目录；实测约 42 字/行
- 全站最小可读字号 9px → 11px（页脚备案、域名、eyebrow 等），9/10px 全部清除；正文与辅助文字 12–13px 起
- 搜索输入框 12 → 16px（同时规避 iOS 聚焦自动放大）
- 文章页新增 `post-shell` 容器，替换原先直接铺满 1160px 的 `post-heading`
- 文章标题去掉全角冒号后的强制 `<br>`（原 `title-break`）：实测断点从 700px 变成 360–430px 区间，且会造出「先对齐口径：什么叫 / 外壳，本文比什么」这类断在词中的折行；改为 `text-wrap: pretty` + `overflow-wrap: break-word`，由浏览器按容器宽度处理
- 移动端文章标题字号 30px（clamp 下限）不变；正文 h2 桌面 26px、移动 21px，h3 桌面 20px、移动 18px
- 全页 h1/h2/h3 统一 `text-wrap: pretty`
- 对比度未变：所有既有文字对比度 4.6–8.5:1，仍满足 AA

验证：`npm test` 6 项通过；`npm run type-check`、`npm run lint`、`npm run build` 通过；1440 / 900 / 768 / 390 / 320 五档宽度无横向溢出，最小字号 11px；亮暗双主题抽查首页、文章列表、标签页、文章详情。

遗留：`node scripts/check-site.mjs` 第 45 行断言 `"记住这一句"` 在本轮之前就已失效——该内容在当前工作区（他人未提交改动）里已被删掉。不属于 P0 范围，未修改断言或他人文章。（2026-10-25 补记：该断言已随后续提交整体移除，脚本中不复存在。）

## 已完成：服务器侧待办 8 项（2026-10-25）

> 2026-10-23 复审确认的 8 项已随发布目录 `20261025T083331Z` 全部闭环，细节与证据见 `docs/deployment.md` 的 2026-10-25 一节。

- [x] `/_next/static/**` 缓存：面板代理配置新增 `^~ /_next/static/` 透传 location，绕开 `expires 1m` 覆盖；公网年缓存断言首次通过。
- [x] 404 共享缓存：站点级 `proxy_cache off` + `dynamicParams = false`，公网 404 实测单条 `private, no-cache`，无共享缓存。
- [x] HSTS：五个子站与 knowquest 的 HTTPS 核验通过后加 `includeSubDomains`；preload 明确不做。
- [x] CSP：由 Report-Only 转强制，自建 `/api/csp-report` 接收端，报告以单行 JSON 落 journald（`journalctl -u personal-homepage` 查询）。
- [x] 发布核验：公网已运行 `20261025T083331Z`，`node scripts/check-site.mjs https://w2321.top` 全部通过。
- [x] `/_next/image` 入口：`images.unoptimized: true` + 页脚备案图标改原生 `<img>`，入口关闭。
- [x] 正文图片缓存：构建期按内容哈希追加 `?v=<sha1-8>`，`/images/**` 一年 immutable，图片仍可原路径覆盖更新。
- [x] 依赖公告：官方 registry `npm audit --omit=dev` 0 漏洞；全量 7 条（2 moderate、5 high）全在开发链，只记录未修。

## 新记录（2026-10-25，待用户安排）

- 面板代理配置对非静态扩展名统一 `add_header Cache-Control no-cache`，与应用自身的缓存头叠加出双 `Cache-Control`：首页 HTML（`s-maxage=31536000` + `no-cache`）、`/api/csp-report`（`no-store, no-cache`）、RSS / sitemap / robots.txt / search-index（`max-age=3600` 被削为需再验证）。功能无损（no-cache 只强制再验证）；要收干净需再加 `^~` 透传 location 或移除该面板规则，且面板重新生成配置时要一并保留。
- 文章 `og:image:width/height` 对所有封面硬编码 1448×1086（`src/app/blog/[slug]/page.tsx`），封面比例不同时声明不准。

## 美化实施计划（2026-10-25 用户确认）

> 调研后用户确认的三步计划，每步单独开一个对话实施。三个仓库 2026-10-25 查证均在近一个月内有提交（活跃标准：一个月内）。实施时沿用上方「实现时的注意点」的双主题与 `prefers-reduced-motion` 要求。

- [x] 第一步·动效层（2026-10-25 已实施，见下方记录）：引入 `motion` + `motion-primitives`（https://github.com/motiondivision/motion 、https://github.com/ibelick/motion-primitives ）。落点：首页 intro 标题字符入场与名片卡浮入、站点目录卡片滚动 stagger 进场 + hover 光斑（Spotlight）、文章页小节轻微滚动渐显（幅度克制，不抢阅读）。
- [ ] 第二步·全文搜索：`Pagefind`（https://github.com/Pagefind/pagefind ）构建后索引 HTML、纯客户端运行。现有 `search-index` 路由只有标题/摘要/标签元数据，此步补全文检索。
- [ ] 第三步·评论：`Waline`（https://github.com/walinejs/waline ，备选 Twikoo https://github.com/twikoojs/twikoo ），浅深色主题配色对齐现有靛蓝/青绿。

边界：本轮三步均不动现有配色（墨蓝纸页方案已随 ddf3757 回退）；2026-10-20 记录的 `#93b5cf` 改色设想仍未安排，与本计划独立。不引入 Vanta 类 3D 背景（停更且与清爽卡片风冲突）。

## 已完成：第一步·动效层（2026-10-25）

- 依赖：`motion` 14.6 入 package.json；`motion-primitives` 的 npm 包只是 CLI（拉 registry 源码进仓库），故将其 `Spotlight` 组件 vendor 到 `src/components/motion-primitives/spotlight.tsx`，渐变改用 `var(--brand)` 主题变量；`AnimatedGroup` 仅支持进场即播（无 whileInView），未采用，目录 stagger 直接用 motion variants 实现。
- 首页 intro：标题逐字符入场（`IntroTitle`，sr-only 完整句 + 逐字 span aria-hidden，避免读屏逐字朗读；改文案只动 `titleLines`），问候/描述/链接/名片卡 `FloatIn` 浮入。
- 站点目录：卡片滚入视口 stagger 进场（`whileInView` + `once`，grid staggerChildren 0.05s）；工具/项目大卡加 Spotlight 光斑，社交/紧凑卡（透明底）不加。
- 文章页：正文按 h2 分节，`ArticleReveal`（IntersectionObserver + CSS 过渡）整节渐显，幅度 opacity + 12px 位移；文章间导航 `key={slug}` 重挂载重新生效；已滚过视口顶端的段落直接展示。
- 适配：`MotionProvider`（`MotionConfig reducedMotion="user"`）接管 motion 动画；正文渐显在减少动态偏好/无 IO 时不隐藏任何内容；`layout.tsx` 的 noscript 规则恢复 `[data-entrance]` 初始隐藏态（无 JS 可见性兜底）；Spotlight 渐变 `color-mix(in srgb, var(--brand) 30%, transparent)` 浅深主题自适应。
- 验证：`npm test` 16 项、`npm run type-check`、`npm run lint`、`SITE_URL=https://example.test npm run build` 通过；`next start -p 3003`（隐藏控制台，验后即停）+ `SITE_URL=https://example.test node scripts/check-site.mjs` 全部通过；SSR 抽查：首页 h1 唯一、13 个字符 span、10 张大卡带光斑，文章页正文 SSR 不含 reveal 类（初始不隐藏）。

