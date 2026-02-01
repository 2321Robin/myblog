import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

// In Next.js 16 app router, dynamic route params arrive as a Promise; unwrap before use
type PageParams = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageParams) {
  const { slug } = await params;
  const mod = await getPostBySlug(slug).catch(() => null);
  if (!mod) return {};
  return {
    title: mod.metadata.title,
    description: mod.metadata.summary,
  };
}

export default async function PostPage({ params }: PageParams) {
  const { slug } = await params;
  const mod = await getPostBySlug(slug).catch(() => null);

  if (!mod) {
    notFound();
  }

  const MDXContent = mod.default;
  const { metadata } = mod;

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-6 py-12">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Article</p>
        <h1 className="text-3xl font-bold leading-tight">{metadata.title}</h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>{new Date(metadata.date).toLocaleDateString()}</span>
          {metadata.tags?.map((tag) => (
            <span key={tag} className="rounded-full bg-surface-muted px-2 py-0.5 text-xs font-medium text-brand">
              {tag}
            </span>
          ))}
        </div>
        {metadata.summary ? <p className="text-muted-foreground">{metadata.summary}</p> : null}
      </div>

      <article className="prose prose-zinc max-w-none dark:prose-invert">
        <MDXContent />
      </article>
    </div>
  );
}