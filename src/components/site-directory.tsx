"use client";

import { Suspense, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight, ArrowUpRight, BarChart3, BookOpenText, Calculator, FileText,
  FolderKanban, Gamepad2, Github, Home, PenLine, Rss, Search, Tags, Video, X,
} from "lucide-react";
import { motion, type Variants } from "motion/react";
import { Spotlight } from "./motion-primitives/spotlight";
import { filterSiteLinks, getLinkHost, siteGroups } from "@/lib/site-links";
import type { SiteIcon, SiteLink } from "@/lib/site-links";

// 网格滚入视口时卡片逐张浮现；社交/紧凑卡片不加光斑（透明底上会发糊）。
const gridVariants: Variants = { visible: { transition: { staggerChildren: 0.05 } } };
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const icons = {
  score: Calculator, game: Gamepad2, resume: FileText, projects: FolderKanban,
  github: Github, video: Video, writing: PenLine, home: Home, stats: BarChart3,
  blog: BookOpenText, tags: Tags, rss: Rss,
} satisfies Record<SiteIcon, typeof Calculator>;

function SiteCard({ link, spotlight = false }: { link: SiteLink; spotlight?: boolean }) {
  const Icon = icons[link.icon];
  const external = link.href.startsWith("http");
  const content = (
    <>
      {spotlight && <Spotlight size={180} />}
      <div className="site-card-top">
        <span className={`site-icon icon-${link.icon}`}><Icon size={23} strokeWidth={1.7} aria-hidden="true" /></span>
        {external ? <ArrowUpRight size={17} className="card-arrow" aria-hidden="true" /> : <ArrowRight size={17} className="card-arrow" aria-hidden="true" />}
      </div>
      <h4>{link.title}</h4>
      <p>{link.description}</p>
      <span className="site-domain" translate="no">{getLinkHost(link.href)}</span>
      {external && <span className="sr-only">（在新窗口打开）</span>}
    </>
  );
  return external || link.href.endsWith(".xml") ? (
    <a className="site-card" href={link.href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>{content}</a>
  ) : (
    <Link className="site-card" href={link.href}>{content}</Link>
  );
}

export function SiteDirectory({ links }: { links: SiteLink[] }) {
  return <Suspense fallback={<DirectoryContents links={links} query="" />}><SearchableDirectory links={links} /></Suspense>;
}

function SearchableDirectory({ links }: { links: SiteLink[] }) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  function updateQuery(value: string) {
    const url = new URL(window.location.href);
    if (value.trim()) url.searchParams.set("q", value);
    else url.searchParams.delete("q");
    // Next.js copies its own history state; passing it back would bypass query synchronization.
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }
  return <DirectoryContents links={links} query={query} onQueryChange={updateQuery} />;
}

function DirectoryContents({ links, query, onQueryChange }: { links: SiteLink[]; query: string; onQueryChange?: (value: string) => void }) {
  const searchInput = useRef<HTMLInputElement>(null);
  function clearSearch() {
    onQueryChange?.("");
    searchInput.current?.focus();
  }

  const filtered = filterSiteLinks(links, query);

  return (
    <section id="projects" className="directory-section" aria-labelledby="directory-title">
      <span id="links" className="anchor-alias" aria-hidden="true" />
      <div className="directory-toolbar">
        <div><p className="eyebrow">EXPLORE MY CORNER</p><h2 id="directory-title">从这里，去逛逛。</h2></div>
        <form className="directory-search" role="search" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="site-search">搜索站点、工具与项目</label>
          <div className="search-field">
            <Search size={18} aria-hidden="true" />
            <input ref={searchInput} id="site-search" name="q" type="search" autoComplete="off" spellCheck={false} placeholder="试试“扫雷”或 GitHub…" value={query} disabled={!onQueryChange} onChange={(event) => onQueryChange?.(event.target.value)} />
            {query && <button type="button" className="search-clear" onClick={clearSearch} aria-label="清除搜索"><X size={16} aria-hidden="true" /></button>}
          </div>
        </form>
      </div>
      <p className="search-status" role="status" aria-live="polite" aria-atomic="true">{query.trim() ? `找到 ${filtered.length} 个入口` : "工具、作品与内容，按用途整理在一起。"}</p>
      <div className="directory-groups">
        {siteGroups.map((group) => {
          const items = filtered.filter((link) => link.category === group.id);
          if (!items.length) return null;
          return (
            <section key={group.id} className={`directory-group group-${group.id}`} aria-labelledby={`group-${group.id}`}>
              <div className="group-heading"><h3 id={`group-${group.id}`}>{group.title}</h3><span>{group.description}</span></div>
              <motion.div className="site-grid" variants={gridVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "0px 0px -8% 0px" }}>
                {items.map((link) => (
                  <motion.div key={link.id} variants={cardVariants} data-entrance>
                    <SiteCard link={link} spotlight={group.id === "tools" || group.id === "projects"} />
                  </motion.div>
                ))}
              </motion.div>
            </section>
          );
        })}
        {filtered.length === 0 && <div className="search-empty"><Search size={28} strokeWidth={1.5} aria-hidden="true" /><h3>没有找到“{query.trim()}”</h3><p>试试站点名称、用途或域名，也可以查看全部入口。</p><button className="button button-primary" onClick={clearSearch}>清除搜索</button></div>}
      </div>
    </section>
  );
}
