"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ProductFilters } from "@/components/catalog/product-filters";
import { ProductGrid } from "@/components/catalog/product-grid";
import { CloseIcon, FilterIcon } from "@/components/icons";
import { EmptyState } from "@/components/ui/empty-state";
import type { Category, Collection, Finish, Product } from "@/types/product";

type CatalogClientProps = {
  products: Product[];
  categories: Category[];
  collections: Collection[];
  finishes: Finish[];
};

type SortKey = "featured" | "name" | "model";

export function CatalogClient({
  products,
  categories,
  collections,
  finishes,
}: CatalogClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const filterTriggerRef = useRef<HTMLButtonElement>(null);
  const values = {
    category: searchParams.get("category") ?? "",
    collection: searchParams.get("collection") ?? "",
    finish: searchParams.get("finish") ?? "",
  };
  const sort = (searchParams.get("sort") as SortKey | null) ?? "featured";
  const activeFilterCount = Object.values(values).filter(Boolean).length;

  useEffect(() => {
    if (!mobileOpen) return;
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMobileOpen(false);
        filterTriggerRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = getFocusableElements(dialogRef.current);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    params.delete("collection");
    params.delete("finish");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const categoryMatch =
        !values.category || product.category === values.category;
      const collectionMatch =
        !values.collection || product.collection === values.collection;
      const finishMatch =
        !values.finish ||
        product.variants.some((variant) => variant.finish === values.finish);
      return categoryMatch && collectionMatch && finishMatch;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "name") return a.nameKo.localeCompare(b.nameKo, "ko");
      if (sort === "model") {
        const aModel = a.variants[0].modelNumber || a.nameKo;
        const bModel = b.variants[0].modelNumber || b.nameKo;
        return aModel.localeCompare(bModel, "ko", { numeric: true });
      }
      return Number(b.featured) - Number(a.featured);
    });
  }, [products, sort, values.category, values.collection, values.finish]);

  return (
    <div className="page-shell pb-24">
      <div className="mb-7 flex items-center justify-between border-y border-line py-4 lg:justify-end">
        <button
          className="flex items-center gap-2 text-sm font-medium lg:hidden"
          onClick={() => setMobileOpen(true)}
          ref={filterTriggerRef}
          type="button"
        >
          <FilterIcon className="size-4" />
          필터
          {activeFilterCount > 0 ? (
            <span className="flex size-5 items-center justify-center rounded-full bg-ink text-[10px] text-white">
              {activeFilterCount}
            </span>
          ) : null}
        </button>
        <label className="flex items-center gap-3 text-xs text-muted">
          정렬
          <select
            aria-label="제품 정렬"
            className="min-w-32 border border-line bg-warm-white px-3 py-2 text-xs text-ink"
            onChange={(event) => updateParam("sort", event.target.value)}
            value={sort}
          >
            <option value="featured">추천순</option>
            <option value="name">제품명순</option>
            <option value="model">모델명순</option>
          </select>
        </label>
      </div>

      <div className="grid gap-12 lg:grid-cols-[15rem_1fr]">
        <aside aria-label="제품 필터" className="hidden lg:block">
          <div className="sticky top-28">
            <ProductFilters
              categories={categories}
              collections={collections}
              finishes={finishes}
              onChange={updateParam}
              onClear={clearFilters}
              values={values}
            />
          </div>
        </aside>

        <div>
          <div
            aria-live="polite"
            className="mb-6 flex items-center justify-between text-xs text-muted"
          >
            <p>총 {filteredProducts.length}개 제품</p>
            {activeFilterCount > 0 ? (
              <button
                className="border-b border-muted"
                onClick={clearFilters}
                type="button"
              >
                필터 초기화
              </button>
            ) : null}
          </div>
          {filteredProducts.length > 0 ? (
            <ProductGrid
              className="lg:grid-cols-3"
              products={filteredProducts}
            />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      {mobileOpen ? (
        <div
          aria-label="제품 필터"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-warm-white lg:hidden"
          ref={dialogRef}
          role="dialog"
        >
          <div className="flex h-17 items-center justify-between border-b border-line px-5">
            <p className="font-semibold">제품 필터</p>
            <button
              aria-label="필터 닫기"
              className="flex size-11 items-center justify-center"
              onClick={() => setMobileOpen(false)}
              ref={closeButtonRef}
              type="button"
            >
              <CloseIcon className="size-5" />
            </button>
          </div>
          <div className="h-[calc(100dvh-8.75rem)] overflow-y-auto px-5 py-5">
            <ProductFilters
              categories={categories}
              collections={collections}
              finishes={finishes}
              onChange={updateParam}
              onClear={clearFilters}
              values={values}
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 border-t border-line bg-warm-white p-4">
            <button
              className="button-primary w-full"
              onClick={() => setMobileOpen(false)}
              type="button"
            >
              {filteredProducts.length}개 제품 보기
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function getFocusableElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), summary, input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter(
    (element) =>
      !element.hasAttribute("hidden") &&
      element.getAttribute("aria-hidden") !== "true",
  );
}
