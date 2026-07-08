"use client";

import { useState, useSyncExternalStore } from "react";

function buildShareUrl(base: string, slug: string) {
  if (base.startsWith("http")) return `${base.replace(/\/$/, "")}${slug}`;
  return slug;
}

function subscribeToOriginChange(onStoreChange: () => void) {
  queueMicrotask(onStoreChange);
  return () => {};
}

function getClientOrigin() {
  return window.location.origin;
}

function getServerOrigin() {
  return "";
}

export function ShareBar({ title, url }: { title: string; url: string }) {
  const origin = useSyncExternalStore(
    subscribeToOriginChange,
    getClientOrigin,
    getServerOrigin
  );
  const resolvedUrl = buildShareUrl(origin, url);
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(resolvedUrl);
  const encodedTitle = encodeURIComponent(title);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(resolvedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (err) {
      console.error("Copy failed", err);
    }
  }

  async function handleNativeShare() {
    if (typeof navigator === "undefined" || !navigator.share) {
      await handleCopy();
      return;
    }
    try {
      await navigator.share({ title, url: resolvedUrl });
    } catch (err) {
      console.error("Share cancelled or failed", err);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 text-sm">
      <span className="text-xs uppercase tracking-[0.14em] text-muted">分享</span>
      <div className="flex flex-wrap items-center gap-2">
        <a
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-border px-3 py-1 transition hover:border-brand hover:text-brand"
        >
          Twitter
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-border px-3 py-1 transition hover:border-brand hover:text-brand"
        >
          LinkedIn
        </a>
        <button
          type="button"
          onClick={handleNativeShare}
          className="rounded-full border border-border px-3 py-1 transition hover:border-brand hover:text-brand"
        >
          原生分享
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-full border border-border px-3 py-1 transition hover:border-brand hover:text-brand"
        >
          {copied ? "已复制" : "复制链接"}
        </button>
      </div>
    </div>
  );
}
