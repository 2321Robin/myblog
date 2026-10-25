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

// 生产强制（2026-10-25 起），违规落 /api/csp-report。RSC 载荷与 next-themes 的
// 内联脚本需要 unsafe-inline，收紧到 nonce 会让整站转为动态渲染，收益不抵代价。
// 开发环境例外：React dev 需要 eval() 重建调用栈，dev 下改发 Report-Only 并
// 放宽 script-src 的 unsafe-eval，避免拦截浮层阻塞本地开发。
const CSP_REST = [
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "report-uri /api/csp-report",
];

function cspHeader() {
  const scriptSrc =
    process.env.NODE_ENV === "development" ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'" : "script-src 'self' 'unsafe-inline'";
  const policy = ["default-src 'self'", scriptSrc, ...CSP_REST].join("; ");
  return process.env.NODE_ENV === "development"
    ? { key: "Content-Security-Policy-Report-Only", value: policy }
    : { key: "Content-Security-Policy", value: policy };
}

const SECURITY_HEADERS = [
  // includeSubDomains：2026-10-25 核验 score / resume / minesweeper /
  // covenant / count 五个子站 HTTPS 均可达，knowquest / projects 已无解析。
  // 不做 preload：提交 hstspreload.org 后近乎不可逆，另案再议。
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
];

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  poweredByHeader: false,
  // No page uses the optimizer (content images are plain <img> with build-time
  // dimensions; the footer badge is a 14px PNG), so serve everything as-is and
  // keep the /_next/image entry out of the runtime.
  images: {
    unoptimized: true,
  },
  // 明确 Turbopack 根目录，避免父级 pnpm-lock 误判工作区
  turbopack: {
    root: __dirname,
  },
  async headers() {
    // Next 16 already emits immutable for hashed build output and warns when a
    // custom Cache-Control applies in development, where chunks are rewritten on
    // every edit. The override is for the production bundle only.
    const headers = [{ source: "/:path*", headers: [...SECURITY_HEADERS, cspHeader()] }];
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
