# 复审意见实施计划（R1–R5）

**Goal:** 按 [`public-site-audit-recheck-2026-10-23.md`](../reviews/public-site-audit-recheck-2026-10-23.md) 落实 R2（正文图片）、R3（source-map-js）、R4（读取期内存上限）、R5（探测安全性），以及低优先级收尾里的静态缓存告警。R1（发布）需服务器上下文，只记录到 backlog。

**Architecture:** 图片属性在构建期由 rehype 插件写入 AST，运行时零成本；保存接口的大小上限改为流式累计；依赖升级只动 postcss / tailwind 两个构建链包。

**Tech Stack:** Next.js 16.4.2 App Router、MDX rehype 插件、unist-util-visit、sharp、node:test。

## 约束

- 只动这些文件：`next.config.ts`、`scripts/mdx-image-attributes.mjs`（新增）、`scripts/check-site.mjs`、`src/app/api/dev/save-post/route.ts`、`package.json`、`package-lock.json`、`docs/deployment.md`、`docs/backlog.md`、本 spec/plan。
- 不碰文章正文与图片文件（R2 只改渲染属性，不改图、不改 alt、不改位置）。
- 不用 `npm audit fix` / `--force`。
- 发布核验（R1）不代做，只写入部署记录与 backlog。

## 执行步骤

### R2 正文图片加载

- [x] 新增 `scripts/mdx-image-attributes.mjs`：rehype 插件，遍历 `element/img`（Markdown 图片）与 `mdxJsxFlowElement/img`（正文内联吉祥物），用 sharp 读 `public/` 下真实尺寸，写入 `width`/`height`/`loading="lazy"`/`decoding="async"`；只处理 `/images/` 开头的 src。
- [x] `next.config.ts` 注册插件。Turbopack 会序列化 loader options，插件必须传**绝对路径字符串**（函数引用无法序列化）。
- [x] 验证：生产构建后文章页 11/7 张正文图全部带 `width`/`height`，屏外图带 `loading="lazy" decoding="async"`，`<link rel="preload" as="image">` 归零。
- [x] 删除为同一目的临时加入的运行时 `src/lib/image-dimensions.ts` 与 `post-content.tsx` 里的 async 图片组件——构建期插件已覆盖，运行时那套是重复实现。

### R3 source-map-js 告警

- [x] `npm install --save-dev postcss@^8.5.31 @tailwindcss/postcss@^4.3.3`，锁文件 `source-map-js` 1.2.1 → 1.2.2（上游已发 1.2.2，`^1.2.1` 本就允许，不需要 override）。
- [x] 官方 registry 上 `npm audit --omit=dev` 归零；全量 audit 剩 12 条，全在 ESLint / tinyglobby / fast-glob 开发链，不进生产产物。
- [x] 回归：`npm test` / `type-check` / `lint` / `build` 全绿。

### R4 读取期内存上限

- [x] `src/app/api/dev/save-post/route.ts`：`readJsonBody` 改为读 `request.body` 流，累计字节数超过 512 KB 立即 `reader.cancel()` 并返回 413，不再 `await request.text()` 后判断。
- [x] 实测：`content-length` 声明 600 KB → 413；不声明长度、chunked 传输 600 KB → 413；坏 JSON → 400；正常 → 200。

### R5 生产保存探测

- [x] `scripts/check-site.mjs`：探测 body 从 `{ slug: "ai-model-agent-harness", content: "x" }` 改为 `{ slug: "not-a-real-post", content: "" }`，仍断言 404。

### 低优先级收尾

- [x] `next.config.ts`：`/_next/static/:path*` 的 Cache-Control 覆盖加 `NODE_ENV === "production"` 条件，消除 Next 16 的开发态告警（生产侧仍显式声明）。
- [ ] 列表页（`/blog`、`/blog/tags`）的 Open Graph URL 仍继承首页：属额外 P3，未做，记入 backlog。
- [ ] 图片优化入口 `maximumDiskCacheSize` / 关闭：未做，记入 backlog。

### 收尾

- [x] `npm test`、`npm run type-check`、`npm run lint`、`SITE_URL=https://example.test npm run build` 全绿。
- [x] 生产服务上 `SITE_URL=https://example.test node scripts/check-site.mjs` 全绿。
- [x] `docs/deployment.md`、`docs/backlog.md` 记录本轮改动与服务器侧待办。
- [x] 按 R2 / R3 / R4+R5 分项提交。
