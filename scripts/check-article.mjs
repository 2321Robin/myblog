// 发布前检查文章正文的 Markdown 渲染问题，重点是"写了 ** 却没渲染成加粗"。
// 用法：node scripts/check-article.mjs [slug...]（缺省检查 src/content/posts 下全部文章）
//
// 为什么需要它：CommonMark 的强调分隔符规则会拒绝一部分看似合法的写法。
// 例如 `切到 **「开发」**就行`，闭合的 ** 紧贴中文标点，整段退化成纯文本，
// 页面上直接显示星号。这类问题编译不报错，只能靠解析结果反查。
import fs from "node:fs";
import path from "node:path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import { visit } from "unist-util-visit";

const postsDir = path.join(process.cwd(), "src", "content", "posts");
const only = process.argv.slice(2);
const files = fs
  .readdirSync(postsDir)
  .filter((file) => file.endsWith(".mdx"))
  .filter((file) => only.length === 0 || only.includes(file.replace(/\.mdx$/, "")))
  .sort();

// 只看 ** 与 __：单个 * 在中文正文里常作乘号或占位，误报太多。
const MARKERS = /\*\*|__/;
let problems = 0;

function report(file, line, message, excerpt) {
  problems += 1;
  console.log(`${file}:${line}  ${message}`);
  console.log(`  原文：${excerpt.trim()}`);
}

for (const file of files) {
  const source = fs.readFileSync(path.join(postsDir, file), "utf8");
  const processor = unified().use(remarkParse).use(remarkMdx).use(remarkGfm);
  const tree = processor.parse(source);

  // 文本节点里残留的强调标记，就是没能渲染成 <strong>/<em> 的那些。
  visit(tree, "text", (node) => {
    if (!MARKERS.test(node.value)) return;
    const line = node.position?.start.line ?? 0;
    const lineText = source.split("\n")[line - 1] ?? node.value;
    report(file, line, "加粗/斜体标记未渲染，页面上会显示成字面星号", lineText);
  });

  // 空强调（** **）同样渲染不出可见效果。
  visit(tree, "strong", (node) => {
    const text = node.children.map((child) => child.value ?? "").join("");
    if (text.trim() === "") {
      report(file, node.position?.start.line ?? 0, "空的加粗标记", "");
    }
  });
}

console.log(problems === 0 ? `检查通过：${files.length} 篇正文没有残留强调标记。` : `共 ${problems} 处需要修复。`);
process.exitCode = problems === 0 ? 0 : 1;
