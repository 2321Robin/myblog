# 主题调研：Harness（Agent 外壳）横评（截至 2026-10-20）

> 所有价格均为查询时点（2026-10-20）官方页面口径，币种以页面标注为准；标注"未核实"的条目禁止直接引用为事实。

## 一、Harness 清单总表

| 名称 | 厂商 | 形态 | 绑定模型 | MCP / Skills / Hooks / 规则文件 | 价格（口径） | 平台 | 国内可用性 |
|---|---|---|---|---|---|---|---|
| Claude Code v2.1.303 | Anthropic | 终端 CLI / IDE 扩展 / 桌面 App / Web（claude.ai/code）/ 移动 | 默认 Claude（Opus 5.5 等）；可接 Bedrock、Google Cloud Agent Platform（原 Vertex）、Microsoft Foundry、自定义 `ANTHROPIC_BASE_URL` 网关 | MCP✓ Skills✓ Hooks✓ Subagents✓；CLAUDE.md（兼容 AGENTS.md）+ 自动记忆 | 所有付费档含：Pro $20/月（年付 $17）、Max $100 起、Team $20–125/席、Enterprise（USD，claude.com/pricing） | macOS/Windows/Linux/WSL | 需订阅+网络；可改 base_url 接 GLM/DeepSeek（各有官方指南） |
| Codex CLI v0.163.0（Apache-2.0） | OpenAI | 终端 CLI / IDE 扩展（VS Code/Cursor/Windsurf）/ 桌面 App（codex app）/ 云端（chatgpt.com/codex） | GPT 系列（官方 models 页推荐 gpt-5.5；DevDay 2026 发布 GPT-6.1 Sol）；可指向任意 Chat Completions/Responses 兼容 provider | MCP✓ Skills✓ Hooks✓ AGENTS.md✓ Rules✓ Subagents✓ Worktrees✓ Automations✓ | ChatGPT 订阅（Plus/Pro 等）或 API key；2026 年现价未能核实（openai.com 403） | macOS/Windows/Linux | 可自配第三方兼容端点 |
| Gemini CLI（周更 stable/preview/nightly） | Google | 终端 CLI | Gemini（`-m` 指定；OAuth / Gemini API key / Vertex AI） | MCP✓ GEMINI.md✓ 扩展✓ Skills✓（agentskills.io 收录） | 免费层已于 2026-06-18 转出；付费 API key 仍可用 | macOS/Linux（brew）/npm | 需可达 Google 服务 |
| Antigravity CLI | Google | 终端 CLI + Antigravity 2.0 桌面 App | Gemini 4 Argon（公告原文） | Agent Skills、Hooks、Subagents、Extensions（现称 Antigravity 插件） | 未核实（Google 域名本次不可达） | 未核实 | 未核实 |
| Qwen Code | 阿里 Qwen 团队 | 终端 CLI / 桌面 / VS Code·Zed·JetBrains 插件 / Web UI / IM（微信·飞书·钉钉·TG） | 多协议：Qwen、OpenAI、Anthropic、Gemini 兼容 + Ollama/vLLM 本地 | MCP✓ Hooks✓ SubAgents✓ Agent Teams✓ Auto-Skills✓ | CLI 开源免费；Qwen OAuth 免费档已停（2026-04-15），现走 QwenCloud Token Plan / 百炼 Coding Plan | macOS/Windows/Linux | 国内友好（千问/百炼充值） |
| opencode v2.0.32 | Anomaly（原 SST） | 终端 TUI / 桌面 / IDE 扩展 | 模型无关（任意 provider API key；官方推荐 Zen 精选） | MCP✓ 插件✓ AGENTS.md✓ Skills✓ 自定义命令/工具✓ LSP✓ ACP✓ | 开源免费；Zen 按模型计费 | macOS/Linux/Windows（推荐 WSL） | 可配任意国内模型 |
| crush | Charmbracelet | 终端 CLI | 任意 provider（Anthropic/OpenAI/Gemini/OpenRouter/Bedrock/Moonshot/Z.ai…）；官方 Hyper 订阅 | MCP✓ LSP✓ Agent Skills✓（兼容 .claude/skills）hooks✓ CRUSH.md/AGENTS.md✓ | FSL-1.1-MIT 免费；Hyper 含免费层（订阅制） | macOS/Linux/Windows/Android/BSD | 可配 Moonshot/Z.ai |
| Cursor | Anysphere（2026-08-14 起属 SpaceX/xAI） | IDE / JetBrains 插件 / 云 agent | 自研 Composer 1 / 2.5 + 第三方模型（Claude/GPT/Grok/Gemini 等） | plugins、skills、MCP、rules | Free $0 / Plus $8 / Premium $30 / Super $100 / Ultra $200 / Teams $30+（USD，cursor.com/pricing；用量池与 Grok 共享、每周刷新） | macOS/Windows/Linux | 需国际支付 |
| Devin Desktop（原 Windsurf） | Cognition | IDE / Devin CLI / Devin 云 agent | Devin 系列（现模型清单未核实） | MCP（未核实细节）；原 Cascade 已 EOL | 有免费层；现价未核实 | macOS/Windows/Linux | 未核实 |
| GitHub Copilot | GitHub/微软 | VS Code/JetBrains agent 模式、Copilot CLI、github.com 云端 agent、Agent HQ | Copilot 模型 + 第三方 agent（Claude Code、Codex 等）经 Agent HQ 接入 | MCP✓ Agent Skills✓ AGENTS.md✓ Plan Mode✓ | Free / Pro $10 / Pro+ $39 / Max $100 / Business $19 / Enterprise $39（USD，docs.github.com；AI Credits 制） | VS Code/JetBrains 全平台 | 依赖 github.com 访问 |
| Zed | Zed Industries | 编辑器 Agent Panel + ACP 外部 agent | 自有托管模型/API key/订阅/本地模型；ACP agent（Claude、Codex、Gemini CLI、OpenCode、Copilot、Cursor、Poolside 等）自带模型与计费 | MCP✓（可经 ACP 转发）Skills✓ profiles/instructions✓ | 编辑器免费；外部 agent 不向 Zed 付费；托管模型价未核实 | macOS/Linux/Windows | 可配本地/API |
| Kiro | AWS | IDE（Code OSS）/ CLI / Web / 移动 / Kiro Crew（开源） | 多模型：Auto、GPT-5.6 系列、Claude fable-5.1、opus/sonnet-5.5 + 开源权重（kimi-k2、deepseek-3.2、minimax-m2.5、glm-5、qwen3-coder-next） | MCP✓ Specs✓ Steering✓ AGENTS.md/Skills.md✓ Hooks✓ ACP✓ | 信用点制：Free 50 点 / Pro $20 / Pro+ $40 / Pro Max $100 / Power $200；加购 $0.04/点（USD，kiro.dev/pricing） | 全平台 | Free 档可用开源权重模型 |
| Trae | 字节跳动 | IDE（SOLO 模式）/ Trae Web / trae-agent（开源 CLI） | 未核实清单 | Agent Skills（agentskills.io 收录）；MCP 细节未核实 | 有免费层；国内/国际版价格未核实 | macOS/Windows | 国内版可用 |
| Qoder | 阿里系（页脚 Bright Zenith，有 qoder.cn） | IDE / CLI / 移动 / QoderWake / Cloud Agents | 未公布具体模型 | Marketplace 扩展、Automations | 2 周试用 + credits 订阅；价格未核实 | 桌面/移动 | 有国内站 |
| iFlow CLI（心流） | 阿里心流团队 | 终端 CLI | iFlow 平台多模型（个人免费，媒体口径） | MCP（生态口径） | 个人免费 | 跨平台终端 | 国内友好 |
| CodeBuddy | 腾讯 | IDE + CodeBuddy Code CLI | 未核实（媒体称含混元/DeepSeek） | MCP（媒体口径） | 免费层+订阅（未核实） | 全平台 | 国内友好 |
| Claude Agent SDK | Anthropic | TS/Python 库（封装 Claude Code 二进制） | Claude；仅 API key 认证（禁 claude.ai 登录转售） | 继承 Claude Code 全套（子代理/hooks/MCP/权限/会话） | 按 API 计费 | 跨平台 | 需国际 API |
| OpenAI Agents SDK | OpenAI | Python（JS 版未核实） | 默认 Responses API；可经 LiteLLM/Any-LLM 接第三方 | MCP✓ handoffs/guardrails/sessions/tracing | 开源免费，按模型计费 | 跨平台 | 可接第三方 |

