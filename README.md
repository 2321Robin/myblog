## 项目简介
- 个人自用博客，专注写作与阅读（文章、标签、搜索、RSS/站点地图、基础 SEO）。
- 不做评论、鉴权、草稿流程，暂不接入监控，保持最简体验。
- 技术栈：Next.js + TypeScript + Tailwind CSS（App Router + src 目录）。

## 状态总览
**已完成**
- 初始化框架、导航/页脚、主题切换（浅/深色）。
- MDX 内容管线：支持 `src/content/posts/*.mdx`，frontmatter metadata 已接入。
- 列表页：分页 + 标签过滤，封面占位，阅读时长显示。
- 详情页：代码高亮、目录、分享条、上一篇/下一篇、返回博客列表按钮。
- 搜索 MVP：静态索引，前端过滤，接口 `/search-index`。
- SEO/分发：RSS、sitemap、robots，OG/Twitter/结构化数据。
- 标签独立页：/blog/tags 汇总标签并跳转过滤。

**待办**
- Lighthouse 与无障碍检查，目标各分项 ≥ 90。
- 部署准备：Vercel + `SITE_URL` 环境变量，可选开启 Analytics。
- 内容充实：编写更多实际文章，补充真实封面。

## 路线图（自用精简版）
- M1 基础框架（已完成）：Next.js+TS+Tailwind、CI（lint+type-check）、设计基线、导航/页脚。
- M2 内容系统（已完成）：MDX、列表与详情、目录/分享、标签过滤、阅读时长/封面占位。
- M3 搜索与 SEO（部分完成）：本地搜索、RSS/sitemap/robots、OG 元数据；待补分类/标签页与 Lighthouse 检查。
- M4 上线与优化（未启动）：性能/无障碍优化，部署 Vercel，跳过评论/鉴权/草稿/监控。

## 写作指南
- 文章位置：`src/content/posts/*.mdx`
- 元数据示例：

```mdx
export const metadata = {
	title: "Hello World",
	slug: "hello-world",
	date: "2024-01-01",
	tags: ["life", "notes"],
	summary: "一句话摘要",
	cover: "/covers/hello.jpg", // 可选
	readingTimeMinutes: 3,       // 可选
};
```

正文直接写 MDX，支持 GFM 与代码高亮。

## 开发与运行
- 本地启动：`npm run dev`
- 代码检查：`npm run lint`，类型检查：`npm run type-check`
- 构建：`npm run build`，预览：`npm run start`

## 部署提示（Vercel）
- 设置环境变量 `SITE_URL` 为生产站点地址，用于生成绝对链接/OG/RSS。
- 部署后自测：`/`、`/blog`、`/blog/[slug]`、`/search-index`、RSS/sitemap/robots；验证标签过滤与分页。
- 可选开启 Vercel Analytics；暂不接入监控/日志平台。

## 质量检查
- 跑一次 Lighthouse（桌面+移动），性能/可访问性/最佳实践/SEO 目标各 ≥ 90。
- 无障碍：键盘可达、焦点样式、语义化 heading 层级。
