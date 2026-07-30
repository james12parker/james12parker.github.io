import { ProductGrid } from "@/components/catalog/product-grid";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Product } from "@/types/product";

export function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="border-t border-line py-18 md:py-24">
      <div className="page-shell">
        <SectionHeading
          eyebrow="Related products"
          title="함께 살펴보면 좋은 제품"
        />
        <ProductGrid products={products} />
      </div>
    </section>
  );
}
