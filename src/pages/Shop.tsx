import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ShopProductCard, { ShopProductCardSkeleton } from "@/components/ShopProductCard";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { contentConfig, type ShopSortOptionValue } from "@/config/content.config";
import {
  buildShopCategoryOptions,
  buildShopFilterGroups,
  isShopFilterValueDisabled,
  matchesShopFilters,
  sanitizeShopFilterState,
  type ShopFilterGroup,
  type ShopFilterState,
} from "@/lib/shopFilters";
import { getCategoryLabel } from "@/lib/categories";
import { formatPrice } from "@/lib/price";
import { cn } from "@/lib/utils";
import { getAllProducts } from "@/services/productService";
import { getPrimaryImage, type Product } from "@/types/product";

const PRODUCTS_PER_PAGE = 6;

type ShopGridItem = {
  key: string;
  href: string;
  name: string;
  descriptor: string;
  priceValue: number;
  priceLabel: string;
  imageUrl: string;
  imageAlt: string;
  badgeLabel?: string;
  categorySlug: string;
  categoryLabel: string;
  isFeatured: boolean;
  product: Product;
};

const normalizeSlug = (value: string | null | undefined) => value?.trim().toLowerCase() ?? "";

const slugToLabel = (value: string) =>
  value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((segment) => segment[0].toUpperCase() + segment.slice(1))
    .join(" ");

const createLiveGridItem = (product: Product, index: number): ShopGridItem => {
  const categorySlug = normalizeSlug(product.categories?.slug);
  const categoryLabel = product.categories?.name?.trim() || getCategoryLabel(product.categories?.slug);
  const descriptor = product.short_description?.trim() || categoryLabel;
  const badgeLabel = product.is_featured ? "Bestseller" : index === 0 ? "New Arrival" : undefined;

  return {
    key: product.id,
    href: `/shop/${product.slug}`,
    name: product.name,
    descriptor,
    priceValue: product.price,
    priceLabel: formatPrice(product.price),
    imageUrl: getPrimaryImage(product),
    imageAlt: product.name,
    badgeLabel,
    categorySlug,
    categoryLabel,
    isFeatured: product.is_featured === true,
    product,
  };
};

interface ShopFiltersPanelProps {
  categoryOptions: Array<{ slug: string; label: string }>;
  selectedCategories: string[];
  onToggleCategory: (categorySlug: string) => void;
  optionGroups: ShopFilterGroup[];
  selectedOptionValues: Record<string, string[]>;
  onToggleOptionValue: (groupKey: string, valueKey: string) => void;
  isOptionValueDisabled: (groupKey: string, valueKey: string) => boolean;
  maxPrice: number;
  upperPriceBound: number;
  onMaxPriceChange: (value: number) => void;
}

