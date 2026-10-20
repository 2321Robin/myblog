# 《Harness 横评》写作计划

- 成文路径：`src/content/posts/harness-comparison.mdx`
- 调研依据：`docs/research/harness-comparison-research.md`（下称"调研"）
- 风格参照：`src/content/posts/ai-model-agent-harness.mdx`（下称"概念篇"）——必须先通读
- 规范：`docs/writing-guide.md` + `docs/reviews/ai-model-agent-harness-revision-log.md` 第三部分检查清单

## metadata 提案

```js
export const metadata = {
  title: "Harness 横评：终端、IDE、网页，Agent 外壳怎么选",
  slug: "harness-comparison",
  date: "2026-10-20",
  summary: "……（钩子式）",
  tags: ["ai", "agent", "harness"],
};
```

- 不写 cover 字段（封面未生成）。
- 时效声明：产品格局以 2026-10-20 为准，本文要写明。

## 定位与主线

- 与概念篇强呼应：概念篇已定义 harness（模型权重之外、组织模型运行的那部分系统），本文开头一段带过定义并给链接，不重讲。
- 核心判断（开场尽早给）：2026 年选 harness，选的不只是一个软件，而是形态（你在哪干活）+ 生态（扩展机制通不通用）+ 模型绑定（引擎锁不锁死）；而且外壳本身比想象中不稳定——今年已经三度"变天"。
- 对比维度固定并声明（呼应"对比前固定变量"红线）：形态、模型绑定、扩展机制（MCP/Skills/Hooks/规则文件）、权限与沙箱、价格、国内可用性。**不跑分、不评"最强外壳"**。
- 时效钩子：2026 年三个外壳变动事件开场。

## 大纲

### 1. 开场：外壳比模型变得还快（钩子）
- 三件事：Windsurf 6-02 被 Cognition 换牌为 Devin Desktop（Cascade 7-01 EOL）；Google 5-19 公告 Gemini CLI 免费层 6-18 起移交 Antigravity CLI；Cursor 8-14 官宣并入 SpaceX/xAI（官方账号口径，细节未见官方长文——措辞要含糊，见红线）（调研§四时间线）。
- 判断：模型在迭代，外壳在"城头变幻大王旗"。所以这篇不评最强，教你怎么按自己的情况选。配图1（三形态全景）放第 2 节。

### 2. 对比维度声明 + 定义回扣
- 一段带过概念篇定义 + 链接；本文六个维度（上面那串）。

### 3. 终端 CLI：效率党的主场
- Claude Code（v2.1.303 口径）：全形态（终端/IDE 扩展/桌面/Web/移动），权限模式+OS 级沙箱（macOS Seatbelt、Linux bubblewrap，默认关闭），云端会话 claude.ai/code（调研§二）；绑定 Claude 系（可接 Bedrock/Vertex/自定 base_url）。
- Codex CLI（Apache-2.0 开源）：本地轻量 agent，沙箱默认 read-only、workspace-write 按 OS 机制审批；config 可指任意兼容 provider（调研§二）。
- Qwen Code：从 Gemini CLI 衍生走向独立多协议框架，全形态覆盖（CLI/桌面/插件/Web/IM），Agent Teams（调研§二）。
- opencode 与 crush：provider 无关、开源，扩展全套（MCP/插件/ACP；crush 兼容 .claude/skills）（调研§二）。
- 一句"谁适合"：愿意住在终端里的人。

### 4. IDE/编辑器：看着代码干活
- Cursor：自研 Composer + 多模型聚合、Plan Mode；价格档已核（cursor.com/pricing：Free/Plus $8/Premium $30/Super $100/Ultra $200）（调研§一）。
- GitHub Copilot：VS Code/JetBrains agent 模式 + Agent HQ 统一编排第三方 agent（2025-10-28 公告）；档位已核（Free/Pro $10/Pro+ $39/Max $100 等）（调研§一、§二）。
- Zed：编辑器本体免费 + ACP 接外部 agent（类比 LSP），agent 自带模型与计费（调研§二）。
- Kiro（AWS）：spec-driven、信用点计费（Free 50 点/Pro $20 起），多形态（调研§一、§二）。
- 国内三线一句带过：Trae（字节）、Qoder（阿里系）、CodeBuddy（腾讯）——模型与价格未全面核实，以官网为准（见红线）。

