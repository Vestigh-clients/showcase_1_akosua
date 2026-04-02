import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ShopProductCard, { ShopProductCardSkeleton } from "@/components/ShopProductCard";
import ProductFetchErrorState from "@/components/products/ProductFetchErrorState";
import { storeConfig } from "@/config/store.config";
import { getCategoryLabel } from "@/lib/categories";
import { formatPrice } from "@/lib/price";
import { getProductsByCategory } from "@/services/productService";
import { getPrimaryImage, type Product } from "@/types/product";

type SortOption = "featured" | "price-low-high" | "price-high-low" | "newest";

const CATEGORY_SKELETON_COUNT = 4;

const toShopCardItem = (product: Product) => ({
  href: `/shop/${product.slug}`,
  name: product.name,
  descriptor: product.short_description?.trim() || product.categories?.name || getCategoryLabel(product.categories?.slug),
  priceLabel: formatPrice(product.price),
  imageUrl: getPrimaryImage(product),
  imageAlt: product.name,
  badgeLabel: product.is_featured ? "Bestseller" : undefined,
  categoryLabel: product.categories?.name || getCategoryLabel(product.categories?.slug),
  product,
});

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const enabledCategories = useMemo(() => {
    const seen = new Set<string>();
    return storeConfig.categories
      .filter((category) => category.enabled)
      .map((category) => ({
        ...category,
        slug: category.slug.trim().toLowerCase(),
      }))
      .filter((category) => category.slug.length > 0)
      .filter((category) => {
        if (seen.has(category.slug)) {
          return false;
        }
        seen.add(category.slug);
        return true;
      });
  }, []);

  const categoryBySlug = useMemo(() => {
    return Object.fromEntries(enabledCategories.map((category) => [category.slug, category]));
  }, [enabledCategories]);

  const requestedSlug = (slug ?? "").trim().toLowerCase();
  const category = categoryBySlug[requestedSlug] ?? null;
  const uiText = storeConfig.categoryPage.uiText;

  useEffect(() => {
    if (!requestedSlug || !category) {
      setLoading(false);
      setProducts([]);
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProductsByCategory(requestedSlug);
        setProducts(data ?? []);
      } catch (err) {
        console.error(err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    void fetchProducts();
  }, [category, requestedSlug]);

  const sortedProducts = useMemo(() => {
    const indexed = products.map((product, index) => ({ product, index }));

    switch (sortBy) {
      case "price-low-high":
        return [...indexed].sort((a, b) => a.product.price - b.product.price).map((entry) => entry.product);
      case "price-high-low":
        return [...indexed].sort((a, b) => b.product.price - a.product.price).map((entry) => entry.product);
      case "newest":
        return [...indexed].sort((a, b) => a.index - b.index).map((entry) => entry.product);
      case "featured":
      default:
        return [...indexed]
          .sort((a, b) => {
            const featuredDiff = Number(Boolean(b.product.is_featured)) - Number(Boolean(a.product.is_featured));
            return featuredDiff !== 0 ? featuredDiff : a.index - b.index;
          })
          .map((entry) => entry.product);
    }
  }, [products, sortBy]);

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold mb-4">{uiText.notFoundTitle}</h1>
        <Link to="/shop" className="font-body text-accent hover:underline">
          {uiText.backToShopLabel}
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20">
        <ProductFetchErrorState />
      </div>
    );
  }

  const copyDefaults = storeConfig.categoryPage.defaults;
  const copyForCategory = storeConfig.categoryPage.bySlug[category.slug] ?? {};
  const heroDescription = copyForCategory.heroDescription?.trim() || category.description.trim() || copyDefaults.heroDescription;
  const editorialQuote = copyForCategory.editorialQuote?.trim() || copyDefaults.editorialQuote;
  const editorialDescription = copyForCategory.editorialDescription?.trim() || copyDefaults.editorialDescription;
  const heroImageUrl = category.imageUrl.trim();

  return (
    <div className="bg-[var(--color-secondary)] text-foreground">
      <div className="space-y-[80px]">
        <section className="relative min-h-[70vh] overflow-hidden">
          {heroImageUrl ? (
            <img src={heroImageUrl} alt={category.name} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-[rgba(var(--color-primary-rgb),0.15)]" />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(var(--color-primary-rgb),0.65)_0%,rgba(var(--color-primary-rgb),0.05)_100%)]" />

          <div className="absolute bottom-8 left-6 right-6 z-10 max-w-[520px] text-left md:bottom-[80px] md:left-[80px] md:right-auto">
            <p className="mb-3 font-body text-[10px] font-medium uppercase tracking-[0.2em] text-accent">{category.name}</p>
            <h1 className="font-display text-[46px] md:text-[64px] font-light italic leading-[1.05] text-white">{category.name}</h1>
            <p className="mt-4 max-w-[400px] font-body text-[14px] font-light leading-relaxed text-white/70">{heroDescription}</p>
          </div>
        </section>

        <section className="border-b border-[var(--color-border)] pb-8">
          <div className="container mx-auto px-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-body text-[11px] font-light text-[var(--color-muted)]">
              Showing {loading ? CATEGORY_SKELETON_COUNT : sortedProducts.length} products
            </p>

            <div className="relative inline-flex items-center gap-2 self-start sm:self-auto">
              <span className="font-body text-[11px] font-light text-[var(--color-muted)]">Sort by:</span>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortOption)}
                className="appearance-none bg-transparent border-none p-0 pr-4 font-body text-[11px] font-light text-foreground focus:outline-none"
                aria-label="Sort products"
                disabled={loading}
              >
                <option value="featured">Featured</option>
                <option value="price-low-high">Price Low-High</option>
                <option value="price-high-low">Price High-Low</option>
                <option value="newest">Newest</option>
              </select>
              <span className="pointer-events-none absolute right-0 font-body text-[11px] text-[var(--color-muted)]">v</span>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-[80px]">
          <div className="space-y-12">
            <div className="bg-foreground px-8 py-16 md:px-[80px] md:py-[100px]">
              <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-5 md:gap-16">
                <p className="md:col-span-3 font-display text-[34px] font-light italic leading-[1.2] text-background md:text-[40px]">
                  {editorialQuote}
                </p>

                <p className="md:col-span-2 max-w-[340px] whitespace-pre-line font-body text-[14px] font-normal leading-[2] text-[var(--color-muted-soft)]">
                  {editorialDescription}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: CATEGORY_SKELETON_COUNT }).map((_, index) => (
                  <ShopProductCardSkeleton key={`category-skeleton-${index}`} />
                ))}
              </div>
            ) : sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
                {sortedProducts.map((product) => (
                  <ShopProductCard key={product.id} item={toShopCardItem(product)} />
                ))}
              </div>
            ) : null}

            {!loading && sortedProducts.length === 0 ? (
              <div className="border border-[var(--color-border)] px-6 py-8 text-center">
                <p className="font-body text-[12px] text-[var(--color-muted)]">{uiText.emptyCategoryMessage}</p>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CategoryPage;
