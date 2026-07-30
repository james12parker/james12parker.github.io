import assert from "node:assert/strict";
import test from "node:test";

import { categories } from "@/data/categories";
import { collections } from "@/data/collections";
import { finishes, products } from "@/data/products";
import {
  compactSearchText,
  normalizeSearchText,
  searchCatalog,
} from "@/lib/catalog-search";

function result(query: string) {
  return searchCatalog(query, products, categories, collections, finishes);
}

function ids(query: string) {
  return result(query).products.map(({ product }) => product.id);
}

test("normalizes case, whitespace, Korean spacing, and model punctuation", () => {
  assert.equal(normalizeSearchText("  BeLAir   Towel "), "belair towel");
  assert.equal(compactSearchText("HG110-1"), "hg1101");
  assert.equal(compactSearchText("매립 휴지걸이"), "매립휴지걸이");
});

test("finds exact and partial model numbers with or without hyphens", () => {
  assert.equal(ids("HG822C")[0], "hg822c");
  assert.ok(ids("HG822").includes("hg822c"));
  assert.ok(ids("HG822").includes("hg822s"));
  assert.equal(ids("HG1101")[0], "hg1101");
  assert.equal(ids("HG110-1")[0], "hg1101");
});

test("searches Korean and English collection names", () => {
  assert.ok(ids("벨레어").includes("belair-towel-bar"));
  assert.ok(ids("Belair").includes("belair-paper-holder"));
  assert.ok(ids("바투타").includes("batuta-towel-bar"));
  assert.ok(ids("battuta").includes("batuta-paper-holder"));
  assert.equal(result("벨레어").collections[0]?.id, "belair");
});

test("matches category terms with practical Korean spacing", () => {
  assert.ok(ids("매립형 휴지걸이").includes("hg112s"));
  assert.ok(ids("매립 휴지걸이").includes("hg1101"));
  assert.ok(ids("면도경").includes("hg9992"));
  assert.equal(result("면도경").categories[0]?.id, "mirrors");
});

test("finish-specific queries resolve the synchronized product variant", () => {
  const match = result("사코 휴지걸이 크롬").products.find(
    ({ product }) => product.id === "saco-paper-holder",
  );
  assert.ok(match);
  assert.equal(match.variant.finish, "크롬");
  assert.match(match.variant.image, /chrome/);

  const satinTowelBars = result("사틴 수건걸이");
  assert.equal(satinTowelBars.preferredFinish, "사틴");
  assert.ok(satinTowelBars.products.length > 0);
  assert.ok(
    satinTowelBars.products.every(({ variant }) => variant.finish === "사틴"),
  );
});
