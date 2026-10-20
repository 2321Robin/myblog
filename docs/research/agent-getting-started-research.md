# 主题调研：AI Agent 新手入门（截至 2026-10-20）

> 查询时点均为 2026-10-20。标注"官方页已核"= 本次直接抓取官方页面原文；"搜索摘要"= 经搜索获得的官方页面片段，未能直接打开；"社区共识"= 无官方出处。

## 一、候选产品清单

| 产品 | 形态 | 官方获取方式/安装 | 免费额度 | 订阅价格（2026-10-20 查询口径） | 国内可用性 |
|---|---|---|---|---|---|
| Claude（claude.ai / Claude Code） | 网页对话（含多步任务、Artifacts）+ 终端 agent | Claude Code 官方安装（官方页已核）：macOS/Linux `curl -fsSL https://claude.ai/install.sh \| bash`；Windows PowerShell `irm https://claude.ai/install.ps1 \| iex`；`brew install --cask claude-code`；`winget install Anthropic.ClaudeCode`；npm `npm install -g @anthropic-ai/claude-code`（需 Node 22+，文档警告勿用 sudo）。来源：code.claude.com/docs/en/setup | 免费档可网页对话，无 Claude Code | 官方页已核（USD）：Pro $17/月（年付 $200 一次付）或 $20/月，含 Claude Code，约 5 倍免费档用量/5 小时；Max 从 $100/月（5x 或 20x Pro，仅月付，含 $100–$200 API 额度）；Team 标准 $20–25/座、Premium $100–125/座 | 大陆无法直接访问与付费，需国际支付方式（社区共识；本次抓取 platform.claude.com 文档被重定向到 app-unavailable-in-region 页，与该口径一致） |
| OpenAI（ChatGPT / Codex） | 网页/App 对话 + agent 模式（自主浏览、虚拟电脑）；Codex CLI/IDE/云端 | Codex CLI 官方（GitHub 已核）：`npm install -g @openai/codex`；`brew install --cask codex`；`curl -fsSL https://chatgpt.com/codex/install.sh \| sh`（Win PS 用 install.ps1）；登录用 ChatGPT 账号（Plus/Pro/Business/Edu/Enterprise） | 免费档可对话，agent 模式限额极小（未能核实具体数字） | 搜索摘要（chatgpt.com/pricing，官方页拒抓 403）：Free $0；Go $8/月；Plus $20/月；Pro 拆为 $100/$200/$500 三档；Business $25/人/月（年付 $20） | 大陆无法直接访问与付费，需国际支付方式（社区共识） |
| Google（Gemini app / Antigravity CLI） | 网页/App 对话 + 终端 agent | Gemini CLI 官方 README 已核：`npx @google/gemini-cli` 或 `npm install -g @google/gemini-cli`、`brew install gemini-cli`。注意：官方 README 明示 2026-06-18 起 Gemini CLI 对免费档与 Google One 用户由 Antigravity CLI 接替；Antigravity CLI 安装（官方文档搜索摘要）：`curl -fsSL https://antigravity.google/cli/install.sh \| bash` | Gemini app 免费可用有速率限制；CLI 免费档约 250 请求/天（Pro 订阅 1,500、Ultra 2,000，ai.google.dev 速率页搜索摘要） | 搜索摘要（one.google.com / gemini.google/subscriptions，官方页超时未直开）：AI Plus $4.99/月；AI Pro $19.99/月；AI Ultra $99.99/月（自 $249.99 下调） | 大陆无法直接访问与付费，需国际支付方式（社区共识） |
| DeepSeek | 网页/App 对话（deepseek.com，含网页版 chat.deepseek.com、Harness 桌面端）；API 按量 | 官网直接注册（官方页已核，产品线：App/网页版/Harness/API）；API 文档 platform.deepseek.com | 聊天应用未见任何订阅收费（官方页未列，社区共识免费） | 无个人订阅；API 按量（官方页已核，USD）：deepseek-flash 输入缓存命中 $0.003–0.006/百万、未命中 $0.15–0.3/百万、输出 $0.6–1.2/百万（错峰为半价，峰时为工作日 UTC 01–04、06–10 点）；v4-pro 输出 $1.98–3.96/百万；上下文 1M | 大陆可直接访问；支付币种口径未核实（中文定价页超时未打开） |
| Qwen/通义（chat.qwen.ai / Qwen Code） | 网页/App 对话 + 终端 agent | Qwen Code（阿里云官方文档已核）：脚本安装 `bash -c "$(curl -fsSL https://qwen-code-assets.oss-cn-hangzhou.aliyuncs.com/installation/install-qwen.sh)" -s --source bailian`（Windows 有 install-qwen.bat）；另有开源版 `npm install -g @qwen-code/qwen-code`（GitHub 搜索摘要）；启动后 `/auth` 选：Token Plan 个人版/团队版、Coding Plan（固定月费）、按量计费 | 网页端免费可用，限额未能核实 | Coding/Token Plan 具体价格未能核实（百炼文档未列数字） | 大陆可直接访问，人民币支付（百炼） |
| 智谱 GLM（z.ai / bigmodel.cn） | 网页对话 + GLM Coding Plan 订阅（配 CLI） | 官方文档已核：套餐 Lite/Pro/Max，每 5 小时积分 2,000/12,000/28,000、周积分 10,000/60,000/140,000；含 GLM-5.3 与 GLM-5.3-Flash；官方支持 Claude Code、Codex、OpenCode、Cline 等"20+ Agent Tools"；非高峰（工作日 14–18 点 UTC+8 之外）积分 5 折 | 网页对话免费可用，限额未能核实 | 海外版（docs.z.ai 已核）：Lite 起 $18/月；国内版购买页 bigmodel.cn/glm-coding 为 JS 页未能直读，搜索口径：2026-02 调价为 49/149/400 元/月，2026-07-30 改积分制后 Pro 约 538 元/月（非官方直核，写作时建议标注"以购买页为准"） | 大陆可直接访问，人民币支付 |
| Kimi（月之暗面） | 网页/App 对话 + Kimi Code（CLI/VS Code/桌面端） | 官方文档已核：Kimi Code 含于会员；API 平台 platform.kimi.com 按量充值 | 聊天免费可用，限额未能核实 | 官方页已核（人民币，连续包月/年付折合月价）：Go ¥49（¥39，无 Kimi Code）；Plus ¥99（¥79，含 Kimi Code）；Pro ¥199（¥159）；Max ¥699（¥559）；Ultra ¥1,399（¥1,119）；加油包单次最低 ¥25。API（官方页已核）：kimi-k3 输入命中 ¥2/未命中 ¥20、输出 ¥100/百万 | 大陆可直接访问，人民币支付 |
| 字节豆包 / 扣子（coze.cn） | App 对话；扣子为低代码 bot/agent 搭建平台 | 官网直接下载/注册（豆包 App、coze.cn） | 基础免费（社区共识） | 具体计费未能核实 | 大陆可直接访问，人民币支付 |
| 腾讯元宝（yuanbao.tencent.com） | App/网页对话（混元模型，官网搜索摘要称已接入 Hy4 preview、Agent 能力升级；官网本身仅极简页，官方页已核但信息少） | 官网/应用商店下载 | 基础功能免费（第三方口径，非官方页直核） | 未见个人订阅收费（未能核实） | 大陆可直接访问，人民币支付 |

