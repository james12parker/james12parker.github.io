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
      <div className="page-shell grid items-start gap-10 py-12 md:grid-cols-[1.3fr_0.7fr_0.9fr] md:gap-10 md:py-14 lg:gap-12">
        <div>
          <Link
            aria-label={`${siteConfig.brandNameKo} 홈`}
            className="inline-flex items-center"
            href="/"
          >
            <Image
              alt={siteConfig.logoAlt}
              className="h-10 w-auto"
              height={64}
              src="/images/brand/hoyang25-logo.svg"
              width={230}
            />
          </Link>
          <p className="mt-4 max-w-[21rem] text-sm leading-6 text-white/65">
            {siteConfig.companyDescription}
          </p>
          {siteConfig.instagramUrl || siteConfig.naverBlogUrl ? (
            <div className="mt-6 flex gap-4 text-xs">
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
          ) : null}
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold tracking-[0.12em] text-brand-soft">
            바로가기
          </p>
          <ul className="space-y-1 text-sm">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  className="block py-1.5 text-white/85 transition-colors hover:text-brand-soft"
                  href={link.href}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold tracking-[0.12em] text-brand-soft">
            회사 정보
          </p>
          <dl className="grid grid-cols-[4.5rem_1fr] gap-x-3 gap-y-2 text-xs leading-5">
            <dt className="text-white/55">회사명</dt>
            <dd className="text-white/80">{siteConfig.business.companyName}</dd>
            <dt className="text-white/55">대표명</dt>
            <dd className="text-white/80">
              {siteConfig.business.representative}
            </dd>
            <dt className="text-white/55">사업장 주소</dt>
            <dd className="text-white/80">{siteConfig.address}</dd>
            <dt className="text-white/55">이메일</dt>
            <dd className="text-white/80">{siteConfig.email}</dd>
          </dl>
        </div>
      </div>
      <div className="border-t border-white/20">
        <div className="page-shell flex flex-col gap-3 py-4 text-[11px] text-white/55 sm:flex-row sm:items-center sm:justify-between">
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
