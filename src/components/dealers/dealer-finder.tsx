"use client";

import { type FormEvent, useMemo, useState } from "react";

import { ExternalIcon, PhoneIcon } from "@/components/icons";
import type { Dealer } from "@/data/dealers";
import {
  changeDealerProvince,
  EMPTY_DEALER_FILTERS,
  filterDealers,
  getDistrictOptions,
  getProvinceOptions,
  normalizeTelephone,
  paginateDealers,
  resetDealerFilters,
  type DealerFilters,
} from "@/lib/dealer-search";

const labels = {
  allProvinces: "전체 시·도",
  allDistricts: "전체 시·군·구",
  placeholder: "대리점명 또는 주소를 입력하세요",
  noResults: "선택한 조건에 맞는 대리점이 없습니다.",
} as const;

export function DealerFinder({ dealers }: { dealers: readonly Dealer[] }) {
  const [filters, setFilters] = useState<DealerFilters>(EMPTY_DEALER_FILTERS);
  const [queryInput, setQueryInput] = useState("");
  const [page, setPage] = useState(1);
  const provinces = useMemo(() => getProvinceOptions(dealers), [dealers]);
  const districts = useMemo(
    () => getDistrictOptions(dealers, filters.province),
    [dealers, filters.province],
  );
  const results = useMemo(
    () => filterDealers(dealers, filters),
    [dealers, filters],
  );
  const pagination = paginateDealers(results, page);
  const featured = useMemo(
    () =>
      filterDealers(dealers).filter(
        (dealer) => dealer.type === "showroom" || dealer.isFeatured,
      ),
    [dealers],
  );

  function applySearch(event: FormEvent) {
    event.preventDefault();
    setFilters((current) => ({ ...current, query: queryInput }));
    setPage(1);
  }

  return (
    <>
      {featured.length ? (
        <section
          aria-labelledby="featured-showrooms"
          className="mb-16 md:mb-24"
        >
          <p className="eyebrow-section mb-4">Visit HOYANG</p>
          <h2
            className="text-3xl font-medium tracking-[-0.04em] md:text-4xl"
            id="featured-showrooms"
          >
            HOYANG 쇼룸
          </h2>
          <div className="mt-8 grid gap-px border border-line bg-line lg:grid-cols-2">
            {featured.map((dealer) => (
              <DealerCard dealer={dealer} featured key={dealer.id} />
            ))}
          </div>
        </section>
      ) : null}

      <section aria-labelledby="dealer-directory">
        <div className="mb-8">
          <p className="eyebrow-section mb-4">Dealer directory</p>
          <h2
            className="text-3xl font-medium tracking-[-0.04em] md:text-4xl"
            id="dealer-directory"
          >
            대리점 찾기
          </h2>
        </div>

        <form
          className="border-y border-line bg-stone p-5 md:p-7"
          onSubmit={applySearch}
          role="search"
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[minmax(10rem,0.65fr)_minmax(10rem,0.65fr)_minmax(16rem,1.4fr)_auto] lg:items-end">
            <Field label="시·도">
              <select
                className="min-h-12 w-full border border-line bg-white px-3 text-sm"
                onChange={(event) => {
                  setFilters((current) =>
                    changeDealerProvince(current, event.target.value),
                  );
                  setPage(1);
                }}
                value={filters.province}
              >
                <option value="">{labels.allProvinces}</option>
                {provinces.map((province) => (
                  <option key={province}>{province}</option>
                ))}
              </select>
            </Field>
            <Field label="시·군·구">
              <select
                className="min-h-12 w-full border border-line bg-white px-3 text-sm disabled:bg-surface disabled:text-muted"
                disabled={!filters.province}
                onChange={(event) => {
                  setFilters((current) => ({
                    ...current,
                    district: event.target.value,
                  }));
                  setPage(1);
                }}
                value={filters.district}
              >
                <option value="">{labels.allDistricts}</option>
                {districts.map((district) => (
                  <option key={district}>{district}</option>
                ))}
              </select>
            </Field>
            <Field label="대리점 검색">
              <input
                className="min-h-12 w-full min-w-0 border border-line bg-white px-4 text-sm placeholder:text-muted"
                onChange={(event) => setQueryInput(event.target.value)}
                placeholder={labels.placeholder}
                type="search"
                value={queryInput}
              />
            </Field>
            <div className="grid grid-cols-2 gap-2 md:col-span-2 lg:col-span-1">
              <button className="button-primary w-full" type="submit">
                검색
              </button>
              <button
                className="button-secondary w-full"
                onClick={() => {
                  setFilters(resetDealerFilters());
                  setQueryInput("");
                  setPage(1);
                }}
                type="button"
              >
                초기화
              </button>
            </div>
          </div>
        </form>

        <p
          aria-live="polite"
          className="mt-8 text-sm font-medium"
          role="status"
        >
          총 {results.length}개의 대리점이 있습니다.
        </p>
        {pagination.items.length ? (
          <div className="mt-5 grid gap-px border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
            {pagination.items.map((dealer) => (
              <DealerCard dealer={dealer} key={dealer.id} />
            ))}
          </div>
        ) : (
          <div className="mt-5 border-y border-line py-16 text-center text-sm text-muted">
            {labels.noResults}
          </div>
        )}

        {pagination.pageCount > 1 ? (
          <nav
            aria-label="대리점 검색 결과 페이지"
            className="mt-10 flex items-center justify-center gap-2"
          >
            <button
              aria-label="이전 페이지"
              className="button-secondary min-w-12 px-3 disabled:border-line disabled:text-muted"
              disabled={pagination.page === 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              type="button"
            >
              이전
            </button>
            <span aria-current="page" className="px-3 text-sm">
              {pagination.page} / {pagination.pageCount}
            </span>
            <button
              aria-label="다음 페이지"
              className="button-secondary min-w-12 px-3 disabled:border-line disabled:text-muted"
              disabled={pagination.page === pagination.pageCount}
              onClick={() =>
                setPage((current) =>
                  Math.min(pagination.pageCount, current + 1),
                )
              }
              type="button"
            >
              다음
            </button>
          </nav>
        ) : null}
      </section>
    </>
  );
}

function Field({
  children,
  label,
}: {
  children: React.ReactElement;
  label: string;
}) {
  return (
    <label className="grid gap-2 text-xs font-semibold text-muted">
      <span>{label}</span>
      {children}
    </label>
  );
}

function DealerCard({
  dealer,
  featured = false,
}: {
  dealer: Dealer;
  featured?: boolean;
}) {
  const fullAddress = [dealer.address, dealer.addressDetail]
    .filter(Boolean)
    .join(" ");
  return (
    <article
      className={`flex flex-col bg-white ${featured ? "min-h-80 p-7 md:p-9" : "min-h-72 p-6"}`}
    >
      <p className="eyebrow">
        {dealer.type === "showroom" ? "HOYANG SHOWROOM" : "OFFICIAL DEALER"}
      </p>
      <div className="mt-6 flex-1">
        <h3
          className={`${featured ? "text-2xl" : "text-xl"} font-medium tracking-[-0.025em]`}
          data-no-translate
        >
          {dealer.nameKo}
        </h3>
        {dealer.nameEn ? (
          <p
            className="mt-2 text-[11px] tracking-[0.13em] text-muted uppercase"
            data-no-translate
          >
            {dealer.nameEn}
          </p>
        ) : null}
        <dl className="mt-6 grid grid-cols-[3.5rem_1fr] gap-x-2 gap-y-2 text-sm leading-6">
          <dt className="text-muted">주소</dt>
          <dd className="min-w-0 break-words" data-no-translate>
            {fullAddress}
          </dd>
          <dt className="text-muted">전화</dt>
          <dd data-no-translate>
            <a
              className="hover:text-brand"
              href={`tel:${normalizeTelephone(dealer.phone)}`}
            >
              {dealer.phone}
            </a>
          </dd>
          {dealer.operatingHours ? (
            <>
              <dt className="text-muted">영업시간</dt>
              <dd data-no-translate>{dealer.operatingHours}</dd>
            </>
          ) : null}
        </dl>
      </div>
      <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 border-t border-line pt-5 text-sm font-semibold">
        <a
          className="inline-flex min-h-11 items-center gap-1.5"
          href={`tel:${normalizeTelephone(dealer.phone)}`}
        >
          <PhoneIcon className="size-4" />
          전화하기
        </a>
        {dealer.naverMapUrl ? (
          <MapLink href={dealer.naverMapUrl} label="네이버 지도" />
        ) : null}
        {dealer.kakaoMapUrl ? (
          <MapLink href={dealer.kakaoMapUrl} label="카카오맵" />
        ) : null}
      </div>
    </article>
  );
}

function MapLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      className="inline-flex min-h-11 items-center gap-1.5 hover:text-brand"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      {label}
      <ExternalIcon className="size-3.5" />
    </a>
  );
}
