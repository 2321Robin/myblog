# 主题调研（截至 2026-10-20）

主题：2026-10 时点主流大模型定位差异与擅长领域（编程/写作/长文本/画图）、按任务选模型、多模型混用。
方法：官方发布页/文档/定价页优先，权威媒体次之；每条注明来源与日期。查不到的写"未能核实"。

> 与已核实锚点的一致性说明：
> 1. OpenAI GPT-6 Astra、GPT-6.1 Sol（2026-09）——与调研一致（Astra 2026-09-03 官宣，Sol 2026-09-29）。
> 2. DeepSeek V4.1-Flash 首发时间：锚点写"2026-10 首发"，**与官方矛盾**。DeepSeek 官方新闻页（news260910）明确 V4.1-Flash 首发为 **2026-09-10**，V4.1-Flash-1017 是 2026-10-17 的小版本更新。建议正文改为"2026-09-10 首发、10-17 更新"。
> 3. Codex 官方接入指南提供 `deepseek-flash` 与 `deepseek-v4-pro`——与调研一致（DeepSeek 官方定价页两个模型名并列；`deepseek-v4-flash` 为旧别名，仍可调用但路由到 Flash）。

## 一、家族×型号清单

| 家族 | 型号全称 | 首发/更新日期 | 定位 | 上下文 | 开放权重 | 模态 |
|---|---|---|---|---|---|---|
| OpenAI | GPT-6 Astra | 2026-09-03 官宣（分批推送） | 最强旗舰：计算机操作、编程、网络安全、专业工作 | 官方页未单独核实；长上下文档有加价（第三方称 >200K 加价） | 否 | 多模态 |
| OpenAI | GPT-6 Sol / GPT-6 Luna | 2026-09-22 进入 API 与 Codex；10-07 全量进 ChatGPT | 付费档=Sol，免费档=Luna（日常档） | 未能核实 | 否 | 多模态 |
| OpenAI | GPT-6.1 Sol | 2026-09-29 | "接近 Astra 的智能，1/5 价格"：agentic 编程、计算机操作、文档型专业工作 | 约 1.05M（官方发布文）；OpenRouter 页面标 128K，两处不一致 | 否 | 多模态 |
| Anthropic | Claude Fable 5 / Mythos 5（现 Fable 5.1） | 2026-06-09；5.1 更新日期未能核实 | "Mythos 级"更高档：大型编程项目、多日自主任务 | 未能核实 | 否 | 文本+图像+文件输入（OpenRouter 页） |
| Anthropic | Claude Opus 5.5 | 2026-09-22 | 旗舰主力 | API 1M（应用内 200K），最大输出约 128K | 否 | 多模态 |
| Anthropic | Claude Sonnet 5.5 | 2026-09-28 | 均衡主力（编码/日常） | 未能核实（同代通常 1M 档，未单独核实） | 否 | 多模态 |
| Anthropic | Claude Haiku 5.5 | 2026-10-07 | 最快轻量档（标准速度下官方称最快） | 未能核实 | 否 | 多模态 |
| Google | Gemini 4 Argon | 2026-09-30 早享（Fairwind）、2026-10-13 GA | 新旗舰，输出上限大幅提升 | 1M（1,048,576），输出最高 1M | 否 | 多模态 |
| Google | Gemini 3.6 Flash | 2026-09（3.8 Flash TTS 09-23 等） | 日常/快速档；Nano Banana 2.1 底座 | 未能核实 | 否 | 多模态 |
| Meta | Muse Spark 1.3（1.0: 2026-04-08；1.1: 07-09；1.2: 08；1.3: 09-22） | 2026-09-22 | 闭源旗舰，驱动 Meta AI（WhatsApp/IG/FB） | 未能核实 | Spark Open 816B 开放（第三方称） | 多模态推理 |
| Meta | Muse Glimmer | 2026-08-10 | 30B 密集、Apache 2.0，本地/端上 Agent（接替 Llama 开放位） | 未能核实 | 是（Apache 2.0） | 多模态 |
| xAI | Grok 4.7 | 2026-10-03 | 旗舰：编程与知识工作；Expert 模式；Grok 5 未发布 | 未能核实 | 否 | 多模态 |
| Mistral | Mistral Large 4（绰号 Le Chonk） | 2026-10-06 预览；权重计划 10-27 开放 | 旗舰，官方称部分领域超中国头部模型 | 未能核实 | 预览期闭源，10-27 开放（待验证） | 未能核实 |
| DeepSeek | DeepSeek-V4.1-Flash-1017（前代 V4.1-Flash 2026-09-10；V4-Pro-0813 2026-08-13） | 2026-10-17 | 552B MoE（输入激活 8B/输出 16B，Causal-Encoder-Decoder 新架构）；默认思考；原生视觉 | 1M，最大输出 384K | 是（HuggingFace，MIT） | 文本+视觉 |
| 阿里 Qwen | Qwen3.8-Max（百炼另有 qwen3.7-plus、qwen3.8-flash）；开源线 Qwen3.5-397B-A17B（2026-03）、Qwen3.8-27B（2026-08-12） | Qwen3.8-Max 2026-08-03 全量、08-12 开放权重（CNBC 称 2.4T） | 闭源旗舰 Max + 大规模开源线 | 未能核实 | 开源线是；Max 权重 08-12 开放（CNBC） | 多模态 |
| 智谱 GLM | GLM-5（2026-02-12）→5.1（04）→5.2（06）→GLM-5.3（2026-08-14）；GLM-5.3-Flash（2026-08-26，320B/18B 激活） | GLM-5.3 2026-08-14 | 开放权重编程旗舰；Flash 为首个原生多模态 | 未能核实 | 是（MIT，HF/ModelScope） | 5.3-Flash 原生多模态 |
| 月之暗面 Kimi | Kimi K3（K2.6 为前代） | 2026-07-16；07-27 开放权重 | 2.8T 开放权重推理模型，Kimi Delta Attention 架构；K3.1 传闻 10 月（未确认） | 1M（1,048,576） | 是 | 多模态推理 |
| MiniMax | M3.1 Flash（2026-10-19）；M3（06-01）；M2.7（03-18，200K） | M3.1 Flash 2026-10-19 | 日常高效主力；M3 面向 Agent 推理/工具/代码/多模态输入 | M2.7 200K；M3+ 未能核实 | 未能核实（M2 代开源） | 多模态输入 |
| 字节豆包 | 豆包大模型 2.0（Pro/Lite/Mini + Code）；Seed 2.1（2026-06-23） | 2026-02-14 | 生产级通用 Agent 模型 + 编程模型；"专家模式" | 未能核实 | 否 | 多模态 |

