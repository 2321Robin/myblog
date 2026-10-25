import assert from "node:assert/strict";

const base = process.argv[2] ?? "http://127.0.0.1:3003";
const routes = ["/", "/blog", "/blog/tags", "/blog/ai-model-agent-harness", "/blog/agent-usage-ecosystem", "/blog/agent-getting-started", "/blog/harness-comparison", "/blog?tag=ai", "/blog?page=1.5", "/blog?page=Infinity", "/blog?tag=ai&tag=agent", "/blog?page=1&page=2", "/blog?tag=no-such-tag", "/rss.xml", "/sitemap.xml", "/robots.txt", "/search-index", "/og.png", "/icon.svg"];
const bodies = new Map();
const headers = new Map();

for (const route of routes) {
  const response = await fetch(`${base}${route}`, { signal: AbortSignal.timeout(45000) });
  assert.equal(response.status, 200, `${route} status`);
  const body = await response.text();
  bodies.set(route, body);
  headers.set(route, response.headers);
  if (route === "/" || route.startsWith("/blog")) {
    assert.equal((body.match(/<h1\b/g) ?? []).length, 1, `${route} should render one main heading`);
    assert.ok(body.includes('id="main-content"'), `${route} skip-link target`);
    assert.ok(body.includes("赣ICP备2026002780号"), `${route} footer`);
  }
  console.log(`PASS ${route}`);
}

// Security headers must be present on every HTML surface, and the framework banner must be gone.
for (const route of ["/", "/blog", "/blog/tags", "/blog/ai-model-agent-harness", "/blog/agent-usage-ecosystem", "/blog/agent-getting-started", "/blog/harness-comparison"]) {
  const h = headers.get(route);
  assert.equal(h.get("x-content-type-options"), "nosniff", `${route} nosniff`);
  assert.equal(h.get("x-frame-options"), "SAMEORIGIN", `${route} frame options`);
  assert.equal(h.get("referrer-policy"), "strict-origin-when-cross-origin", `${route} referrer policy`);
  assert.match(h.get("permissions-policy") ?? "", /camera=\(\)/, `${route} permissions policy`);
  const hsts = h.get("strict-transport-security") ?? "";
  assert.match(hsts, /max-age=31536000/, `${route} HSTS max-age`);
  assert.ok(/includeSubDomains/i.test(hsts), `${route} HSTS covers the verified subdomains`);
  const csp = h.get("content-security-policy") ?? "";
  assert.match(csp, /default-src 'self'/, `${route} CSP enforced`);
  assert.match(csp, /report-uri \/api\/csp-report/, `${route} CSP reports to the collector`);
  assert.equal(h.get("x-powered-by"), null, `${route} must not advertise the framework`);
}
console.log("PASS security headers on every HTML surface");

