"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import type { ComponentProps } from "react";

// useLayoutEffect 在 SSR 阶段会告警，服务端渲染时退回 useEffect。
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

// 文章正文按 h2 分组成「小节」，滚动进入视口时整节轻微渐显（幅度克制，不抢阅读）。
// 初始隐藏态由 JS 添加 .reveal-item：无 JS、不支持 IntersectionObserver 或
// 偏好减少动态效果时，正文保持默认可见，不做任何隐藏。
export function ArticleReveal({ children, ...props }: ComponentProps<"article">) {
  const articleRef = useRef<HTMLElement | null>(null);

  useIsoLayoutEffect(() => {
    const article = articleRef.current;
    if (!article || article.children.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    const groups: Element[][] = [];
    for (const block of Array.from(article.children)) {
      if (block.tagName === "H2" || groups.length === 0) groups.push([]);
      groups[groups.length - 1].push(block);
    }

    const groupOfHead = new Map<Element, Element[]>();
    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          const group = groupOfHead.get(entry.target);
          if (!group) continue;
          // 已经滚过视口顶端的段落直接展示；其余在进入视口（提前 8%）时渐显。
          if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
            for (const block of group) block.classList.add("is-revealed");
            obs.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    for (const group of groups) {
      for (const block of group) block.classList.add("reveal-item");
      groupOfHead.set(group[0], group);
      observer.observe(group[0]);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <article {...props} ref={articleRef}>
      {children}
    </article>
  );
}