## 二、擅长领域证据

### 编程
- OpenAI：GPT-6.1 Sol 官方定位即 agentic coding + computer use；SonarSource 评测（2026-10-09）称比 GPT-6 Sol 多写 39% 代码、通过率更高。
- Anthropic：Opus 5.5 是 Arena 编程/文本榜首常客（arena.ai 10 月快照第 1）；Fable 5.1 官方页定位"最有野心编程项目"。
- Google：Gemini 4 Argon 领跑 Vals Index 与 DeepSWE v1.1（官方/评测方口径）。
- DeepSeek：V4.1-Flash-1017 官方称推理/编程/Agent/视觉全面升级；KV Cache 压缩使 Agent 任务成本大幅降低（官方 news260910）；已适配 Codex。
- GLM：GLM-5 系列副标题即 "From Vibe Coding to Agentic Engineering"；GLM-5.3 官方称开放权重中最强编程，Z.ai Code Bench 较 5.2 +50%；因涌现网络攻防能力，Anthropic 专门发布安全分析（开放权重可被移除拒绝机制）。
- Kimi：K3 定位"长程编码与知识工作"（SCMP）。
- 豆包：Doubao-Seed-Code 专用编程模型（2025-11-13 起）+ 豆包 2.0 Code。

### 长文本
- Gemini 4 Argon：1M 上下文 + 最高 1M 输出（官方），输出上限从 64K 提升——长文档产出口径最激进。
- DeepSeek V4.1-Flash：1M 上下文/384K 输出（官方定价页）。
- Kimi K3：1M（官方文档 1,048,576）。
- Claude Opus 5.5：API 1M（应用 200K）。
- GPT-6.1 Sol：官方发布文称约 1.05M（与 OpenRouter 标注 128K 矛盾，以官方为准并存疑）。
- Qwen3.8-Max：上下文未能核实（官方模型页未抓到数字）。

