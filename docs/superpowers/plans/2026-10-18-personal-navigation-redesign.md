# Personal Navigation Redesign Implementation Plan

> **For agentic workers:** Use executing-plans for inline execution of the coupled UI tasks; use requesting-code-review for an independent final review. Steps use checkbox syntax for tracking.

**Goal:** 重做 Robin 的个人主页，以站点导航和工具为核心，保留原内容与 URL，新增入口只需编辑数据。

**Architecture:** 服务端页面加载文章，统一布局提供导航与页脚。独立客户端目录组件消费序列化入口数据，支持本地搜索和 URL 状态。样式统一使用蓝灰设计变量，文章继续通过已有 MDX 管线渲染。

**Tech Stack:** Next.js 16、React 19、TypeScript、Tailwind 4、lucide-react、next-themes；测试使用 Node 自带 test runner，无新增运行依赖。

## Global Constraints

- 以当前工作区为基线，包括现有 10 个文件的未提交修改。
- 本次保留现有入口，做好扩展。入口数量不得固定为四个。
- 不编造经历、职业身份、项目指标或新文章。不删除原有可访问路由。
- 保留旧首页 #blog、#about、#projects，并将 #links 作为站点区的兼容锚点。
- 本轮只处理现有仓库，不创建新的托管项目或部署。
- 不改动 src/content/posts 的原文件；不更改原有外链地址和备案号。
- 已有 node_modules，依赖未变时不重复安装。保留用户改动，不打包提交用户原有未提交文件。

## Task 1: 可扩展入口数据与搜索契约

Files: create src/lib/site-links.ts and tests/site-links.test.mjs; modify package.json for a test script.

Interfaces: `SiteLink { id, title, href, description, category: "tools" | "social" | "more", icon, keywords?: string[] }`; exports `siteLinks`, `siteGroups`, `filterSiteLinks(links, query): SiteLink[]`, `getLinkHost(href): string`.

- [x] 先测试内容保留、空白搜索、中文和域名、不区分大小写、多词搜索、无匹配及新增记录自动可搜索。
- [x] Run `node --experimental-strip-types --test tests/site-links.test.mjs`; 确认尚未实现功能时失败。
- [x] 实现单一数据源、trim + lowercase + 每个检索词均匹配：

```ts
const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
return links.filter((link) => {
  const text = [link.title, link.description, link.href, ...(link.keywords ?? [])].join(" ").toLowerCase();
  return words.every((word) => text.includes(word));
});
```

- [x] 用真实原链接测试通过；不对入口数量写固定上限。

## Task 2: 首页与共享框架

Files: create src/components/site-header.tsx, site-footer.tsx, site-directory.tsx; replace src/app/page.tsx and globals.css; update layout.tsx, theme-toggle.tsx and lib/site.ts; add public/og.svg.

Interfaces: layout renders header, page children and footer once. `SiteDirectory({ links: SiteLink[] })` contains grouped cards and controlled search.

- [x] 顶部身份、常用工具、内容社交、其它入口、近期文章、关于按设计顺序实现；入口全部来自 Task 1。
- [x] 搜索 `?q=` 使用 useSearchParams 作为状态来源，history.replaceState(null, ...) 同步；Suspense 的服务端回退显示完整列表，刷新、同页导航及后退恢复状态。
- [x] 入口展示原描述、真实域名和图标；分组由数据过滤生成。全部卡片为原生链接，不嵌套可交互控件。
- [x] 搜索有可见 label、name=q、autocomplete=off，结果数 aria-live，清空按钮和无结果提示。
- [x] 字体、主题变量、44px 点击目标、焦点、长文本、减弱动画、320px 布局从全局样式统一控制。
- [x] 元数据命名改为 Robin · 个人站点，提供本地分享 SVG 与 favicon 标识；不依赖远程字体服务。

## Task 3: 阅读页面统一与既有缺陷

Files: modify src/app/blog/page.tsx, blog/tags/page.tsx, components/post-content.tsx, table-of-contents.tsx and share-bar.tsx; update lib/posts.ts types if needed.

- [x] 博客使用一致的标题、分隔行和标签；修正无效 grid 定义；分页解析为正整数并处理越界。
- [x] 在渲染层隐藏同名首个 MDX h1，其他 h1 降为 h2；页面保留一个主 h1。
- [x] CSS 恢复列表标记、代码高亮、表格与长内容溢出控制。
- [x] 相邻文章文案明确为较新/较早，与倒序列表的索引方向一致。
- [x] 分享保留 Twitter、LinkedIn、原生分享和复制；成功与失败均有可读反馈；取消原生分享不报错。

## Task 4: 验证、文档与审查

Files: update README.md, this plan, and design verification status. Add scripts/check-site.mjs for HTTP smoke checks if useful.

- [x] `npm test` → 所有搜索与扩展契约通过。
- [x] `npm run type-check` and `npm run lint` → exit 0。
- [x] `npm run build` → exit 0。若 Turbopack 挂起，使用 systematic-debugging 收集错误和进程输出，检查 webpack 替代构建；只保留有证据支持的配置改动。
- [x] HTTP 检查 /、/blog、/blog/tags、两篇文章、筛选与分页参数、/rss.xml、/sitemap.xml、/robots.txt、/search-index。
- [x] 检查文章源文件 diff 为空、所有原链接和备案存在、单 h1、目录目标 ID、分享状态。
- [x] 在可用浏览器中检查桌面/移动、浅/深色、搜索、清除、刷新、后退、键盘和横向溢出；不可用则如实记录边界。
- [x] 使用 requesting-code-review 独立审查实际改动；修复 Important/Critical 反馈。
- [x] README 说明增删入口的实际数据结构和命令，移除未实现的博客搜索声明。

## Progress

- [x] User confirmed design and extensibility scope.
- [x] Created codex/personal-navigation-redesign branch preserving working changes.
- [x] Task 1.
- [x] Task 2.
- [x] Task 3.
- [x] Task 4.


## Final verification — 2026-10-18

- `npm test`: 6 tests passed. Node 22.11 emits its expected experimental type-stripping notice; no test failure.
- `npm run type-check`: exit 0.
- `npm run lint`: exit 0.
- `npm run build`: exit 0 with the original default Turbopack command; all 13 routes generated. No build configuration change was needed.
- Production HTTP checks: 17 routes passed, plus retained original URLs/anchors, metadata assets, one h1 per page, indexed original articles, neighboring article dates and unknown-post 404.
- Regression reproduced and fixed: repeated tag query originally returned 500; normalized string/string[] parameters now pass.
- Browser regression reproduced and fixed: same-page header navigation previously removed q without resetting filtered results. useSearchParams plus replaceState(null, ...) now keeps the URL and list consistent.
- Browser verified: Chinese/domain search, sequential typing, reload and back restoration, clear focus, empty results, light/dark themes, keyboard outline, mobile article list markers, real heading anchors and copy feedback.
- No horizontal overflow at 320px, 390px and the default desktop viewport. Desktop common tools use four columns; the list expands automatically with new data.
- Independent read-only review approved the latest source without remaining findings.
- `git diff --check`: clean. `git diff -- src/content/posts`: empty.
- Screenshots saved in the task visualization directory: robin-home-desktop.jpg and robin-home-mobile.jpg.
- Lighthouse, external subsite availability and real external sharing were not measured. No deployment or remote Git operation performed.
- Kept the development branch and working changes for user review, including pre-existing uncommitted edits; no application commit was created.
