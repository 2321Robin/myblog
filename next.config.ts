import type { NextConfig } from "next";
import createMDX from "@next/mdx";

// 使用字符串形式的插件名称以兼容 Turbopack 的可序列化要求
const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: ["rehype-prism-plus"],
  },
});

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
};

export default withMDX(nextConfig);
