// 发布前压缩文章配图：public/images/posts 下的 PNG/JPG 转为同尺寸 WebP 并替换原文件。
// 用法：node scripts/compress-images.mjs（可重复运行，已是 WebP 的文件自动跳过）
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const POSTS_DIR = path.join(process.cwd(), "public", "images", "posts");
const MAX_WIDTH = 1600;
const QUALITY = 82;

async function collectImages(dir) {
  const files = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await collectImages(full)));
    else if (/\.(png|jpe?g)$/i.test(entry.name)) files.push(full);
  }
  return files;
}

const files = await collectImages(POSTS_DIR);
if (files.length === 0) {
  console.log("没有需要压缩的图片。");
  process.exit(0);
}

let beforeTotal = 0;
let afterTotal = 0;
for (const file of files) {
  const out = file.replace(/\.(png|jpe?g)$/i, ".webp");
  const before = (await fs.stat(file)).size;
  let pipeline = sharp(file);
  const meta = await pipeline.metadata();
  if ((meta.width ?? 0) > MAX_WIDTH) pipeline = pipeline.resize({ width: MAX_WIDTH });
  await pipeline.webp({ quality: QUALITY }).toFile(out);
  const after = (await fs.stat(out)).size;
  if (out !== file) await fs.rm(file);
  beforeTotal += before;
  afterTotal += after;
  console.log(
    `${path.relative(process.cwd(), out)}  ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB`
  );
}

console.log(
  `合计 ${(beforeTotal / 1024 / 1024).toFixed(1)}MB → ${(afterTotal / 1024 / 1024).toFixed(1)}MB`
);
