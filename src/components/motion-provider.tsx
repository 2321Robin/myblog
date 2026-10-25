"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";

// reducedMotion="user"：系统偏好「减少动态效果」时，motion 的所有动画
// 直接落到终态（配合 globals.css 末尾对 transition/animation 的全局缩短）。
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
