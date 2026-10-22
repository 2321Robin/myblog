import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getBaseUrl, siteMetadata } from "@/lib/site";
import { getDevSaveToken } from "@/lib/dev-save-token";
import "./globals.css";


export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: "/",
    siteName: siteMetadata.title,
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Robin · 工具、作品与记录" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
    title: siteMetadata.title,
    description: siteMetadata.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {process.env.NODE_ENV === "development" && <meta name="dev-save-token" content={getDevSaveToken()} />}
      </head>
      <body className="antialiased">
        <a
          href="#main-content"
          className="sr-only fixed left-4 top-4 z-50 rounded-full bg-brand-strong px-4 py-2 text-sm font-semibold text-surface focus:not-sr-only focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          跳到主要内容
        </a>
        <ThemeProvider><SiteHeader />{children}<SiteFooter /></ThemeProvider>
      </body>
    </html>
  );
}
