# 站点加固设计：依赖安全、本地编辑器访问控制、草稿发布隔离

依据：[`docs/reviews/public-site-audit-2026-10-22.md`](../reviews/public-site-audit-2026-10-22.md) 的 A、B、C 三项（用户 2026-10-22 确认本轮范围）。D（响应头）与 E（缓存）依赖线上 Nginx，本轮不做；F（正文图片属性）按仓库约定属插图会话；G/H/I、J 另案处理。

设计目标：把"依赖升级""接口可达性""草稿可见性"三件事从"靠人记得"变成"代码与脚本能断言"。

## 一、框架与依赖升级（A）

- `next`、`@next/mdx`、`eslint-config-next` 同步升至 **16.4.2**（npm 官方 `latest`，2026-10-22 核验）。三者版本号必须一致：`@next/mdx` 与 `eslint-config-next` 都跟随 Next 主版本发布。
- `react` / `react-dom` 保持 **19.2.3**。Next 16.4.2 peer 为 `^19.0.0`，19.2.3 满足，缩小回归面。
- 顶层 `sharp` 已是 0.35.5（仅 `scripts/compress-images.mjs` 使用），Next 内部的 sharp 随框架版本更新，不在 `package.json` 单独固定。
- 执行 `npm install next@16.4.2 @next/mdx@16.4.2 eslint-config-next@16.4.2` 更新锁文件，不用 `npm audit fix --force`（会降级 ESLint 相关依赖）。
- 升级后必须全量回归：`npm test` / `npm run type-check` / `npm run lint` / `npm run build`，并用 `scripts/check-site.mjs` 跑一次本地服务的路由冒烟。任一步失败即停止并汇报，不做半升级提交。
- 不改动 `package.json` 中依赖的组织方式（dependencies/devDependencies 归属保持现状）。

## 二、开发用保存接口访问控制（B）

现状：`POST /api/dev/save-post` 只判断 `NODE_ENV !== "development"`，无令牌、无来源校验、无大小限制，写入目标是会被 `import()` 编译执行的 MDX。`npm run dev` 未绑定回环地址。

设计（全部只在开发环境生效，生产行为不变：任何方法一律 404）：

1. **绑定回环**：`dev` 脚本改为 `next dev -H 127.0.0.1`，不监听其它网卡。
2. **访问令牌**：`next dev` 启动时生成一次性随机令牌，写入服务端模块级常量；同时输出到启动日志与页面注入点。编辑器从注入点读取令牌，随请求头发送。
   - 令牌不进仓库、不进 `.env`、不进 URL 查询参数（避免落到日志与 Referer）；只走自定义请求头 `x-dev-save-token`。
   - 浏览器侧获取方式：dev 环境在文章页注入 `<meta name="dev-save-token" content="…">`，编辑器从该 meta 读取。令牌按进程生成，页面刷新后仍有效；重启 dev 后旧页面取不到新令牌，需刷新。
   - 实现位置：`src/lib/dev-save-token.ts`（`getDevSaveToken()`，惰性生成，`crypto.randomUUID()` 两次拼接或 `randomBytes(32).toString("hex")`）。
3. **来源校验**：请求必须满足其一，否则 403：
   - `Host` 头为 `127.0.0.1:<port>` 或 `localhost:<port>`；且
   - `Origin` 存在时必须是 `http://127.0.0.1:<port>` 或 `http://localhost:<port>`（按 `Host` 的端口动态匹配）。
4. **请求约束**：`Content-Type` 必须 `application/json`；请求体上限 512 KB（`Content-Length` 超限或读取超限即 413）。现有 slug 正则与"只覆盖已存在文件"的检查保留。
5. **路由顺序**：`NODE_ENV` 检查最前（生产直接 404，与现状一致），随后令牌 → 来源 → 类型/大小 → 业务校验。每个失败分支返回明确错误文案，便于本地排查。

## 三、草稿发布隔离（C）

现状：`getPostSlugs()` 读目录下所有 `.mdx`，`getAllPosts()` 全量导入，草稿一旦留在工作区就必然进入列表、静态参数、RSS、sitemap、搜索索引；隔离靠打包时手工剔除文件。