### 写作/中文创作
- 各家官方均主打"专业写作/设计判断"（Astra 官方语），但**没有可核实的"中文写作专项"跑分口径**。
- 侧面证据：知乎 2026-07 图像工具横评称即梦中文文字渲染 >92% 准确率（图像内文字，非文本写作）；Reddit 用户印象称 Qwen3-Max 对话"更像人"。写作能力建议正文以"社区口碑 + 官方产品定位"表述，避免虚构跑分。

### 多模态理解
- DeepSeek V4.1-Flash 原生视觉（官方 API 原生多模态）；V4-Pro 不支持图像（官方定价页）。
- GLM-5.3-Flash 是 GLM-5 系首个原生多模态（官方博客）。
- Kimi K3、Gemini 4 Argon、Muse Spark 1.1+、豆包 2.0 均多模态（各自发布页）。

### 图像生成（另一类模型）
- Google：Nano Banana 2.1（2026-10-06，基于 Gemini 3.6 Flash，The Decoder 称部分基准超上代 Pro 且更便宜）；Nano Banana 2（2026-02-26）；Nano Banana Pro（2025-11-20）。
- OpenAI：GPT Image 2（2026-04-21）→ GPT Images 2.5（2026-09-08：gpt-image-2.5-sunburst / -flare）。
- 字节：Seedream 4.0（2025-09，4K、参考图、中文文字渲染强）——即梦（Jimeng）底座。
- Midjourney：V8 alpha（2026-03-17）→ V8.1（04-14）→ V8.2（2026-07 前后，社区口径）。
- MiniMax：Image-01（2025-04，2026 无新版）；视频线 H3（2026-07-31）、Hailuo 2.3。
- 2026-10 主力格局：Google（Nano Banana 2.1）与 OpenAI（GPT Images 2.5）双头部，国产即梦/Seedream 主打中文文字与性价比，Midjourney 保持风格化社区。

## 三、价格量级表（查询时点 2026-10-20）

| 模型 | 输入/输出（每百万 token） | 币种 | 来源 |
|---|---|---|---|
| GPT-6 Astra | $10 / $50（长上下文档第三方称 $20 / $75） | USD | OpenAI 定价转述 + TechFabric/Exodata |
| GPT-6.1 Sol | $2 / $10（缓存输入 $0.10） | USD | OpenAI 官方发布文 |
| Claude Opus 5.5 | $4 / $20（较 Opus 5 降 20%；页面另有 $8/$40 档，解读存疑） | USD | Anthropic 官方页 |
| Gemini 4 Argon | 促销期 $2 / $10（至 11-30），后 $4 / $20；>200K 档 $4 / $18 | USD | 官方口径转述 |
| Grok 4.7 | $2 / $6 | USD | xAI（搜索摘要） |
| Kimi K3 | $3 / $15（缓存命中 $0.30–0.75）；OpenRouter 第三方约 $0.24 / $13 | USD | Moonshot 平台/OpenRouter |
| GLM-5.3-Flash | 约 $0.048 / $0.16 | USD | OpenRouter |
| DeepSeek V4.1-Flash（deepseek-flash） | 高峰：¥2 / ¥8；闲时半价（¥1 / ¥4）；缓存命中 ¥0.02–0.04 | CNY | DeepSeek 官方定价页 |
| DeepSeek V4-Pro（deepseek-v4-pro） | 高峰：¥9 / ¥27；闲时半价；缓存命中 ¥0.15–0.30 | CNY | DeepSeek 官方定价页 |
| Qwen3.8-Max | ¥12 / ¥36（缓存命中 ¥1.5；百炼阶梯计费） | CNY | 阿里云百炼官方文档 |
| GPT Image 2（图像 token） | $8 输入 / $2 缓存 / $30 输出 | USD | OpenAI 社区公告 |
| 订阅制参考 | Google AI Pro $19.99/月、Ultra $99.99 起；GLM Coding Plan 第三方称 $18/月起（闲时 5 折积分） | USD | 官方/第三方 |

量级结论：旗舰输出 $15–50；轻量/国产开放线输出 $0.2–10；DeepSeek 闲时 + 缓存命中是最低成本档（每百万几毛人民币级）。

## 四、榜单口径与混用现状

