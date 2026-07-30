import Image from "next/image";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/icons";
import { collectionName } from "@/lib/catalog";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  const primaryVariant = product.variants[0];
  const modelNumbers = [
    ...new Set(
      product.variants
        .map((variant) => variant.modelNumber)
        .filter((modelNumber) => modelNumber.length > 0),
    ),
  ];

  return (
    <article className="group min-w-0">
      <Link
        aria-label={`${product.nameKo} 상세 보기`}
        className="relative block aspect-square overflow-hidden border border-line bg-white"
        href={`/products/${product.slug}`}
      >
        <Image
          alt={`${product.nameKo} ${primaryVariant.finish} 제품 이미지`}
          className="object-contain p-1 transition-transform duration-500 ease-out group-hover:scale-[1.018] md:p-2"
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          src={primaryVariant.image}
        />
        {product.featured ? (
          <span className="absolute top-3 left-3 border border-line bg-warm-white/90 px-2.5 py-1 text-[9px] font-bold tracking-[0.14em] uppercase backdrop-blur-sm">
            Featured
          </span>
        ) : null}
      </Link>
      <div className="pt-4">
        <p className="text-[10px] font-semibold tracking-[0.13em] text-muted uppercase">
          {collectionName(product.collection)}
        </p>
        <Link
          className="mt-1.5 flex items-start justify-between gap-3 text-[15px] font-medium tracking-[-0.02em] hover:text-muted md:text-base"
          href={`/products/${product.slug}`}
        >
          <span>{product.nameKo}</span>
          <ArrowRightIcon className="mt-0.5 hidden size-4 shrink-0 text-brand opacity-0 transition-opacity group-hover:opacity-100 sm:block" />
        </Link>
        {modelNumbers.length > 0 ? (
          <p className="mt-1 text-[11px] text-muted">
            모델 {modelNumbers.join(" / ")}
          </p>
        ) : null}
        <div
          aria-label={`마감: ${product.variants.map((item) => item.finish).join(", ")}`}
          className="mt-3 flex flex-wrap items-center gap-2"
        >
          {product.variants.map((item) => (
            <span
              className={`finish-swatch finish-${item.finish}`}
              key={item.id}
              title={item.finish}
            />
          ))}
          <span className="ml-1 text-[11px] text-muted">
            {product.variants.map((item) => item.finish).join(" · ")}
          </span>
        </div>
      </div>
    </article>
  );
}