**API 按量 vs 订阅的区别**：订阅=固定月费换"5 小时窗口+周额度"（Claude/Kimi/GLM/ChatGPT 皆此模式，各家官方文档一致）；API=按 token 计费，可精确到单次成本（Kimi 官方文档示例：简单请求约 0.03 元、复杂多步任务约 1.6 元——官方页已核，可直接引用）。
**Token 官方解释口径**：OpenAI/Anthropic 均按"模型把文本切成 token 计费/计长"解释；英文约 1 token≈4 字符的官方口径（help.openai.com 文章对抓取返回 403，未能直核原文，写作时建议链接而非引用）。
**新手一个月花费量级（估算，非官方数据）**：纯网页对话 0 元起步；轻中度 CLI 用量选国内订阅 ¥99–199/月（Kimi Plus/Pro、GLM Lite/Pro 档）；国际产品 Plus $20/月≈¥145（按 7.2 汇率估算，需外卡）；API 按量轻用每月几元到几十元人民币（依据 DeepSeek 错峰价与 Kimi 官方单次成本示例推算）。

## 二、需求表达与安全边界的官方依据

**怎么把需求说清楚（官方出处）**
- Anthropic 官方平台文档《Prompt Engineering Overview》（docs.claude.com / platform.claude.com，本次抓取被地区重定向，要点为该指南长期稳定的目录）：清晰直接、给示例、给上下文、让模型先思考（think/plan）、用结构化标签。
- Claude Code 官方 Best Practices（code.claude.com/docs/en/best-practices，官方页已核，可直接引用）：
  - "The more precise your instructions, the fewer corrections you'll need"；"Reference specific files, mention constraints, and point to example patterns"。
  - 推荐工作流：Explore → Plan → Implement → Commit；用 plan 模式"reads files and answers questions without making changes"；"If you could describe the diff in one sentence, skip the plan"。
  - "Course-correct early"："The best results come from tight feedback loops"；纠正两次以上就 /clear 重开。
  - "Run /clear between unrelated tasks"；"LLM performance degrades as context fills"。
  - "Give Claude a check it can run: tests, a build, a screenshot to compare"。
  - 大任务拆步：先让 Claude 采访你写 SPEC.md，再新会话执行；"Test on a few files, then run on all of them"。
