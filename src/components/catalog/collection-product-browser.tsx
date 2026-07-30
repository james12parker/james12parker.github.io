"use client";

import { useState } from "react";

import { ProductGrid } from "@/components/catalog/product-grid";
import { finishes } from "@/data/products";
import type { Finish, Product } from "@/types/product";

export function CollectionProductBrowser({
  products,
}: {
  products: Product[];
}) {
  const [finish, setFinish] = useState<Finish | "">("");
  const availableFinishes = finishes.filter((item) =>
    products.some((product) =>
      product.variants.some((variant) => variant.finish === item),
    ),
  );
  const filtered = finish
    ? products.filter((product) =>
        product.variants.some((variant) => variant.finish === finish),
      )
    : products;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-y border-line py-4">
        <p aria-live="polite" className="text-xs text-muted">
          {filtered.length}개 제품
        </p>
        <div aria-label="마감 필터" className="flex flex-wrap gap-2">
          <button
            aria-pressed={!finish}
            className={`border px-3 py-2 text-xs ${
              !finish ? "border-ink bg-ink text-white" : "border-line"
            }`}
            onClick={() => setFinish("")}
            type="button"
          >
            전체
          </button>
          {availableFinishes.map((item) => (
            <button
              aria-pressed={finish === item}
              className={`flex items-center gap-2 border px-3 py-2 text-xs ${
                finish === item ? "border-ink bg-ink text-white" : "border-line"
              }`}
              key={item}
              onClick={() => setFinish(item)}
              type="button"
            >
              <span className={`finish-swatch finish-${item}`} />
              {item}
            </button>
          ))}
        </div>
      </div>
      <ProductGrid products={filtered} />
    </div>
  );
}
