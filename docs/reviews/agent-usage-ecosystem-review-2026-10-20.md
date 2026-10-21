# 《给 Agent 配装备》全面审查

- 审查日期：2026-10-20。
- 对象：[agent-usage-ecosystem.mdx](C:/Users/Robin/Documents/Codes/myblog/src/content/posts/agent-usage-ecosystem.mdx)，本轮读取版本共 160 行。
- 原文 SHA-256：`0fc5758a31d77742eb7653820ca1bdd79a8d406f2253ea828763a703f15a9b6d`。以下行号对应这一版本。
- 范围：论点、概念、事实与日期、结构、语言、实际配图与 alt、引用、metadata 和 MDX。写作规范用作审查标准；本轮仅新增审查记录，不实施正文或图片修订，不改其它文章及既有审查记录。
- 方法：通读全文，分项核对现行官方文档；两路独立资料核查后合并复核。既有调研记录只提供检索线索，不作为事实成立的证据。
- 分级：P0＝动摇核心论点或存在严重误导；P1＝发布前应修；P2＝准确性、阅读体验与引用完善。本轮为 **P0：0 条，P1：7 条，P2：9 条**。没有把检索失败直接判成事实错误。

## 总评与发布判断

开场场景、六件装备的记忆框架和“新同事入职”的主线成立，适合承接上一篇。当前主要问题是类比越过了技术边界：Hooks 被讲成安全保证，插件被讲成能分发全部配置，独立上下文被讲成全面隔离，模型接口兼容被推广成装备全面通用。另有 Hooks 首发事件清单的硬错误。**建议修完 P1 后发布，无需推倒重写。**

## P1：发布前应修

### E01｜Hooks 的“必须”需要限定，不能直接推出安全保证

**位置与原句**：第 21、70—77、101、108、118 行。“Hooks 管‘必须’”“关键语义就一条”“一条 Hook 卡死危险的清理命令”。

**问题**：自动触发有确定的时机，检查本身是否正确、是否覆盖所有路径、失败时是否继续，是另外的问题。退出码的说明只适用于命令 hook；不同事件的阻断语义也不同。现行文档明确：多数事件上检查崩溃或超时默认继续，不能仅凭“配置了 hook”承诺拦住危险操作。模型判断型 hook 也不因此变成确定的判定器。

**可替换第 71 行**：

> 　　以命令 hook 为例，在工具调用前的 PreToolUse 事件上返回 exit 2，可以阻断这次调用；返回成功状态和相应 JSON，则能按事件控制权限、参数或上下文。不过检查失败或超时在多数事件上默认仍会放行。要把它当作策略门禁，还得验证检查范围和失败时的行为；新版本的命令与 HTTP hook 可以配置 onFailure 为 block。

**同步收口**：第 101 行的“卡死”改为“用经过验证的 PreToolUse 检查拦截危险命令”；第 108 行改为“必须：在指定事件上自动执行检查，可按规则阻断动作”；第 118 行改为“不保证，用 Hooks 加上权限与沙箱机制约束”。不必改变“门禁”的主比喻，但应补一句“门禁也要验收，不能替代权限和沙箱”。

