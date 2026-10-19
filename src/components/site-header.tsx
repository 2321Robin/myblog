import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { siteLinks } from "@/lib/site-links";

export function SiteHeader() {
  const github = siteLinks.find((link) => link.id === "github");
  return (
    <header className="site-header">
      <div className="site-width header-inner">
        <Link href="/" className="site-brand" aria-label="Robin，返回主页">
          <span className="brand-mark" aria-hidden="true"><svg width="32" height="32" viewBox="0 0 64 64"><path d="M17 50V13h12v7c4-6 10-8 18-7v12c-11-2-18 3-18 12v13z" fill="white" /><circle cx="48" cy="49" r="6" fill="#a5e0de" /></svg></span>
          <span className="brand-name" translate="no">Robin<span>个人站点</span></span>
        </Link>
        <nav className="primary-nav" aria-label="主导航">
          <Link href="/#projects">站点导航</Link>
          <Link href="/blog">文章</Link>
          <Link href="/#about">关于</Link>
        </nav>
        <div className="header-actions">
          {github && <a href={github.href} target="_blank" rel="noreferrer" className="header-github">
            GitHub <ArrowUpRight size={14} aria-hidden="true" />
          </a>}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
