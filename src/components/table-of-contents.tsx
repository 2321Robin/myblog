import type { Heading } from "@/lib/posts";

export function TableOfContents({ headings }: { headings: Heading[] }) {
  if (!headings.length) return null;
  return (
    <aside className="toc"><h2 id="toc-title">这篇文章里</h2><nav aria-labelledby="toc-title">{headings.map((heading) => <a key={heading.id} href={`#${heading.id}`} className={heading.level === 3 ? "toc-subheading" : undefined}>{heading.text}</a>)}</nav></aside>
  );
}