依据：[Hooks 的失败处理与事件语义](https://code.claude.com/docs/en/hooks#block-the-action-when-a-hook-fails)。`onFailure` 要求 v2.1.295 或更新版本；文章若保留具体字段，应连同版本门槛说明。

### E02｜插件代码的权限边界不能写成与 Agent 相同

**位置与原句**：第 85 行。“你授给 Agent 的文件、终端和权限，它一样不少地继承。”

**问题**：这句话容易让读者以为 Agent 的工具审批和沙箱同样约束插件内全部代码。官方明确区分：Agent 发起的工具调用受相应权限规则约束；命令 hooks 与部分服务进程以用户权限执行，并在 Claude Code 的沙箱外运行。原文低估了安装插件带来的信任范围。

**可替换**：

> 　　要紧的是安全这一条。插件里不仅有给模型读的文字，也可能有直接运行的代码。官方提醒，命令 hooks 和一些服务进程会以你的用户权限、在 Claude Code 的沙箱外运行。因此装第三方插件前，尤其要检查它附带的 hooks、脚本和服务。

依据：[插件安全与信任中的权限说明](https://code.claude.com/docs/en/plugins/security#permissions)。

### E03｜“整套打成插件、一条命令全部装齐”包含了无法自动加载的指令文件

**位置与原句**：第 83、101、109 行。“一份清单文件……加上……”“整套东西打成插件，新同事一条命令全部装齐”；表格“把以上装备装进一个安装包”。

**问题**：这里的“整套”包括前面的 CLAUDE.md，但插件根目录的 CLAUDE.md 不会自动作为上下文加载。插件也不能代替目标系统的登录授权。另外，现行实现中的 plugin.json 是可选清单，不能当成插件的必需定义。

**可替换第 101 行相关部分**：

> CLAUDE.md 随项目仓库分发；Skills、MCP 配置、Hooks 和子智能体可以打成插件，让新同事一次安装，再按需完成外部系统授权。

**第 109 行可替换为**：

```text
| 插件 | 打包：集中分发 Skills、Hooks、MCP、子智能体等组件 | 常见清单为 .claude-plugin/plugin.json |
```

第 83 行开头改为“在 Claude Code 里，插件是按约定组织的目录，通常带有 `.claude-plugin/plugin.json` 清单”。

依据：[插件清单与标准目录布局](https://code.claude.com/docs/en/plugins-reference#standard-layout)，明确说明清单可选，插件根 CLAUDE.md 不加载。

### E04｜SessionEnd 并非 Hooks 首发事件

**位置与原句**：第 70 行。“首次带上 hooks 时只有 4 个事件：PreToolUse、PostToolUse、Stop、SessionEnd”。

**问题**：官方 CHANGELOG 在 v1.0.38 记录发布 hooks，在后来的 v1.0.85 才记录引入 SessionEnd。首发的“四个事件”清单有确定错误；无需为修正它再猜一份首发清单。

**可替换该句**：

> Claude Code 在 2025 年 6 月底发布 hooks，此后事件不断增加；如今官方文档已列出 30 多个，覆盖工具调用、用户提交提示词、上下文压缩和子智能体启停等节点。

依据：[官方 CHANGELOG 的 v1.0.38、v1.0.85 条目](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)。6 月底的时间判断有[官方仓库讨论](https://github.com/anthropics/claude-code/issues/712)支持，错误在事件枚举。

### E05｜模型接口兼容、技能格式复用和插件通用是三件不同的事

**位置与原句**：第 47、114 行。“同一份技能可以跨产品复用”；“模型各有各的，装备却是通用协议——模型可插拔，装备不挑模型”。

**问题**：DeepSeek、GLM 提供兼容端点，说明某些模型可以接入某个 Harness；Qwen Code 具备同名能力，说明它实现了这些功能。两者都不能证明 Claude Code 的 hooks 配置、插件目录或子智能体定义在所有产品里通用。即使采用 Skills 开放格式，专用工具、脚本依赖和权限也可能需要适配。

**可替换第 114 行末句**：

> 这些例子说明，模型和 Harness 可以在兼容接口允许的范围内重新组合。MCP 和 Skills 提高了连接与知识的可复用性；Hooks、插件和子智能体的具体配置，仍要看各家实现。

**第 47 行补充**：

> 同一份技能可以在支持该格式的产品间复用；涉及专用工具、脚本依赖或权限时，还得适配目标环境。

依据：[DeepSeek 接入 Claude Code](https://api-docs.deepseek.com/zh-cn/quick_start/agent_integrations/claude_code/)、[Qwen Code 官方仓库](https://github.com/QwenLM/qwen-code)、[GLM 协议端点说明](https://docs.z.ai/devpack/quick-start)、[Skills 的 compatibility 与 allowed-tools 字段](https://agentskills.io/specification)。这是对材料所能支持范围的判断，不是否认这些产品的兼容能力。

### E06｜独立上下文不等于互不共享，普通委派与 fork 也要区分

**位置与原句**：第 93、95、97、112 行。“与主对话互不共享”“最多三层”“信息隔离，各干各的”。

**问题**：普通委派通常从新的对话上下文开始，fork 则继承父对话历史；默认工作目录也并未因此隔离。并行修改同一文件仍可能冲突。三层是目前默认、可以配置的嵌套深度，不是固定上限。

**可替换第 93 行相关部分**：

> 子智能体拥有独立的上下文窗口，可以配置专门的提示词和可用工具。普通委派主要接收任务说明，fork 型则继承父对话历史。主对话通过 Agent 工具把任务交出去，也可以并行运行；当前默认可向下嵌套三层，上限可配置。上下文独立不代表文件互不影响，需要隔离代码修改时，还要使用独立工作树等机制。

**可替换第 97 行记忆点**：

> 　　子智能体像另开一间办公室：对话可以分开，文件与任务仍要协调。

依据：[子智能体的上下文与嵌套深度](https://code.claude.com/docs/en/sub-agents#manage-subagent-context)、[工作目录与工作树隔离说明](https://code.claude.com/docs/en/sub-agents)。正文中“独立上下文”的基本判断正确，需要收窄的是“互不共享”。

### E07｜MCP 的“工牌”比喻需要把连接与访问许可分开

**位置与原句**：第 55、57、60 行。“MCP：内部系统的工牌”“根本没人给它发工牌”。

**问题**：工牌通常意味着身份与许可，而 MCP 首先统一的是连接、能力发现和调用方式。它可以规定授权流程，但安装服务器或连接成功不会自动授予工单系统权限。这个边界直接关系到开场的第二类问题。

**可在第 57 行末补充**：

> 　　这里的“工牌”只是比喻：MCP 统一连接和调用方式，真正能访问什么，仍由目标系统的凭据、授权和宿主应用的权限控制决定。

**第 60 行宜加一个贯穿示例**：

> 放到开头的工单系统里，tools 可以是“查询本周缺陷”的函数，resources 可以是供读取的工单资料，prompts 则可以是整理周报的交互模板。

依据：[MCP 授权规范的范围与传输差异](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization)。比喻可以保留，不必换图。

## P2：准确性与编辑完善

### E08｜“指令＝常驻 Markdown”“记忆体系四层”都应缩小范围

**位置与原句**：第 27、41、53 行。“指令：一组常驻上下文的 Markdown 文件”“记忆体系分四层”“从项目根一路拼接到当前目录”“指令有个天生的毛病：常驻”。

**问题**：文章把“指令”限定为一种文件形态，之后又在 Cursor 段落承认规则可以条件触发。四种作用域描述的是手写指令文件，也未覆盖 auto memory。Claude Code 的目录加载顺序从文件系统根到工作目录；子目录指令可以按需加载。因此“所有指令天然常驻”不是 Skills 与指令的可靠分界。

**可替换第 27 行开头**：

> 　　这里说的“指令”，主要指项目背景和协作规则文件。以 Claude Code 为例，CLAUDE.md 类手写指令分组织、用户、项目和本地个人四种作用域；这些文件按目录层级合并，子目录里的指令在访问相关文件时按需加载。此外，它还有自动记忆机制。

**第 41 行开头可替换为**：“把所有流程都塞进启动时加载的 CLAUDE.md，会持续占用上下文。”

**第 53 行可替换为**：“基本规矩放进项目指令，专门流程做成按需取用的 Skills。”

依据：[Claude Code 的指令与记忆加载机制](https://code.claude.com/docs/en/memory)、[Cursor 规则的条件触发](https://cursor.com/help/customization/rules)。四跳导入的数字正确，不需修改。

### E09｜.cursorrules 是项目根文件，不是全局配置

**位置与原句**：第 29 行。“早期的单一全局配置 .cursorrules”。

**问题**：这里把项目内的单文件规则误称为全局配置，容易与用户级 User Rules 混淆。

**可替换**：

> Cursor 则从早期项目根目录里的单文件 .cursorrules，2025 年起逐步转向 .cursor/rules 目录。

依据：[Cursor 官方迁移说明](https://cursor.com/help/customization/rules#how-do-i-migrate-from-cursorrules)。

### E10｜sampling 与 logging 的弃用属实，但不能混称客户端能力

**位置与原句**：第 62 行。“不少旧资料把 sampling、logging 列为 MCP 的客户端能力”。

**问题**：logging 的规范定义是服务器向客户端发送日志，由服务器声明 capability。官网架构概览本身也有混列，所以这里按规范正文澄清即可，不把它说成作者凭空犯错。还可顺手防止读者把“弃用”理解成“已经删除”。

**可替换前半句**：

> 　　顺带排个雷：旧资料里常见的 sampling（客户端代调模型）和 logging（服务器向客户端发送日志），在 2026-07-28 版规范中都已标记弃用；弃用意味着建议迁移，并不等于已经删除。

依据：[Logging 规范](https://modelcontextprotocol.io/specification/2026-07-28/server/utilities/logging)、[弃用登记表](https://modelcontextprotocol.io/specification/2026-07-28/deprecated)。版本号与弃用日期均应保留。

### E11｜六类用途是作者的讲解框架，能力清单不能证明“官方分层”

**位置与原句**：第 21、112 行。“六种不同层的装备，各管一件事”“正好能逐一对号入座”“这个分法也不是我硬凑的”。

**问题**：插件会打包其它组件，Skills 又可以包含指令、脚本和资料；这些关系不是六个互斥层级。SDK 把几项能力列在一张表里，能证明它们是可组合的工程组件，不能证明正文给出的六层分类就是官方架构。

**可替换第 21 行相关短语**：“六类可以搭配使用的机制，先各抓住一个主要用途”。

**可替换第 112 行相关部分**：

> 为了方便理解，可以把它们分别联系到上下文、知识流程、工具连接、执行控制、分发和编排。这是本文按用途整理的讲解方式，各层之间会有交叉。Claude Agent SDK 的能力表也把 Hooks、子智能体、MCP、权限、Skills 和插件列为可组合的能力。

依据：[Claude Agent SDK 能力表](https://code.claude.com/docs/en/agent-sdk/overview#capabilities)。这是论证范围问题；SDK 原始能力清单与“同一套工具、循环和上下文管理”的引述成立。

### E12｜结尾题外话再次把 Hooks 暗示为事实准确性的保证

**位置与原句**：第 119 行。“唯独没配门禁卡，所以文中每一个日期和数字，都得我自己回头再核一遍。”

**问题**：这句很有个人声音，但因果关系不成立：即便配置 hook，也只能自动执行某项检查，不能自动保证开放事实正确。此外，第 118 行已完成总结，第 119 行说“最后”，第 121 行又出现预告，收束略有反复。

**可替换第 119—121 行为一个末段**：

> 　　下一篇聊点更实际的：第一次启动 Agent，该先配哪件装备？这篇文章本身也是一次练习——调研文档提供资料，写作规范约定做法；至于日期和数字，工具能帮我检查，核实的责任仍在我。

这只是编辑建议。保留原有三段也可以，但应删去“没配门禁，所以才要自己核实”的因果。

### E13｜中段从场景突然切成配置手册，宜减少连续术语

**位置与原句**：第 27、60、70、83 行。“JSON-RPC 2.0”“Streamable HTTP”“三级结构”“.claude-plugin/marketplace.json”等连续出现。

**问题**：这几段一次引入了较多新术语，却很少再用开头的“发版本、查工单、拦危险命令”解释用途。对刚读完上一篇的读者，认出配置文件比记住传输协议和首发事件清单更有价值。MCP 本身也没有在正文首次展开全称。

**可替换 MCP 段落的入门版本**：

> 　　MCP（Model Context Protocol，模型上下文协议）约定了 Agent 应用与外部服务怎么交换能力和数据。比如工单服务把“查询缺陷”开放成工具，支持 MCP 的应用就可以按同一套协议发现并调用它；内部系统如何实现，仍由服务端处理。技术上，它采用客户端与服务器架构，标准传输包括本地标准输入输出和远程 Streamable HTTP。

JSON-RPC、elicitation、弃用细节可保留在简短的技术补充里；不必删除，只需先讲清用途。Hooks 同理，先给“发布前检查是否通过”之类具体用法，再补配置结构。

### E14｜大事记要区分宣布计划与实际可用

**位置与原句**：第 131—132 行。“Google DeepMind 宣布 Gemini 支持 MCP”“Microsoft 宣布 Windows 11 原生支持 MCP”。

**问题**：Windows 的 2025-05-19 公告明确说随后数月向部分伙伴提供私有开发者预览，表格的解释容易被读成当时已普遍可用。Google 的 4 月声明有原始推文线索，本轮读取受限，不能据此判错；但应该使用“宣布将支持”而非暗示已经落地。

**可替换 Windows 行**：

```text
| 2025.5 | Microsoft 宣布 Windows 11 原生集成 MCP 的计划 | 操作系统厂商开始建设 MCP 接入基础设施 |
```

**Google 两种可选处理**：保留 4 月并改为“Google DeepMind 宣布将为 Gemini 提供 MCP 支持”，补可核查历史出处；或采用可直接打开的一手材料，改为：

```text
| 2025.5 | Google 宣布 Gemini API 与 SDK 已兼容 MCP 工具 | MCP 进入 Gemini 开发工具链 |
```

依据：[Windows Build 2025 公告](https://blogs.windows.com/windowsdeveloper/2025/05/19/advancing-windows-for-ai-development-new-platform-capabilities-and-tools-introduced-at-build-2025/)、[Google 2025-05-20 I/O 官方稿](https://blog.google/innovation-and-ai/technology/ai/io-2025-keynote/)。[Google 4 月原始声明线索](https://x.com/demishassabis/status/1910107859041271977)本轮无法读取；5 月材料不能反过来独立证明 4 月日期。

### E15｜参考资料有一个确定断链，另有数字和历史日期尚缺对应证据

**位置与原句**：第 114、130、144—160 行。“20 多个兼容工具”；“Qwen Code 仓库：[github.com/QwenLM/qwen-code]”。

**问题**：Qwen 仓库只有方括号文字，缺少 Markdown 链接目标，编译虽通过，读者却无法点击。GLM 所引 quick-start 能证明协议端点和多工具支持，不能直接证明“20 多个”；专门的支持列表也混有不同产品入口，计数口径需要说明。OpenAI 当前 SDK 支持 MCP 可以确认，但现行功能说明本身不能证明 2025 年 3 月的采用公告日期，本轮未完成该历史日期的一手闭环。以上后两项不直接判为错误。

**可替换引用条目**：

```markdown
- Qwen3-Coder 发布博文：[Qwen3-Coder：面向编码 Agent 的模型](https://qwenlm.github.io/blog/qwen3-coder/)；[Qwen Code 官方仓库](https://github.com/QwenLM/qwen-code)。
```

**可替换数字表述**：“智谱的 GLM Coding Plan 文档列出多种官方支持工具，并提供 Anthropic 协议端点。”

延伸阅读已有中文资料名称，不算缺少可读标签；可将链接本身的显示文字也改成“架构说明”“版本与弃用规则”等短语，缩短移动端的长 URL。历史条目应补对应公告，避免用现行技术文档代替发布日期证据。

依据：[GLM 官方支持工具清单](https://docs.z.ai/devpack/tool/others)、[OpenAI 当前 MCP 连接文档](https://developers.openai.com/api/docs/guides/agents-api/tools/mcp)。OpenAI [API 更新日志](https://developers.openai.com/api/docs/changelog)可证明 Responses API 在 2025 年 5 月新增远程 MCP 支持，但这既不能证明、也不能推翻 3 月 SDK 采用的另一事件。

### E16｜补齐真正的段落边界，再统一记忆点的加粗

**位置与原句**：第 70—71、118—119 行；各小节末句第 37、53、64、77、87、97 行。

**问题**：70 与 71、118 与 119 中间都没有空行，Markdown 会把相邻文本合成一个段落。两处恰好分别承担“机制→关键语义”和“总结→个人题外话”的转折，不宜只在源码换行。各小节记忆点目前也大多没有按写作规范加粗。

**直接处理建议**：在上述两组文本之间各补一空行；技术措辞修正后，将各节最后一句统一写成单独的 `**记忆点。**`。例如：

```text
　　**指令影响判断，不提供执行保证。**
```

段首全角缩进、中文标点、标题冒号均是作者约定，未当作问题；本轮未发现遗漏缩进的正文段落。

## 已确认可保留的事实

以下是本轮专门核过、容易被旧资料误判的部分。确认不等于对该产品所有入口作兼容性承诺。

| 文章位置 | 核查结果 | 一手依据 |
| --- | --- | --- |
| 第 62、138 行 | MCP 现行版本为 2026-07-28；不兼容变更才改变版本号 | [版本规则](https://modelcontextprotocol.io/docs/2026-07-28/learn/versioning) |
| 第 62 行 | sampling、logging 均在该版标记弃用，尚非删除 | [弃用登记表](https://modelcontextprotocol.io/specification/2026-07-28/deprecated) |
| 第 60、138 行 | Host／Client／Server、两种标准传输及无状态能力发现的概述成立 | [规范与变更记录](https://modelcontextprotocol.io/specification/2026-07-28/changelog) |
| 第 43、45、47 行 | Skills 发布于 2025-10-16；2025-12-18 开放格式；三级渐进加载有原文支持 | [Anthropic 原文与更新注记](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) |
| 第 47 行 | “40 多个名字”成立，当前官方展示列表为 46 条；ChatGPT 与 Codex 合列一项 | [官方展示列表源码](https://raw.githubusercontent.com/agentskills/agentskills/main/docs/snippets/clients.jsx) |
| 第 29、135、137 行 | AGENTS.md 的 2025 年 8 月、超过 6 万项目及 AAIF 托管均有官方依据 | [Linux Foundation 成立公告](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation)、[AGENTS.md 官网](https://agents.md/) |
| 第 29 行 | Claude Code 已支持默认条件下回退读取 AGENTS.md，不能改回“默认不支持” | [现行 memory 文档](https://code.claude.com/docs/en/memory#read-agentsmd)。要求 v2.1.277 或更新版本；实际回退还取决于祖先目录内的指令文件与相关设置 |
| 第 70 行 | command、http、mcp_tool、prompt、agent 五类 hooks 已存在，事件数“30 多个”成立 | [Hooks 文档](https://code.claude.com/docs/en/hooks) |
| 第 81 行 | Claude Code 插件于 2025-10-09 公开测试发布 | [官方发布文章](https://claude.com/resources/articles/claude-code-plugins) |
| 第 93 行 | 自定义子智能体由 v1.0.60 引入；本轮未钉死具体日期，“2025 年 7 月前后”不据此判错 | [官方 CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md) |
| 第 114 行 | DeepSeek 官方文档确实写有 opus→deepseek-v4-pro、haiku／sonnet→deepseek-flash 的模型名映射 | [接入指南的模型映射章节](https://api-docs.deepseek.com/zh-cn/quick_start/agent_integrations/claude_code/#使用-claude-code-或者-claude-desktop-app-时的模型映射) |
| 第 114 行 | Qwen Code 源于 Gemini CLI，当前 README 也列出了 MCP、Skills、子智能体等能力 | [官方 README](https://github.com/QwenLM/qwen-code) |
| 第 129 行 | MCP 在 2024 年 11 月发布，准确日期为 11 月 25 日 | [原始公告](https://www.anthropic.com/news/model-context-protocol) |

## 图片、格式与本地验证

- 已实际查看封面、三张全宽说明图和四张正文猫咪图，共八张；封面独立且为 4:3，说明图为 3:2。未发现影响论述的错字或明显图文冲突。alt 与实际主体、动作和信息基本相符，不建议为了统一风格重新绘制。
- 六件装备全景图的文字与记忆框架一致；它表达的是用途索引，没有画出严谨的六层架构。因此正文采用 E11 的工作分类说法即可，无须换图。
- 指令与 Skills 对比图可以保留，但应配合 E08，把比较对象限定为“把所有流程常驻加载”与“按需取用”，避免说成所有指令都只能常驻。
- Hooks 对比图可以保留；在正文补上 E01 的门禁条件即可。本轮未移动、缩放、替换或删除图片。
- 使用仓库已安装的 `@mdx-js/mdx` 与站点相同的 remark／rehype 插件检查文章编译，收尾复核通过，零编译警告。没有用全站构建代替内容审查。
- metadata 的标题与正文主标题一致，slug 对应文件名，日期有效；封面路径存在。正文七个图片引用均存在，连同封面均为 WebP，宽度均不超过 1600px。
- 唯一站内文章链接 `/blog/ai-model-agent-harness` 的目标文件存在。无遗留作者批注、待生成／待插图占位、正文缩进遗漏。
- 确认一个悬空 Markdown 标签：第 158 行 Qwen Code 仓库链接，见 E15。
- 未启动浏览器逐视口验收，未宣称浮动图片的最终页面布局已经通过视觉测试。外部链接抓取失败也未直接判为失效链接。
- 本轮没有应用文章修订，因此不运行与本任务无关的单元测试、全站检查或图片压缩脚本；不覆盖工作区既有改动。

## 建议修订顺序

先修 E01—E07 的技术边界与首发事件，再处理指令定义、时间线和引用。最后同步检查开头总纲、收拢表、结尾与 metadata summary，让缩写口号与正文边界一致。标题和开场可保留，暂不需要增加图片，也不需要扩写成安装教程。
