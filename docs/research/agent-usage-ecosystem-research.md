# 主题调研：AI 使用生态——Skills、MCP、Hooks、插件、子智能体、指令（截至 2026-10-20）

> 为《AI、模型、Agent、Harness》续篇准备的事实调研。每条关键事实附来源 URL 与日期；可信度：高=一手官方来源；中=二手/社区来源；未能核实=未找到可靠来源，文中不得作为事实使用。

## 一、关键事实清单

| 事实 | 日期/口径 | 来源 | 可信度 |
| --- | --- | --- | --- |
| Anthropic 发布开放标准 MCP（Model Context Protocol），首批合作：Block、Apollo（企业）与 Zed、Replit、Codeium、Sourcegraph（工具） | 2024-11-25 | https://www.anthropic.com/news/model-context-protocol | 高（官方，页面标注 Nov 25, 2024） |
| MCP 采用 client/server 架构：Host（AI 应用）为每个 Server 建一个 Client；数据层基于 JSON-RPC 2.0，传输层支持 stdio 与 Streamable HTTP | 官方架构文档（现行） | https://modelcontextprotocol.io/docs/learn/architecture | 高 |
| MCP 服务器三大原语：tools（可执行函数）、resources（上下文数据）、prompts（交互模板）；客户端原语 elicitation（向用户追问）；sampling/logging 自 2026-07-28 版起标记弃用 | 现行规范 | https://modelcontextprotocol.io/docs/learn/architecture | 高 |
| MCP 规范版本演进：2024-11-05 → 2025-03-26（OAuth 2.1 授权框架、Streamable HTTP 取代 HTTP+SSE、工具注解、音频）→ 2025-06-18（elicitation、结构化工具输出、移除 JSON-RPC batching、OAuth 资源服务器分级）→ 2025-11-25 → 2026-07-28（现行；无状态 `server/discover` 发现机制） | 版本号即日期 | https://modelcontextprotocol.io/specification/versioning ；各版 changelog：/specification/2025-03-26/changelog、/specification/2025-06-18/changelog | 高（2025-11-25 的具体变更内容未核对） |
| OpenAI 宣布采用 MCP，先落地于 Agents SDK（Responses API、ChatGPT 桌面端随后） | 2025-03-26 | https://openai.github.io/openai-agents-python/mcp ；https://www.techrepublic.com/article/news-openai-anthropic-model-context-protocol | 高（官方文档+媒体双源） |
| Google DeepMind 宣布 Gemini 支持 MCP；Google I/O 落地 Gemini API SDK 支持 | 2025-04-09 宣布；2025-05-20 落地 | https://techcrunch.com/2025/04/09/google-says-itll-embrace-anthropics-standard-for-connecting-ai-models-to-data ；https://blog.google/innovation-and-ai/models-and-research/google-deepmind/google-gemini-updates-io-2025 | 高 |
| Microsoft 在 Build 2025 宣布 Windows 11 原生 MCP 支持（应用可作 MCP 服务器）与 Windows AI Foundry | 2025-05-19 | https://blogs.windows.com/windowsdeveloper/2025/05/19/advancing-windows-for-ai-development-new-platform-capabilities-and-tools-introduced-at-build-2025 | 高 |
| Anthropic 将 MCP 捐给 Linux 基金会旗下 Agentic AI Foundation（AAIF）；联合创始 Anthropic、Block、OpenAI，支持者 Google、Microsoft、AWS、Cloudflare、Bloomberg；创始项目为 MCP、goose、AGENTS.md | 2025-12-09 | https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation | 高（官方公告，单一第一手来源） |
| AAIF 公告中的规模口径：10,000+ 活跃公开 MCP 服务器；Python+TS SDK 月下载 97M+；ChatGPT、Cursor、Gemini、Microsoft Copilot、VS Code 已采用 | 2025-12-09 公告口径 | 同上 | 高（官方口径，未独立核实） |
| Anthropic 发布 Agent Skills：文件夹 + SKILL.md（YAML frontmatter 必填 name、description），渐进式加载三级：启动只载名称/描述 → 判断相关才读全文 → 按需读捆绑文件/脚本 | 2025-10-16 | https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills | 高 |
| Skills 发布为开放标准（agentskills.io），格式与运行时分离，可跨产品复用 | 2025-12-18（Anthropic 博客更新注记口径） | 同上（页内 Update 注记）；https://agentskills.io/ | 中高 |
| agentskills.io 客户端列表含：Gemini CLI、Cursor、GitHub Copilot、VS Code、ChatGPT & Codex、Goose、OpenCode、Roo Code、TRAE（字节）、Factory、Databricks、Mistral Vibe、Kiro、OpenClaw 等 40+ | 截至 2026-10 页面 | https://agentskills.io/ | 高（官方站列表，逐家落地时间不一） |
| Claude Code hooks：用户定义的 shell 命令/HTTP 端点/MCP 工具/LLM 提示/子代理，在生命周期固定点自动执行；事件约 30 个（PreToolUse、PostToolUse、UserPromptSubmit、SessionStart、Stop、SubagentStart/Stop、PreCompact 等） | 官方文档现行 | https://code.claude.com/docs/en/hooks | 高 |
| hooks 可阻断（exit 2）、放行（JSON allow）、改写参数/结果（updatedInput/updatedToolOutput）、注入上下文 | 官方文档现行 | 同上 | 高 |
| hooks 首发：v1.0.38（PreToolUse、PostToolUse、Stop、SessionEnd），此后 7 月内快速补事件 | 2025-06-30（社区对官方 changelog 的追踪） | https://github.com/shanraisshan/claude-code-hooks/blob/main/README.md | 中（第三方追踪官方 changelog，官方仓库无日期） |
| Claude Code plugins 发布：打包 slash commands、subagents、MCP servers、hooks；官方称"今后打包分享 Claude Code 定制的标准方式" | 2025-10-09（公开 beta） | https://claude.com/blog/claude-code-plugins | 高 |
| plugin = 含 `.claude-plugin/plugin.json` 的目录，可装 skills/agents/hooks/.mcp.json；marketplace = 含 `.claude-plugin/marketplace.json` 的 git 仓库（目录而非托管商店）；官方市场首次会话自动添加 | 官方文档现行 | https://code.claude.com/docs/en/plugins | 高 |
| subagents：独立上下文窗口、独立系统提示词与工具白名单，经 Agent 工具（原 Task）委派，可并行、可嵌套约三层；配置在 `.claude/agents/*.md`（必填 name、description） | 官方文档现行 | https://code.claude.com/docs/en/sub-agents | 高 |
| 自定义 subagents 首发约 v1.0.60 | 2025-07-10 前后（社区考证） | 社区转述 changelog（如 hidekazu-konishi.com、Reddit r/ClaudeAI） | 中 |
| Claude Code 记忆文件 CLAUDE.md：managed policy / `~/.claude/CLAUDE.md` / 项目 `./CLAUDE.md` / `CLAUDE.local.md` 四层，启动自动拼接加载，`@path` 导入最深 4 跳 | 官方文档现行 | https://code.claude.com/docs/en/memory | 高 |
| 官方对指令文件定性："Claude treats both as context, not enforced configuration — to guarantee an action is blocked, use a PreToolUse hook instead"（指令是上下文不是强制配置；要硬保证就用 hook） | 官方文档现行 | 同上 | 高 |
| AGENTS.md：纯 Markdown、"给编码代理看的 README"；官方站称 60k+ 开源项目使用；由 OpenAI Codex、Amp、Jules、Cursor、Factory 等协作产生；现由 AAIF（Linux 基金会）托管；支持工具含 Codex、Jules、Cursor、Gemini CLI、Copilot、Devin、Windsurf、Zed、Warp、Aider、goose、opencode、Junie 等 | 站点现行；上线 2025-08-20（HN 帖日期） | https://agents.md/ ；https://news.ycombinator.com/item?id=44957443 | 高（站点）/中（上线日期二手） |
| Cursor 规则现行体系：`.cursor/rules/*.mdc`（frontmatter：alwaysApply/globs/description，四种触发：Always / Auto Attached / Agent Requested / Manual）；另支持 AGENTS.md 与 Team Rules（优先级 Team > Project > User）；当前文档已不再提及旧 `.cursorrules` | 官方文档现行 | https://cursor.com/docs/context/rules | 高（现行体系）；`.cursorrules` 于 v0.47（约 2025-02）被 Project Rules 取代为二手说法（中） |
| Claude Agent SDK 能力表：内置工具、hooks、subagents、MCP、permissions、sessions、skills/commands/memory（从 `.claude/` 与 `~/.claude/` 自动加载）、plugins；官方称"提供驱动 Claude Code 的同一套工具、agent 循环与上下文管理" | 官方文档现行 | https://code.claude.com/docs/en/agent-sdk/overview | 高 |
| DeepSeek 官方提供 Anthropic 兼容端点 `https://api.deepseek.com/anthropic`，官方文档给出接入 Claude Code 的环境变量配置（claude-opus 请求映射到 deepseek-v4-pro）；Responses API"专门适配 Codex"（2026-08-13） | 文档现行；V4 接口 2026-04-24 起 | https://api-docs.deepseek.com/zh-cn/quick_start/agent_integrations/claude_code ；https://api-docs.deepseek.com/updates | 高 |
| Qwen Code 随 Qwen3-Coder-480B-A35B 发布，"adapted from Gemini CLI"；现宣称 MCP、Plan Mode、LSP、Auto-Memory、Auto-Skills、SubAgents、Agent Teams 零配置内置 | 2025-07-22 发布；README 现行 | https://qwenlm.github.io/blog/qwen3-coder/ ；https://github.com/QwenLM/qwen-code | 高 |
| 智谱 Z.ai GLM Coding Plan：官方文档列出 20+ 兼容工具（Claude Code、Roo Code、Kilo Code、Cline、OpenCode、OpenClaw、Crush、Goose、Cursor 等），Anthropic 协议端点 `https://api.z.ai/api/anthropic` | 文档现行（定价 $18/月起，官方口径） | https://docs.z.ai/devpack/quick-start | 高 |
| OpenAI Agents SDK 内置 MCP 支持（"Think of MCP like a USB-C port for AI applications"） | 文档现行 | https://openai.github.io/openai-agents-python/mcp | 高 |

