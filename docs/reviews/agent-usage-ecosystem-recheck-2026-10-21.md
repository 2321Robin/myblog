# 《给 Agent 配装备》修改稿复审

- 日期：2026-10-21。
- 对象：[当前文章](C:/Users/Robin/Documents/Codes/myblog/src/content/posts/agent-usage-ecosystem.mdx)，163 行。
- SHA-256：`1d611eea0bced1f2792d41ae5811c4c54717ce29668b1812694bb7191db9875f`。下列位置均按这一版本。
- 范围：对照上一轮意见检查修订结果，再检查事实、概念与表达；本轮不改正文、图片或上一轮报告。
- 结论：未发现 P0。仍有 **1 条 P1、3 条 P2**。修正 R01 后可发布，R02—R04 建议一并小修；没有必要再扩写成技术手册。

## 上一轮修改的复核结果

已经修正的主要问题包括：插件自身代码的权限边界、插件与项目指令的分发区别、错误的 Hooks 首发事件清单、子智能体的普通委派与 fork、默认嵌套深度和文件隔离、跨产品格式与运行环境的区别，以及 MCP 接入与授权的区别。

指令定义、Cursor 项目规则、logging 的归类、作者用途分类与官方架构的区别、Windows／Google 的时间线措辞、结尾和 Qwen 仓库链接也已作相应调整，不再重列。Hooks 的失败与超时说明、`onFailure` 的版本门槛均准确，剩下的是同段内的事件能力混淆，见 R01。

## R01 · P1：PreToolUse 不能改写尚未产生的工具结果

**位置**：[第 72 行](C:/Users/Robin/Documents/Codes/myblog/src/content/posts/agent-usage-ecosystem.mdx:72)。

**原句**：“在工具调用前的 `PreToolUse` 事件上……以 `exit 0` 退出并输出一段 JSON，则可以放行、改写参数、改写结果……”

**问题**：这句话把不同事件支持的能力合并了。调用前可以控制是否执行、修改输入；改写模型看到的工具结果属于调用后的 `PostToolUse`。另外，退出码适用于命令 hook，不能不加限定地套用到上一段列出的 HTTP 等类型。“关键语义就一条”也不适合引出随后多种事件与返回方式。

**可直接替换本段第一句**，后面的失败处理说明保留：

> 　　以命令 hook 为例，在工具调用前的 `PreToolUse` 事件上返回 `exit 2`，可以阻断这次调用；返回 `exit 0` 并输出符合事件格式的 JSON，可以控制是否放行、改写参数或补充上下文。要改写模型看到的工具结果，则使用调用后的 `PostToolUse`；HTTP hook 通过响应状态和 JSON 传回决定。

依据：[Hooks 决策控制](https://code.claude.com/docs/en/hooks#decision-control)、[调用后的结果处理](https://code.claude.com/docs/en/hooks#posttooluse-decision-control)、[HTTP 返回方式](https://code.claude.com/docs/en/hooks#http-response-handling)。现行文档的 `updatedToolOutput` 可用于多种工具，不应再改成“只能改写 MCP 工具输出”。改变结果只影响模型看到的内容，不会撤回已经发生的文件写入或命令执行。

## R02 · P2：AGENTS.md 的默认读取条件漏了本地指令文件

**位置**：[第 29 行](C:/Users/Robin/Documents/Codes/myblog/src/content/posts/agent-usage-ecosystem.mdx:29)。

**原句**：“Claude Code 默认在没有 CLAUDE.md 时才读 AGENTS.md”。

**问题**：前文刚介绍 `CLAUDE.local.md`；读者可能添加这个文件，却发现原先的 AGENTS.md 不再默认加载。它也参与回退条件，不能只检查项目根有没有 CLAUDE.md。这里补一个条件，比罗列更多高级选项更有用。

**可直接替换**：

> Claude Code（v2.1.277 起）默认在当前目录及祖先目录都没有 `CLAUDE.md`、`.claude/CLAUDE.md` 或 `CLAUDE.local.md` 时，改读 `AGENTS.md`；也可以在 `CLAUDE.md` 里写一行 `@AGENTS.md`，共用同一份内容。

依据：[AGENTS.md 加载条件](https://code.claude.com/docs/en/memory#when-claude-code-reads-agentsmd)。用户主目录下的 `~/.claude/CLAUDE.md` 与组织策略不参与上述回退判断，无须为此另加一段解释。

## R03 · P2：elicitation 应说明是服务器通过客户端向用户询问

**位置**：[第 60 行](C:/Users/Robin/Documents/Codes/myblog/src/content/posts/agent-usage-ecosystem.mdx:60)。

**原句**：“客户端还可以在需要时向用户追问确认（elicitation）”。

**问题**：这不算方向完全写反，但省略发起方后，容易把 MCP 协议能力与 Agent 应用自己问用户一句话混为一谈。elicitation 的请求由服务器发起，客户端承接与用户的交互。

**可直接替换**：

> 服务器还可以通过支持 elicitation 的客户端，向用户索取补充信息或请求确认。

依据：[MCP elicitation 规范](https://modelcontextprotocol.io/specification/2026-07-28/client/elicitation)。这里不需要展开表单模式、URL 模式等细节。

## R04 · P2：“工牌”和“门禁卡”都像通行凭据，Hooks 宜统一叫“门禁检查”

**位置**：[第 66 行](C:/Users/Robin/Documents/Codes/myblog/src/content/posts/agent-usage-ecosystem.mdx:66)、第 86、133 行。

**原句**：“Hooks：门禁卡”；“门禁卡发错了人，比不发更糟”；大事记“‘门禁卡’登场”。

**问题**：MCP 刚用“工牌”讲接入，Hooks 又用“门禁卡”，两个对象都像发给 Agent 的凭据。本文真正要区分的却是接入方式与检查机制。正文和现有对比图已经在讲“门禁”，只需把文字统一，不需要改图。

**可直接修改的文字**：

- 第 66 行标题改为“Hooks：门禁检查”。
- 第 86 行末尾改为“——这些自动执行的代码，也可能直接执行危险操作”。
- 第 133 行改为“‘门禁检查’登场，固定点自动执行检查”。

依据：[Hooks 的生命周期定义](https://code.claude.com/docs/en/hooks#hook-lifecycle)。此项属于比喻清晰度建议，不是新增的技术错误。

## 本地验证与审查边界

- 使用与站点相同的 `remark-gfm`、`rehype-prism-plus`、`rehype-slug` 编译当前 MDX，通过，零警告。
- 封面与正文图片引用均存在；未发现悬空 Markdown 标签、遗留作者批注。
- 复审未修改文章或图片；新增的只有本记录。没有运行图片压缩、全站构建或与内容审查无关的测试。
- 上一轮已经核实、此次未变的日期与数字未全部重新检索。上轮尚未完成一手历史来源闭环的日期，不因正文未改就自动视为本轮已核实；本轮也没有据此判错。此处重点是当前修改稿的残留错误与新引入的混淆。

**发布判断**：文章已接近定稿。R01 是明确的技术修正；R02—R04 都可以用一句话或一个短语解决。修改后保留现有结构、叙事和配图即可。
