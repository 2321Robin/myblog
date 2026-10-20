## 项目简介

Robin 的个人主页与博客。首页优先展示工具、作品及站点入口，文章、社交链接、个人介绍和备案信息一并保留。

- Next.js 16 App Router + React 19 + TypeScript + Tailwind CSS 4。
- 站点导航按“网站与工具 / 项目与代码 / 内容与社交 / 其它入口”分组，支持名称、简介、域名和关键词搜索。
- 搜索状态保存在 `?q=`，支持刷新和浏览器后退恢复。
- 博客使用本地 MDX，保留标签筛选、分页、目录、代码高亮、分享和相邻文章导航。
- 浅色 / 深色主题、移动端导航、键盘焦点及减少动画偏好。
- RSS、sitemap、robots、文章索引和本地分享图片。
- 不接入评论、鉴权、数据库、监控或第三方分析。

## AI 协作者

在本仓库工作的 AI 先读根目录 [`AGENTS.md`](AGENTS.md)：只做用户明确要求的事、提交时不误提交他人改动、一个对话只负责一篇文章或一项网页改进。

## 增加或调整站点入口

编辑 `src/lib/site-links.ts` 中的 `siteLinks` 数组。每新增一条记录，页面分组、搜索和响应式布局都会自动更新，无需更改组件，也没有固定四个入口的限制。

```ts
{
  id: "my-new-tool",                 // 唯一且稳定
  title: "新工具",
  href: "https://example.com",       // 或本站路径，例如 /blog
  description: "一句话说明用途。",
  category: "tools",                // tools / projects / social / more
  icon: "projects",
  keywords: ["别名", "英文名称"],    // 可选，用于搜索
},
```

可选图标：`score`、`game`、`resume`、`projects`、`github`、`video`、`writing`、`home`、`stats`、`blog`、`tags`、`rss`。

同一分组按数组中的顺序展示。调整分组标题及说明可编辑同文件的 `siteGroups`。新增图标时同时扩展 `SiteIcon` 类型与 `src/components/site-directory.tsx` 的图标映射，TypeScript 会检查遗漏。

当前网站入口包括打牌计分、扫雷、简历、卫戍协议和精灵捕捉计数器；项目区展示 Stronghold-Protocol、qq_bot、ScoreCard、count 和 MineSweeper。Stronghold 标明 Fork 与上游贡献，count 标明暂未维护。失效的 `projects.w2321.top` 入口已由实际项目替代。

## 写作

文章位于 `src/content/posts/*.mdx`。现有文章源文件在此次重做中保持原样。

```mdx
export const metadata = {
  title: "文章标题",
  slug: "my-post",                   // 与文件名相同
  date: "2026-10-18",
  tags: ["notes", "web"],
  summary: "一句话摘要",
  cover: "/covers/my-post.jpg",      // 可选
};

# 文章标题

正文支持 GFM、列表和代码高亮。同名正文标题在渲染时省略，保留页面主标题。
```

`readingTimeMinutes` 为可选元数据字段；当前加载器根据正文自动估算阅读时长。首页显示近期文章，`/blog` 按日期倒序排列，标签状态使用 `?tag=`。

`/search-index` 提供文章索引 JSON。本轮提供的是首页站点入口搜索，尚未提供博客全文搜索界面。

## 开发与验证

当前测试脚本使用 Node.js 22.6+ 的 TypeScript 类型擦除功能，不额外安装测试依赖。

```text
npm install
npm run dev
npm test
npm run type-check
npm run lint
npm run build
npm run start
```

本地页面与内容检查（先启动开发或生产服务器）：

```text
node scripts/check-site.mjs http://127.0.0.1:3000
```

此检查覆盖页面路由、原有外链与锚点、文章单一主标题、相邻文章方向、空标签状态、RSS / sitemap / robots / 索引、分享图片和未知文章 404。

## 部署

设置 `SITE_URL` 为真实站点地址，例如 `https://w2321.top`。未配置时仅用于本地开发，绝对地址回退到 `http://localhost:3000`。

`SITE_URL` 用于元数据、RSS、sitemap 和 robots 的绝对链接。发布前检查该值，以及外部子站链接、备案链接与订阅地址。

分享图：`public/og.png`（1200 × 630）；可编辑源文件是 `public/og.svg`。站点标识为 `src/app/icon.svg`。无需加载远程字体。

当前版本已部署至 [w2321.top](https://w2321.top)。运行结构、验证结果和回退方法见 [部署记录](docs/deployment.md)。