- Anthropic《Building Effective Agents》（anthropic.com/engineering/building-effective-agents，官方页已核，2024-12 发布）："finding the simplest solution possible, and only increasing complexity when needed"；agent 自主性带来 "higher costs, and the potential for compounding errors"；要求设停止条件、沙盒测试、"human review remains crucial"。

**权限与安全（Claude Code 官方文档，官方页已核：code.claude.com/docs/en/permissions）**
- 六种权限模式：`default`（每工具首次使用询问）、`acceptEdits`（自动接受工作目录内文件编辑）、`plan`（只读探索不改文件）、`auto`（免常规询问，但每个 shell/网络动作先经后台分类器核查）、`dontAsk`（一律拒绝需询问项）、`bypassPermissions`——官方原话警告 "Only use this mode in isolated environments like containers or VMs"。
- Manual 模式下默认需批准的：所有 shell 命令（除内置只读集 ls/cat/grep 等）、文件修改（"don't ask again" 仅到会话结束）、WebFetch/WebSearch。
- 沙箱："OS-level enforcement that restricts shell commands' filesystem and network access"；官方建议"Use both for defense-in-depth, since sandbox restrictions still apply even if a prompt injection bypasses Claude's decision-making"。

**数据边界（隐私）**
- Anthropic《Consumer Terms》（anthropic.com/legal/consumer-terms，官方页已核）：消费者对话默认可用于训练——"may use Materials ... including training our models, unless you opt out of training through your account settings"；即使退出，点过赞/踩（Feedback）的对话和被安全标记的对话仍可用于训练。要点：**订阅前/使用前去设置里检查训练开关**。
- OpenAI 官方口径（help.openai.com 与政策页均拒绝抓取 403，未能直核原文）：公开口径为 ChatGPT 消费版对话默认可用于训练、可在"数据控制"中关闭；API 数据默认不用于训练。写作时建议给链接并标注"以官方页为准"。
- 敏感数据注意：各 CLI 会读写本地文件并执行命令（官方文档口径见上），身份证件/密钥/客户数据不应随手喂给 agent——此条为"作者观点+官方权限文档推论"，非官方原话。

## 三、常见误区清单（附出处）

1. **一次丢超大任务、期望一口气全自动完成**——Anthropic agents 指南：自主链越长错误越会"compounding"，从最简方案开始（官方）。Claude Code 官方建议大任务先出 SPEC、分步执行（官方）。
2. **不复核产出就直接用**——"human review remains crucial"（Anthropic 官方）；给 agent 一个能自动跑的检查（测试/构建/截图对比）形成闭环（Claude Code 官方）。
3. **把对话窗口当数据库/长期记忆**——官方建议不相关任务间 `/clear`、上下文变长性能下降（Claude Code 官方）；跨会话事实应写进 CLAUDE.md/项目文件而非指望聊天记录（官方文档口径，措辞可自拟）。
4. **在重要环境里乱开免询问模式**——`bypassPermissions` 官方原话仅限容器/VM 隔离环境；沙箱+权限"defense-in-depth"（Claude Code 官方）。
5. **没备份就让 agent 改文件/跑命令**——官方权限文档显示文件修改默认询问，但接受编辑后即自动改盘；git/备份先行是社区共识（非官方原话）。
6. **以为订阅=无限量**——各家官方口径均为 5 小时窗口+周额度（Claude/Kimi/GLM 官方页已核）；ChatGPT agent 模式 Plus 仅 40 条/月（官方帮助中心搜索摘要）。
7. **对费用没有预期**——API 按 token 计费与订阅是两套体系；Kimi 官方示例复杂多步任务约 ¥1.6/次，DeepSeek 错峰半价（官方页已核）；建议先订阅后按需 API（作者观点）。
8. **不看隐私默认设置**——Anthropic 消费者条款默认训练可退出（官方已核）；OpenAI 需自查数据控制（未能直核原文）。

## 四、争议与未核实点

