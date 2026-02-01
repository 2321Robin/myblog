import type { NextConfig } from "next";
import createMDX from "@next/mdx";

// 使用字符串形式的插件名称以兼容 Turbopack 的可序列化要求
const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: ["rehype-prism-plus", "rehype-slug"],
  },
});

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  // 明确 Turbopack 根目录，避免父级 pnpm-lock 误判工作区
  turbopack: {
    root: __dirname,
  },
};

export default withMDX(nextConfig);
