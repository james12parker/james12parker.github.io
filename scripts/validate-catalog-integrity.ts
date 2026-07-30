import { categories } from "../src/data/categories";
import { products } from "../src/data/products";

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

for (const id of ["belair-paper-holder", "brio-paper-holder"]) {
  const product = byId.get(id);
  invariant(product, "Missing product: " + id);
  invariant(
    product.variants[0].finish === "크롬",
    id + " must display chrome by default.",
  );
}
invariant(
  byId.get("belair-paper-holder")?.variants[0].image !==
    byId.get("brio-paper-holder")?.variants[0].image,
  "Paper-holder chrome images must remain product-specific.",
);

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
