const LOCAL_FALLBACK = "http://localhost:3000";

export function getBaseUrl() {
  const env = process.env.SITE_URL?.trim();
  if (env) {
    let url: URL;
    try {
      url = new URL(env);
    } catch {
      throw new Error(`SITE_URL is not a valid absolute URL: ${env}`);
    }
    if (process.env.NODE_ENV === "production" && url.protocol !== "https:") {
      throw new Error(`SITE_URL must use https in production, got: ${env}`);
    }
    return url.origin + url.pathname.replace(/\/$/, "");
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("SITE_URL must be set for production builds; absolute links depend on it.");
  }
  return LOCAL_FALLBACK;
}

export const siteMetadata = {
  title: "Robin · 个人站点",
  description: "Robin 的工具、作品与日常记录。专注 Web 前端与产品体验，把想法做成可用的产品与工具。",
};
