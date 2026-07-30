import Image from "next/image";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/icons";
import type { Category } from "@/types/product";

export function CategoryCard({
  category,
  index,
  image,
  imageAlt,
}: {
  category: Category;
  index: number;
  image?: string;
  imageAlt?: string;
}) {
  return (
    <Link
      className="group flex min-h-40 flex-col justify-between border-t border-line py-5 transition-colors hover:bg-stone sm:min-h-52 sm:px-5 sm:hover:px-6"
      href={`/products?category=${category.id}`}
    >
      <span className="flex items-start justify-between gap-4">
        <span className="text-[10px] tracking-[0.16em] text-muted">
          {String(index + 1).padStart(2, "0")}
        </span>
        {image ? (
          <span className="relative hidden h-18 w-28 bg-white sm:block">
            <Image
              alt={imageAlt ?? ""}
              className="object-contain"
              fill
              sizes="112px"
              src={image}
            />
          </span>
        ) : null}
      </span>
      <span className="flex items-end justify-between gap-3">
        <span>
          <strong className="block text-lg font-medium tracking-[-0.025em]">
            {category.shortName}
          </strong>
          <span className="mt-2 hidden max-w-48 text-xs leading-5 text-muted sm:block">
            {category.description}
          </span>
        </span>
        <ArrowRightIcon className="mb-1 size-4 shrink-0 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
