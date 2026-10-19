"use client";

import { useState, useSyncExternalStore } from "react";
import { Copy, Share2 } from "lucide-react";

function subscribeToOriginChange(onStoreChange: () => void) {
  queueMicrotask(onStoreChange);
  return () => {};
}
const getClientOrigin = () => window.location.origin;
const getServerOrigin = () => "";

export function ShareBar({ title, url }: { title: string; url: string }) {
  const origin = useSyncExternalStore(subscribeToOriginChange, getClientOrigin, getServerOrigin);
  const resolvedUrl = `${origin}${url}`;
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(resolvedUrl);
  const encodedTitle = encodeURIComponent(title);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(resolvedUrl);
      setCopied(true);
      setMessage("链接已复制，可以粘贴分享。");
    } catch {
      setCopied(false);
      setMessage("复制失败，请从浏览器地址栏复制文章链接。");
    }
  }

  async function handleNativeShare() {
    if (!navigator.share) return handleCopy();
    try {
      await navigator.share({ title, url: resolvedUrl });
      setMessage("分享完成。");
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setMessage("分享未完成，可以使用复制链接。");
    }
  }

  return (
    <aside className="share-bar" aria-label="分享文章">
      <p>把有用的记录，分享给需要的人。</p>
      <div>
        <a className="button" href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noreferrer">Twitter</a>
        <a className="button" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noreferrer">LinkedIn</a>
        <button type="button" className="button" onClick={handleNativeShare}><Share2 size={14} aria-hidden="true" />原生分享</button>
        <button type="button" className="button button-primary" onClick={handleCopy}><Copy size={14} aria-hidden="true" />{copied ? "已复制" : "复制链接"}</button>
      </div>
      <p className="share-feedback" role="status" aria-live="polite">{message}</p>
    </aside>
  );
}
