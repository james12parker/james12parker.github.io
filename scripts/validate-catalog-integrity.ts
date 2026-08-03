import { categories } from "../src/data/categories";
import { collections } from "../src/data/collections";
import { products } from "../src/data/products";
import { productBelongsToCollection } from "../src/lib/catalog";

function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const byId = new Map(products.map((product) => [product.id, product]));
const ids = products.map((product) => product.id);
const slugs = products.map((product) => product.slug);
invariant(new Set(ids).size === ids.length, "Product IDs must be unique.");
invariant(
  new Set(slugs).size === slugs.length,
  "Product slugs must be unique.",
);
invariant(
  !byId.has("hg822"),
  "The combined HG822 product must not remain active.",
);
invariant(
  !slugs.includes("hg822-double-towel-shelf"),
  "The combined HG822 slug must not remain canonical.",
);

const batutaTowel = byId.get("batuta-towel-bar");
invariant(batutaTowel, "Batuta towel bar must exist.");
invariant(
  batutaTowel.variants.length === 1 &&
    batutaTowel.variants[0].finish === "사틴" &&
    batutaTowel.variants[0].image ===
      "/images/products/batuta/batuta-towel-bar-satin.jpg",
  "Batuta towel bar satin must use its real normalized source image.",
);

const belairTowel = byId.get("belair-towel-bar");
invariant(belairTowel, "Belair towel bar must exist.");
invariant(
  belairTowel.variants.length === 1 &&
    belairTowel.variants[0].finish === "사틴",
  "Belair towel bar must only expose satin.",
);

const hg822c = byId.get("hg822c");
const hg822s = byId.get("hg822s");
invariant(hg822c && hg822s, "HG822C and HG822S must exist independently.");
invariant(
  hg822c.slug !== hg822s.slug,
  "HG822 models need distinct canonical slugs.",
);
invariant(
  hg822c.variants.length === 1 &&
    hg822c.variants[0].modelNumber === "HG822C" &&
    hg822c.variants[0].finish === "크롬",
  "HG822C must be the chrome model.",
);
invariant(
  hg822s.variants.length === 1 &&
    hg822s.variants[0].modelNumber === "HG822S" &&
    hg822s.variants[0].finish === "사틴",
  "HG822S must be the satin model.",
);
invariant(
  hg822c.variants[0].image !== hg822s.variants[0].image,
  "HG822C and HG822S must use distinct finish images.",
);

const expectedTowelBarOrder = [
  "batuta-towel-bar",
  "belair-towel-bar",
  "saco-towel-bar",
  "concord-towel-bar",
  "brio-towel-bar",
  "hg822c",
  "hg822s",
  "hg820",
];
const towelBarOrder = products
  .filter((product) => product.category === "towel-bars")
  .map((product) => product.id);
invariant(
  towelBarOrder.length === expectedTowelBarOrder.length &&
    towelBarOrder.every((id, index) => id === expectedTowelBarOrder[index]),
  "Requested towel-bar catalog order is not preserved.",
);

const sharedPaperHolder = byId.get("batuta-paper-holder");
invariant(
  sharedPaperHolder,
  "Shared Batuta and Belair paper holder must exist.",
);
invariant(
  sharedPaperHolder.nameKo === "바투타/벨레어 휴지걸이" &&
    sharedPaperHolder.variants.length === 1 &&
    sharedPaperHolder.variants[0].finish === "사틴" &&
    productBelongsToCollection(sharedPaperHolder, "batuta") &&
    productBelongsToCollection(sharedPaperHolder, "belair"),
  "Shared paper holder must expose one satin variant in both collections.",
);

const brioPaperHolder = byId.get("brio-paper-holder");
invariant(brioPaperHolder, "Brio paper holder must exist.");
invariant(
  brioPaperHolder.variants[0].finish === "사틴",
  "Brio paper holder must display satin by default.",
);

const brioChrome = brioPaperHolder.variants.find(
  (variant) => variant.finish === "크롬",
);
invariant(
  brioChrome?.image ===
    "/images/products/brio/brio-toilet-paper-holder-chrome.png",
  "Brio chrome must use the new PNG image.",
);

const expectedCategoryNames = new Map([
  ["bath-accessories", "옷걸이 및 슬리퍼 걸이"],
  ["shower-accessories", "슬라이드바"],
  ["cleaning", "청소솔"],
]);
for (const [categoryId, expectedName] of expectedCategoryNames) {
  const category = categories.find((candidate) => candidate.id === categoryId);
  invariant(
    category?.name === expectedName && category.shortName === expectedName,
    `${categoryId} must display ${expectedName}.`,
  );
}

const expectedProductFinishes = new Map([
  ["hg120", ["크롬"]],
  ["hg240", ["크롬"]],
  ["hg513", ["크롬", "사틴"]],
  ["hg999", ["크롬"]],
]);
for (const [productId, expectedFinishes] of expectedProductFinishes) {
  invariant(
    JSON.stringify(
      byId.get(productId)?.variants.map((variant) => variant.finish),
    ) === JSON.stringify(expectedFinishes),
    `${productId} finishes do not match the confirmed catalog data.`,
  );
}

const hg240 = byId.get("hg240");
const hg820 = byId.get("hg820");
const hg05 = byId.get("hg05");
invariant(
  hg240?.nameKo === "HG240 폰&트레이 매립휴지걸이",
  "HG240 name mismatch.",
);
invariant(
  hg820?.nameKo === "HG820C 이단수건선반" &&
    hg820.variants[0]?.modelNumber === "HG820C",
  "HG820 public model must be HG820C.",
);
invariant(
  hg05?.nameKo === "HG05S 옷걸이" && hg05.variants[0]?.modelNumber === "HG05S",
  "HG05 public model must be HG05S.",
);

const expectedFeatured = new Map([
  ["hg110s", true],
  ["hg112s", true],
  ["hg240", false],
  ["hg822c", false],
  ["hg822s", false],
]);
for (const [productId, expected] of expectedFeatured) {
  invariant(
    Boolean(byId.get(productId)?.featured) === expected,
    `${productId} featured state mismatch.`,
  );
}
const expectedCollectionImages = new Map([
  ["belair", "/images/products/belair/belair-towel-bar-satin.jpg"],
  ["saco", "/images/products/saco/saco-towel-bar-black.jpg"],
]);
for (const [collectionId, expectedImage] of expectedCollectionImages) {
  invariant(
    collections.find((collection) => collection.id === collectionId)?.image ===
      expectedImage,
    `${collectionId} must use its towel-bar collection cover.`,
  );
}

const shavingMirrors = categories.find((category) => category.id === "mirrors");
invariant(
  shavingMirrors?.shortName === "면도경",
  "The stable mirrors key must display 면도경.",
);
invariant(
  products
    .filter((product) => product.category === "mirrors")
    .every((product) => product.nameKo.includes("면도경")),
  "The mirrors filter must only return shaving mirrors.",
);

for (const product of products) {
  for (const relatedId of product.relatedProductIds)
    invariant(
      byId.has(relatedId),
      "Unknown related product " +
        relatedId +
        " referenced by " +
        product.id +
        ".",
    );
}

const variantCount = products.reduce(
  (sum, product) => sum + product.variants.length,
  0,
);
console.log(
  JSON.stringify(
    {
      products: products.length,
      variants: variantCount,
      canonicalProductRoutes: products.length,
    },
    null,
    2,
  ),
);
