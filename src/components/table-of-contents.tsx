import type { Heading } from "@/lib/posts";

export function TableOfContents({ headings }: { headings: Heading[] }) {
  if (!headings.length) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-4 text-sm text-muted-foreground">
        无可用目录
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 text-sm shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">目录</p>
      <nav className="mt-3 space-y-2">
        {headings.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`block leading-relaxed text-foreground transition hover:text-brand ${
              item.level === 3 ? "pl-4 text-xs text-muted-foreground" : "text-sm"
            }`}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