## 二、版本、命名与格式细节

**MCP**
- 官方类比："USB-C for AI applications"（官方文档沿用至今）。
- 版本命名 = 日期字符串，仅在有不兼容变更时递增；向后兼容更新不升版本（官方 versioning 页）。
- 2026-07-28 版要点：无状态化（每个请求自带版本与能力声明，`_meta` 字段）、强制 `server/discover` 能力发现、sampling/logging 弃用、扩展机制（如 Tasks 长任务扩展、MCP Apps）。
- 命名区分：MCP（协议）≠ MCP server（提供上下文的程序，可本地 stdio 或远程 Streamable HTTP）。

**Agent Skills（SKILL.md）**
- 目录结构：`SKILL.md`（必需）+ 可选 `scripts/`、`references/`、`assets/`（agentskills.io 规范）。
- frontmatter 最少 `name`、`description`；正文为指令；可捆绑脚本让模型当工具跑（不必载入上下文）。
- 渐进式加载三级对应 token 成本：元数据常驻 → 全文按需 → 捆绑文件再按需。
- 与 MCP 的分工（Anthropic 原文口径）：Skills 教 agent"怎么用"（流程/领域知识），MCP 负责"连上"外部系统；Anthropic 称将探索二者互补。

**Hooks（Claude Code）**
- 配置位置：`~/.claude/settings.json`（用户）、`.claude/settings.json`（项目，可提交）、`.claude/settings.local.json`、managed policy、插件 `hooks/hooks.json`、skill/subagent frontmatter；各层合并。
- 结构三级：事件 → matcher（正则/`|` 列表）→ handlers；handler 类型：command / http / mcp_tool / prompt（单轮模型判断）/ agent（实验性子代理校验）。
- 关键语义：exit 2 = 阻断（官方提醒："If your hook is meant to enforce a policy, use exit 2"）；exit 0 + JSON = 放行/改写/注入上下文。
- 事件从首发 4 个（2025-06）增长到约 30 个（2026-06，社区追踪口径）；新增 InstructionsLoaded（CLAUDE.md 加载时触发）、PermissionRequest、PreModelSwitch 等。

