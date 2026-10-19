// 扫描文章中的【】标注（作者批注），逐条打印文件、行号和上下文。
// 用法：node scripts/list-annotations.mjs
import fs from "node:fs";
import path from "node:path";

const postsDir = path.join(process.cwd(), "src", "content", "posts");
let total = 0;

for (const file of fs.readdirSync(postsDir).sort()) {
  if (!file.endsWith(".mdx")) continue;
  const lines = fs.readFileSync(path.join(postsDir, file), "utf8").split("\n");
  lines.forEach((line, i) => {
    for (const match of line.matchAll(/【[^】]*】/g)) {
      total += 1;
      console.log(`${file}:${i + 1}`);
      console.log(`  标注：${match[0]}`);
      console.log(`  原句：${line.trim()}`);
      console.log("");
    }
  });
}

console.log(total === 0 ? "没有找到标注。" : `共 ${total} 处标注。`);
