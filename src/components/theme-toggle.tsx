"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

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
      aria-label={mounted ? (isDark ? "切换到浅色主题" : "切换到深色主题") : "切换主题"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="theme-toggle"
    >
      {mounted ? (
        isDark ? <Moon size={16} aria-hidden="true" /> : <Sun size={16} aria-hidden="true" />
      ) : (
        <span className="inline-block size-4" aria-hidden="true" />
      )}
    </button>
  );
}
