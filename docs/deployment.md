# 个人主页服务器部署记录

日期：2026-10-18。当前状态：新版本已部署至 `https://w2321.top`，正式服务与公网检查通过。

## 2026-10-22 依赖升级与草稿发布隔离（代码侧，未部署）

- 依赖：`next` / `@next/mdx` / `eslint-config-next` 由 16.1.6 升级到 16.4.2，React 保持 19.2.3。npm 的 `latest` 标签在 2026-10-22 指向 16.4.2；未使用 `npm audit fix --force`。
- 本地保存接口：`npm run dev` 绑定 `127.0.0.1`；`POST /api/dev/save-post` 增加每次启动生成的访问令牌（页面 `<meta name="dev-save-token">` 注入）、Host/Origin 同源校验、`application/json` 与 512 KB 请求体上限。生产环境仍直接 404。
- 草稿隔离：文章 metadata 新增 `published` 字段，`published: false` 不进入列表、静态参数、RSS、sitemap、搜索索引，直接访问 404。当前 `agent-getting-started`、`harness-comparison`、`model-landscape-2026` 三篇标记为草稿。**发布打包不再需要手工剔除草稿文件**，`git archive` 全量导出即可。
- 检查脚本 `scripts/check-site.mjs` 新增草稿 404、索引隔离与生产保存接口 404 断言；CI 在构建后启动生产服务跑同一脚本。
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
- 当前版本目录：`/www/wwwroot/w2321.top-releases/20261021T054949Z`。
- 上一版本目录：`/www/wwwroot/w2321.top-releases/20261020T004055Z`，保留用于回退。
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