**Plugins（Claude Code）**
- 形态：`.claude-plugin/plugin.json` 清单 + skills/、agents/、hooks/、`.mcp.json`；新式 JS hooks 模块称 "mod"。
- 安装：`/plugin` 交互菜单；scope 分 user/project/local；官方提示"plugins run as you"，安装前需审查。
- marketplace 只是"列插件的 git 仓库"，非托管商店；官方/社区/第三方分层。

**指令/规则文件**
- CLAUDE.md 加载顺序：managed → user → 项目根到当前目录拼接（不覆盖）；子目录文件在触达该目录时按需加载；`/init` 生成。
- AGENTS.md：最就近文件优先；用户聊天指令优先级最高（agents.md 站）。
- Claude Code 与 AGENTS.md 共存：默认无 CLAUDE.md 时才读 AGENTS.md；可在 CLAUDE.md 写 `@AGENTS.md` 复用同份文件。
- Cursor：`.cursorrules`（单文件、全局生效）→ `.cursor/rules/*.mdc`（多文件、glob 触发、可常驻可手动），官方最佳实践建议"规则少于 500 行、引用文件而非粘贴、从简单开始"。

## 三、争议与未核实点

1. **"DeepSeek App/官网 2025 年 3 月上线 MCP 服务器配置"**：未能核实。官方 API 更新日志（api-docs.deepseek.com/updates）全文无 MCP 字样；网络流传说法均无官方链接。文中不建议采用，或明确标注"社区说法，未见官方文档"。
2. **Claude Code hooks / subagents 的精确首发版本号与日期**：官方 CHANGELOG.md 只写版本不写日期；"v1.0.38（2025-06-30）"与"v1.0.60（2025-07-10）"来自第三方 changelog 追踪。建议正文写"2025 年 6 月底/7 月"，页注说明口径。
3. **`.cursorrules` 被弃用的具体版本与时间**：当前官方文档已不提 `.cursorrules`（一手可证），"v0.47、2025 年 2 月引入 Project Rules"为二手来源（社区/论坛），建议模糊为"2025 年起逐步转向 `.cursor/rules`"。
4. **AGENTS.md 的"提出者"**：有"Sourcegraph 提出""OpenAI 牵头"等不同二手说法；agents.md 官方站仅称 "emerged from collaborative efforts"（OpenAI Codex、Amp、Jules、Cursor、Factory 等），建议采用官方模糊口径。
5. **规模数字口径**：97M+ 月 SDK 下载、10,000+ 公开服务器为 Anthropic 捐赠公告（2025-12-09）单方口径；60k+ AGENTS.md 项目为 agents.md 站与 OpenAI 转述口径；SWE-bench 76.40–77.80% 为 Qwen Code README 自报口径（含 7 个版本）。引用时注明"官方自报"。
6. **sampling 原语的时效**：大量旧文把 sampling 列为 MCP 客户端原语，但 2026-07-28 规范已弃用；写作时以官方 architecture 页为准，避免误导。
7. **Skills 开放标准公布日（2025-12-18）**：来自 Anthropic 博客页内更新注记（转述），未找到独立新闻稿，中高可信。

