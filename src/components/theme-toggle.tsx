"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

function subscribeToMount(onStoreChange: () => void) {
  queueMicrotask(onStoreChange);
  return () => {};
}

function getMountedClientSnapshot() {
  return true;
}

function getMountedServerSnapshot() {
  return false;
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribeToMount,
    getMountedClientSnapshot,
    getMountedServerSnapshot
  );

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="切换主题"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-full border border-border px-3 text-sm font-medium",
        "bg-surface/70 text-foreground shadow-sm backdrop-blur-sm transition",
        "hover:border-brand hover:text-foreground"
      )}
    >
      {mounted ? (
        isDark ? <Moon size={16} /> : <Sun size={16} />
      ) : (
        <span className="inline-block h-4 w-4" />
      )}
      <span className="hidden sm:inline">{mounted ? (isDark ? "深色" : "浅色") : "主题"}</span>
    </button>
  );
}
