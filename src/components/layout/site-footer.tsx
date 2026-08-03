import Image from "next/image";
import Link from "next/link";

import { ArrowRightIcon, ExternalIcon } from "@/components/icons";
import { isPlaceholderValue } from "@/config/launch-data";
import { siteConfig } from "@/config/site";

const footerLinks = [
  { label: "제품", href: "/products" },
  { label: "컬렉션", href: "/collections" },
  { label: "브랜드", href: "/about" },
  { label: "대리점", href: "/dealers" },
  { label: "고객지원", href: "/support" },
  { label: "문의", href: "/contact" },
];

export function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const companyDetails = [
    { label: "회사명", value: siteConfig.business.companyName },
    { label: "대표명", value: siteConfig.business.representative },
    { label: "사업장 주소", value: siteConfig.address },
    { label: "이메일", value: siteConfig.email },
  ].filter(({ value }) => !isPlaceholderValue(value));

  return (
    <footer className="border-t border-ink bg-ink text-white">
      <div className="page-shell grid items-start gap-10 py-12 md:grid-cols-2 md:gap-x-16 md:gap-y-12 md:py-14 lg:grid-cols-[minmax(0,1.35fr)_minmax(10rem,0.55fr)_minmax(21rem,0.9fr)] lg:gap-12">
        <div className="md:col-span-2 lg:col-span-1">
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

        <div className="w-full max-w-48">
          <p className="mb-4 text-xs font-semibold tracking-[0.12em] text-brand-soft">
            바로가기
          </p>
          <ul className="border-t border-white/15 text-sm">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  className="group flex items-center justify-between border-b border-white/15 py-2.5 text-white/80 transition-colors hover:text-white"
                  href={link.href}
                >
                  <span>{link.label}</span>
                  <ArrowRightIcon className="size-3.5 text-white/35 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-brand-soft" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {companyDetails.length ? (
          <div className="w-full md:max-w-[24rem] md:justify-self-end">
            <p className="mb-4 text-xs font-semibold tracking-[0.12em] text-brand-soft">
              회사 정보
            </p>
            <dl className="grid grid-cols-[4.5rem_1fr] gap-x-3 gap-y-2 text-xs leading-5">
              {companyDetails.map(({ label, value }) => (
                <div className="contents" key={label}>
                  <dt className="text-white/55">{label}</dt>
                  <dd className="text-white/80">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}
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
