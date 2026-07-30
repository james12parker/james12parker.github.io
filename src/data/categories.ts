import type { Category } from "@/types/product";

export const categories: Category[] = [
  {
    id: "towel-bars",
    slug: "towel-bars",
    name: "수건걸이 및 수건선반",
    shortName: "수건걸이",
    description: "수건걸이와 수건선반 제품을 모아 볼 수 있는 카테고리입니다.",
  },
  {
    id: "toilet-paper-holders",
    slug: "toilet-paper-holders",
    name: "휴지걸이",
    shortName: "휴지걸이",
    description: "컬렉션과 마감별 휴지걸이 제품을 확인할 수 있습니다.",
  },
  {
    id: "recessed-holders",
    slug: "recessed-holders",
    name: "매립형 휴지걸이",
    shortName: "매립형 휴지걸이",
    description: "매립형 휴지걸이 제품을 모델별로 확인할 수 있습니다.",
  },
  {
    id: "shelves-storage",
    slug: "shelves-storage",
    name: "선반 및 수납",
    shortName: "선반 및 수납",
    description: "욕실용 선반과 수납 제품을 모아 소개합니다.",
  },
  {
    id: "bath-accessories",
    slug: "bath-accessories",
    name: "옷걸이 및 욕실 액세서리",
    shortName: "욕실 액세서리",
    description: "옷걸이와 기타 욕실 액세서리를 모아 소개합니다.",
  },
  {
    id: "shower-accessories",
    slug: "shower-accessories",
    name: "샤워 액세서리",
    shortName: "샤워 액세서리",
    description: "샤워 액세서리 제품을 모델별로 확인할 수 있습니다.",
  },
  {
    id: "cleaning",
    slug: "cleaning",
    name: "청소용품",
    shortName: "청소용품",
    description: "등록된 욕실 청소용품을 확인할 수 있습니다.",
  },
  {
    id: "mirrors",
    slug: "mirrors",
    name: "면도경",`r`n    shortName: "면도경",`r`n    description: "등록된 면도경 제품을 확인할 수 있습니다.",
  },
];

export const homepageCategoryIds = [
  "towel-bars",
  "toilet-paper-holders",
  "recessed-holders",
  "shelves-storage",
  "bath-accessories",
  "mirrors",
] as const;

export function getCategory(id: string) {
  return categories.find((category) => category.id === id);
}