## 四、文章可用的主线例子与结构素材建议（只建议素材，不写正文）

- **承接上一篇**：上一篇"harness 解剖图"列了系统提示词、工具层、上下文工程、权限与沙箱、子 Agent 编排、错误恢复——本篇六机制可与之逐一对号：指令/记忆=上下文层；MCP=工具连接层（对外边界）；Skills=知识/流程层（按需加载）；Hooks+Permissions=控制层（确定性执行）；Plugins=打包分发层；Subagents=编排隔离层。可用 Agent SDK 能力表（官方文档）作为"官方认证的分层清单"。
- **一个贯穿例子**（可选方向）：把六机制放进"给模型发工牌/入职"叙事——CLAUDE.md/AGENTS.md 是入职须知（说了但未必照做）；hooks 是门禁卡（物理拦下）；MCP 是内部系统工牌；Skills 是岗位 SOP 手册（用到才翻）；插件是整套装备的安装包；子代理是另开一间办公室的外包小组。上一篇的 DeepSeek 拟人 mascot 系列可延续。
- **关键对比**（官方原话支撑）："context, not enforced configuration" vs PreToolUse hook——一句话讲清"指令靠自觉、hook 靠机制"的本质区别（code.claude.com/docs/en/memory）。
- **时间线素材**：2024-11 MCP 发布 → 2025-03/04/05 OpenAI、Google、Microsoft 相继采用 → 2025-06/07 hooks、subagents → 2025-08 AGENTS.md 上线 → 2025-10 Skills 与 plugins（间隔仅一周）→ 2025-12 AAIF 治理 + Skills 开放标准 → 2026-07 规范 2026-07-28 → 2026-10 现状。可做成与上一篇"七十年大事记"呼应的"两年大事记"表。
- **国内视角素材**：DeepSeek 官方文档提供 Claude Code/Anthropic 端点与 Codex 适配；Qwen Code（Gemini CLI 衍生）内置 MCP/子代理/Skills；GLM Coding Plan 官方兼容 20+ 工具（Anthropic 端点）；TRAE 出现在 agentskills.io 官方客户端列表——说明"机制是通用协议，模型可插拔"这一主线在国内同样成立。
- **可引用的数字**（注意标注口径）：MCP 月 SDK 下载 97M+、公开服务器 10k+（Anthropic 2025-12 公告）；AGENTS.md 60k+ 项目（agents.md）；hooks 事件数 4→约 30（2025-06 至 2026-06）；agentskills.io 40+ 客户端。
- **反差/冲突素材**：规则文件三套标准并存（CLAUDE.md、AGENTS.md、.cursor/rules）→ AAIF 同时收编 MCP 与 AGENTS.md（治理统一化）；Skill 与 MCP "互补还是竞争"的讨论（Anthropic 表态互补）；plugins "以你的身份运行"的安全提示。

