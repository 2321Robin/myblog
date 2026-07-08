import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { getBaseUrl, siteMetadata } from "@/lib/site";
import "./globals.css";


export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: getBaseUrl(),
    siteName: siteMetadata.title,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
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
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
