import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import ShopProductCard, { ShopProductCardSkeleton, type ShopProductCardItem } from "@/components/ShopProductCard";
import {
  contentConfig,
  type ContentImageLinkConfig,
  type ContentLinkConfig,
  type HomeCategoryCardConfig,
} from "@/config/content.config";
import { getCategoryLabel } from "@/lib/categories";
import { formatPrice } from "@/lib/price";
import { getAllProducts, getFeaturedProducts } from "@/services/productService";
import { getPrimaryImage, type Product } from "@/types/product";

const isExternalHref = (href: string) => /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href);

interface EditorialLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

const EditorialLink = ({ href, className, children }: EditorialLinkProps) => {
  if (isExternalHref(href)) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  );
};

const EditorialButton = ({ link, className }: { link: ContentLinkConfig; className: string }) => {
  return (
    <EditorialLink href={link.href} className={className}>
      {link.label}
    </EditorialLink>
  );
};

const toShopCardItem = (product: Product, badgeLabel?: string): ShopProductCardItem => ({
  href: `/shop/${product.slug}`,
  name: product.name,
  descriptor: product.short_description?.trim() || product.categories?.name || getCategoryLabel(product.categories?.slug),
  priceLabel: formatPrice(product.price),
  imageUrl: getPrimaryImage(product),
  imageAlt: product.name,
  badgeLabel,
  categoryLabel: product.categories?.name || getCategoryLabel(product.categories?.slug),
  product,
});

const CategoryCard = ({ item }: { item: HomeCategoryCardConfig }) => {
  return (
    <EditorialLink href={item.href} className="group relative block overflow-hidden rounded-[0.5rem]">
      <img
        src={item.imageUrl}
        alt={item.imageAlt}
        className="aspect-[3/4] w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.06]"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,27,15,0.62)_0%,rgba(0,27,15,0.14)_50%,rgba(0,27,15,0.08)_100%)] transition-opacity duration-500 group-hover:opacity-90" />
      <div className="absolute inset-x-2 bottom-3 text-center sm:inset-x-4 sm:bottom-5">
        <h3 className="font-display text-[14px] font-medium text-white sm:text-[30px]">{item.label}</h3>
        <span className="mt-2 inline-flex rounded-[0.125rem] bg-white px-3 py-1 font-body text-[8px] font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] sm:px-5 sm:py-2 sm:text-[10px]">
          {item.ctaLabel}
        </span>
      </div>
    </EditorialLink>
  );
};

const DetailCard = ({ item }: { item: ContentImageLinkConfig }) => {
  return (
    <article className="group">
      <EditorialLink href={item.href} className="block">
        <div className="overflow-hidden rounded-[0.5rem] bg-[var(--color-surface-alt)]">
          <img
            src={item.imageUrl}
            alt={item.imageAlt}
            className="aspect-square w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            loading="lazy"
          />
        </div>
        <h3 className="mt-3 font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)] sm:text-[11px]">
          {item.label}
        </h3>
      </EditorialLink>
    </article>
  );
};

