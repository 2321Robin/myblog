import assert from "node:assert/strict";

const base = process.argv[2] ?? "http://127.0.0.1:3003";
const routes = ["/", "/blog", "/blog/tags", "/blog/ai-model-agent-harness", "/blog/agent-usage-ecosystem", "/blog?tag=ai", "/blog?page=1.5", "/blog?page=Infinity", "/blog?tag=ai&tag=agent", "/blog?page=1&page=2", "/blog?tag=no-such-tag", "/rss.xml", "/sitemap.xml", "/robots.txt", "/search-index", "/og.png", "/icon.svg"];
const bodies = new Map();

for (const route of routes) {
  const response = await fetch(`${base}${route}`, { signal: AbortSignal.timeout(45000) });
  assert.equal(response.status, 200, `${route} status`);
  const body = await response.text();
  bodies.set(route, body);
  if (route === "/" || route.startsWith("/blog")) {
    assert.equal((body.match(/<h1\b/g) ?? []).length, 1, `${route} should render one main heading`);
    assert.ok(body.includes('id="main-content"'), `${route} skip-link target`);
    assert.ok(body.includes("赣ICP备2026002780号"), `${route} footer`);
  }
  console.log(`PASS ${route}`);
}

const home = bodies.get("/");
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
assert.ok(bodies.get("/blog/agent-usage-ecosystem").includes('id="hooks门禁检查"'), "ecosystem article heading anchor");
assert.ok(bodies.get("/blog/agent-usage-ecosystem").includes("门禁检查"), "ecosystem article revised wording");
assert.ok(!bodies.get("/blog/agent-usage-ecosystem").includes("门禁卡"), "retired metaphor must not reappear");
assert.ok(bodies.get("/blog?tag=no-such-tag").includes("这个标签下还没有文章"), "empty filter state");
const indexed = JSON.parse(bodies.get("/search-index")).posts;
for (const slug of ["ai-model-agent-harness", "agent-usage-ecosystem"]) assert.ok(indexed.some((post) => post.slug === slug), `post ${slug} indexed`);
for (const slug of ["hello-world", "next-roadmap"]) assert.ok(!indexed.some((post) => post.slug === slug), `removed post ${slug} not indexed`);
const missing = await fetch(`${base}/blog/not-an-existing-post`, { signal: AbortSignal.timeout(15000) });
assert.equal(missing.status, 404, "unknown post");
console.log("PASS selected destinations, project attribution, maintenance status, anchors, reading behavior, index and 404");

const drafts = ["agent-getting-started", "harness-comparison", "model-landscape-2026"];
for (const draft of drafts) {
  const response = await fetch(`${base}/blog/${draft}`, { signal: AbortSignal.timeout(45000) });
  assert.equal(response.status, 404, `${draft} draft must stay offline`);
  console.log(`PASS /blog/${draft} draft offline`);
}
for (const route of ["/blog", "/blog/tags", "/sitemap.xml", "/rss.xml", "/search-index"]) {
  for (const draft of drafts) assert.ok(!bodies.get(route).includes(draft), `${route} must not reference draft ${draft}`);
}
console.log("PASS draft posts stay out of every index");

// The local editor writes MDX that Next.js compiles, so production must refuse it outright.
const savePost = await fetch(`${base}/api/dev/save-post`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ slug: "ai-model-agent-harness", content: "x" }),
  signal: AbortSignal.timeout(15000),
});
assert.equal(savePost.status, 404, "production save endpoint must be gone");
console.log("PASS /api/dev/save-post is disabled outside development");
