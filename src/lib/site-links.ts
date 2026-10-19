export type SiteIcon = "score" | "game" | "resume" | "projects" | "github" | "video" | "writing" | "home" | "stats" | "blog" | "tags" | "rss";
export type SiteCategory = "tools" | "projects" | "social" | "more";

export type SiteLink = {
  id: string;
  title: string;
  href: string;
  description: string;
  category: SiteCategory;
  icon: SiteIcon;
  keywords?: string[];
};

export const siteGroups: { id: SiteCategory; title: string; description: string }[] = [
  { id: "tools", title: "网站与工具", description: "可以直接打开的站点、游戏与小工具。" },
  { id: "projects", title: "项目与代码", description: "自己构建的工具，也参与开源项目的改进。" },
  { id: "social", title: "内容与社交", description: "文章、代码，还有偶尔更新的视频。" },
  { id: "more", title: "其它入口", description: "个人域名下的更多站点。" },
];

// 新增站点只需在这里添加记录；分组、搜索和卡片布局会自动更新。
export const siteLinks: SiteLink[] = [
  { id: "score", title: "打牌计分", href: "https://score.w2321.top", description: "线下牌局快速算分的小工具。", category: "tools", icon: "score", keywords: ["cards", "score", "计分器"] },
  { id: "minesweeper", title: "扫雷游戏", href: "https://minesweeper.w2321.top", description: "自制网页版扫雷，支持快捷键。", category: "tools", icon: "game", keywords: ["minesweeper", "game"] },
  { id: "resume", title: "在线简历", href: "https://resume.w2321.top", description: "我的在线简历，可下载 PDF。", category: "tools", icon: "resume", keywords: ["resume", "cv"] },
  { id: "covenant", title: "卫戍协议：盟约", href: "https://covenant.w2321.top/", description: "明日方舟同人自走棋塔防，支持单人和联机合作。", category: "tools", icon: "game", keywords: ["Stronghold", "Protocol", "covenant", "游戏"] },
  { id: "capture-counter", title: "精灵捕捉计数器", href: "https://count.w2321.top/", description: "记录精灵遭遇与捕捉。暂未维护，有需要可联系我。", category: "tools", icon: "stats", keywords: ["count", "赛季", "计数器"] },
  { id: "project-stronghold", title: "Stronghold-Protocol", href: "https://github.com/2321Robin/Stronghold-Protocol", description: "卫戍协议同人复刻。Fork · 上游贡献者，6 次合并。", category: "projects", icon: "github", keywords: ["卫戍协议", "盟约", "covenant", "开源", "贡献"] },
  { id: "project-qq-bot", title: "qq_bot", href: "https://github.com/2321Robin/qq_bot", description: "QQ 群机器人：精灵查询、AI 对话、搜索与定时消息。", category: "projects", icon: "github", keywords: ["NoneBot", "NapCat", "Python", "自动化"] },
  { id: "project-scorecard", title: "ScoreCard", href: "https://github.com/2321Robin/ScoreCard", description: "打牌计分工具，为线下牌局快速统计输赢。", category: "projects", icon: "github", keywords: ["打牌", "计分", "cards"] },
  { id: "project-count", title: "count", href: "https://github.com/2321Robin/count", description: "分赛季的精灵捕捉记录与同步。暂未维护，有需要可联系我。", category: "projects", icon: "github", keywords: ["精灵", "捕捉", "计数器"] },
  { id: "project-minesweeper", title: "MineSweeper", href: "https://github.com/2321Robin/MineSweeper", description: "自制网页版扫雷，支持快捷键操作。", category: "projects", icon: "github", keywords: ["扫雷", "游戏", "TypeScript"] },
  { id: "blog", title: "博客文章", href: "/blog", description: "记录构建、学习与思考。", category: "social", icon: "blog", keywords: ["blog", "写作"] },
  { id: "github", title: "GitHub", href: "https://github.com/2321Robin", description: "项目代码与开源贡献。", category: "social", icon: "github", keywords: ["code", "代码"] },
  { id: "bilibili", title: "哔哩哔哩", href: "https://space.bilibili.com/2062699686", description: "视频与内容更新。", category: "social", icon: "video", keywords: ["bilibili", "b站"] },
  { id: "csdn", title: "CSDN 博客", href: "https://blog.csdn.net/Robin2321", description: "技术文章与随笔。", category: "social", icon: "writing" },
  { id: "tags", title: "文章标签", href: "/blog/tags", description: "从感兴趣的主题开始阅读。", category: "social", icon: "tags", keywords: ["tags", "分类"] },
  { id: "rss", title: "RSS 订阅", href: "/rss.xml", description: "在阅读器中接收文章更新。", category: "social", icon: "rss", keywords: ["feed", "订阅"] },
  { id: "home", title: "主域名 / 主页", href: "https://w2321.top", description: "个人域名的首页入口。", category: "more", icon: "home" },
];

export function filterSiteLinks(links: SiteLink[], query: string): SiteLink[] {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return links.filter((link) => {
    const text = [link.title, link.description, link.href, ...(link.keywords ?? [])].join(" ").toLowerCase();
    return words.every((word) => text.includes(word));
  });
}

export function getLinkHost(href: string): string {
  return href.startsWith("/") ? `本站 · ${href}` : new URL(href).hostname;
}
