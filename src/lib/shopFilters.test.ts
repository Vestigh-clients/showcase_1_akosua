import { describe, expect, it } from "vitest";
import {
  buildShopCategoryOptions,
  buildShopFilterGroups,
  filterShopProducts,
  isShopFilterValueDisabled,
  matchesShopFilters,
  sanitizeShopFilterState,
  type ShopFilterState,
} from "@/lib/shopFilters";
import type { Product } from "@/types/product";

const createProduct = (overrides: Partial<Product>): Product => ({
  id: overrides.id ?? "product-id",
  name: overrides.name ?? "Product",
  slug: overrides.slug ?? "product",
  price: overrides.price ?? 100,
  stock_quantity: overrides.stock_quantity ?? 0,
  is_available: overrides.is_available ?? true,
  has_variants: overrides.has_variants ?? false,
  images: overrides.images ?? [],
  categories:
    overrides.categories ??
    ({
      id: "category-id",
      name: "Dresses",
      slug: "dresses",
    } as Product["categories"]),
  short_description: overrides.short_description,
  description: overrides.description,
  compare_at_price: overrides.compare_at_price,
  total_stock_quantity: overrides.total_stock_quantity,
  in_stock: overrides.in_stock,
  is_featured: overrides.is_featured,
  benefits: overrides.benefits,
  tags: overrides.tags,
  weight_grams: overrides.weight_grams,
  sku: overrides.sku,
  product_option_types: overrides.product_option_types ?? [],
  product_variants: overrides.product_variants ?? [],
});

const products = [
  createProduct({
    id: "p1",
    name: "Akosua Midi",
    slug: "akosua-midi",
    price: 180,
    has_variants: true,
    product_option_types: [
      {
        id: "size-type-a",
        name: "Size",
        display_order: 2,
        product_option_values: [
          { id: "size-s-a", option_type_id: "size-type-a", value: "S", color_hex: null, display_order: 1 },
          { id: "size-m-a", option_type_id: "size-type-a", value: "M", color_hex: null, display_order: 2 },
        ],
      },
      {
        id: "color-type-a",
        name: "Color",
        display_order: 1,
        product_option_values: [
          { id: "color-red-a", option_type_id: "color-type-a", value: "Red", color_hex: "#AA2200", display_order: 1 },
        ],
      },
    ],
    product_variants: [
      {
        id: "variant-s-red",
        label: "S / Red",
        price: 180,
        compare_at_price: null,
        stock_quantity: 5,
        is_available: true,
        display_order: 1,
        sku: "AK-S-RED",
        product_variant_options: [
          { option_type_id: "size-type-a", option_value_id: "size-s-a" },
          { option_type_id: "color-type-a", option_value_id: "color-red-a" },
        ],
      },
      {
        id: "variant-m-red",
        label: "M / Red",
        price: 180,
        compare_at_price: null,
        stock_quantity: 0,
        is_available: true,
        display_order: 2,
        sku: "AK-M-RED",
        product_variant_options: [
          { option_type_id: "size-type-a", option_value_id: "size-m-a" },
          { option_type_id: "color-type-a", option_value_id: "color-red-a" },
        ],
      },
    ],
  }),
  createProduct({
    id: "p2",
    name: "Heritage Column",
    slug: "heritage-column",
    price: 240,
    has_variants: true,
    product_option_types: [
      {
        id: "size-type-b",
        name: "size",
        display_order: 2,
        product_option_values: [
          { id: "size-m-b", option_type_id: "size-type-b", value: "m", color_hex: null, display_order: 1 },
          { id: "size-l-b", option_type_id: "size-type-b", value: "L", color_hex: null, display_order: 2 },
        ],
      },
      {
        id: "color-type-b",
        name: "Color",
        display_order: 1,
        product_option_values: [
          { id: "color-blue-b", option_type_id: "color-type-b", value: "Blue", color_hex: "#1144AA", display_order: 1 },
        ],
      },
    ],
    product_variants: [
      {
        id: "variant-m-blue",
        label: "M / Blue",
        price: 240,
        compare_at_price: null,
        stock_quantity: 4,
        is_available: true,
        display_order: 1,
        sku: "HC-M-BLUE",
        product_variant_options: [
          { option_type_id: "size-type-b", option_value_id: "size-m-b" },
          { option_type_id: "color-type-b", option_value_id: "color-blue-b" },
        ],
      },
    ],
    categories: {
      id: "category-id",
      name: "Dresses",
      slug: "dresses",
    },
  }),
  createProduct({
    id: "p3",
    name: "Classic Wrapper",
    slug: "classic-wrapper",
    price: 60,
    stock_quantity: 9,
    has_variants: false,
    categories: {
      id: "category-id-2",
      name: "Tops",
      slug: "tops",
    },
  }),
];

describe("shopFilters", () => {
  it("merges option groups and values case-insensitively", () => {
    const groups = buildShopFilterGroups(products);

    expect(groups.map((group) => group.key)).toEqual(["color", "size"]);
    expect(groups[1]?.values.map((value) => value.key)).toEqual(["s", "m", "l"]);
    expect(groups[1]?.values.find((value) => value.key === "m")?.valueIds.sort()).toEqual(["size-m-a", "size-m-b"]);
  });

  it("builds category options from live products", () => {
    expect(buildShopCategoryOptions(products)).toEqual([
      { slug: "dresses", label: "Dresses" },
      { slug: "tops", label: "Tops" },
    ]);
  });

  it("matches only products with an in-stock variant for selected option values", () => {
    const groups = buildShopFilterGroups(products);
    const state: ShopFilterState = {
      categories: [],
      optionValues: {
        size: ["m"],
      },
      maxPrice: 1000,
    };

    expect(filterShopProducts(products, state, groups).map((product) => product.id)).toEqual(["p2"]);
  });

  it("excludes non-variant products when any option group is selected", () => {
    const groups = buildShopFilterGroups(products);
    const state: ShopFilterState = {
      categories: [],
      optionValues: {
        color: ["blue"],
      },
      maxPrice: 1000,
    };

    expect(matchesShopFilters(products[2], state, groups)).toBe(false);
  });

  it("disables unavailable option values under the current selection", () => {
    const groups = buildShopFilterGroups(products);
    const state: ShopFilterState = {
      categories: [],
      optionValues: {
        color: ["red"],
      },
      maxPrice: 1000,
    };

    expect(isShopFilterValueDisabled(products, groups, state, "size", "m")).toBe(true);
    expect(isShopFilterValueDisabled(products, groups, state, "size", "s")).toBe(false);
  });

  it("keeps selected option values enabled and removes invalid selections during sanitization", () => {
    const groups = buildShopFilterGroups(products);
    const state = {
      size: ["m"],
      color: ["green"],
    };

    expect(isShopFilterValueDisabled(products, groups, { categories: [], optionValues: { size: ["m"] }, maxPrice: 1000 }, "size", "m")).toBe(
      false,
    );
    expect(sanitizeShopFilterState(state, groups)).toEqual({ size: ["m"] });
  });
});
