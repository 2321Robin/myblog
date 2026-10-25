"use client";

import { useEffect, useRef } from "react";

// 进度以「读完正文的比例」计：从正文顶端进入视口到正文末尾离开视口。
// 直接写 transform，绕开 React 重渲染；滚动事件用 rAF 合并。
export function ReadingProgress({ target }: { target: string }) {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const article = document.querySelector(target);
    if (!article) return;
    const node = bar.current;
    if (!node) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = article.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const read = scrollable > 0 ? -rect.top / scrollable : rect.top < 0 ? 1 : 0;
      node.style.transform = `scaleX(${Math.min(1, Math.max(0, read))})`;
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
  }, [target]);

  return <div ref={bar} className="reading-progress" aria-hidden="true" />;
}
