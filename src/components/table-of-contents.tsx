"use client";

import { useEffect, useRef } from "react";
import type { Heading } from "@/lib/posts";

// 目录高亮取「最后一个已经越过标题线的章节」，比 IntersectionObserver 的
// 交叉比例稳：长章节不会因为短章节进视口就丢掉高亮。
export function TableOfContents({ headings }: { headings: Heading[] }) {
  const nav = useRef<HTMLElement>(null);

  useEffect(() => {
    const links = Array.from(nav.current?.querySelectorAll<HTMLAnchorElement>("a[href^='#']") ?? []);
    if (!links.length) return;
    const targets = links
      .map((link) => document.getElementById(decodeURIComponent(link.hash.slice(1))))
      .filter((heading): heading is HTMLElement => heading !== null);
    if (!targets.length) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.32;
      let current = -1;
      targets.forEach((heading, index) => {
        if (heading.getBoundingClientRect().top <= line) current = index;
      });
      links.forEach((link, index) => {
        if (index === current) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [headings]);

  if (!headings.length) return null;
  return (
    <aside className="toc">
      <h2 id="toc-title">这篇文章里</h2>
      <nav ref={nav} aria-labelledby="toc-title">
        {headings.map((heading) => (
          <a key={heading.id} href={`#${heading.id}`} className={heading.level === 3 ? "toc-subheading" : undefined}>
            {heading.text}
          </a>
        ))}
      </nav>
    </aside>
  );
}