设计：

1. **元数据字段**：`export const metadata` 新增可选 `published?: boolean`。默认 `true`（省略 = 已发布），既有文章不变。
   - `published: false` 的 `slug.mdx` 视为草稿：不进入 `getAllPosts()`、不进 `generateStaticParams()`、不进 RSS/sitemap/搜索索引；直接请求 `/blog/<slug>` 返回 404。
   - 公开读取统一收口到 `getPublishedPostBySlug()`：草稿返回 `null`。`getPostBySlug()` 保留"含草稿"语义供 dev 编辑器使用，并对不存在的 slug 返回 `null`（先校验 slug 正则与文件存在，再 `import()`，避免未知 slug 触发模块解析异常）。
2. **文章页读取策略**：`/blog/[slug]` 先取 `getPublishedPostBySlug()`；仅当 `NODE_ENV === "development"` 时回退到 `getPostBySlug()`。生产构建与生产运行都不含草稿，dev 工作流不受影响。
3. **元数据校验**：`validatePostMetadata` 增加 `published` 校验：必须是 `boolean`，缺失视为 `true`；`PostMeta` 类型增加 `published: boolean`（必填，规范化后始终有值）。
4. **草稿清单来源**：以 `published: false` 为唯一事实来源，删除部署记录里"手工剔除文件"的依赖。部署流程改为：`git archive` 全量导出即可，构建时草稿自然被过滤。
5. **当前三篇草稿**：`agent-getting-started.mdx`、`harness-comparison.mdx`、`model-landscape-2026.mdx` 的 `metadata` 增加 `published: false`。只加 frontmatter 字段，不动正文与配图。

## 四、自动检查（对应 I 的相关子项）

- 不新增重复实现过滤逻辑的单元测试：`tests/*.test.mjs` 只能 `import` 纯 TS 模块，而 `posts.ts` 的草稿判定依赖 MDX `import()`；在 node:test 里把正则抄第二份再断言，测的是副本不是实现。草稿隔离改由真实生产构建 + 路由断言覆盖。
- `scripts/check-site.mjs` 增加：三篇草稿路由 404、`/blog`、`/blog/tags`、`/sitemap.xml`、`/rss.xml`、`/search-index` 不含草稿 slug、`POST /api/dev/save-post` 在生产返回 404。
- CI（`.github/workflows/ci.yml`）增加构建后冒烟：`npm run build` 后以 `SITE_URL=https://example.test` 启动 `next start -H 127.0.0.1 -p 3100`，轮询 `/robots.txt` 就绪后跑 `node scripts/check-site.mjs http://127.0.0.1:3100`。这一步同时覆盖"生产保存接口关闭"与"草稿未上线"。
- 依赖公告：本轮不做自动漏洞扫描接入（audit 数据源在镜像下不可用：registry.npmmirror.com 未实现 `/-/npm/v1/security/*`），升级本身已按官方 latest 完成；记入 backlog 由用户安排定期核验。

## 五、明确不做

- 响应头 / 缓存（D、E）：仓库侧 `next.config.ts` 可加 `headers()`，但线上真正生效的是 Nginx；且本轮无法登录服务器验证。留待专项。
- 正文图片 `width/height`/`loading=lazy`（F）：属插图会话。
- 分享元数据、canonical、sitemap 补入口、`SITE_URL` 构建校验（G、H、I 主体）：另案。
- 手机首页布局（J）：缺 375/390/430px 渲染证据。

## 六、验证口径

- 本地：`npm test`、`npm run type-check`、`npm run lint`、`npm run build` 全绿。
- 冒烟：生产构建启动后 `node scripts/check-site.mjs http://127.0.0.1:<port>` 全绿，含三篇草稿 404、索引不含草稿。
- dev 接口：实际启动 dev 服务，验证无令牌 403、错误 Origin 403、超长 body 413、正常保存 200；并确认 dev 监听仅 `127.0.0.1`。
- 提交：只提交本任务文件（见实施计划清单），不带 `git add -A`。