### 榜单口径
- SWE-bench 官方（swebench.com）：Full Verified 为 500 条人工过滤子集，**默认 bash-only、用 mini-SWE-agent 跑**——即官方榜单本身就是"模型+harness"组合。Epoch AI 页面也明确"除非另有说明，scaffold 是简单循环"。社区实测不同 scaffold 可造成 10%+ 分差（r/LocalLLaMA；arXiv 2506.17208 系统分析）。
- LMArena（arena.ai）：2026-10 快照出现两套口径——arena.ai 按胜率（Opus 5.5 (Max) 18.88%、GPT-6 Astra (Max) 14.13%、Fable 5.1），BenchLM 按 Elo（Gemini 4 Argon 约 1532 居首）。排名模型名带 "(Max)/(High)" 后缀 = 思考档位参与对比，引用时必须写全。
- 教训口径：引用任何分数需带"模型版本 + harness + 日期"三要素。

### 多模型混用
- Claude Code：官方仅 Anthropic 系（直连 + Bedrock `CLAUDE_CODE_USE_BEDROCK=1` + Vertex）；第三方模型需社区工具（如 CC Switch 接 DeepSeek）。原生 `/model opusplan` 别名：Plan Mode 用 Opus 规划、批准后自动切 Sonnet 执行——"贵模型规划、便宜模型执行"的官方化实现。
- Codex CLI：OpenAI 官方开放第三方接入（Responses API）。DeepSeek 2026-08-13 起原生适配 Codex，一键配置，模型名 `deepseek-flash` 与 `deepseek-v4-pro`（与锚点一致）；腾讯 WorkBuddy/CodeBuddy、OpenCode 亦全量接入。
- Cursor：原生聚合 OpenAI/Anthropic/Google/xAI 前沿模型；BYOK 支持 OpenAI/Anthropic/Google/Azure/Bedrock（xAI 走 Cursor 服务），Tab 等部分功能不可用 BYOK（官方帮助文档）。
- GLM Coding Plan：可在 Claude Code、Codex、Cline、OpenCode 等使用 GLM-5.3/5.3-Flash/5.2（官方订阅页）——国产订阅借壳国际 harness 的代表路径。
- 公开讨论：知乎/博客园多篇"贵的想、便宜的做"成本优化文；AugmentCode 2026-04 路由指南按任务角色分配 Opus/Sonnet/Haiku 级模型。

## 五、争议与未核实点

1. **DeepSeek V4.1-Flash 首发时间与锚点矛盾**（09-10 vs 10）：以官方新闻页为准，建议正文修正。
2. **LMArena 榜首两套口径冲突**（Opus 5.5 (Max) vs Gemini 4 Argon），且快照来自聚合站而非官方存档；引用需注明"2026-10 某快照"。
3. **Meta Muse 细节**：Spark 1.0 有官方 news 页，但 Spark Open 816B、Glimmer 30B 规格多来自二源（eesel.ai、Reddit）；dev.meta.ai 抓取失败未能终验。
4. **GPT-6.1 Sol 上下文**：官方约 1.05M vs OpenRouter 128K，未决。
5. **Qwen3.8-Max 上下文窗口**与"CNBC 称 2.4T 开放权重"细节未在官方页核实；Qwen3.6-Max-Preview 仅 Reddit 单源。
6. **Claude Opus 5.5 "$8/$40 extended thinking 档"**：仅单一来源转述官方页，含义（是否 effort 计价）存疑。
7. **Claude Fable/Mythos 体系**：官方页存在，但"Mythos 5 无安全分类器"等说法仅 Simon Willison 博客单源，需谨慎。
8. **Mistral Large 4 开放权重**：10-27 才到期，本调研时点尚未落地。
9. **K3.1（Kimi）10 月发布传闻**：未官方确认。
10. Gemini 3.6 Flash 具体发布日、各轻量档上下文多数未核实。

## 六、文章结构素材建议（只建议素材，不写正文）

- 开头钩子：2026-09-22 到 10-19 三十天内，Claude 5.5 三连发、GPT-6.1 Sol、Gemini 4 Argon GA、Grok 4.7、GLM-5.3、M3.1 Flash 密集落地——"模型换代周期已压到周级"。
- 选型四象限素材：预算极低（DeepSeek 闲时/缓存、GLM-5.3-Flash）→ 均衡编程（Sonnet 5.5、GPT-6.1 Sol、GLM-5.3）→ 旗舰攻坚（Opus 5.5、Astra、Gemini 4 Argon、Kimi K3）→ 本地/开源（Glimmer 30B、Qwen3.8-27B、DeepSeek 权重）。
- 长文本对比素材：Argon 1M 输出 vs DeepSeek 384K 输出 vs 通用 1M 窗口——"窗口大 ≠ 输出长"。
- 图像生成独立小节素材：Nano Banana 2.1 / GPT Images 2.5 / Seedream 4.0（中文文字）/ Midjourney V8.2，强调"这是另一类模型，别和对话模型混选"。
- 混用实战素材：opusplan（官方）、Codex+DeepSeek（官方一键）、Cursor BYOK 限制、GLM 借壳 Claude Code。
- 榜单素养素材：SWE-bench 默认 mini-SWE-agent、LMArena "(Max)" 后缀、10% scaffold 分差——教读者看懂"模型+ harness"。
- 避坑素材：第五节 1-7 条可直接化为"本文信息都有时效，注意核对"注脚。