- **OpenAI 定价细节**：官方页对抓取全部返回 403，Pro 拆档 $100/$200/$500 与 Go $8 来自官方页搜索摘要，发布前建议人工再开一次 chatgpt.com/pricing 核对。
- **OpenAI agent 模式限额（Plus 40 条/月等）**：来自官方帮助中心文章片段，抓取被拒，数字可能随时间调整。
- **Google AI 档位（Plus $4.99/Pro $19.99/Ultra $99.99）与 CLI 免费档 250/天**：官方页超时，来自搜索摘要与第三方聚合（CloudZero 等）；Ultra 2025 年首发价 $249.99、后下调的说法也来自第三方。
- **GLM Coding 国内版现价**：官方购买页为 JS 动态页未能直读；49/149/400 与 538 元/月来自搜索结果，且 2026-07-30 刚改积分制，价格口径最不稳定，写作时建议只给"Lite 起步、以购买页为准"。
- **智谱/DeepSeek/Qwen 国内 API 的人民币计价与支付方式**：中文定价页超时未打开，未能核实（Kimi 为明确人民币，已核）。
- **豆包、扣子、元宝的免费/付费细则**：官方页无定价说明或为极简页，均未能核实。
- **国内可用性表述**：Claude/ChatGPT/Gemini 需特殊网络与外卡属社区共识，官方从未正面声明大陆区政策，文章措辞建议用"无法直接访问/注册"而非绝对化断言。

## 五、文章可用的结构素材建议（只列素材）

- 开篇锚点：先分清"网页对话里的一次性 agent 能力（ChatGPT agent 模式、Claude 网页多步任务）"与"本地 CLI agent（Claude Code、Codex、Antigravity、Qwen Code、Kimi Code）"两条入手路径——第 6 项调研结论：无编程背景优先网页 agent（零安装、免费档），CLI 留给愿意开终端的读者（依据：各家免费档现状，均官方已核）。
- "第一个 agent 怎么选"决策素材：大陆可直接付费→Kimi/智谱/Qwen/DeepSeek；有外卡+想用最主流→ChatGPT Plus 或 Claude Pro；纯白嫖练手→DeepSeek/豆包/元宝网页端。
- 安装演示素材：Claude Code 一行命令（curl/PowerShell）+ 首次运行的权限询问界面描述（官方 setup 与 permissions 文档）。
- "怎么把需求说清楚"可引用金句（官方已核）："The more precise your instructions, the fewer corrections you'll need"、Explore→Plan→Implement→Commit、"Give Claude a check it can run"。
- 费用预期素材：Kimi 官方单次成本示例（¥0.03 简单 / ¥1.6 复杂）、DeepSeek 错峰半价机制、各家 5 小时窗口规则。
- 安全叙事素材：Claude Code 权限模式表+沙箱原话、Anthropic 默认训练可退出条款、`bypassPermissions` 官方警告。

## 六、延伸阅读链接（官方文档优先）

- Claude Code 安装与要求：https://code.claude.com/docs/en/setup
- Claude Code 权限模式与批准机制：https://code.claude.com/docs/en/permissions
- Claude Code 官方最佳实践：https://code.claude.com/docs/en/best-practices
- Claude 订阅定价页：https://claude.com/pricing
- Anthropic Consumer Terms（训练与退出条款）：https://www.anthropic.com/legal/consumer-terms
- Anthropic Building Effective Agents：https://www.anthropic.com/engineering/building-effective-agents
- Codex CLI（开源仓库与安装）：https://github.com/openai/codex
- ChatGPT 定价：https://chatgpt.com/pricing ；agent 模式帮助：https://help.openai.com/en/articles/11752874-chatgpt-agent
- Gemini CLI（README，含迁移到 Antigravity 说明）：https://github.com/google-gemini/gemini-cli
- Antigravity CLI 安装：https://antigravity.google/docs/cli/install
- Google AI 订阅：https://one.google.com/about/google-ai-plans ；Gemini API 速率：https://ai.google.dev/gemini-api/docs/rate-limits
- DeepSeek API 定价：https://api-docs.deepseek.com/quick_start/pricing ；官网：https://www.deepseek.com/
- Qwen Code（阿里云百炼文档）：https://help.aliyun.com/zh/model-studio/qwen-code ；开源仓库：https://github.com/qwenLM/qwen-code
- 智谱 GLM Coding（国内文档）：https://docs.bigmodel.cn/cn/coding-plan/overview ；（海外 z.ai）：https://docs.z.ai/devpack/overview
- Kimi 会员价格：https://www.kimi.com/help/membership/membership-pricing ；Kimi Code 权益：https://www.kimi.com/code/docs/kimi-code/membership.html ；API 定价：https://platform.kimi.com/docs/pricing/chat
- 扣子：https://www.coze.cn ；腾讯元宝：https://yuanbao.tencent.com