## 二、逐个展开：定位与交互亮点

- **Claude Code**：文档自称"最全形态在终端"，同一能力分布在 terminal/IDE/desktop/browser；2026 年新增桌面 App、云端会话（`claude --cloud`，任务在隔离 VM 克隆仓库跑、关浏览器不停）、`/mobile` 二维码、Routines 定时任务、Channels/Slack/Remote Control 跨设备控制；权限模式 Accept edits/Plan/Auto；OS 级沙箱（macOS Seatbelt、Linux bubblewrap+网络代理白名单，默认关闭）。（code.claude.com/docs/en/overview、/web-quickstart、/sandboxing、/model-config，2026-10-20 查）
- **Codex CLI**：README 强调"本地轻量 agent"，与 IDE 扩展、云端（chatgpt.com/codex）、桌面 app 三形态互补；沙箱默认 read-only，workspace-write 需按 OS 机制（macOS Seatbelt / Linux Landlock+seacomp）审批，另有 full-auto 与 bypass；config.toml 可配任意兼容 provider；`/model`、`-m` 切模型。（github.com/openai/codex、developers.openai.com/codex/sandbox、/codex/models，2026-10-20 查）
- **Gemini CLI → Antigravity CLI**：Google 官方公告（2026-05-19）：6 月 18 日起免费层与 Google One 用户不再由 Gemini CLI 服务，因其"未针对最新模型优化"；Antigravity CLI 用 Go 重写，保留 Skills/Hooks/Subagents/Extensions，主推异步多 agent 工作流，与 Antigravity 2.0 桌面组成"统一 harness"；企业 Code Assist 与付费 API key 用户不受影响。（developers.googleblog.com/en/an-important-update-transitioning-gemini-cli-to-antigravity-cli/，2026-10-20 查；仓库 README 仍周更）
- **Qwen Code**：自 v0.1 起不再同步 Gemini CLI 上游，转为独立多协议 agent 框架；亮点是全形态覆盖（CLI/桌面/编辑器插件/Web UI/IM 入口）与 Agent Teams；README 称评测用 Qwen 3.7 Max、SWE-bench Verified 七版平均 76.4–77.8%。（github.com/QwenLM/qwen-code，2026-10-20 查）
- **opencode**：SST 时期项目，2026 年归 Anomaly 并推 2.0（2026-07 公测，10-16 已到 v2.0.32）；卖点是 provider 无关 + TUI 体验 + ACP/插件/自定义工具全套扩展。（opencode.ai/docs、github.com/anomalyco/opencode、anoma.ly/notes/opencode-2-0，2026-10-20 查）
- **crush**：Charm 的终端 agent，未更名、活跃维护；原生支持 Moonshot/Z.ai 等 provider，Skill 兼容 `.claude/skills` 目录，LSP 可挂语言服务器；模型目录由社区 Catwalk 维护。（github.com/charmbracelet/crush，2026-10-20 查）
- **Cursor**：docs 定位"building ambitious software 的 coding agent"，主打 Plan Mode 与 Composer 自研模型；2026-08-14 并入 SpaceX/xAI 后定价与 Grok 用量池深度绑定。（cursor.com/docs、cursor.com/pricing、x.com/cursor_ai/status/2088249881718919393）
- **Windsurf → Devin Desktop**：Cognition 2026-06-02 经 OTA 把 Windsurf 换牌为 Devin Desktop（保留套餐与配置）；Cascade 2026-07-01 EOL，由 Devin Local/云 Devin 接替；产品逻辑是"本地快、云端久"。（cognition.com/blog：Introducing Devin Desktop 2026-06-02、Devin in Windsurf 2026-04-15、Devin CLI 2026-04-27、Fusion 2026-06-29 与 2026-09-11）
- **GitHub Copilot**：Agent HQ（2025-10-28 Universe 公告）把 Claude Code/Codex/Google 等第三方 agent 纳入统一指挥（Mission Control），付费 Copilot 订阅即可用，不加收；VS Code 加 Plan Mode 与 AGENTS.md；GitHub 设 MCP Registry。（github.blog/news-insights/company-news/welcome-home-agents、docs.github.com/en/copilot/get-started/plans）
- **Zed**：以 ACP（agentclientprotocol.com，类比 LSP）接入外部 agent，官方 Registry 一键装 Claude/Codex/Gemini CLI 等，会话历史可导入；Zed 配置的 MCP 可经 ACP 转发给外部 agent。（zed.dev/docs/ai/external-agents，2026-10-20 查）
- **Kiro**：从"agentic IDE"扩展为 IDE+CLI+Web+移动+Kiro Crew（开源工作区）全家桶，主打 spec-driven development；信用点计费，开源权重模型费率低至 0.05x。（kiro.dev、kiro.dev/pricing，2026-10-20 查）
- **国内三线**：Trae（字节，SOLO 模式+开源 trae-agent）、Qoder（阿里系，IDE/CLI/移动/QoderWake）、CodeBuddy（腾讯）；横向对比见腾讯云开发者社区 2026-08 文章与 JetBrains 中文博客（2026-03-18，插件市场一键接入国产 AI）。iFlow CLI（心流）为阿里系免费终端 agent。（trae.ai、qoder.com、github.com/iflow-ai/iflow-cli、developer.cloud.tencent.com/article/2726398、blog.jetbrains.com/zh-hans/blog/2026/03/18/ai-china）