## 七、延伸阅读链接（官方发布页优先）

- OpenAI GPT-6 Astra: https://openai.com/index/gpt-6-astra
- OpenAI GPT-6.1 Sol: https://openai.com/index/introducing-gpt-6-1-sol ；安全附录: https://deploymentsafety.openai.com（2026-09-29）
- OpenAI GPT Images 2.5: https://community.openai.com/t/introducing-gpt-images-2-5-in-the-api-and-chatgpt/1395897（2026-09-08）
- Anthropic Opus 5.5: https://www.anthropic.com/claude-opus-5-5 ；Haiku 5.5: https://www.anthropic.com/claude-haiku-5-5
- Anthropic Fable 5/Mythos 5: https://www.anthropic.com/news/claude-fable-5-mythos-5（2026-06-09）
- Claude Code Bedrock/Vertex: https://code.claude.com/docs/en/amazon-bedrock 、https://code.claude.com/docs/en/google-vertex-ai
- Gemini API 更新日志: https://ai.google.dev/gemini-api/docs/changelog（Gemini 4 Argon GA 2026-10-13）
- Nano Banana 2.1 报道: https://the-decoder.com/googles-new-image-model-nano-banana-2-1-generates-better-images-for-less-money（2026-10-06）
- Meta Muse Spark: https://about.fb.com/news/2026/04/introducing-muse-spark-meta-superintelligence-labs（2026-04-08）
- xAI News: https://x.ai/news（Grok 4.7、Grok Voice 3.0）
- Mistral Large 4: https://mistral.ai/news/mistral-large-4 ；Reuters: https://www.reuters.com/world/china/mistral-ceo-says-new-ai-model-beats-chinese-ones-some-areas-2026-10-06
- DeepSeek V4.1-Flash 发布: https://api-docs.deepseek.com/zh-cn/news/news260910 ；V4-Pro/Codex 适配: https://api-docs.deepseek.com/zh-cn/news/news260813 ；定价: https://api-docs.deepseek.com/zh-cn/quick_start/pricing
- DeepSeek-V4.1-Flash-1017 权重: https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash-1017
- Qwen3.8-Max（百炼）: https://help.aliyun.com/zh/model-studio/qwen3-8-max ；定价: https://help.aliyun.com/zh/model-studio/model-pricing
- GLM-5.3: https://z.ai/blog/glm-5.3 ；GLM-5.3-Flash: https://z.ai/blog/glm-5.3-flash ；GLM-5 技术报告: https://arxiv.org/html/2602.15763v1
- Anthropic 关于 GLM-5.3 的安全分析: https://www.anthropic.com/research/glm-5-3-and-the-spread-of-advanced-cyber-capabilities
- Kimi K3（SCMP/Bedrock）: https://www.scmp.com/tech/tech-trends/article/3368274/moonshots-kimi-k3-lands-amazon-key-test-chinese-open-source-ai-revenue（2026-09-21）
- MiniMax 模型发布动态: https://platform.minimax.cn/docs/release-notes/models
- 豆包 2.0（财新）: https://m.caixin.com/m/2026-02-14/102414794.html ；Seed 2.1: https://seed.bytedance.com/zh/blog/seed2-1-officially-released-advancing-ai-productivity
- Seedream 4.0: https://seed.bytedance.com/zh/seedream4_0
- SWE-bench 官方: https://www.swebench.com ；harness 分析: https://arxiv.org/html/2506.17208v2 ；Epoch AI: https://epoch.ai/benchmarks/swe-bench-verified
- LMArena: https://arena.ai/leaderboard
- Cursor BYOK: https://cursor.com/help/models-and-usage/api-keys ；模型与定价: https://cursor.com/docs/models-and-pricing
