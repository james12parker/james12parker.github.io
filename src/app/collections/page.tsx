import type { Metadata } from "next";

import { CollectionCard } from "@/components/catalog/collection-card";
import { PageIntro } from "@/components/ui/page-intro";
import { isPreviewRelease } from "@/config/launch-data";
import { collections } from "@/data/collections";

export const metadata: Metadata = {
  title: "컬렉션",
  description: "욕실 액세서리 컬렉션을 둘러보세요.",
  alternates: {
    canonical: "/collections",
  },
};

export default function CollectionsPage() {
  return (
    <>
      <PageIntro
        breadcrumb="컬렉션"
        description="제품군별 형태와 마감 옵션을 한눈에 살펴볼 수 있습니다."
        eyebrow="Collections"
        title="컬렉션"
      />
      <section className="page-shell pb-24 md:pb-32">
        <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection, index) => (
            <CollectionCard
              collection={collection}
              key={collection.id}
              priority={index < 3}
            />
          ))}
        </div>
        {isPreviewRelease ? (
          <p className="mt-12 border-t border-line pt-5 text-[11px] leading-5 text-muted">
            컬렉션 영문명, URL slug, 소개 문구는 임시 데이터이며 최종 편집
            검토가 필요합니다.
          </p>
        ) : null}
      </section>
    </>
  );
}