const ShopFiltersPanel = ({
  categoryOptions,
  selectedCategories,
  onToggleCategory,
  optionGroups,
  selectedOptionValues,
  onToggleOptionValue,
  isOptionValueDisabled,
  maxPrice,
  upperPriceBound,
  onMaxPriceChange,
}: ShopFiltersPanelProps) => {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-display text-[24px] text-[var(--color-primary)]">{contentConfig.shop.sidebar.categoryTitle}</h2>
        <div className="mt-4 space-y-3">
          {categoryOptions.map((category) => {
            const isChecked = selectedCategories.includes(category.slug);

            return (
              <label key={category.slug} className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleCategory(category.slug)}
                  className="h-4 w-4 rounded-[0.125rem] border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-accent)]"
                />
                <span className="font-body text-sm text-[var(--color-primary)] transition-colors hover:text-[var(--color-accent)]">
                  {category.label}
                </span>
              </label>
            );
          })}
        </div>
      </section>

      {optionGroups.map((group) => {
        const selectedValues = selectedOptionValues[group.key] ?? [];
        const renderAsSwatches = group.values.some((value) => Boolean(value.colorHex));

        return (
          <section key={group.key}>
            <h2 className="font-display text-[24px] text-[var(--color-primary)]">{group.label}</h2>

            {renderAsSwatches ? (
              <div className="mt-4 space-y-3">
                {group.values.map((value) => {
                  const isSelected = selectedValues.includes(value.key);
                  const isDisabled = isOptionValueDisabled(group.key, value.key);

                  return (
                    <button
                      key={value.key}
                      type="button"
                      onClick={() => onToggleOptionValue(group.key, value.key)}
                      disabled={isDisabled}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-[0.125rem] border px-3 py-2 text-left transition-colors",
                        isSelected
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                          : "border-[var(--color-border)] bg-white text-[var(--color-primary)] hover:border-[var(--color-accent)]",
                        isDisabled && "cursor-not-allowed opacity-40",
                      )}
                    >
                      <span
                        className="h-4 w-4 rounded-full border border-transparent"
                        style={{ backgroundColor: value.colorHex || "#d2cdc4" }}
                      />
                      <span className="font-body text-sm">{value.label}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="mt-4 flex flex-wrap gap-2">
                {group.values.map((value) => {
                  const isSelected = selectedValues.includes(value.key);
                  const isDisabled = isOptionValueDisabled(group.key, value.key);

                  return (
                    <button
                      key={value.key}
                      type="button"
                      onClick={() => onToggleOptionValue(group.key, value.key)}
                      disabled={isDisabled}
                      className={cn(
                        "rounded-[0.125rem] border px-3 py-2 font-body text-[11px] uppercase tracking-[0.18em] transition-colors",
                        isSelected
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                          : "border-[var(--color-border)] bg-white text-[var(--color-primary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]",
                        isDisabled && "cursor-not-allowed opacity-40",
                      )}
                    >
                      {value.label}
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}

      <section>
        <h2 className="font-display text-[24px] text-[var(--color-primary)]">{contentConfig.shop.sidebar.priceTitle}</h2>
        <div className="mt-4">
          <input
            type="range"
            min={0}
            max={upperPriceBound}
            value={Math.min(maxPrice, upperPriceBound)}
            onChange={(event) => onMaxPriceChange(Number(event.target.value))}
            className="h-1 w-full cursor-pointer appearance-none bg-[var(--color-border)] accent-[var(--color-primary)]"
          />
          <div className="mt-2 flex justify-between font-body text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
            <span>$0</span>
            <span>${upperPriceBound}</span>
          </div>
        </div>
      </section>

      <section className="rounded-[0.5rem] bg-[linear-gradient(135deg,var(--theme-primary)_0%,#013220_100%)] p-6 text-white">
        <p className="font-body text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
          {contentConfig.shop.sidebar.promotion.eyebrow}
        </p>
        <p className="mt-3 max-w-[180px] font-display text-[28px] leading-tight text-white">
          {contentConfig.shop.sidebar.promotion.title}
        </p>
        <Link
          to={contentConfig.shop.sidebar.promotion.cta.href}
          className="mt-5 inline-flex font-body text-[10px] font-semibold uppercase tracking-[0.22em] text-white underline decoration-[var(--color-accent)] underline-offset-4"
        >
          {contentConfig.shop.sidebar.promotion.cta.label}
        </Link>
      </section>
    </div>
  );
};

const Shop = () => {
  const { slug } = useParams<{ slug: string }>();
  const routeCategorySlug = normalizeSlug(slug);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedOptionValues, setSelectedOptionValues] = useState<Record<string, string[]>>({});
  const [sortBy, setSortBy] = useState<ShopSortOptionValue>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllProducts();
        setProducts(data ?? []);
      } catch (err) {
        console.error(err);
        setError("Unable to load the live catalog right now.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchProducts();
  }, []);

  const allItems = useMemo(() => products.map((product, index) => createLiveGridItem(product, index)), [products]);
  const categoryOptions = useMemo(() => buildShopCategoryOptions(products), [products]);
  const optionGroups = useMemo(() => buildShopFilterGroups(products), [products]);

  useEffect(() => {
    setSelectedOptionValues((current) => {
      const next = sanitizeShopFilterState(current, optionGroups);
      const currentKeys = Object.keys(current);
      const nextKeys = Object.keys(next);
      const isSame =
        currentKeys.length === nextKeys.length &&
        currentKeys.every((key) => {
          const currentValues = current[key] ?? [];
          const nextValues = next[key] ?? [];
          return currentValues.length === nextValues.length && currentValues.every((value, index) => value === nextValues[index]);
        });

      return isSame ? current : next;
    });
  }, [optionGroups]);

  const upperPriceBound = useMemo(() => {
    const highestPrice = allItems.reduce((maximum, item) => Math.max(maximum, item.priceValue), 0);
    return Math.max(1000, Math.ceil(highestPrice / 50) * 50);
  }, [allItems]);

  useEffect(() => {
    setMaxPrice(upperPriceBound);
  }, [upperPriceBound]);

  useEffect(() => {
    setSelectedCategories(routeCategorySlug ? [routeCategorySlug] : []);
    setSelectedOptionValues({});
  }, [routeCategorySlug]);

  const filterState = useMemo<ShopFilterState>(
    () => ({
      categories: selectedCategories,
      optionValues: selectedOptionValues,
      maxPrice,
    }),
    [maxPrice, selectedCategories, selectedOptionValues],
  );

  const disabledOptionValues = useMemo(() => {
    const disabled = new Set<string>();

    optionGroups.forEach((group) => {
      group.values.forEach((value) => {
        if (isShopFilterValueDisabled(products, optionGroups, filterState, group.key, value.key)) {
          disabled.add(`${group.key}:${value.key}`);
        }
      });
    });

    return disabled;
  }, [filterState, optionGroups, products]);

  const filteredItems = useMemo(() => {
    const matchedItems = allItems.filter((item) => matchesShopFilters(item.product, filterState, optionGroups));
    const sortedItems = [...matchedItems];

    switch (sortBy) {
      case "price-asc":
        sortedItems.sort((left, right) => left.priceValue - right.priceValue);
        break;
      case "price-desc":
        sortedItems.sort((left, right) => right.priceValue - left.priceValue);
        break;
      case "featured":
        sortedItems.sort((left, right) => Number(right.isFeatured) - Number(left.isFeatured));
        break;
      case "newest":
      default:
        break;
    }

    return sortedItems;
  }, [allItems, filterState, optionGroups, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterState, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PRODUCTS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedItems = filteredItems.slice((safeCurrentPage - 1) * PRODUCTS_PER_PAGE, safeCurrentPage * PRODUCTS_PER_PAGE);

  const activeCategoryLabel =
    selectedCategories.length === 1
      ? categoryOptions.find((item) => item.slug === selectedCategories[0])?.label ?? slugToLabel(selectedCategories[0])
      : null;

  const heading = activeCategoryLabel ? `${contentConfig.shop.titlePrefix} ${activeCategoryLabel}` : contentConfig.shop.defaultTitle;
  const breadcrumbLeaf = activeCategoryLabel ?? "All Pieces";
  const resultStart = filteredItems.length === 0 ? 0 : (safeCurrentPage - 1) * PRODUCTS_PER_PAGE + 1;
  const resultEnd = Math.min(safeCurrentPage * PRODUCTS_PER_PAGE, filteredItems.length);
  const activeOptionFilterCount = Object.values(selectedOptionValues).reduce((total, values) => total + values.length, 0);
  const activeFilterCount = selectedCategories.length + activeOptionFilterCount + (maxPrice < upperPriceBound ? 1 : 0);

  const toggleCategory = (categorySlug: string) => {
    setSelectedCategories((current) =>
      current.includes(categorySlug) ? current.filter((item) => item !== categorySlug) : [...current, categorySlug],
    );
  };

  const toggleOptionValue = (groupKey: string, valueKey: string) => {
    setSelectedOptionValues((current) => {
      const currentValues = current[groupKey] ?? [];
      const nextValues = currentValues.includes(valueKey)
        ? currentValues.filter((item) => item !== valueKey)
        : [...currentValues, valueKey];

      if (nextValues.length === 0) {
        const { [groupKey]: _removed, ...rest } = current;
        return rest;
      }

      return {
        ...current,
        [groupKey]: nextValues,
      };
    });
  };

  const isOptionValueDisabled = (groupKey: string, valueKey: string) => disabledOptionValues.has(`${groupKey}:${valueKey}`);

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
        <aside className="hidden lg:sticky lg:top-24 lg:block lg:w-72 lg:flex-shrink-0">
          <div className="rounded-[0.75rem] bg-[var(--color-surface-alt)] p-5 shadow-[0_20px_60px_rgba(28,28,26,0.04)] lg:p-8">
            <ShopFiltersPanel
              categoryOptions={categoryOptions}
              selectedCategories={selectedCategories}
              onToggleCategory={toggleCategory}
              optionGroups={optionGroups}
              selectedOptionValues={selectedOptionValues}
              onToggleOptionValue={toggleOptionValue}
              isOptionValueDisabled={isOptionValueDisabled}
              maxPrice={maxPrice}
              upperPriceBound={upperPriceBound}
              onMaxPriceChange={setMaxPrice}
            />
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="mb-10">
            <div className="mb-6 flex flex-wrap items-center gap-2 font-body text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
              <span>{contentConfig.shop.breadcrumb.homeLabel}</span>
              <span>/</span>
              <span>{contentConfig.shop.breadcrumb.shopLabel}</span>
              <span>/</span>
              <span className="font-semibold text-[var(--color-primary)]">{breadcrumbLeaf}</span>
            </div>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="font-display text-[44px] leading-none tracking-[-0.03em] text-[var(--color-primary)]">{heading}</h1>
                <p className="mt-2 font-body text-sm italic text-[var(--color-muted)]">
                  {loading ? "Loading curated pieces..." : `Showing ${resultStart}-${resultEnd} of ${filteredItems.length} artisanal pieces`}
                </p>
                {error ? (
                  <p className="mt-3 font-body text-[11px] uppercase tracking-[0.16em] text-[var(--color-accent)]">
                    Live catalog unavailable right now.
                  </p>
                ) : null}

                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="mt-5 inline-flex items-center gap-2 rounded-[0.125rem] bg-[var(--color-primary)] px-4 py-3 font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-white lg:hidden"
                >
                  <SlidersHorizontal size={14} strokeWidth={1.8} />
                  Filters
                  <span className="rounded-full bg-white/12 px-2 py-0.5 text-[9px]">{activeFilterCount}</span>
                </button>
              </div>

              <label className="flex items-center gap-3 font-body text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                <span>Sort by</span>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as ShopSortOptionValue)}
                  className="rounded-[0.125rem] bg-[var(--color-surface-alt)] px-3 py-2 font-display text-[15px] normal-case tracking-normal text-[var(--color-primary)] outline-none"
                >
                  {contentConfig.shop.sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </header>

          {loading ? (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, index) => (
                <ShopProductCardSkeleton key={`shop-skeleton-${index}`} />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="rounded-[0.75rem] bg-[var(--color-surface-alt)] px-6 py-12 text-center shadow-[0_20px_60px_rgba(28,28,26,0.04)]">
              <h2 className="font-display text-[32px] text-[var(--color-primary)]">No matching pieces yet</h2>
              <p className="mt-3 font-body text-sm text-[var(--color-muted)]">
                Adjust the filters to widen the edit and explore more of the collection.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                {paginatedItems.map((item) => (
                  <ShopProductCard key={item.key} item={item} />
                ))}
              </div>

              <div className="mt-14 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((current) => Math.max(1, current - 1))}
                    disabled={safeCurrentPage === 1}
                    className="flex h-10 w-10 items-center justify-center rounded-[0.125rem] bg-[var(--color-surface-alt)] font-body text-[11px] text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {"<"}
                  </button>

                  {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNumber = index + 1;
                    const isActive = pageNumber === safeCurrentPage;

                    return (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() => setCurrentPage(pageNumber)}
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-[0.125rem] font-body text-[11px] transition-colors",
                          isActive
                            ? "bg-[var(--color-primary)] text-white"
                            : "bg-[var(--color-surface-alt)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white",
                        )}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => setCurrentPage((current) => Math.min(totalPages, current + 1))}
                    disabled={safeCurrentPage === totalPages}
                    className="flex h-10 w-10 items-center justify-center rounded-[0.125rem] bg-[var(--color-surface-alt)] font-body text-[11px] text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {">"}
                  </button>
                </div>

                <p className="font-body text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                  Page {safeCurrentPage} of {totalPages}
                </p>
              </div>
            </>
          )}
        </main>
      </div>

      <Drawer open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
        <DrawerContent className="max-h-[88vh] rounded-t-[1rem] border-none bg-[var(--theme-canvas)]">
          <DrawerHeader className="border-b border-[rgba(28,28,26,0.06)] px-4 pb-4 pt-2 text-left sm:px-6">
            <DrawerTitle className="font-display text-[28px] font-medium text-[var(--color-primary)]">Filter Collection</DrawerTitle>
            <DrawerDescription className="font-body text-sm text-[var(--color-muted)]">
              Refine the catalog by category, live variations, and price.
            </DrawerDescription>
          </DrawerHeader>

          <div className="overflow-y-auto px-4 py-6 sm:px-6">
            <ShopFiltersPanel
              categoryOptions={categoryOptions}
              selectedCategories={selectedCategories}
              onToggleCategory={toggleCategory}
              optionGroups={optionGroups}
              selectedOptionValues={selectedOptionValues}
              onToggleOptionValue={toggleOptionValue}
              isOptionValueDisabled={isOptionValueDisabled}
              maxPrice={maxPrice}
              upperPriceBound={upperPriceBound}
              onMaxPriceChange={setMaxPrice}
            />
          </div>

          <div className="border-t border-[rgba(28,28,26,0.06)] px-4 py-4 sm:px-6">
            <DrawerClose asChild>
              <button
                type="button"
                className="w-full rounded-[0.125rem] bg-[var(--color-primary)] px-4 py-3 font-body text-[10px] font-semibold uppercase tracking-[0.22em] text-white"
              >
                View {filteredItems.length} Pieces
              </button>
            </DrawerClose>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Shop;