// Hashed build output is immutable; error pages must not be cached for a year.
const homeHtml = bodies.get("/");
const staticAsset = homeHtml.match(/\/_next\/static\/[^"]+\.(?:js|css)/)?.[0];
assert.ok(staticAsset, "homepage references a hashed static asset");
const staticResponse = await fetch(`${base}${staticAsset}`, { signal: AbortSignal.timeout(20000) });
assert.equal(staticResponse.status, 200, `static asset ${staticAsset}`);
assert.equal(staticResponse.headers.get("cache-control"), "public, max-age=31536000, immutable", "hashed assets cached for a year");
console.log("PASS hashed static assets use a long-lived immutable cache");

const home = homeHtml;
assert.ok(home.includes("<title>Robin · 个人站点</title>"), "homepage must be the deployed Robin redesign, not a cached older version");
assert.ok(home.includes('id="directory-title"') && home.includes("从这里，去逛逛。"), "navigation directory must be present in deployed HTML");
for (const encoding of ["identity", "gzip, deflate, br"]) {
  const response = await fetch(`${base}/`, { headers: { "Accept-Encoding": encoding }, signal: AbortSignal.timeout(20000) });
  assert.equal(response.status, 200, `homepage with ${encoding}`);
  const html = await response.text();
  assert.ok(html.includes("<title>Robin · 个人站点</title>"), `cached homepage variant ${encoding} must use the deployed redesign`);
}
console.log("PASS deployed homepage version across identity/gzip cache variants");
for (const href of ["https://w2321.top", "https://score.w2321.top", "https://resume.w2321.top", "https://minesweeper.w2321.top", "https://covenant.w2321.top/", "https://github.com/2321Robin", "https://count.w2321.top/", "https://space.bilibili.com/2062699686", "https://blog.csdn.net/Robin2321", "mailto:2932547376@qq.com"]) {
  assert.ok(home.includes(`href="${href}"`), `confirmed destination ${href}`);
}
for (const repo of ["Stronghold-Protocol", "qq_bot", "ScoreCard", "count", "MineSweeper"]) {
  assert.ok(home.includes(`href="https://github.com/2321Robin/${repo}"`), `selected repository ${repo}`);
}
for (const excluded of ["knowquest.w2321.top", "projects.w2321.top", "MaaAssistantArknights", "SmartStudyAssistant", "xingchen-mall-db-lab"]) {
  assert.ok(!home.includes(excluded), `unselected destination ${excluded} must stay out of the homepage`);
}
assert.ok(home.includes("Fork · 上游贡献者，6 次合并。"), "Stronghold fork and contribution attribution");
assert.ok(home.includes("暂未维护，有需要可联系我。"), "count maintenance status");
assert.ok(!home.includes("访问统计"), "capture counter must not be mislabeled as visitor analytics");
for (const id of ["blog", "about", "projects", "links"]) assert.ok(home.includes(`id="${id}"`), `anchor ${id}`);
assert.ok(home.indexOf('id="projects"') < home.indexOf('id="blog"'), "directory precedes articles");
assert.ok(bodies.get("/blog/ai-model-agent-harness").includes('id="先从一场股灾说起"'), "MDX heading anchor");
assert.ok(bodies.get("/blog/agent-getting-started").includes('id="第-1-步下载安装包"'), "getting-started heading anchor");
assert.ok(bodies.get("/blog/agent-getting-started").includes("允许完全访问"), "getting-started revised permission wording");
assert.ok(!bodies.get("/blog/agent-getting-started").includes("直接同意"), "retired approval advice must not reappear");
assert.ok(bodies.get("/blog/agent-usage-ecosystem").includes('id="hooks门禁检查"'), "ecosystem article heading anchor");
assert.ok(bodies.get("/blog/agent-usage-ecosystem").includes("门禁检查"), "ecosystem article revised wording");
assert.ok(!bodies.get("/blog/agent-usage-ecosystem").includes("门禁卡"), "retired metaphor must not reappear");
assert.ok(bodies.get("/blog/harness-comparison").includes('id="开场外壳比模型变得还快"'), "harness comparison opening heading anchor");
// Figure placeholders live in drafts only; a published article must never ship one.
for (const slug of ["ai-model-agent-harness", "agent-usage-ecosystem", "agent-getting-started", "harness-comparison"]) {
  assert.ok(!bodies.get(`/blog/${slug}`).includes("待配图"), `${slug} must not ship with figure placeholders`);
}
assert.ok(bodies.get("/blog?tag=no-such-tag").includes("这个标签下还没有文章"), "empty filter state");
const indexed = JSON.parse(bodies.get("/search-index")).posts;
for (const slug of ["ai-model-agent-harness", "agent-usage-ecosystem", "agent-getting-started", "harness-comparison"]) assert.ok(indexed.some((post) => post.slug === slug), `post ${slug} indexed`);
for (const slug of ["hello-world", "next-roadmap"]) assert.ok(!indexed.some((post) => post.slug === slug), `removed post ${slug} not indexed`);
const missing = await fetch(`${base}/blog/not-an-existing-post`, { signal: AbortSignal.timeout(15000) });
assert.equal(missing.status, 404, "unknown post");
assert.ok(!/s-maxage=31536000/.test(missing.headers.get("cache-control") ?? ""), "404 must not be cached for a year");
console.log("PASS selected destinations, project attribution, maintenance status, anchors, reading behavior, index and 404");

const drafts = ["model-landscape-2026"];
for (const draft of drafts) {
  const response = await fetch(`${base}/blog/${draft}`, { signal: AbortSignal.timeout(45000) });
  assert.equal(response.status, 404, `${draft} draft must stay offline`);
  console.log(`PASS /blog/${draft} draft offline`);
}
for (const route of ["/blog", "/blog/tags", "/sitemap.xml", "/rss.xml", "/search-index"]) {
  for (const draft of drafts) assert.ok(!bodies.get(route).includes(draft), `${route} must not reference draft ${draft}`);
}
console.log("PASS draft posts stay out of every index");

// The local editor writes MDX that Next.js compiles, so production must refuse
// it outright. Probe with a slug that does not exist and an empty body: if the
// guard ever regresses, the request cannot damage a real article.
const savePost = await fetch(`${base}/api/dev/save-post`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ slug: "not-a-real-post", content: "" }),
  signal: AbortSignal.timeout(15000),
});
assert.equal(savePost.status, 404, "production save endpoint must be gone");
console.log("PASS /api/dev/save-post is disabled outside development");