### 5. 网页与云端：派活而不是盯活
- Claude Code 云端会话：任务在隔离 VM 克隆仓库跑、关浏览器不停、可回终端续跑（官方 web-quickstart 已核，调研§三#1）。
- Codex 云端（chatgpt.com/codex）、Devin（"本地代理让你更快，云代理在你不在时完成工作"——Cognition 官方口径）（调研§三#2）。
- Agent HQ 的意义：从"选外壳"变成"指挥多个外壳"（调研§三#3）。
- 谁适合：任务可托管、要并行、不想守着终端的人。

### 6. 扩展生态：换壳成本正在下降
- 矩阵表（行=harness 精选 8 个，列=MCP/Skills/Hooks/规则文件）：MCP 几乎全员支持；Skills 标准（agentskills.io）40+ 客户端；AGENTS.md 跨工具通用；hooks 各家自有（调研§一、§六）。
- 论点：扩展标准在跨外壳趋同——去年换个壳要重配一切，今年 MCP/Skills/规则文件跟着人走。配图2。

### 7. 权限与沙箱：外壳的安全责任
- 三种思路对照：Codex 默认只读沙箱+按 OS 审批写权限；Claude Code 默认权限模式询问+可选 OS 级沙箱（纵深防御官方口径）；云端托管干脆扔进隔离 VM（调研§二、§三）。
- 一句结论：外壳越自主，越要问它"出事了算谁的"。

### 8. 国内用户的两条路
- 路线一：国产外壳（Qwen Code、iFlow CLI、Trae/Qoder/CodeBuddy）。
- 路线二：通用外壳 + 国产模型——GLM Coding Plan 官方支持 20+ 工具（Anthropic 协议端点）；DeepSeek 官方 Anthropic 兼容端点接 Claude Code、官方适配 Codex（调研§一、§六）。均有官方指南。
- 提醒：Qwen OAuth 免费档 2026-04-15 已停（调研§四）。

### 9. 怎么选（收束）
- 三个问题定外壳：你在哪干活（终端/IDE/浏览器）？活能不能托管并行（云端）？模型想不想锁死（绑定 vs provider 无关）？
- 简表：形态×代表×适合人群。
- 记忆点：**选外壳就是选工作方式：终端管深度，云端管并行，扩展生态决定你换壳的代价。**

### 10. 写在最后
- 只收束一次。下篇预告（软）：这个系列接下来想聊聊更个人的两篇——我自己这一年的使用感悟，和我的 AI 工具箱。（不指名发布顺序）
- 题外话：一句个人化收尾。

### 附录
- 延伸阅读：调研§七官方文档（每条带可读文字）。
- 大事记：可加"2026 外壳变动时间线"小表（5-19、6-02、6-18、7-01、8-14 等，日期单调，全部官方口径）。

## 配图清单（2 张信息图 + 1 张封面，均未生成）

1. 配图1（第 2 节，全宽）：三形态全景——终端窗口、IDE 窗口、浏览器窗口三个场景，各自住着代表性外壳（名字逐字核对），下方共用同一台"模型引擎"。
2. 配图2（第 6 节，全宽）：扩展生态趋同示意——多个外壳图标 + 三个通用标准层（MCP/Skills/AGENTS.md）贯穿，箭头表示"跟着人走"。
3. 封面（4:3）：极简——同一台引擎外面套三种"外壳"剪影（终端/窗口/云），全图唯一文字"Agent 外壳"。

## 本文事实红线（除通用红线外）

- Cursor 并入 SpaceX/xAI：仅有官方 X 帖与聚合报道，措辞用"官宣并入（官方账号公告）"，不写交易细节、不断言品牌存续。
- 不写：Codex/ChatGPT 2026 订阅现价（官方 403 未核实，写"以官网为准"）；Antigravity CLI 定价/平台；"Codex CLI 默认 GPT-6.1 Sol"（第三方）；Claude Code 桌面 App/Routines/Channels（公告未核实，最多写"文档已出现相关入口"或干脆略）；Gemini CLI 是否有子代理（未核实）。
- Codex models 页推荐 gpt-5.5 与 GPT-6.1 Sol 的关系未核实——避免把具体推荐型号写死，用"GPT 系"。
- 国产三线（Trae/Qoder/CodeBuddy）只写存在与形态，模型清单与价格不写死。
- 云端功能描述以官方文档已核条目为限（claude.ai/code、chatgpt.com/codex 的存在可写，细节口径从调研原文）。
