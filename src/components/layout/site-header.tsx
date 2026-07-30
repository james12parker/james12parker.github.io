import Image from "next/image";
import Link from "next/link";

import { DesktopNavigation } from "@/components/layout/desktop-navigation";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { LanguageSelector } from "@/components/layout/language-selector";
import { siteConfig } from "@/config/site";

export function SiteHeader() {
  return (
    <>
      <div className="hidden border-b border-line bg-stone md:block">
        <div className="page-shell flex h-9 items-center justify-end gap-6 text-[11px] text-muted">
          <Link className="hover:text-ink" href="/contact?topic=product">
            제품 문의
          </Link>
          <Link className="hover:text-ink" href="/contact?topic=bulk">
            대량 구매 및 납품 문의
          </Link>
          <Link className="hover:text-ink" href="/support">
            고객지원
          </Link>
          <LanguageSelector />
        </div>
      </div>
      <header className="sticky top-0 z-40 border-b border-line bg-warm-white">
        <div className="page-shell flex h-20 items-center justify-between lg:h-22">
          <Link
            aria-label={`${siteConfig.brandNameKo} 홈`}
            className="flex items-center"
            href="/"
          >
            <Image
              alt={siteConfig.logoAlt}
              className="h-12 w-auto md:h-14"
              height={48}
              priority
              src={siteConfig.logoPath}
              width={230}
            />
          </Link>
          <DesktopNavigation />
          <MobileNavigation />
        </div>
      </header>
    </>
  );
}