// The CSP report collector accepts reports and is never cached.
const cspReport = await fetch(`${base}/api/csp-report`, {
  method: "POST",
  headers: { "content-type": "application/csp-report" },
  body: JSON.stringify({ "csp-report": { "document-uri": "check-site-probe", "violated-directive": "probe" } }),
  signal: AbortSignal.timeout(15000),
});
assert.equal(cspReport.status, 204, "csp report collector responds 204");
// Shared proxies may stack their own no-cache directive; no-store must survive.
assert.match(cspReport.headers.get("cache-control") ?? "", /no-store/, "csp report collector is not cached");
console.log("PASS /api/csp-report collects violation reports");

// Canonical links: each page points at itself, with out-of-range pages rejected.
function canonicalOf(route) {
  return bodies.get(route).match(/<link rel="canonical" href="([^"]+)"/)?.[1];
}
// Absolute links come from SITE_URL; fall back to the server under test.
const origin = (process.env.SITE_URL ?? new URL(base).origin).replace(/\/$/, "");
const canonicalExpectations = [
  ["/", origin],
  ["/blog", `${origin}/blog`],
  ["/blog/tags", `${origin}/blog/tags`],
  ["/blog?page=1", `${origin}/blog`],
  ["/blog?page=1.5", `${origin}/blog`],
  ["/blog?page=Infinity", `${origin}/blog`],
  ["/blog?tag=ai", `${origin}/blog?tag=ai`],
  ["/blog/ai-model-agent-harness", `${origin}/blog/ai-model-agent-harness`],
  ["/blog/agent-usage-ecosystem", `${origin}/blog/agent-usage-ecosystem`],
  ["/blog/agent-getting-started", `${origin}/blog/agent-getting-started`],
  ["/blog/harness-comparison", `${origin}/blog/harness-comparison`],
];
for (const [route, expected] of canonicalExpectations) {
  if (!bodies.has(route)) {
    const response = await fetch(`${base}${route}`, { signal: AbortSignal.timeout(45000) });
    assert.equal(response.status, 200, `${route} status`);
    bodies.set(route, await response.text());
  }
  assert.equal(canonicalOf(route), expected, `${route} canonical`);
}
const outOfRange = await fetch(`${base}/blog?page=999999`, { signal: AbortSignal.timeout(30000) });
assert.equal(outOfRange.status, 404, "page beyond the last one must be a 404, not a soft duplicate");
console.log("PASS canonical links and pagination bounds");

