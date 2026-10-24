import test from "node:test";
import assert from "node:assert/strict";

const { computeReadingTimeMinutes } = await import("../src/lib/posts.ts");

// 400 个汉字或 200 个拉丁词按一分钟算，向上取整。
test("counts Chinese prose at 400 characters per minute", () => {
  assert.equal(computeReadingTimeMinutes("字".repeat(400)), 1);
  assert.equal(computeReadingTimeMinutes("字".repeat(401)), 2);
  assert.equal(computeReadingTimeMinutes("字".repeat(800)), 2);
});

test("counts latin words at 200 words per minute", () => {
  assert.equal(computeReadingTimeMinutes("word ".repeat(200)), 1);
  assert.equal(computeReadingTimeMinutes("word ".repeat(201)), 2);
});

test("never reports less than one minute", () => {
  assert.equal(computeReadingTimeMinutes(""), 1);
  assert.equal(computeReadingTimeMinutes("短"), 1);
});

// 回归：旧实现把图片 alt 与链接地址当正文，每篇多算一两分钟。
test("ignores image alt text and link URLs", () => {
  const withImage = `正文。\n\n![${"图".repeat(800)}](/images/a.webp)`;
  assert.equal(computeReadingTimeMinutes(withImage), 1);

  const withLink = `正文，[${"链".repeat(800)}](https://example.com/${"path".repeat(200)})`;
  assert.equal(computeReadingTimeMinutes(withLink), 3);
});

test("ignores frontmatter, code blocks and inline code", () => {
  const source = [
    "export const metadata = {",
    `  summary: "${"摘".repeat(1200)}",`,
    "};",
    "",
    "# 标题",
    "",
    `\`\`\`text\n${"码".repeat(1200)}\n\`\`\``,
    "",
    `行内 \`${"段".repeat(400)}\` 代码。`,
    "",
    "正文。",
  ].join("\n");
  assert.equal(computeReadingTimeMinutes(source), 1);
});

test("keeps link text, headings and table cells in the count", () => {
  const source = `## ${"标".repeat(400)}\n\n| ${"格".repeat(400)} |\n\n[${"链".repeat(400)}](/blog/x)`;
  assert.equal(computeReadingTimeMinutes(source), 3);
});
