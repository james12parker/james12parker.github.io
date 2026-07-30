import Link from "next/link";

import { ChevronDownIcon, ExternalIcon } from "@/components/icons";
import { categories } from "@/data/categories";
import { collections } from "@/data/collections";
import { finishes } from "@/data/products";
import { siteConfig } from "@/config/site";

const dropdownSummaryClass =
  "flex cursor-pointer list-none items-center gap-1.5 px-3 py-7 text-sm font-medium tracking-[-0.01em] transition-colors marker:content-none hover:text-muted [&::-webkit-details-marker]:hidden";

export function DesktopNavigation() {
  return (
    <nav aria-label="주 메뉴" className="hidden h-full items-stretch lg:flex">
      <details className="nav-details group relative">
        <summary className={dropdownSummaryClass}>
          제품
          <ChevronDownIcon className="size-3.5 transition-transform group-open:rotate-180" />
        </summary>
        <div className="mega-panel fixed inset-x-0 z-40 border-y border-line bg-warm-white">
          <div className="page-shell grid grid-cols-[1.5fr_0.7fr] gap-16 py-10">
            <div>
              <p className="eyebrow mb-5">제품 카테고리</p>
              <div className="grid grid-cols-2 gap-x-12">
                <Link className="mega-link font-medium" href="/products">
                  전체 제품
                </Link>
                {categories.map((category) => (
                  <Link
                    className="mega-link"
                    href={`/products?category=${category.id}`}
                    key={category.id}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="border-l border-line pl-10">
              <p className="eyebrow mb-5">빠른 탐색</p>
              <p className="max-w-sm text-sm leading-6 text-muted">
                카테고리, 컬렉션, 마감 조건으로 필요한 제품을 간편하게
                찾아보세요.
              </p>
              <Link className="text-link mt-6" href="/products">
                제품 카탈로그
              </Link>
            </div>
          </div>
        </div>
      </details>

      <details className="nav-details group relative">
        <summary className={dropdownSummaryClass}>
          컬렉션
          <ChevronDownIcon className="size-3.5 transition-transform group-open:rotate-180" />
        </summary>
        <div className="mega-panel fixed inset-x-0 z-40 border-y border-line bg-warm-white">
          <div className="page-shell py-10">
            <div className="mb-5 flex items-center justify-between">
              <p className="eyebrow">컬렉션</p>
              <Link className="text-link text-xs" href="/collections">
                전체 컬렉션
              </Link>
            </div>
            <div className="grid grid-cols-6 divide-x divide-line border-y border-line">
              {collections.map((collection) => (
                <Link
                  className="group/item px-5 py-7 transition-colors hover:bg-stone"
                  href={`/collections/${collection.slug}`}
                  key={collection.id}
                >
                  <span className="block text-base font-medium">
                    {collection.nameKo}
                  </span>
                  <span className="mt-2 block text-xs tracking-[0.12em] text-muted uppercase">
                    {collection.nameEn}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </details>

      <details className="nav-details group relative">
        <summary className={dropdownSummaryClass}>
          마감
          <ChevronDownIcon className="size-3.5 transition-transform group-open:rotate-180" />
        </summary>
        <div className="mega-panel absolute left-1/2 z-40 w-72 -translate-x-1/2 border border-line bg-warm-white p-3 shadow-[0_18px_40px_rgba(25,25,20,0.08)]">
          {finishes.map((finish) => (
            <Link
              className="flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-stone"
              href={`/products?finish=${finish}`}
              key={finish}
            >
              <span className={`finish-swatch finish-${finish}`} />
              {finish}
            </Link>
          ))}
        </div>
      </details>

      <Link
        className="px-3 py-7 text-sm font-medium hover:text-muted"
        href="/about"
      >
        브랜드
      </Link>
      <Link
        className="px-3 py-7 text-sm font-medium hover:text-muted"
        href="/support"
      >
        고객지원
      </Link>
      {siteConfig.naverSmartStoreUrl ? (
        <a
          className="ml-3 flex items-center gap-1.5 self-center border border-ink px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-ink hover:text-white"
          href={siteConfig.naverSmartStoreUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          네이버 스토어
          <ExternalIcon className="size-3.5" />
        </a>
      ) : (
        <span
          aria-disabled="true"
          className="ml-3 flex cursor-not-allowed items-center gap-1.5 self-center border border-line px-4 py-2.5 text-xs font-semibold text-muted"
          title="네이버 스토어 링크 준비 중"
        >
          네이버 스토어
          <ExternalIcon className="size-3.5" />
        </span>
      )}
    </nav>
  );
}
