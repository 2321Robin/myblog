import test from "node:test";
import assert from "node:assert/strict";
import { siteLinks, filterSiteLinks, getLinkHost } from "../src/lib/site-links.ts";

test("retains the confirmed external destinations with unique entry IDs", () => {
  const destinations = [
    "https://w2321.top", "https://score.w2321.top", "https://resume.w2321.top",
    "https://minesweeper.w2321.top", "https://github.com/2321Robin",
    "https://covenant.w2321.top/", "https://count.w2321.top/",
    "https://space.bilibili.com/2062699686", "https://blog.csdn.net/Robin2321",
  ];
  for (const href of destinations) assert.ok(siteLinks.some((link) => link.href === href), href);
  assert.equal(new Set(siteLinks.map((link) => link.id)).size, siteLinks.length);
});

test("empty or whitespace searches return every entry", () => {
  assert.deepEqual(filterSiteLinks(siteLinks, "  "), siteLinks);
});

test("finds Chinese names, domains, descriptions and English aliases", () => {
  assert.ok(filterSiteLinks(siteLinks, "扫雷").some((link) => link.href.includes("minesweeper")));
  assert.ok(filterSiteLinks(siteLinks, "  SCORE.W2321  ").some((link) => link.href.includes("score")));
  assert.ok(filterSiteLinks(siteLinks, "线下牌局").some((link) => link.href.includes("score")));
  assert.ok(filterSiteLinks(siteLinks, "bilibili").some((link) => link.title === "哔哩哔哩"));
  assert.equal(filterSiteLinks(siteLinks, "this-site-does-not-exist").length, 0);
});

test("multiple search words must all match", () => {
  assert.ok(filterSiteLinks(siteLinks, "扫雷 快捷键").some((link) => link.href.includes("minesweeper")));
  assert.equal(filterSiteLinks(siteLinks, "扫雷 简历").length, 0);
});

test("a new entry participates without changing search logic", () => {
  const extra = { id: "new-tool", title: "新工具", href: "https://new.example.com", description: "新的站点", category: "tools", icon: "projects", keywords: ["future"] };
  const extended = [...siteLinks, extra];
  assert.equal(filterSiteLinks(extended, "future")[0], extra);
  assert.equal(filterSiteLinks(extended, "").length, siteLinks.length + 1);
  assert.equal(siteLinks.some((link) => link.id === extra.id), false);
});

test("domain labels support external and internal links", () => {
  assert.equal(getLinkHost("https://score.w2321.top/"), "score.w2321.top");
  assert.equal(getLinkHost("/blog"), "本站 · /blog");
});
