# 文章选题备忘

> 写作分支:`writing/articles`。这里只记录选题,不动笔;成文后放 `src/content/posts/*.mdx`(metadata 格式参考 `ai-model-agent-harness.mdx`)。

## 选题清单

### 1. 核心概念:AI、模型、Agent、Harness

- 解释这些概念分别是什么
- 它们的由来(怎么被提出、命名的)
- 概念之间的演变过程与相互关系

### 2. AI 使用生态:Skills、MCP、Hooks、插件、子智能体、指令

- 各个概念的解释:是什么、解决什么问题
- 怎么使用:典型用法与实践
- 它们之间的关系与配合方式

### 3. 个人经历:使用 Agent 的感悟

- 我自己使用 agent 的真实经历
- 踩过的坑与经验总结
- 对人机协作方式的思考

### 4. 新手引导:怎么开始用 Agent

- 面向没用过 agent 的读者,给一条从零开始的入门路径
- 第一个 agent 怎么选、怎么装、怎么把需求说清楚
- 常见误区与边界:权限、数据安全、费用预期

### 5. 模型横评:不同模型的区别与擅长领域

- 主流模型的定位差异(以动笔时点为准,时效性强)
- 按擅长领域对比:编程、画图、写作、长文本等
- 怎么按任务选模型,多模型混合使用的思路

### 6. Harness 横评:不同的 Agent 外壳

- 主流 harness 的定位与差异(终端 / IDE / 网页等形态)
- 各自的交互方式、扩展机制、适合的人群
- 与选题 1 的概念篇呼应,偏实操对比

### 7. 我的 AI 工具箱

- 日常在用的 AI 相关工具盘点(agent、模型服务、周边工具)
- 每个工具解决什么问题、为什么留下它
- 工具之间怎么组合成自己的工作流

## 状态

- [x] 选题 1:二稿完成(`ai-model-agent-harness.mdx`),已发布,配图与封面已生成并接入
- [x] 选题 2:初稿完成(`agent-usage-ecosystem.mdx`,2026-10-20),已过外审并修订;**配图已全部到手并插入正文(3 张信息图 + 封面,metadata.cover 已补)**,待作者终审后发布
- [ ] 选题 3:未动笔——**需要作者提供**:真实使用经历、踩过的坑、人机协作的思考素材
- [x] 选题 4:初稿完成(`agent-getting-started.mdx`,2026-10-20),已过两轮外审并修订(第二轮见 `docs/reviews/three-articles-review-2026-10-20.md`),待作者审
- [x] 选题 5:初稿完成(`model-landscape-2026.mdx`,2026-10-20),已过两轮外审并修订(第二轮见 `docs/reviews/three-articles-review-2026-10-20.md`),待作者审(时效性强,信息截至 2026-10-20)
- [x] 选题 6:初稿完成(`harness-comparison.mdx`,2026-10-20),已过两轮外审并修订(第二轮见 `docs/reviews/three-articles-review-2026-10-20.md`),待作者审
- [ ] 选题 7:未动笔——**需要作者提供**:日常在用的 AI 工具清单及留下的理由

## 初稿配套资料(2026-10-20)

- 调研与写作计划:`docs/research/<slug>-research.md`(事实与来源)、`docs/research/<slug>-plan.md`(大纲、配图清单与提示词要点)
- 审查与处置记录:`docs/reviews/four-drafts-review-2026-10-20.md`
- 三篇复审记录:`docs/reviews/three-articles-review-2026-10-20.md`(26 项 P1 + 5 项 P2,已于 2026-10-20 全部按意见修订正文;配图仍未生成,发布前需落实)
- 各篇配图状态(**实时更新**:图片到手即插入正文并在此同步,规则见 `docs/writing-guide.md` 第四节):
  - 生态篇 `agent-usage-ecosystem`:3 张信息图 + 封面均已插入正文,`metadata.cover` 已补,PNG 已压缩为 WebP,待终审后发布;
  - 入门篇 `agent-getting-started`:正文 6 张实操截图已插入;封面已到手(`cover.webp`,1448×1086,31 KB),`metadata.cover` 已补,列表缩略图与文章分享图均指向封面;
  - harness 篇 `harness-comparison`、模型篇 `model-landscape-2026`:第二轮外审的正文意见已全部修订;**配图仍未生成**——图像生成接口 2026-10-20 返回 429(账号组耗尽),重试仍失败,待接口恢复后按 `docs/research/*-plan.md` 的配图清单生成,正文保留 `{/* 配图n(待生成) */}` 占位,封面未出(metadata 未写 cover);
  - 概念篇 `ai-model-agent-harness`:已发布,配图与封面齐备。
