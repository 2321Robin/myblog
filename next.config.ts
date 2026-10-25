import path from "node:path";
import type { NextConfig } from "next";
import createMDX from "@next/mdx";

// Turbopack 序列化 loader options，插件必须是模块路径字符串；函数引用无法序列化。
// 用绝对路径，因为 loader 在 node_modules 里解析相对路径。
const rehypeImageAttributes = path.join(__dirname, "scripts", "mdx-image-attributes.mjs");

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: ["rehype-prism-plus", "rehype-slug", rehypeImageAttributes],
  },
});

// Report-Only：先观察违规，不拦截。RSC 载荷与 next-themes 的内联脚本需要 unsafe-inline，
// 收紧到 nonce 会让整站转为动态渲染，收益不抵代价。
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const SECURITY_HEADERS = [
  // 不带 includeSubDomains / preload：其它子站未逐一核验。
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Content-Security-Policy-Report-Only", value: CONTENT_SECURITY_POLICY },
];

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  poweredByHeader: false,
  // 明确 Turbopack 根目录，避免父级 pnpm-lock 误判工作区
  turbopack: {
    root: __dirname,
  },
  async headers() {
    // Next 16 already emits immutable for hashed build output and warns when a
    // custom Cache-Control applies in development, where chunks are rewritten on
    // every edit. The override is for the production bundle only.
    const headers = [{ source: "/:path*", headers: SECURITY_HEADERS }];
    if (process.env.NODE_ENV === "production") {
      headers.push(
        {
          source: "/_next/static/:path*",
          headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
        },
        // Content images carry a build-time ?v= content hash (rehype plugin +
        // versionedImageUrl), so they can be immutable-cached and still be
        // replaced in place.
        {
          source: "/images/:path*",
          headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
        },
      );
    }
    return headers;
  },
};

export default withMDX(nextConfig);
