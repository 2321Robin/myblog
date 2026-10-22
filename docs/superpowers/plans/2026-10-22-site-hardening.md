# 站点加固实施计划

**Goal:** 按 `docs/superpowers/specs/2026-10-22-site-hardening-design.md` 完成三项：Next.js 16.4.2 依赖升级、dev 保存接口访问控制、草稿发布隔离，并让 CI 冒烟覆盖后两项。

**Architecture:** `src/lib/posts.ts` 作为文章唯一读取入口，`published` 在元数据校验层归一化；dev 令牌走服务端模块常量 + dev-only `<meta>` 注入；检查脚本扩展草稿断言。

**Tech Stack:** Next.js 16 App Router、TypeScript、node:test、GitHub Actions。

## 约束

- 只动本任务文件：`package.json`、`package-lock.json`、`src/lib/posts.ts`、`src/app/blog/[slug]/page.tsx`、`src/app/api/dev/save-post/route.ts`、`src/lib/dev-save-token.ts`（新增）、`src/components/article-editor.tsx`、`src/app/layout.tsx`（dev-only meta）、`package.json` dev 脚本、`tests/publish-state.test.mjs`（新增）、`scripts/check-site.mjs`、`.github/workflows/ci.yml`、`docs/writing-guide.md`、`docs/deployment.md`、三篇草稿的 `metadata` 字段、spec/plan 文档。
- 不 `git add -A`；工作区他人未提交改动（四篇评审稿正文与一份评审文档）原样保留，只在草稿 frontmatter 加 `published: false`，不碰其正文。
- 不用 `npm audit fix --force`。
- React 保持 19.2.3。

## 执行步骤

- [ ] 依赖升级：`npm install next@16.4.2 @next/mdx@16.4.2 eslint-config-next@16.4.2`；核对 `package.json` 与锁文件三者均为 16.4.2、react 19.2.3；跑 `npm test`、`npm run type-check`、`npm run lint`、`npm run build`。
- [ ] 草稿发布状态：`src/lib/posts.ts` 增加 `published` 校验与归一化，`getAllPosts`/`getPostSlugs`（新增已发布过滤）与 `getPostBySlug` 的草稿语义按设计落地；`src/app/blog/[slug]/page.tsx` 的 `generateStaticParams`、`generateMetadata`、页面体改走"已发布集合优先，dev 允许草稿"路径。
- [ ] 三篇草稿 metadata 增加 `published: false`；两篇已发布文章不动。
- [ ] dev 保存接口：新增 `src/lib/dev-save-token.ts`；route 增加令牌、Host/Origin、Content-Type、512 KB 上限四道检查（生产 404 仍最前）；`package.json` dev 脚本加 `-H 127.0.0.1`；`src/app/layout.tsx` dev-only 注入令牌 meta；`src/components/article-editor.tsx` 读取 meta 并以 `x-dev-save-token` 头发送。
- [ ] 新增 `tests/publish-state.test.mjs`：已发布集合含两篇线上文章、不含三篇草稿；草稿 slug 不可通过公开 API 取得。
- [ ] `scripts/check-site.mjs`：增加三篇草稿路由 404、`/blog`、`/blog/tags`、`/sitemap.xml`、`/rss.xml`、`/search-index` 不含草稿的断言。
- [ ] `.github/workflows/ci.yml`：Build 之后启动生产服务并跑 `check-site.mjs`（固定端口，如 3100），作为发布前冒烟。
- [ ] 更新 `docs/writing-guide.md` 第六节（本地编辑器令牌与回环绑定说明）、`docs/deployment.md`（草稿改用 `published: false`，打包不再手工剔除文件）。
- [ ] 全量验证：`npm test`、`npm run type-check`、`npm run lint`、`npm run build`；生产服务上跑 `node scripts/check-site.mjs http://127.0.0.1:3100`；dev 服务实测四类请求（无令牌 / 跨源 / 超限 / 正常）与监听地址。
- [ ] 汇报改动清单与验证结果，等用户确认后再提交（不自动 commit）。
