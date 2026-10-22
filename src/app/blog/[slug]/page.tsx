import { notFound } from "next/navigation";
import { ArticleEditor } from "@/components/article-editor";
import { PostContent } from "@/components/post-content";
import { getAllPosts, getPostBySlug, getPostHeadings, getPostSource, getPublishedPostBySlug } from "@/lib/posts";

// In Next.js 16 app router, dynamic route params arrive as a Promise; unwrap before use
type PageParams = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

// Drafts stay readable in the local editor; every other environment serves
// published posts only.
async function findPost(slug: string) {
  const published = await getPublishedPostBySlug(slug);
  if (published) return published;
  return process.env.NODE_ENV === "development" ? getPostBySlug(slug) : null;
}

export async function generateMetadata({ params }: PageParams) {
  const { slug } = await params;
  const mod = await findPost(slug);
  if (!mod) return {};
  return {
    title: mod.metadata.title,
    description: mod.metadata.summary,
  };
}

export default async function PostPage({ params }: PageParams) {
  const { slug } = await params;
  const posts = await getAllPosts();
  const mod = await findPost(slug);

  if (!mod) {
    notFound();
  }

  const MDXContent = mod.default;
  const { metadata } = mod;
  const headings = await getPostHeadings(slug);
  const currentIndex = posts.findIndex((p) => p.slug === slug);
  const prev = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const next = currentIndex >= 0 && currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  return (
    <>
      <PostContent
        Content={MDXContent}
        metadata={metadata}
        slug={slug}
        prev={prev}
        next={next}
        headings={headings}
      />
      {process.env.NODE_ENV === "development" && (
        <ArticleEditor slug={slug} initialSource={await getPostSource(slug)} />
      )}
    </>
  );
}