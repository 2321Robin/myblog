This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 项目简介
- 个人博客站点，支持文章发布/分类/标签/搜索/评论，良好 SEO 与性能。
- 技术栈：Next.js + TypeScript + Tailwind CSS（App Router + src 目录）。

## 开发计划 / 里程碑
- 第1周：初始化仓库、CI/CD、设计系统基线（颜色/排版/组件）、首页与导航/页脚。
- 第2周：MDX 内容管线、文章列表与详情（代码高亮、目录）、基本封面/摘要。
- 第3周：分类/标签页、搜索 MVP（本地索引）、RSS/站点地图、基础 SEO 与 OG 配置。
- 第4周：评论方案（Giscus 或 Supabase）、简单鉴权与草稿流程、性能与无障碍检查，上线。

## 本地任务清单（可直接勾）
- [ ] M1 基础框架：初始化 Next.js+TS+Tailwind，配好 ESLint/Prettier/测试/CI，确定设计基线，搭好导航/页脚/首页占位。
- [ ] M2 内容系统：MDX + frontmatter，文章列表（分页/摘要/封面），详情页（高亮/目录/分享），相关文章/标签联动。
- [ ] M3 搜索与 SEO：分类/标签页，搜索 MVP（本地索引），RSS/sitemap/robots，OG/Twitter/结构化数据。
- [ ] M4 互动与上线：评论（Giscus 或 Supabase），简单鉴权+草稿流程，性能/无障碍检查，部署 Vercel + 基础监控。

## 详细执行步骤

### M1 基础框架（推荐顺序）
- [x] 本地启动验证：`npm run dev`，确认首页可开。
- [x] 清理模板：修改 `src/app/page.tsx` 为自定义布局骨架（导航/页脚/占位区块），删掉默认文案。
- [x] 设计基线：在 `src/app/globals.css` 设定主题色变量、排版和暗/亮模式策略（修改 `:root` / `.dark` 变量即可换色）。
- [x] 质量基线：已添加 `npm run type-check`；CI（.github/workflows/ci.yml）运行 `lint` 与 `type-check`。后续如需可再补充自定义 ESLint/Prettier 规则。
- [x] 目录约定：已建立 `src/components`, `src/lib`, `src/content`；可用 `@/components`, `@/lib`, `@/content` 导入（见 `tsconfig.json`/`app` 默认别名）。
- [x] 主题切换：已集成 `next-themes`（见 `src/components/theme-provider.tsx`），在 header 添加 `ThemeToggle` 按钮；复用 `globals.css` 变量，后续可自定义样式。

### M2 内容系统
- [x] 接入 MDX：`@next/mdx` 已配置；文章放在 `src/content/posts/*.mdx`，使用 `export const metadata = {...}` 存 frontmatter（title/slug/date/tags/summary/cover）。
- [ ] 列表页：基础列表已上线（/blog），分页/过滤/封面待做。
- [ ] 详情页：基础渲染已上线（/blog/[slug]），目录、代码高亮与分享待做。
- [ ] 关联推荐：基于标签或相似度返回相关文章。

### M3 搜索与 SEO
- [ ] 分类页/标签页：支持过滤和分页。
- [ ] 搜索 MVP：生成静态索引（slug/title/summary/tags），前端过滤；预留切换到 Algolia/Typesense 的接口。
- [ ] 生成 RSS、sitemap、robots；添加 OG/Twitter/结构化数据（`metadata` API）。
- [ ] 跑 Lighthouse，目标 SEO ≥ 90。

### M4 互动与上线
- [ ] 评论：优先 Giscus（免后端）；若自托管，Supabase + rate limit。
- [ ] 鉴权与草稿：受保护路由或 token，草稿不出现在公开列表。
- [ ] 性能/无障碍：优化图片/字体、语义化标签、键盘可达性；Lighthouse 性能/可访问性/最佳实践 ≥ 90。
- [ ] 部署：Vercel；开启监控（Vercel Analytics），可选接入 Sentry。

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