## 三、形态差异与官方选型建议

1. **终端 vs 云端**：Anthropic 官方口径——云端会话适合"本地没有的仓库、不需频繁干预、探索/提问"，本地适合需要本机环境的工作；云端每任务独立会话+分支，官方明确说这是"免去 worktree 管理"的并行方案，且可 teleport 回终端续跑。（code.claude.com/docs/en/web-quickstart）
2. **本地 vs 云 agent 的分工**：Cognition 官方表述"本地代理让你更快，云代理在你不在时完成工作"；Devin CLI 的卖点即"Start Local, Hand Off to the Cloud"。（cognition.com/blog，2026-04-15/04-27）
3. **多 harness 编排**：GitHub 把"选外壳"升级为"指挥多外壳"——Mission Control 跨 GitHub/VS Code/移动/CLI 统一派发与治理第三方 agent。（github.blog，2025-10-28）
4. **统一 harness 趋势**：Google 称 Antigravity 是"面向 2026 多 agent 复杂度的 agent-first 平台"，一个外壳覆盖 CLI/桌面/云；Kiro 同样以多形态+同一信用点口径打包。（developers.googleblog.com，2026-05-19；kiro.dev）
5. **适合人群素材**（可从上述官方口径归纳，勿超出）：重度终端用户/开源爱好者 → Claude Code/Codex/opencode/crush/Qwen Code；IDE 重度用户 → Cursor/Copilot/Zed/Kiro；云端并行/托管 → Codex cloud、claude.ai/code、Devin、Kiro Web、Agent HQ；企业治理 → Agent HQ/Kiro Enterprise/Claude Enterprise（managed permissions、allowedProviders）。

