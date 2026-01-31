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
