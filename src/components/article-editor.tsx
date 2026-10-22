"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { KeyboardEvent } from "react";

type Props = { slug: string; initialSource: string };
type Status = "idle" | "saving" | "saved" | "error";

const ANNOTATION_PATTERN = /【[^】]*】/g;
const HAS_ANNOTATION = /【[^】]*】/;

function countAnnotations(source: string) {
  return source.match(ANNOTATION_PATTERN)?.length ?? 0;
}

export function ArticleEditor({ slug, initialSource }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState(initialSource);
  const [syncedSource, setSyncedSource] = useState(initialSource);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [annotations, setAnnotations] = useState(0);
  const [highlighted, setHighlighted] = useState(false);

  // After a save the server sends fresh source; adopt it without an effect.
  if (syncedSource !== initialSource) {
    setSyncedSource(initialSource);
    setSource(initialSource);
  }

  const sourceAnnotations = countAnnotations(initialSource);
  const dirty = source !== initialSource;

  async function save() {
    setStatus("saving");
    const devToken = document.querySelector<HTMLMetaElement>('meta[name="dev-save-token"]')?.content ?? "";
    setMessage("");
    try {
      const res = await fetch("/api/dev/save-post", {
        method: "POST",
        headers: { "content-type": "application/json", "x-dev-save-token": devToken },
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

  // 在渲染后的正文里把【】标注包上高亮；只用于本地开发，重新渲染后高亮会被 React 冲掉，再点一次即可。
  function toggleHighlight() {
    if (highlighted) {
      document.querySelectorAll(".article-prose .annotation-mark").forEach((mark) => {
        mark.replaceWith(...mark.childNodes);
      });
      setHighlighted(false);
      return;
    }
    const prose = document.querySelector(".article-prose");
    if (!prose) return;
    const walker = document.createTreeWalker(prose, NodeFilter.SHOW_TEXT);
    const targets: Text[] = [];
    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      if (HAS_ANNOTATION.test(node.data)) targets.push(node);
    }
    for (const node of targets) {
      const fragment = document.createDocumentFragment();
      for (const part of node.data.split(/(【[^】]*】)/)) {
        if (!part) continue;
        if (part.startsWith("【")) {
          const mark = document.createElement("mark");
          mark.className = "annotation-mark";
          mark.textContent = part;
          fragment.append(mark);
        } else {
          fragment.append(part);
        }
      }
      node.replaceWith(fragment);
    }
    setHighlighted(true);
  }

  if (!open) {
    return (
      <button type="button" className="article-editor-toggle" onClick={() => setOpen(true)}>
        ✎ 编辑本文（仅本地{sourceAnnotations > 0 ? ` · ${sourceAnnotations} 处标注` : ""}）
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
        <button type="button" onClick={toggleHighlight}>
          {highlighted ? "取消标注高亮" : "高亮标注"}
        </button>
        {status === "saved" && <span className="ok">已保存 ✓</span>}
        {status === "error" && <span className="err">{message}</span>}
        {annotations > 0 && <span className="warn">文中还有 {annotations} 处【】标注未处理</span>}
        <span className="hint">仅本地 · Ctrl/Cmd+S 保存</span>
      </div>
    </div>
  );
}
