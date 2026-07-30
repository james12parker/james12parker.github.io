import { categories } from "@/data/categories";
import { collections } from "@/data/collections";

export function categoryName(id: string) {
  return categories.find((category) => category.id === id)?.name ?? id;
}

export function collectionName(id?: string) {
  if (!id) return undefined;
  return collections.find((collection) => collection.id === id)?.nameKo ?? id;
}
