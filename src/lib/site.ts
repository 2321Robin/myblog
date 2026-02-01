export function getBaseUrl() {
  const env = process.env.SITE_URL?.trim();
  if (env) return env.replace(/\/$/, "");
  return "http://localhost:3000";
}

export const siteMetadata = {
  title: "MyBlog",
  description: "记录构建与思考，专注 Web、前端与产品体验。",
};
