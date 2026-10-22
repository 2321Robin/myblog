# AI 协作者通用规范

本文件对在本仓库工作的所有 AI 生效，是协作者之间的约定，不是给读者的文档。写作相关的细节见 [`docs/writing-guide.md`](docs/writing-guide.md)，两者不冲突，互为补充。

## 一、只做被要求的事

- 用户否决过的方案、写法、风格，不再重提、不再变相重做。
- **配图到手即插**：用户贴图、或图片已生成/已落在仓库里的同一轮，必须立即改名落盘、压缩、写 alt、替换占位注释、补 `metadata.cover`；**MUST NOT** 等用户说"配图好了"再动手，也**MUST NOT** 文中留着"待生成"注释而图片已存在。操作细则见 `docs/writing-guide.md` 第四节。
- **严禁擅自删除已落入正文的图片**：如需调整图片位置、尺寸或类名，先同步告知作者再改；**MUST NOT** 未经允许把插入正文的图片移出或替换为占位注释。
- 工作过程中发现的其它问题（缺陷、可优化点、新想法）不当场修：口头汇报给用户，或按性质记进 `docs/backlog.md`，等用户安排。
- 收尾汇报只描述本任务相关改动，不夹杂无关发现。

## 二、提交卫生（多 AI 协作）

本仓库经常有多个 AI 在不同对话里同时工作，工作区里别人的未提交改动是常态。

- 提交前 MUST 跑 `git status` 逐个核对，只 `git add` 自己任务产出的文件。
- NEVER `git add -A`、`git add .`、`git commit -a`；不用 `git stash` 处理不属于自己的改动。
- 别人未提交的改动原样留在工作区，不进本次提交，也不还原、不覆盖。
- 提交信息沿用现有约定：`feat:` / `fix:` / `docs:` / `style:` / `chore:` + 一句话描述，一次提交只装一个逻辑改动。
- 拿不准某个文件是否属于本任务时，问用户，不猜。
- **任务完成即提交**：每个任务收尾时立刻把本轮自己的改动提交掉，不留未提交状态过夜或跨会话。工作区里的未提交文件容易被别的会话误还原、误覆盖（`git checkout`、`git stash`、冲突解决都可能波及），提交是最省事的保护。

## 三、一个对话 = 一篇文章或一项网页改进

- 一个对话只处理其中一件，避免上下文互相污染：
  - 一篇文章：`src/content/posts/<slug>.mdx` 及其配图、引用资源、该篇文章专属的文档记录；
  - 一项网页改进：站点功能、样式、导航或某页布局的一处改动。
- 需要跨多篇文章或跨多个站点模块的改动，先拆成多个对话，或明确征得用户同意后在同一对话继续。
- 同一对话中接到与本任务无关的第二件事时，停下来问用户：合并处理，还是另开对话。
- **改文字与改图片分属不同会话**：改正文（写作、批注修订、排版、结构调整）和插图的落盘、压缩、插入、换图、调位置，不要在同一会话里混着做；两件事都要做时分成两个会话，避免上下文过长出现遗漏。确有需要合并处理的，先征得用户同意。

> 每个会话只负责一类改动（文字或图片），任务相关的验证只跑与本改动相关的部分：`npm test` / `npm run type-check` / `npm run lint`，站点类改动再跑 `node scripts/check-site.mjs`。

## 四、图片一律由作者本人绘制

- 所有文章插图（信息图、吉祥物 / 立绘、封面）由用户亲手绘制。AI **MUST NOT** 调用图像生成模型出图，**MUST NOT** 用手写 SVG、Graphviz、Mermaid 或代码绘制的图形冒充插画，**MUST NOT** 从外部抓取图片充数。
- 缺图时交付的是提示词，不是图：按 `docs/writing-guide.md` 第四节的四要素为每张图写生成提示词（风格锚点、逐字写死的中文标签、构图与阅读流向、比例与配色），连同计划的插入位置一起交给用户，由用户决定何时绘制。
- 作者交图后的处理按第一节「配图到手即插」执行：改名落盘、压缩、写 alt、替换占位注释、补 `metadata.cover`。
- 已插入正文的图片，调整位置、尺寸、类名或删除前先告知作者（见第一节）。
- 站点功能图标（lucide 图标、`src/app/icon.svg` 等）不属"绘图"，但新增或更换同样遵循第一节：先问再做。

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
