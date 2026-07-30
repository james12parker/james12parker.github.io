import Image from "next/image";
import Link from "next/link";

import { ExternalIcon } from "@/components/icons";
import { siteConfig } from "@/config/site";

const footerLinks = [
  { label: "제품", href: "/products" },
  { label: "컬렉션", href: "/collections" },
  { label: "브랜드", href: "/about" },
  { label: "고객지원", href: "/support" },
  { label: "문의", href: "/contact" },
];

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-ink bg-ink text-white">
      <div className="page-shell grid gap-12 py-14 md:grid-cols-[1.2fr_0.7fr_1fr] md:py-18">
        <div>
          <Link
            aria-label={`${siteConfig.brandNameKo} 홈`}
            className="inline-flex items-center"
            href="/"
          >
            <Image
              alt={siteConfig.logoAlt}
              className="h-8 w-auto brightness-0 invert"
              height={32}
              src={siteConfig.logoPath}
              width={122}
            />
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/65">
            {siteConfig.companyDescription}
          </p>
          <div className="mt-8 flex gap-4 text-xs">
            {siteConfig.instagramUrl ? (
              <a
                className="text-link"
                href={siteConfig.instagramUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                Instagram <ExternalIcon className="size-3" />
              </a>
            ) : null}
            {siteConfig.naverBlogUrl ? (
              <a
                className="text-link"
                href={siteConfig.naverBlogUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                Naver Blog <ExternalIcon className="size-3" />
              </a>
            ) : null}
          </div>
        </div>

        <div>
          <p className="eyebrow mb-5 text-brand-soft">바로가기</p>
          <ul className="space-y-3 text-sm">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link className="hover:text-brand-soft" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-5 text-brand-soft">회사 정보</p>
          <dl className="space-y-2 text-xs leading-5 text-white/65">
            <div className="flex gap-2">
              <dt>회사명</dt>
              <dd>{siteConfig.business.companyName}</dd>
            </div>
            <div className="flex gap-2">
              <dt>이메일</dt>
              <dd>{siteConfig.email}</dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="border-t border-white/20">
        <div className="page-shell flex flex-col gap-4 py-5 text-[11px] text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {currentYear} {siteConfig.brandNameKo}. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link className="hover:text-white" href="/privacy">
              개인정보처리방침
            </Link>
            <Link className="hover:text-white" href="/terms">
              이용약관
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