## 四、2026 年重要动态时间线（均为公告/官方页日期）

- 2025-10-28：GitHub 发布 Agent HQ（背景事件）。（github.blog）
- 2026-03-18：JetBrains 中文博客宣布插件市场接入 Qoder/TRAE/CodeBuddy 等。（blog.jetbrains.com/zh-hans）
- 2026-04-15：Qwen Code 的 Qwen OAuth 免费档停止。（qwenlm.github.io/qwen-code-docs auth 页）
- 2026-04-27：Devin CLI 发布（本地起步、移交云端）。（cognition.com/blog）
- 2026-05-19：Google 公告 Gemini CLI → Antigravity CLI，2026-06-18 生效（免费层/Google One）。（developers.googleblog.com）
- 2026-06-02：Windsurf OTA 更名 Devin Desktop；2026-07-01 Cascade EOL。（cognition.com/blog）
- 2026-06-30 / 07-15：腾讯元宝、豆包、千问相继下线网页端"智能体"（媒体关联 7 月中生效的 AI 拟人互动新规）；媒体指出企业侧 Agent 投入未减。（36kr.com/p/3884179708787593；finance.sina.com.cn 2026-07-04）
- 2026-07：opencode 2.0 公测（Anomaly）。（anoma.ly/notes/opencode-2-0）
- 2026-08-14：Cursor 官宣并入 SpaceX/xAI。（x.com/cursor_ai/status/2088249881718919393）
- 2026-09-29：OpenAI DevDay 2026：Codex CLI 双向语音、`/agents` 多任务视图、GPT-6.1 Sol、"Dots" 常驻 agent 等 20+ 公告。（openai.com/index/devday-2026-recap）
- 2026-10：Claude Code v2.1.303、Codex CLI v0.163.0 在 npm 发布（registry.npmjs.org，2026-10-20 查）；Codex CLI 引入 git worktree 工具之说仅见第三方（tech-insider.org），未采信。

## 五、争议与未核实点