## 五、延伸阅读链接（官方文档优先）

- MCP 发布公告：https://www.anthropic.com/news/model-context-protocol（2024-11-25）
- MCP 官网/规范版本：https://modelcontextprotocol.io/specification/versioning ；架构：https://modelcontextprotocol.io/docs/learn/architecture
- MCP 捐赠与 AAIF：https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation（2025-12-09）
- Agent Skills 工程文：https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills（2025-10-16）
- Skills 开放标准：https://agentskills.io/ ；规范：https://agentskills.io/specification ；仓库：https://github.com/agentskills/agentskills
- Claude Code hooks：https://code.claude.com/docs/en/hooks
- Claude Code plugins：https://code.claude.com/docs/en/plugins ；发布公告：https://claude.com/blog/claude-code-plugins（2025-10-09）
- Claude Code subagents：https://code.claude.com/docs/en/sub-agents
- Claude Code 记忆：https://code.claude.com/docs/en/memory
- Claude Agent SDK 能力总览：https://code.claude.com/docs/en/agent-sdk/overview
- AGENTS.md：https://agents.md/
- Cursor 规则：https://cursor.com/docs/context/rules
- OpenAI Agents SDK 的 MCP：https://openai.github.io/openai-agents-python/mcp
- OpenAI Codex Skills：https://developers.openai.com/codex/skills/
- Qwen3-Coder 与 Qwen Code：https://qwenlm.github.io/blog/qwen3-coder/（2025-07-22）；https://github.com/QwenLM/qwen-code
- DeepSeek 接入 Claude Code：https://api-docs.deepseek.com/zh-cn/quick_start/agent_integrations/claude_code ；更新日志：https://api-docs.deepseek.com/updates
- Z.ai GLM Coding Plan：https://docs.z.ai/devpack/quick-start
- Google 采用 MCP（TechCrunch）：https://techcrunch.com/2025/04/09/google-says-itll-embrace-anthropics-standard-for-connecting-ai-models-to-data（2025-04-09）
- Windows 原生 MCP（Build 2025）：https://blogs.windows.com/windowsdeveloper/2025/05/19/advancing-windows-for-ai-development-new-platform-capabilities-and-tools-introduced-at-build-2025（2025-05-19）
