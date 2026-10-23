# w2321.top 公网站点审查

> 本文保留 2026-10-22 初审时的状态，已随提交 `6981595` 入库。修复后的代码、公网表现及剩余项见[2026-10-23 复审报告](C:/Users/Robin/Documents/Codes/myblog/docs/reviews/public-site-audit-recheck-2026-10-23.md)。下文“未提交”等描述均指初审当时。

审查日期：2026-10-22（北京时间）。对象：当前仓库工作区、依赖锁文件、部署记录，以及 `https://w2321.top` 的实际响应。

本轮只审查并记录，未修改站点代码、文章、图片、依赖或服务器，未提交。工作区原有的文章及评审改动保持原样。公网仅做普通读取与两次指定端口连通性检查，没有执行漏洞利用、压力测试或保存文章请求。

## 结论与处理顺序

优先处理依赖安全更新、开发编辑器的访问控制和草稿发布隔离。其次处理响应头、缓存、图片加载和文章分享信息。功能检查通过不代表这些风险不存在。

| 编号 | 优先级 | 发现 | 证据状态 |
| --- | --- | --- | --- |
| A | P1 | Next.js 16.1.6 及其依赖命中已公开安全公告 | 仓库版本已确认；线上图片处理入口可达；服务器实际安装版本待核对 |
| B | P1，条件性 | 开发环境保存接口无鉴权，可覆盖可执行 MDX | 代码与内存模拟验证；不是已证实的生产写入漏洞 |
| C | P2 | 草稿上线隔离依赖人工剔除文件 | 代码与部署记录确认；三篇草稿当前线上均 404 |
| D | P2，加固 | 常用浏览器安全响应头缺失 | 公网首页、列表和文章实际响应确认 |
| E | P2 | 带哈希的 JS/CSS 仅缓存 60 秒，页面缓存指令不统一 | 公网实际响应确认 |
| F | P2 | 正文图片全部预加载，未设置尺寸和懒加载 | 两篇线上文章 HTML 确认 |
| G | P2 | 文章分享卡片沿用首页标题、图片与 URL | 两篇线上文章 HTML 确认 |
| H | P3 | canonical、参数规范化、sitemap 和构建环境校验可完善 | 源码及公网响应确认 |
| I | P3 | 自动检查缺少安全、草稿发布和响应头验证 | 测试及 CI 配置确认 |
| J | 待复核 | 常见手机宽度下首页文章内容列过窄 | CSS 计算推断；未取得浏览器截图 |

P1 表示应优先安排；P2 表示明确风险或体验问题；P3 表示维护和优化。这里的优先级不是漏洞数据库的 CVSS 等级。

## A. 框架安全更新不能只看顶层依赖

位置：[package.json:18](C:/Users/Robin/Documents/Codes/myblog/package.json:18)、[package-lock.json:6938](C:/Users/Robin/Documents/Codes/myblog/package-lock.json:6938)、[package-lock.json:7546](C:/Users/Robin/Documents/Codes/myblog/package-lock.json:7546)。

锁定的 Next.js 为 **16.1.6**，React / React DOM 为 **19.2.3**。向 npm 官方漏洞数据库查询的结果：

| 查询范围 | 依赖条目总数 | 严重 | 高 | 中 | 低 |
| --- | ---: | ---: | ---: | ---: | ---: |
| 全部依赖 | 20 | 1 | 15 | 3 | 1 |
| 排除 devDependencies | 6 | 1 | 4 | 1 | 0 |

这些数字是被标记的依赖条目，包含依赖链汇总，**不是 20 个能从公网利用的漏洞**。排除开发依赖后仍有 Next.js、它内部的 sharp / postcss，以及 nanoid、source-map-js、baseline-browser-mapping；生产依赖分类也不等于一定在请求路径执行。

尤其要注意：顶层 `sharp` 已是 0.35.5，但 Next.js 下仍安装了 **0.34.5**；只更新图片压缩脚本使用的顶层 sharp 并没有更新框架内部的那一份。

与本项目有关的适用性判断：

