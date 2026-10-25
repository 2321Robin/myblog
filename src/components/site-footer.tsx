import Link from "next/link";
import { ArrowUpRight, Rss } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-width footer-inner">
        <div className="footer-top">
          <p>持续构建，慢慢记录。<span>Robin 的个人互联网一角。</span></p>
          <div className="footer-links">
            <Link href="/blog">阅读文章 <ArrowUpRight size={14} aria-hidden="true" /></Link>
            <a href="/rss.xml"><Rss size={14} aria-hidden="true" /> RSS 订阅</a>
            <a href="mailto:2932547376@qq.com">联系我 <ArrowUpRight size={14} aria-hidden="true" /></a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>Copyright © 2026 - Present <a href="https://w2321.top" target="_blank" rel="noreferrer">w2321</a>. All Rights Reserved.</p>
          <div className="record-links">
            <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">赣ICP备2026002780号</a>
            <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=36098302260203" target="_blank" rel="noreferrer">
              <img src="/gongan_beian.png" alt="" width={14} height={14} className="record-icon" loading="lazy" decoding="async" />赣公网安备36098302260203号
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
