"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { KeyboardEvent } from "react";

type Props = { slug: string; initialSource: string };
type Status = "idle" | "saving" | "saved" | "error";

export function ArticleEditor({ slug, initialSource }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState(initialSource);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [annotations, setAnnotations] = useState(0);

  const dirty = source !== initialSource;

  useEffect(() => {
    setSource(initialSource);
  }, [initialSource]);

  async function save() {
    setStatus("saving");
    setMessage("");
    try {
      const res = await fetch("/api/dev/save-post", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug, content: source }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      const data = (await res.json()) as { annotations?: number };
      setAnnotations(data.annotations ?? 0);
      setStatus("saved");
      setMessage("已保存，页面即将刷新");
      setTimeout(() => {
        router.refresh();
        setStatus("idle");
        setMessage("");
      }, 500);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : String(err));
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === "s") {
      event.preventDefault();
      if (dirty && status !== "saving") save();
    }
  }

  if (!open) {
    return (
      <button type="button" className="article-editor-toggle" onClick={() => setOpen(true)}>
        ✎ 编辑本文（仅本地）
      </button>
    );
  }

  return (
    <div className="article-editor-panel">
      <div className="article-editor-head">
        <span>编辑源码 · {slug}.mdx{dirty ? " · 有未保存修改" : ""}</span>
        <button
          type="button"
          onClick={() => {
            if (!dirty || window.confirm("有未保存的修改，确定关闭？")) setOpen(false);
          }}
        >
          关闭
        </button>
      </div>
      <textarea
        className="article-editor-body"
        value={source}
        spellCheck={false}
        onChange={(e) => {
          setSource(e.target.value);
          if (status === "saved") setStatus("idle");
        }}
        onKeyDown={onKeyDown}
      />
      <div className="article-editor-foot">
        <button type="button" className="save" onClick={save} disabled={status === "saving" || !dirty}>
          {status === "saving" ? "保存中…" : "保存到文件"}
        </button>
        {status === "saved" && <span className="ok">已保存 ✓</span>}
        {status === "error" && <span className="err">{message}</span>}
        {annotations > 0 && <span className="warn">文中还有 {annotations} 处【】标注未处理</span>}
        <span className="hint">仅本地开发环境可用，不随站点部署 · Ctrl/Cmd+S 保存</span>
      </div>
    </div>
  );
}