- **图片优化缓存耗尽**：官方公告说明旧版 `/_next/image` 缓存没有可配置的上限，可被大量变体撑满磁盘。本站没有使用 `next/image` 组件，但对已有 `/og.png` 做一次正常 64px 缩略图请求仍得到 `200 image/png`，说明入口在公网启用。当前仓库版本处于公告影响范围。本轮没有批量制造变体或验证磁盘耗尽。[官方公告](https://github.com/vercel/next.js/security/advisories/GHSA-3x4c-7xq6-9pq8)
- **AVIF 处理链远程代码执行**：公告涉及图片优化使用的底层解码库。当前图片为可信本地 PNG/WebP，未找到上传入口或远程图片白名单，未证明攻击者能把恶意 AVIF 交给处理链，因此不能据此宣称公网 RCE 已复现。[官方公告](https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4)
- **Windows 服务端 RCE**：版本命中，但部署记录指向 Linux/systemd，不能套用到生产主机；本地 Windows 开发服务如果对不可信网络开放则应额外关注。[官方公告](https://github.com/vercel/next.js/security/advisories/GHSA-p293-qw3h-jr36)
- **Server Components 拒绝服务**：框架版本命中；当前源码没有 `use server` 动作，未做利用验证。它是升级理由，不是已经证明本站所有页面都可被该漏洞攻击。[官方公告](https://github.com/vercel/next.js/security/advisories/GHSA-q4gf-8mx6-v5v3)
- **图片优化 SSRF**：官方说明没有配置 `images.remotePatterns` 的应用不受该条影响；当前项目没有这项配置，不列为本站已确认 SSRF。[官方公告](https://github.com/vercel/next.js/security/advisories/GHSA-cjq9-62q9-8jv4)
- **Pages Router SSG 缓存投毒**：该条公告限定 Pages Router，当前为 App Router，不能仅因 npm 命中版本就认定适用。[官方公告](https://github.com/vercel/next.js/security/advisories/GHSA-4jqv-mc3x-m676)

建议：在独立任务中升级 Next.js 及相匹配的 `@next/mdx` / `eslint-config-next`，重新锁定和安装依赖、构建并回归。审查时 npm 给出的 Next.js 修复候选为 **16.4.2**，官方文档也标示该版本；执行升级时重新核验。不要直接使用 `npm audit fix --force`：当前审计对部分 ESLint 依赖甚至给出了降级至 14.x 的建议。

如果继续采用当前原生图片方案，可评估关闭不使用的运行时图片优化入口；若保留，升级后设置缓存上限和适当的反向代理限流。不要把“不使用组件”等同于“接口不存在”。

线上精确依赖版本尚未登录服务器读取。部署记录显示最近发布复用了同一锁文件依赖，这支持风险判断，但不能代替服务器版本清单。

## B. 开发用文章编辑器需要独立访问控制

位置：[保存接口:9](C:/Users/Robin/Documents/Codes/myblog/src/app/api/dev/save-post/route.ts:9)、[请求读取:13](C:/Users/Robin/Documents/Codes/myblog/src/app/api/dev/save-post/route.ts:13)、[文件覆盖:31](C:/Users/Robin/Documents/Codes/myblog/src/app/api/dev/save-post/route.ts:31)、[MDX 导入:145](C:/Users/Robin/Documents/Codes/myblog/src/lib/posts.ts:145)、[开发命令:7](C:/Users/Robin/Documents/Codes/myblog/package.json:7)。

已有的有效保护是生产环境直接返回 404、slug 限制为小写字母/数字/连字符、只覆盖已存在文章。不能把它误报为当前公网任意文件写入。

问题在于开发环境仅依赖 `NODE_ENV`，没有令牌、同源校验、JSON 类型限制或请求体大小限制；MDX 被作为代码模块导入，允许写入 MDX 的权限实质上接近允许写入应用代码。开发命令也没有显式绑定回环地址，安装版 Next CLI 默认监听 `0.0.0.0`。

审查中以**内存文件系统模拟**验证：跨站 Origin 配合 `text/plain` JSON 会进入写入分支；切换 production 则返回 404、不写入。没有覆盖真实文章。框架的开发跨源保护不能替代此自定义接口的鉴权。

触发需要开发端口能被不可信客户端访问，或者浏览器允许恶意网页向本机该服务发送跨站请求；现代浏览器的本地网络访问限制可能阻断后一条路径。后续 MDX 编译/加载存在代码执行风险，本轮未执行完整 RCE。

建议：绑定 `127.0.0.1`；保存接口增加每次启动生成的访问令牌、严格的 Host/Origin 检查、JSON 类型与内容长度上限。公网反向代理可另外明确拒绝 `/api/dev/`，形成第二道边界。

公网本轮只做 GET，`/api/dev/save-post` 返回 **405**。GET 的结果不能证明 POST 的生产检查已经线上执行；生产关闭结论来自源码和模拟验证。

## C. 草稿发布应由代码明确控制

位置：[文章枚举:135](C:/Users/Robin/Documents/Codes/myblog/src/lib/posts.ts:135)、[文章集合:161](C:/Users/Robin/Documents/Codes/myblog/src/lib/posts.ts:161)、[静态路由:9](C:/Users/Robin/Documents/Codes/myblog/src/app/blog/[slug]/page.tsx:9)、[部署记录](C:/Users/Robin/Documents/Codes/myblog/docs/deployment.md)。

现在所有 `.mdx` 都会进入文章读取逻辑，没有统一的发布状态或白名单。部署记录说明，通过打包时手工剔除三篇评审稿来避免上线；下一次直接构建整个仓库时，遗漏剔除步骤就会公开它们，并进入列表、RSS、sitemap 和索引。

本轮线上确认 `agent-getting-started`、`harness-comparison`、`model-landscape-2026` 均为 **404**。这是后续发布隐患，不是当前草稿泄露。

建议：建立统一的 `draft/published` 状态或发布白名单，同时约束单篇读取、静态参数、列表和各索引。仅从列表隐藏不够，直接访问文章 URL 也应返回 404。发布检查应自动断言未发布文章没有进入页面与索引。

## D. 浏览器安全响应头未配置

位置：[应用配置:13](C:/Users/Robin/Documents/Codes/myblog/next.config.ts:13)，以及未纳入仓库的线上 Nginx 配置。

线上首页、博客列表、文章页的响应均没有 `Strict-Transport-Security`、`Content-Security-Policy`、`X-Content-Type-Options`、`X-Frame-Options`、`Referrer-Policy`、`Permissions-Policy`。`X-Powered-By: Next.js` 仍对外输出。

这是加固缺口，**不等同于已存在 XSS 或敏感操作点击劫持**；本站没有登录、支付等高价值交互，实际危害应按此背景评估。

建议先补 HSTS、`nosniff`、禁止非预期 iframe 嵌入和明确的 Referrer Policy；按实际功能限制不使用的浏览器权限。CSP 先做 Report-Only 验证，再强制执行，需兼容 Next.js 的内联数据、主题初始化及当前内联样式，不能随意粘贴一条严格策略导致页面失效。

HSTS 的 `includeSubDomains`/preload 涉及其它子站，本轮未核验所有子站，不能直接全域启用。隐藏框架标识属于低优先级整理，不能替代安全升级。

## E. 静态缓存策略浪费复访性能，页面头也不统一

公网抽查首页引用的 11 个 CSS/JS 文件，均返回 **`Cache-Control: max-age=60`**。这些文件名已有内容哈希，解压后的总量约 **626 KB**；这不是实际网络传输量，也不等于浏览器全部执行量。多数响应有 gzip，压缩本身正常。

其它实际响应：

| 资源 | Cache-Control |
| --- | --- |
| 首页及已发布文章 | `s-maxage=31536000, no-cache` |
| 博客列表 | `private, no-cache, no-store, max-age=0, must-revalidate, no-cache` |
| 正文/封面 WebP 抽样 | `public, max-age=0, no-cache` |
| 三篇未发布文章的 404 | `s-maxage=31536000` |

`no-cache` 表示使用前需重新验证，并不等于禁止存储。带哈希资源只缓存一分钟会增加复访请求与源站压力；页面的重复指令也增加今后接入 CDN 或修改代理时出错的机会。尤其不应让不存在文章的响应在共享缓存中长期保持 404。

建议：对 `/_next/static/` 恢复与哈希文件相符的长期 `public, max-age=31536000, immutable` 策略；对可原路径覆盖的图片先做文件名版本化或采用较短缓存，不能直接套用 immutable；HTML、动态列表和错误页分别设置一致策略。保留部署记录中避免旧页面缓存的措施，重新核验压缩变体与 RSC 的 `Vary`，不要为了性能直接恢复曾导致旧首页的全局代理缓存。[Next.js 官方自托管说明](https://nextjs.org/docs/app/guides/self-hosting)

本轮没有登录 Nginx，不能确定是哪条 `location` 或全局规则覆盖了响应头；定位部署配置应作为后续任务。

## F. 图片压缩已经有效，但加载方式仍需优化

位置：[MDX 内容渲染:31](C:/Users/Robin/Documents/Codes/myblog/src/components/post-content.tsx:31)、[首页封面:44](C:/Users/Robin/Documents/Codes/myblog/src/app/page.tsx:44)。

| 线上文章 | 正文图 | 图片合计 | 无 width/height | 无懒加载 | HTML 中图片 preload |
| --- | ---: | ---: | ---: | ---: | ---: |
| AI、模型、Agent、Harness | 11 | 1,384,552 B | 11 | 11 | 11 |
| 给 Agent 配装备 | 7 | 1,157,570 B | 7 | 7 | 7 |

统计仅包含正文图，不包含页脚的小图标。文章末尾的图也被提前加载，慢网下会与首屏争用带宽；没有固有尺寸则存在布局跳动风险。本轮没有实际测得 CLS/LCP，不能据此给出性能评分或宣称已超标。

建议统一 MDX 图片渲染：补真实尺寸或可靠宽高比，屏外图 `loading="lazy"`，适当使用异步解码，只预加载关键首屏图。首页的小封面目前加载整张图片，可增加适配卡片宽度的资源。保留现有作者图片、alt 和位置；涉及正文图片属性或位置的实施按仓库规范另行安排。

## G. 文章分享信息指向首页

位置：[文章 metadata:18](C:/Users/Robin/Documents/Codes/myblog/src/app/blog/[slug]/page.tsx:18)、[默认 metadata:16](C:/Users/Robin/Documents/Codes/myblog/src/app/layout.tsx:16)。

两篇文章的 `<title>` 和普通 description 正确，但 `og:title` / `twitter:title` 都是“Robin · 个人站点”，`og:url` 是首页，`og:image` / Twitter 图片是 `/og.png`，`og:type` 是 `website`。

原因是文章只覆盖 title/description，没有覆盖根布局里的社交分享字段。社交平台抓取文章时可能统一显示首页卡片，而非文章的标题、封面和摘要。

建议每篇文章输出独立 Open Graph/Twitter 元数据：文章 URL、标题、摘要、现有封面、`article` 类型及发表时间；不需要新增插画。

## H. SEO 与站点地址校验

- [布局:9](C:/Users/Robin/Documents/Codes/myblog/src/app/layout.tsx:9)与文章页没有 canonical。实际 `/blog?page=999999` 和 `?page=1` 都返回 200 且内容相同。建议规范化默认/无效参数，为真实标签和有效分页生成相应 canonical；不能把所有分页都指向第一页。[参数处理:12](C:/Users/Robin/Documents/Codes/myblog/src/app/blog/page.tsx:12)
- [sitemap:10](C:/Users/Robin/Documents/Codes/myblog/src/app/sitemap.xml/route.ts:10)仅含首页和文章，漏掉可收录的 `/blog`、`/blog/tags`；首页 `lastmod` 是生成时间而非内容更新时间。按收录意图补入口，使用真实更新时间或省略 lastmod。
- [站点地址:1](C:/Users/Robin/Documents/Codes/myblog/src/lib/site.ts:1)缺少 `SITE_URL` 时静默退回 localhost。当前公网设置正确，但未来构建很容易带入本地地址。建议生产构建缺少有效 HTTPS 站点地址时失败，CI 使用显式测试域名；避免错误绝对链接进入分享标签、RSS 和 sitemap。

## I. 验证覆盖与日常维护

位置：[现有测试](C:/Users/Robin/Documents/Codes/myblog/tests/site-links.test.mjs)、[CI 配置](C:/Users/Robin/Documents/Codes/myblog/.github/workflows/ci.yml)、[公网检查](C:/Users/Robin/Documents/Codes/myblog/scripts/check-site.mjs)。

现有 6 项单元测试都围绕站点入口/搜索，CI 包含 lint、类型、测试、构建，基础是完整的；但没有检查依赖公告、生产保存接口关闭、草稿隔离、分享元数据、安全响应头和静态缓存。`check-site` 覆盖很多真实页面，却没有作为 CI 的启动后检查步骤。

建议补少量具有真实约束的测试：生产写入分支拒绝、未发布文章不能被直接读取或索引、每篇文章分享信息指向自身、关键响应头与静态缓存正确。将构建产物启动后的冒烟检查接入发布流程。对依赖采用定期公告检查和可复核的更新流程；不必把所有构建工具的版本命中都当成阻断发布的公网漏洞。

## J. 手机布局需要实机复核

位置：[globals.css:354](C:/Users/Robin/Documents/Codes/myblog/src/app/globals.css:354)、[窄屏覆盖:398](C:/Users/Robin/Documents/Codes/myblog/src/app/globals.css:398)。

361–700px 宽度下，带封面的首页文章仍使用 `84px 96px minmax(0,1fr) auto` 四列，并有三段 18px 间距。390px 视口的内容宽为 354px，固定列和间距先占 234px，再减去阅读时间列，标题正文仅剩较窄空间。多行布局直到 360px 才启用。

这提示 375/390/430px 手机上的可读性风险，不能仅用“没有横向滚动条”判定通过。建议在这些宽度检查标题、摘要与阅读时间，并视结果提前切换多行布局。浏览器工具在本轮读取页面时超时，未取得渲染截图；此项保留为源码推断，未作为已复现布局故障。

## 已核实的正常项

- HTTPS 可用；HTTP 返回 308 跳转到 HTTPS。一次正常握手协商 TLS 1.3，证书验证成功，证书到期时间为 **2027-01-15 14:23:33（北京时间）**。未做完整协议/密码套件扫描，也未验证自动续期任务。
- `npm test`：6/6 通过；`npm run type-check`：退出码 0；`npm run lint`：退出码 0。
- `node scripts/check-site.mjs https://w2321.top`：17 项主要路由、首页压缩缓存变体、文章锚点/索引、未知文章和已删除文章 404 检查全部通过。
- `.env`、`.git/config`、`package.json`、`docs/deployment.md` 的公网路径均返回 404，未发现这些常见敏感路径直接暴露。
- 三篇评审稿均 404；两篇正式文章及 RSS、robots、sitemap、搜索索引可访问，绝对 URL 使用正式域名。
- 未发现应用代码使用 `dangerouslySetInnerHTML`；普通查询文本与元数据经 React 渲染。自有 MDX 仍须视为可信代码。
- 代码具备中文语言标记、跳转主内容链接、控件标签、可见键盘焦点、状态播报和减少动画偏好；字体使用系统字体，未发现加载第三方字体/分析脚本。
- 从本次网络对部署记录指定的 3010/3011 端口各连通一次，均超时；只能说明本次没有连通，不能据此断言所有网络下都关闭或已正确绑定回环地址。

## 需要服务器侧另行核实的边界

本轮没有服务器登录上下文，因此以下是核对清单，而不是已发现配置错误：

1. 实际 Next.js、Node.js、Nginx、系统及管理面板版本和安全补丁；真实启动命令、生产模式和监听地址。
2. Nginx 请求体/连接超时限制、限流、错误页缓存，以及修改面板配置后能否保留站点专属规则。不要用公网压力测试替代配置审查。
3. systemd 重启策略、内存/磁盘限制、日志轮转、证书续期和外部可用性告警。仓库 README 明确未接应用监控，但不能据此断言服务器没有告警。
4. 运行账户是否与其它子站共享、运行时是否有不必要的源码写权限、发布目录和备份权限。
5. 备份是否位于独立故障域并做过恢复验证。保留同盘旧版本有助于回退，不能覆盖主机或磁盘整体故障。

本轮未重新构建工作区，未运行 Lighthouse/真实移动设备性能测试，也未核对所有外部子站、全量 Git 历史秘密或服务器文件权限。报告给出的正常结果均限定于已执行的检查；没有“未发现问题即绝对安全”的结论。

## 建议拆分的后续任务

1. 框架及依赖安全更新，核对线上安装版本和图片优化入口。
2. 本地文章保存接口访问控制。
3. 草稿发布状态及发布前防泄露检查。
4. Nginx 安全响应头和缓存策略。
5. 正文图片加载属性优化（遵守图片单独会话规则）。
6. 文章分享信息、canonical 与 sitemap。
7. 手机首页布局复核；服务器运维配置核对。

每项独立评审、验证和交付，符合仓库“一项网页改进一个对话”的协作约定。
