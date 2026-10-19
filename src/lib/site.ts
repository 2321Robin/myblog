export function getBaseUrl() {
  const env = process.env.SITE_URL?.trim();
  if (env) return env.replace(/\/$/, "");
  return "http://localhost:3000";
}

export const siteMetadata = {
  title: "Robin · 个人站点",
  description: "Robin 的工具、作品与日常记录。专注 Web 前端与产品体验，把想法做成可用的产品与工具。",
};