const sitemap = bodies.get("/sitemap.xml");
for (const path of ["/blog", "/blog/tags", "/blog/ai-model-agent-harness", "/blog/agent-usage-ecosystem", "/blog/agent-getting-started", "/blog/harness-comparison"]) {
  assert.ok(sitemap.includes(`<loc>${origin}${path}</loc>`), `sitemap lists ${path}`);
}
assert.match(sitemap, new RegExp(`<url><loc>${origin}</loc></url>`), "homepage entry omits lastmod");
console.log("PASS sitemap covers listings and only stamps articles with lastmod");

// Article share cards must describe the article, not the homepage.
for (const [slug, cover] of [["ai-model-agent-harness", "/images/posts/ai-model-agent-harness/cover.webp"], ["agent-usage-ecosystem", "/images/posts/agent-usage-ecosystem/cover.webp"], ["agent-getting-started", "/images/posts/agent-getting-started/cover.webp"], ["harness-comparison", "/images/posts/harness-comparison/cover.webp"]]) {
  const html = bodies.get(`/blog/${slug}`);
  const url = `${origin}/blog/${slug}`;
  assert.ok(html.includes(`<meta property="og:url" content="${url}"`), `${slug} og:url`);
  assert.ok(html.includes('<meta property="og:type" content="article"'), `${slug} og:type`);
  assert.ok(html.includes(`<meta property="og:image" content="${origin}${cover}?v=`), `${slug} og:image uses its versioned cover`);
  assert.ok(html.includes('<meta name="twitter:title" content='), `${slug} twitter:title present`);
  const ogTitle = html.match(/<meta property="og:title" content="([^"]+)"/)?.[1];
  assert.ok(ogTitle && !ogTitle.includes("个人站点"), `${slug} og:title must be the article title`);
  assert.ok(!html.includes(`<meta property="og:url" content="${origin}/"`), `${slug} og:url must not point at the homepage`);
}
console.log("PASS article share metadata points at each article");

// Figures carry intrinsic dimensions so the layout cannot shift, and only the
// first figure loads eagerly — the rest defer instead of being preloaded.
for (const slug of ["ai-model-agent-harness", "agent-usage-ecosystem", "agent-getting-started", "harness-comparison"]) {
  const html = bodies.get(`/blog/${slug}`);
  const figures = [...html.matchAll(/<img[^>]*src="(\/images\/[^"]+)"[^>]*>/g)];
  assert.ok(figures.length > 0, `${slug} renders article figures`);
  for (const [tag, src] of figures) {
    assert.match(tag, /width="\d+"/, `${src} has intrinsic width`);
    assert.match(tag, /height="\d+"/, `${src} has intrinsic height`);
    assert.ok(!tag.includes('loading="eager"'), `${src} is not force-eager`);
    assert.match(src, /\?v=[0-9a-f]{8}$/, `${src} carries a content-hash version`);
  }
  const eager = figures.filter(([tag]) => !tag.includes('loading="lazy"'));
  assert.ok(eager.length <= 1, `${slug} keeps at most one eager figure (got ${eager.length})`);
  assert.ok(!html.includes('rel="preload" as="image"'), `${slug} must not preload its figures`);
}
console.log("PASS article figures have dimensions and defer below the first one");

// /images/** is content-versioned (?v=), so it must be immutable-cached.
const contentImage = [...bodies.get("/blog/agent-getting-started").matchAll(/<img[^>]*src="(\/images\/[^"]+)"/g)][0]?.[1];
assert.ok(contentImage, "article references a content image");
const imageResponse = await fetch(`${base}${contentImage}`, { signal: AbortSignal.timeout(20000) });
assert.equal(imageResponse.status, 200, `image ${contentImage}`);
assert.equal(imageResponse.headers.get("cache-control"), "public, max-age=31536000, immutable", "content images cached for a year");
console.log("PASS content images are versioned and immutable-cached");
