import { getCategoryLabel } from "@/lib/categories";
import type { Product } from "@/types/product";

export interface ShopFilterValue {
  key: string;
  label: string;
  colorHex: string | null;
  sortOrder: number;
  valueIds: string[];
}

export interface ShopFilterGroup {
  key: string;
  label: string;
  sortOrder: number;
  values: ShopFilterValue[];
}

export interface ShopCategoryOption {
  slug: string;
  label: string;
}

export interface ShopFilterState {
  categories: string[];
  optionValues: Record<string, string[]>;
  maxPrice: number;
}

const normalizeFilterKey = (value: string | null | undefined) => value?.trim().toLowerCase() ?? "";

const sortByOrderThenSequenceThenLabel = <T extends { sortOrder: number; sequence: number; label: string }>(
  left: T,
  right: T,
) => left.sortOrder - right.sortOrder || left.sequence - right.sequence || left.label.localeCompare(right.label);

const getSelectedOptionEntries = (state: ShopFilterState) =>
  Object.entries(state.optionValues).filter(([, selectedValues]) => selectedValues.length > 0);

const getAvailableVariants = (product: Product) =>
  product.product_variants?.filter((variant) => variant.is_available && variant.stock_quantity > 0) ?? [];

const createValueIdLookup = (groups: ShopFilterGroup[]) =>
  Object.fromEntries(
    groups.map((group) => [
      group.key,
      Object.fromEntries(group.values.map((value) => [value.key, new Set(value.valueIds)])),
    ]),
  ) as Record<string, Record<string, Set<string>>>;

export const buildShopCategoryOptions = (products: Product[]): ShopCategoryOption[] =>
  Array.from(
    new Map(
      products
        .map((product) => {
          const slug = normalizeFilterKey(product.categories?.slug);
          if (!slug) return null;

          return [
            slug,
            {
              slug,
              label: product.categories?.name?.trim() || getCategoryLabel(product.categories?.slug),
            },
          ] as const;
        })
        .filter((entry): entry is readonly [string, ShopCategoryOption] => Boolean(entry)),
    ).values(),
  );

export const buildShopFilterGroups = (products: Product[]): ShopFilterGroup[] => {
  let groupSequence = 0;
  let valueSequence = 0;
  const groupMap = new Map<
    string,
    {
      key: string;
      label: string;
      sortOrder: number;
      sequence: number;
      values: Map<
        string,
        {
          key: string;
          label: string;
          colorHex: string | null;
          sortOrder: number;
          sequence: number;
          valueIds: Set<string>;
        }
      >;
    }
  >();

  products.forEach((product) => {
    product.product_option_types?.forEach((optionType) => {
      const groupKey = normalizeFilterKey(optionType.name);
      const optionLabel = optionType.name.trim();
      if (!groupKey || !optionLabel) {
        return;
      }

      const existingGroup = groupMap.get(groupKey);
      const group =
        existingGroup ??
        {
          key: groupKey,
          label: optionLabel,
          sortOrder: optionType.display_order,
          sequence: groupSequence++,
          values: new Map(),
        };

      group.sortOrder = Math.min(group.sortOrder, optionType.display_order);
      groupMap.set(groupKey, group);

      optionType.product_option_values.forEach((optionValue) => {
        const valueKey = normalizeFilterKey(optionValue.value);
        const valueLabel = optionValue.value.trim();
        if (!valueKey || !valueLabel) {
          return;
        }

        const existingValue = group.values.get(valueKey);
        const value =
          existingValue ??
          {
            key: valueKey,
            label: valueLabel,
            colorHex: optionValue.color_hex ?? null,
            sortOrder: optionValue.display_order,
            sequence: valueSequence++,
            valueIds: new Set<string>(),
          };

        value.sortOrder = Math.min(value.sortOrder, optionValue.display_order);
        value.colorHex = value.colorHex ?? optionValue.color_hex ?? null;
        value.valueIds.add(optionValue.id);
        group.values.set(valueKey, value);
      });
    });
  });

  return Array.from(groupMap.values())
    .map((group) => ({
      key: group.key,
      label: group.label,
      sortOrder: group.sortOrder,
      sequence: group.sequence,
      values: Array.from(group.values.values())
        .map((value) => ({
          key: value.key,
          label: value.label,
          colorHex: value.colorHex,
          sortOrder: value.sortOrder,
          sequence: value.sequence,
          valueIds: Array.from(value.valueIds),
        }))
        .sort(sortByOrderThenSequenceThenLabel),
    }))
    .sort(sortByOrderThenSequenceThenLabel)
    .map(({ key, label, sortOrder, values }) => ({
      key,
      label,
      sortOrder,
      values: values.map(({ key: valueKey, label: valueLabel, colorHex, sortOrder: valueSortOrder, valueIds }) => ({
        key: valueKey,
        label: valueLabel,
        colorHex,
        sortOrder: valueSortOrder,
        valueIds,
      })),
    }));
};

export const matchesShopFilters = (
  product: Product,
  state: ShopFilterState,
  groups: ShopFilterGroup[],
): boolean => {
  const categorySlug = normalizeFilterKey(product.categories?.slug);
  const selectedOptionEntries = getSelectedOptionEntries(state);

  if (state.categories.length > 0 && !state.categories.includes(categorySlug)) {
    return false;
  }

  if (product.price > state.maxPrice) {
    return false;
  }

  if (selectedOptionEntries.length === 0) {
    return true;
  }

  if (!product.has_variants) {
    return false;
  }

  const variants = getAvailableVariants(product);
  if (variants.length === 0) {
    return false;
  }

  const valueIdLookup = createValueIdLookup(groups);

  return variants.some((variant) =>
    selectedOptionEntries.every(([groupKey, selectedValueKeys]) => {
      const groupLookup = valueIdLookup[groupKey];
      if (!groupLookup) {
        return false;
      }

      const selectedIds = selectedValueKeys.flatMap((valueKey) => Array.from(groupLookup[valueKey] ?? []));
      if (selectedIds.length === 0) {
        return false;
      }

      return variant.product_variant_options.some((optionLink) => selectedIds.includes(optionLink.option_value_id));
    }),
  );
};

export const filterShopProducts = (products: Product[], state: ShopFilterState, groups: ShopFilterGroup[]) =>
  products.filter((product) => matchesShopFilters(product, state, groups));

export const isShopFilterValueDisabled = (
  products: Product[],
  groups: ShopFilterGroup[],
  state: ShopFilterState,
  groupKey: string,
  valueKey: string,
): boolean => {
  if (state.optionValues[groupKey]?.includes(valueKey)) {
    return false;
  }

  const nextState: ShopFilterState = {
    ...state,
    optionValues: {
      ...state.optionValues,
      [groupKey]: [valueKey],
    },
  };

  return filterShopProducts(products, nextState, groups).length === 0;
};

export const sanitizeShopFilterState = (
  state: Record<string, string[]>,
  groups: ShopFilterGroup[],
) => {
  const validValueKeysByGroup = new Map(groups.map((group) => [group.key, new Set(group.values.map((value) => value.key))]));

  return Object.fromEntries(
    Object.entries(state)
      .map(([groupKey, selectedValues]) => {
        const validValues = validValueKeysByGroup.get(groupKey);
        if (!validValues) {
          return null;
        }

        const nextValues = selectedValues.filter((valueKey) => validValues.has(valueKey));
        if (nextValues.length === 0) {
          return null;
        }

        return [groupKey, nextValues] as const;
      })
      .filter((entry): entry is readonly [string, string[]] => Boolean(entry)),
  );
};
