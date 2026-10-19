# 已选网站与项目内容调整

用户已在 2026-10-18 确认展示范围。本次沿用现有首页、卡片、搜索及响应式布局，不重新设计视觉样式。

- 网站入口：打牌计分、扫雷、简历、卫戍协议、精灵捕捉计数器。保留现有内容与社交链接。
- 新增“项目与代码”分组：Stronghold-Protocol、qq_bot、ScoreCard、count、MineSweeper，链接各自的公开 GitHub 仓库。
- Stronghold-Protocol 明示 Fork、上游贡献者、6 次合并；贡献信息由用户提供。
- count 网站和代码项目均注明暂未维护，有需要可联系站主。只改主页展示，不维护 count 应用。
- 移除无法解析的 projects.w2321.top 入口；真实项目由新分组展示。
- 不展示 KnowQuest、MaaAssistantArknights、SmartStudyAssistant、星辰商城和其它课程实验项目。
- 不将项目盘点中的私有仓库信息复制到公开页面。

实施文件：src/lib/site-links.ts、src/components/site-directory.tsx 的搜索提示文案、README.md、现有测试和线上检查脚本。沿用已有数据驱动分组，不增加依赖。

验证：运行已有测试、类型检查、ESLint 和生产构建；检查实际渲染页面包含新增网站和五个仓库，排除未选入口；发布后检查正式域名及不同压缩缓存变体。

发布：使用新的独立发布目录，沿用现有 www 用户和 systemd 服务，仅切换个人主页；保留上一版本供失败回退。
