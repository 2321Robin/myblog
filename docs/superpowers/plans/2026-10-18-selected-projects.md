# 已选网站与项目调整实施计划

**Goal:** 按用户确认的清单更新网站入口与公开项目，并同步线上。

**Architecture:** site-links.ts 继续作为公开入口唯一数据源。SiteDirectory 按已有映射展示新增 projects 分组；维护状态和贡献说明使用现有 description 展示，沿用全部视觉样式。

**Tech Stack:** Next.js、React、TypeScript、Node 内置测试、systemd、Nginx。

## 约束

- 仅展示已选项目，不修改 count 或自用知识系统。
- count 的网站与项目都注明暂未维护；Stronghold 注明 Fork 和用户提供的 6 次上游合并。
- 不引入依赖，不提交当前工作区的其它改动，不输出凭据。

## 执行步骤

- [x] 修改 src/lib/site-links.ts：扩展 SiteCategory，新增 projects 分组，增加 covenant 和五个公开仓库，修正 count 的 HTTPS、名称及状态，移除失效 projects 子域名。
- [x] 更新 src/components/site-directory.tsx 搜索提示为“搜索站点、工具与项目”；现有搜索自动覆盖新增描述。
- [x] 更新 README.md 分组和配置说明，更新 tests/site-links.test.mjs、scripts/check-site.mjs 原有目的地检查，避免继续要求失效域名或 HTTP count。
- [x] 运行 npm test、npm run lint、npm run type-check、npm run build；检查源数据与渲染 HTML 符合用户名单和状态说明。
- [x] 通过严格主机密钥校验的 SSH 读取既有发布脚本，上传无私密文件的源码包，在独立目录构建并预览。
- [x] 预览通过后切换 personal-homepage.service，验证正式 HTTPS 页面、全部路由及缓存变体；失败恢复上一目录。
- [x] 更新 docs/deployment.md，报告线上结果。
