import Image from "next/image";
import Link from "next/link";

import { CategoryCard } from "@/components/catalog/category-card";
import { CollectionCard } from "@/components/catalog/collection-card";
import { ProductGrid } from "@/components/catalog/product-grid";
import { ArrowRightIcon } from "@/components/icons";
import { FinishGuide } from "@/components/home/finish-guide";
import { Hero } from "@/components/home/hero";
import { NaverCta } from "@/components/home/naver-cta";
import { SupportSection } from "@/components/home/support-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { categories, homepageCategoryIds } from "@/data/categories";
import { collections } from "@/data/collections";
import { products } from "@/data/products";
import { isPreviewRelease } from "@/config/launch-data";

export default function HomePage() {
  const homepageCategories = homepageCategoryIds
    .map((id) => categories.find((category) => category.id === id))
    .filter((category) => category !== undefined);
  const homepageCollections = collections.slice(0, 5);
  const concord = collections.find((collection) => collection.id === "concord");
  const concordProducts = products.filter(
    (product) => product.collection === "concord",
  );
  const featuredProducts = products
    .filter((product) => product.featured)
    .slice(0, 8);

  return (
    <>
      <Hero />

      <section className="page-shell py-20 md:py-28">
        <SectionHeading
          action={{ label: "전체 제품", href: "/products" }}
          eyebrow="Browse by category"
          title="공간과 용도에 맞는 제품"
        />
        <div className="grid grid-cols-2 gap-x-4 md:grid-cols-3">
          {homepageCategories.map((category, index) => {
            const representativeProduct = products.find(
              (product) => product.category === category.id,
            );

            return (
              <CategoryCard
                category={category}
                image={representativeProduct?.variants[0].image}
                imageAlt={
                  representativeProduct
                    ? `${representativeProduct.nameKo} ${representativeProduct.variants[0].finish} 제품 이미지`
                    : undefined
                }
                index={index}
                key={category.id}
              />
            );
          })}
        </div>
      </section>

      <section className="border-y border-line bg-stone py-20 md:py-28">
        <div className="page-shell">
          <SectionHeading
            action={{ label: "전체 컬렉션", href: "/collections" }}
            description="제품의 형태와 마감이 자연스럽게 이어지는 컬렉션을 만나보세요."
            eyebrow="Collections"
            title="하나의 공간으로 이어지는 구성"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {homepageCollections.map((collection, index) => (
              <CollectionCard
                collection={collection}
                key={collection.id}
                priority={index < 3}
              />
            ))}
          </div>
        </div>
      </section>

      {concord ? (
        <section className="page-shell py-20 md:py-32">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
            <div className="grid aspect-[4/3] grid-rows-2 gap-px overflow-hidden border border-line bg-line">
              {concordProducts.map((product) => (
                <div className="relative bg-white" key={product.id}>
                  <Image
                    alt={`${product.nameKo} ${product.variants[0].finish} 제품 이미지`}
                    className="object-contain p-1"
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    src={product.variants[0].image}
                  />
                </div>
              ))}
            </div>
            <div>
              <p className="eyebrow mb-5">Featured collection</p>
              <h2 className="text-4xl font-medium tracking-[-0.045em] md:text-5xl">
                콩코드
              </h2>
              <p className="mt-2 text-xs tracking-[0.16em] text-muted uppercase">
                {concord.nameEn}
              </p>
              <p className="mt-7 max-w-lg text-[15px] leading-7 text-muted">
                {concord.description}
              </p>
              {isPreviewRelease ? (
                <p className="mt-3 text-[10px] text-muted">
                  컬렉션 소개 문구는 최종 편집 검토가 필요합니다.
                </p>
              ) : null}
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  className="button-primary"
                  href={`/collections/${concord.slug}`}
                >
                  컬렉션 보기
                  <ArrowRightIcon className="size-4" />
                </Link>
                <span className="self-center text-xs text-muted">
                  등록 제품 {concordProducts.length}개
                </span>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="border-y border-line py-20 md:py-28">
        <div className="page-shell">
          <SectionHeading
            action={{ label: "전체 제품", href: "/products" }}
            eyebrow="Featured products"
            title="주요 제품"
          />
          <ProductGrid products={featuredProducts} />
        </div>
      </section>

      <section className="page-shell py-20 md:py-28">
        <SectionHeading
          description="제품 사진과 실제 마감 샘플은 빛과 화면 환경에 따라 다르게 보일 수 있습니다."
          eyebrow="Finish guide"
          title="공간의 인상을 결정하는 마감"
        />
        <FinishGuide />
      </section>

      <section className="border-t border-line py-20 md:py-28">
        <div className="page-shell">
          <SectionHeading
            description="제품 확인부터 설치 전 자료까지 필요한 정보를 찾아보세요."
            eyebrow="Product support"
            title="제품을 더 잘 사용하기 위한 지원"
          />
          <SupportSection />
        </div>
      </section>

      <NaverCta />
    </>
  );
}