1. **Codex/ChatGPT 2026 年订阅价**：openai.com 与 developers.openai.com 直连 403，仅核实"ChatGPT 订阅或 API key 两种认证"，Plus/Pro 现价未能复核。
2. **模型名以官方页为准**：Codex models 页推荐 gpt-5.5，DevDay 又宣布 GPT-6.1 Sol，两者时间线关系未核实；"Codex CLI 0.162 默认 GPT-6.1 Sol"仅第三方来源，未采信。
3. **Antigravity CLI**：定价、平台、是否开源未核实（Google 域不可达）；"Gemini 4 Argon"仅出自迁移公告转述。
4. **Cursor 并入 SpaceX**：官方 X 帖标题+搜索聚合，细节（交易结构、Cursor 品牌存续）未从官网长文核实。
5. **国产三线（Trae/Qoder/CodeBuddy）**：模型清单与价格均未从官网核实（官网为营销页或无法访问）；知乎/CSDN 等对比文仅作线索不作结论。
6. **Claude Code 桌面 App、Routines、Channels** 等新功能只见于文档索引，发布公告与日期未核实。
7. **Gemini CLI 是否具备子代理/并行会话**：README 未提，未核实。
8. **Zed 托管模型价格、Copilot "Agent HQ 已 GA 到所有付费档"**：仅有公告与计划页，逐档可用性未逐条核实。

## 六、文章结构素材建议（只建议素材，不写正文）

- 开头钩子：2026 年三个"外壳易主/更名"事件（Windsurf→Devin Desktop、Gemini CLI→Antigravity、Cursor→SpaceX）说明"harness 比模型更不稳定"，选外壳=选生态。
- 主线用"形态"切分（终端/IDE/网页+云），每形态给 2–3 个代表 + 官方选型原话（第三节素材 1–4）。
- 扩展生态矩阵一节：MCP（几乎全员）→ Skills（agentskills.io 收录 40+ 客户端，含 Codex/Copilot/VS Code/Cursor/Gemini CLI/Kiro/Trae）→ ACP（Zed、Kiro 兼容）→ AGENTS.md（Codex/Copilot/opencode/crush/Qwen 等通用）；论点：扩展标准正在"跨外壳通用"，换壳成本在下降。
- 国内可用性一节：两条合法路径——国产外壳（Qwen Code/iFlow/Trae/Qoder/CodeBuddy）或通用外壳+国产模型（z.ai 一键脚本接 Claude Code；DeepSeek Anthropic 兼容端点 `api.deepseek.com/anthropic`，opus→v4-pro、haiku/sonnet→flash 映射）；注意 Qwen OAuth 免费档已停。
- 权限/沙箱对比小节：Codex 默认沙箱+审批 vs Claude Code 默认权限模式+可选 OS 沙箱 vs 云端托管 VM（Anthropic/Devin/Kiro Web），可作为"外壳的安全责任"话题。
- 结尾：把"选择 harness"映射回前文定义（主循环/上下文/权限/编排），指出 2026 的分化点在"并行与托管"而非"单轮问答"。

## 七、延伸阅读链接（官方优先）

- Claude Code 文档总览/模型/沙箱/Web/SDK：https://code.claude.com/docs/en/overview 、/model-config 、/sandboxing 、/web-quickstart 、/agent-sdk/overview
- Claude 定价：https://claude.com/pricing
- Codex 仓库与文档：https://github.com/openai/codex 、https://developers.openai.com/codex/sandbox 、https://developers.openai.com/codex/models
- Gemini CLI → Antigravity 公告：https://developers.googleblog.com/en/an-important-update-transitioning-gemini-cli-to-antigravity-cli/ ；仓库：https://github.com/google-gemini/gemini-cli
- Qwen Code：https://github.com/QwenLM/qwen-code ；认证文档：https://qwenlm.github.io/qwen-code-docs/en/users/configuration/auth/
- opencode：https://opencode.ai/docs/ ；2.0 说明：https://anoma.ly/notes/opencode-2-0
- crush：https://github.com/charmbracelet/crush
- Cursor：https://cursor.com/docs 、https://cursor.com/pricing
- Devin/Cognition 博客：https://cognition.com/blog
- Agent HQ 公告：https://github.blog/news-insights/company-news/welcome-home-agents ；Copilot 计划：https://docs.github.com/en/copilot/get-started/plans
- Zed 外部 agent：https://zed.dev/docs/ai/external-agents ；ACP：https://agentclientprotocol.com/
- Agent Skills 标准：https://agentskills.io/ （客户端列表见首页）
- Kiro：https://kiro.dev/ 、https://kiro.dev/pricing
- GLM 接入 Claude Code：https://docs.z.ai/devpack/tool/claude ；DeepSeek Anthropic 兼容：https://api-docs.deepseek.com/guides/anthropic_api
- OpenAI Agents SDK：https://openai.github.io/openai-agents-python/ ；DevDay 2026：https://openai.com/index/devday-2026-recap
- iFlow CLI：https://github.com/iflow-ai/iflow-cli ；JetBrains AI China：https://blog.jetbrains.com/zh-hans/blog/2026/03/18/ai-china
