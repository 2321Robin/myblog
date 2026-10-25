"use client";

import { motion, type Variants } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

// 首页 intro 的入场动效：标题逐字符浮现（IntroTitle），其余元素浮入（FloatIn）。
// 改标题文案只需改 titleLines；屏幕阅读器读 sr-only 里的完整句子，
// 逐字 span 对辅助技术隐藏（aria-hidden），避免逐字朗读。

const titleLines: { text: string; accent?: boolean }[][] = [
  [{ text: "一些想法，" }],
  [{ text: "一些" }, { text: "正在做的事。", accent: true }],
];

const titleContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.03, delayChildren: 0.05 } },
};

const titleChar: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function IntroTitle() {
  return (
    <motion.h1 id="home-title" data-entrance variants={titleContainer} initial="hidden" animate="visible">
      <span className="sr-only">一些想法，一些正在做的事。</span>
      <span aria-hidden="true">
        {titleLines.map((line, lineIndex) => (
          <span key={lineIndex}>
            {line.flatMap((run, runIndex) =>
              run.text.split("").map((char, charIndex) => (
                <motion.span
                  key={`${lineIndex}-${runIndex}-${charIndex}`}
                  variants={titleChar}
                  className={run.accent ? "intro-title-char title-accent" : "intro-title-char"}
                >
                  {char}
                </motion.span>
              )),
            )}
            {lineIndex === 0 && <br />}
          </span>
        ))}
      </span>
    </motion.h1>
  );
}

export function FloatIn({
  children,
  delay = 0,
  y = 22,
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <motion.div
      className={className}
      style={style}
      data-entrance
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