const Index = () => {
  const { hero, newArrivals, categoryShowcase, newsletterBanner, editorsPick, bestsellers, brandStory, instagram } =
    contentConfig.home;
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setIsProductsLoading(true);

      const [productsResult, featuredProductsResult] = await Promise.allSettled([getAllProducts(), getFeaturedProducts()]);

      if (!isMounted) {
        return;
      }

      if (productsResult.status === "fulfilled") {
        setAllProducts(productsResult.value ?? []);
      } else {
        console.error(productsResult.reason);
        setAllProducts([]);
      }

      if (featuredProductsResult.status === "fulfilled") {
        setFeaturedProducts(featuredProductsResult.value ?? []);
      } else {
        console.error(featuredProductsResult.reason);
        setFeaturedProducts([]);
      }

      setIsProductsLoading(false);
    };

    void fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const newArrivalProducts = useMemo(() => allProducts.slice(0, 4), [allProducts]);

  const bestsellerProducts = useMemo(() => {
    const recentIds = new Set(newArrivalProducts.map((product) => product.id));
    const ranked: Product[] = [];
    const seen = new Set<string>();

    const pushProducts = (products: Product[]) => {
      products.forEach((product) => {
        if (seen.has(product.id)) {
          return;
        }

        seen.add(product.id);
        ranked.push(product);
      });
    };

    pushProducts(featuredProducts.filter((product) => !recentIds.has(product.id)));
    pushProducts(allProducts.filter((product) => !recentIds.has(product.id)));
    pushProducts(newArrivalProducts);

    return ranked.slice(0, 4);
  }, [allProducts, featuredProducts, newArrivalProducts]);

  const editorsPickFeaturedProduct = useMemo(() => featuredProducts[0] ?? allProducts[0] ?? null, [allProducts, featuredProducts]);

  const editorsPickSupportProducts = useMemo(() => {
    if (!editorsPickFeaturedProduct) {
      return [];
    }

    return allProducts.filter((product) => product.id !== editorsPickFeaturedProduct.id).slice(0, 2);
  }, [allProducts, editorsPickFeaturedProduct]);

  const editorsPickFeaturedContent = editorsPickFeaturedProduct
    ? {
        label: editorsPick.featured.label,
        title: editorsPickFeaturedProduct.name,
        cta: { label: editorsPick.featured.cta.label, href: `/shop/${editorsPickFeaturedProduct.slug}` },
        imageUrl: getPrimaryImage(editorsPickFeaturedProduct) || editorsPick.featured.imageUrl,
        imageAlt: editorsPickFeaturedProduct.name,
      }
    : editorsPick.featured;

  const editorsPickDetailItems = editorsPickSupportProducts.length > 0
    ? editorsPickSupportProducts.map((product) => ({
        label: product.name,
        href: `/shop/${product.slug}`,
        imageUrl: getPrimaryImage(product) || editorsPick.detailCards[0]?.imageUrl || "",
        imageAlt: product.name,
      }))
    : editorsPick.detailCards;

  const newArrivalCardItems = useMemo(
    () => newArrivalProducts.map((product, index) => toShopCardItem(product, index === 0 ? "New Arrival" : undefined)),
    [newArrivalProducts],
  );

  const bestsellerCardItems = useMemo(
    () =>
      bestsellerProducts.map((product) =>
        toShopCardItem(product, featuredProducts.some((featuredProduct) => featuredProduct.id === product.id) ? "Bestseller" : undefined),
      ),
    [bestsellerProducts, featuredProducts],
  );

  return (
    <div className="bg-[var(--theme-canvas)]">
      <section className="relative isolate overflow-hidden bg-[var(--color-primary)]">
        <img
          src={hero.imageUrl}
          alt={hero.imageAlt}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,27,15,0.72)_0%,rgba(0,27,15,0.38)_38%,rgba(0,27,15,0.12)_100%)]" />

        <div className="relative mx-auto flex min-h-[68svh] max-w-screen-2xl items-end px-4 pb-10 pt-16 sm:px-6 sm:pb-16 lg:min-h-[76svh] lg:px-8 lg:pb-24">
          <div className="max-w-[620px] animate-fade-in">
            <p className="mb-4 font-body text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)] sm:mb-5 sm:text-[11px]">
              {hero.collectionLabel}
            </p>

            <h1 className="max-w-[420px] font-display text-[42px] font-medium leading-[0.95] tracking-[-0.04em] text-white sm:max-w-[520px] sm:text-[72px] lg:text-[86px]">
              {hero.heading}
            </h1>

            <p className="mt-4 max-w-[360px] font-body text-sm leading-7 text-white/75 sm:mt-6 sm:text-[15px]">
              {hero.subtext}
            </p>

            <div className="mt-7 flex flex-wrap gap-3 sm:mt-10">
              <EditorialButton
                link={hero.primaryCta}
                className="inline-flex min-w-[164px] items-center justify-center rounded-[0.125rem] bg-[var(--color-accent)] px-6 py-4 font-body text-[10px] font-semibold uppercase tracking-[0.26em] text-white transition-colors hover:bg-[#8A6E00] sm:px-10"
              />
              <EditorialButton
                link={hero.secondaryCta}
                className="hidden min-w-[148px] items-center justify-center rounded-[0.125rem] border border-white/40 px-6 py-4 font-body text-[10px] font-semibold uppercase tracking-[0.26em] text-white transition-colors hover:bg-white/10 sm:inline-flex"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="new-arrivals" className="mx-auto max-w-screen-2xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
          <div>
            <p className="font-body text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
              {newArrivals.eyebrow}
            </p>
            <h2 className="mt-2 font-display text-[28px] text-[var(--color-primary)] sm:text-[40px]">{newArrivals.title}</h2>
          </div>

          <EditorialButton
            link={newArrivals.cta}
            className="font-body text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--color-primary)] transition-colors hover:text-[var(--color-accent)] sm:text-[10px]"
          />
        </div>

        {isProductsLoading ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <ShopProductCardSkeleton key={`home-new-arrivals-skeleton-${index}`} />
            ))}
          </div>
        ) : newArrivalCardItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {newArrivalCardItems.map((item) => (
              <ShopProductCard key={item.href} item={item} />
            ))}
          </div>
        ) : (
          <p className="font-body text-sm text-[var(--color-muted)]">New arrivals will appear here once the live catalog is available.</p>
        )}
      </section>

      <section id="collections" className="bg-[var(--color-surface-alt)] py-14 sm:py-20">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center sm:mb-12">
            <h2 className="font-display text-[28px] text-[var(--color-primary)] sm:text-[40px]">{categoryShowcase.title}</h2>
            <p className="mt-3 font-body text-sm text-[var(--color-muted)]">{categoryShowcase.description}</p>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-8">
            {categoryShowcase.items.map((item) => (
              <CategoryCard key={item.label} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-primary)] py-8">
        <div className="mx-auto flex max-w-screen-2xl flex-col gap-6 px-4 text-center sm:px-6 md:flex-row md:items-center md:justify-between md:text-left lg:px-8">
          <div>
            <h2 className="font-display text-[26px] text-white sm:text-[32px]">{newsletterBanner.title}</h2>
            <p className="mt-2 font-body text-sm text-[var(--color-accent)]">{newsletterBanner.description}</p>
          </div>

          <form onSubmit={(event) => event.preventDefault()} className="grid w-full max-w-[420px] grid-cols-[1fr_auto] gap-0 md:w-auto">
            <input
              type="email"
              placeholder={newsletterBanner.inputPlaceholder}
              className="rounded-l-[0.125rem] bg-white/10 px-4 py-4 font-body text-[12px] text-white outline-none placeholder:text-white/45"
              aria-label={newsletterBanner.inputPlaceholder}
            />
            <button
              type="submit"
              className="rounded-r-[0.125rem] bg-[var(--color-accent)] px-5 py-4 font-body text-[10px] font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#8A6E00]"
            >
              {newsletterBanner.buttonLabel}
            </button>
          </form>
        </div>
      </section>

      <section id="editors-picks" className="mx-auto max-w-screen-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mb-10 text-center sm:mb-16">
          <p className="font-body text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
            {editorsPick.eyebrow}
          </p>
          <h2 className="mt-2 font-display text-[28px] text-[var(--color-primary)] sm:text-[40px]">{editorsPick.title}</h2>
        </div>

        <div className="grid grid-cols-[1.05fr_0.95fr] gap-4 sm:gap-8 lg:items-center lg:gap-12">
          <article className="group relative overflow-hidden rounded-[0.5rem] bg-[var(--color-surface-alt)] shadow-[0_18px_40px_rgba(28,28,26,0.06)]">
            <img
              src={editorsPickFeaturedContent.imageUrl}
              alt={editorsPickFeaturedContent.imageAlt}
              className="aspect-[4/5] w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,27,15,0.68)_0%,rgba(0,27,15,0.16)_55%,rgba(0,27,15,0)_100%)]" />
            <div className="absolute inset-x-3 bottom-3 sm:inset-x-6 sm:bottom-6">
              <p className="font-body text-[9px] font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)] sm:text-[10px]">
                {editorsPickFeaturedContent.label}
              </p>
              <h3 className="mt-2 font-display text-[18px] leading-tight text-white sm:text-[34px]">{editorsPickFeaturedContent.title}</h3>
              <EditorialButton
                link={editorsPickFeaturedContent.cta}
                className="mt-4 inline-flex rounded-[0.125rem] bg-white px-3 py-2 font-body text-[8px] font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] transition-colors hover:bg-[var(--color-accent)] hover:text-white sm:px-6 sm:py-3 sm:text-[10px]"
              />
            </div>
          </article>

          <div className="flex flex-col justify-center gap-5 sm:gap-8">
            <p className="font-display text-[17px] leading-[1.45] text-[var(--color-primary)] sm:text-[30px] sm:leading-[1.35]">
              "{editorsPick.quote}"
            </p>

            <div className="grid grid-cols-2 gap-3 sm:gap-5">
              {editorsPickDetailItems.map((item) => (
                <DetailCard key={item.label} item={item} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="bestsellers" className="bg-[var(--color-surface-alt)] py-16 sm:py-24">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center sm:mb-12">
            <p className="font-body text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
              {bestsellers.eyebrow}
            </p>
            <h2 className="mt-2 font-display text-[28px] text-[var(--color-primary)] sm:text-[40px]">{bestsellers.title}</h2>
          </div>

          {isProductsLoading ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <ShopProductCardSkeleton key={`home-bestsellers-skeleton-${index}`} />
              ))}
            </div>
          ) : bestsellerCardItems.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
              {bestsellerCardItems.map((item) => (
                <ShopProductCard key={item.href} item={item} />
              ))}
            </div>
          ) : (
            <p className="font-body text-sm text-[var(--color-muted)]">Bestselling pieces will appear here once the live catalog is available.</p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-screen-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid grid-cols-[0.95fr_1.05fr] gap-5 sm:gap-10 lg:items-center lg:gap-16">
          <div className="relative">
            <div className="absolute -left-4 -top-4 h-24 w-24 rounded-[0.5rem] bg-[rgba(115,92,0,0.12)] sm:-left-6 sm:-top-6 sm:h-36 sm:w-36" />
            <div className="overflow-hidden rounded-[0.5rem] bg-[var(--color-primary)] shadow-[0_20px_60px_rgba(28,28,26,0.08)]">
              <img
                src={brandStory.imageUrl}
                alt={brandStory.imageAlt}
                className="aspect-square w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          <div>
            <p className="font-body text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
              {brandStory.eyebrow}
            </p>
            <h2 className="mt-3 font-display text-[24px] leading-tight text-[var(--color-primary)] sm:text-[44px]">
              {brandStory.title}
            </h2>
            <p className="mt-5 max-w-[520px] font-body text-sm leading-7 text-[var(--color-muted)] sm:text-[15px]">
              {brandStory.body}
            </p>
            <EditorialButton
              link={brandStory.cta}
              className="mt-6 inline-flex font-body text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-primary)] transition-colors hover:text-[var(--color-accent)]"
            />
          </div>
        </div>
      </section>

      <section id="journal" className="pb-0 pt-4">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-[24px] text-[var(--color-primary)] sm:text-[30px]">{instagram.handle}</h2>
            <p className="font-body text-[9px] uppercase tracking-[0.24em] text-[var(--color-muted)] sm:text-[10px]">
              {instagram.label}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-0">
          {instagram.items.map((item) => (
            <EditorialLink key={item.label} href={item.href} className="group block">
              <img
                src={item.imageUrl}
                alt={item.imageAlt}
                className="aspect-square w-full object-cover transition-opacity duration-500 group-hover:opacity-85"
                loading="lazy"
              />
            </EditorialLink>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
