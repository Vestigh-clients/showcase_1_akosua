import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductImagePlaceholder from "@/components/products/ProductImagePlaceholder";
import { useCart } from "@/contexts/CartContext";
import { getCategoryLabel } from "@/lib/categories";
import { formatPrice } from "@/lib/price";
import { cn } from "@/lib/utils";
import { getPrimaryImage, getStockQuantity, isInStock, type Product } from "@/types/product";

export interface ShopProductCardItem {
  href: string;
  name: string;
  descriptor?: string;
  priceLabel?: string;
  imageUrl?: string;
  imageAlt?: string;
  badgeLabel?: string;
  categoryLabel?: string;
  product?: Product | null;
}

interface ShopProductCardProps {
  item: ShopProductCardItem;
  showQuickAction?: boolean;
  className?: string;
}

const ShopProductCard = ({ item, showQuickAction = true, className }: ShopProductCardProps) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [hasImageError, setHasImageError] = useState(false);

  const imageUrl = item.imageUrl?.trim() || (item.product ? getPrimaryImage(item.product) : "");
  const imageAlt = item.imageAlt?.trim() || item.name;
  const categoryLabel = item.categoryLabel?.trim() || item.product?.categories?.name || getCategoryLabel(item.product?.categories?.slug);
  const descriptor = item.descriptor?.trim() || item.product?.short_description?.trim() || categoryLabel;
  const priceLabel = item.priceLabel?.trim() || (item.product ? formatPrice(item.product.price) : "");
  const isOutOfStock = item.product ? !isInStock(item.product) : false;
  const requiresVariantSelection = item.product?.has_variants === true;

  useEffect(() => {
    setHasImageError(false);
  }, [imageUrl, item.product?.id, item.name]);

  const handleQuickAction = () => {
    if (!item.product) {
      navigate(item.href);
      return;
    }

    if (requiresVariantSelection) {
      navigate(item.href);
      return;
    }

    if (isOutOfStock) {
      return;
    }

    addToCart({
      product_id: item.product.id,
      name: item.product.name,
      slug: item.product.slug,
      category: categoryLabel,
      price: item.product.price,
      compare_at_price: item.product.compare_at_price ?? null,
      image_url: imageUrl,
      image_alt: imageAlt,
      sku: item.product.sku ?? null,
      stock_quantity: getStockQuantity(item.product),
      variant_id: null,
      variant_label: null,
    });
  };

  const quickActionLabel = !item.product
    ? "View Product"
    : isOutOfStock
      ? "Out of Stock"
      : requiresVariantSelection
        ? "Select Options"
        : "Quick Add";

  return (
    <article className={cn("group flex flex-col gap-4", className)}>
      <div className="relative overflow-hidden rounded-[0.5rem] bg-[var(--color-surface-alt)] shadow-[0_20px_60px_rgba(28,28,26,0.04)]">
        <Link to={item.href} className="block">
          {imageUrl && !hasImageError ? (
            <img
              src={imageUrl}
              alt={imageAlt}
              className="aspect-[3/4] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              loading="lazy"
              onError={() => setHasImageError(true)}
            />
          ) : (
            <ProductImagePlaceholder className="aspect-[3/4] w-full" />
          )}
        </Link>

        {item.badgeLabel ? (
          <div className="absolute left-3 top-3">
            <span
              className={cn(
                "rounded-[0.125rem] px-2 py-1 font-body text-[9px] font-semibold uppercase tracking-[0.2em] text-white shadow-sm",
                item.badgeLabel.toLowerCase() === "bestseller" ? "bg-[var(--color-primary)]" : "bg-[var(--color-accent)]",
              )}
            >
              {item.badgeLabel}
            </span>
          </div>
        ) : null}

        {showQuickAction ? (
          <div className="absolute inset-0 flex items-end justify-center bg-[rgba(0,27,15,0.06)] p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {item.product ? (
              <button
                type="button"
                onClick={handleQuickAction}
                disabled={isOutOfStock}
                className="w-full translate-y-4 bg-[var(--color-primary)] py-3 font-body text-[10px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-300 group-hover:translate-y-0 hover:bg-[var(--color-accent)] disabled:cursor-not-allowed disabled:bg-[var(--color-border)] disabled:text-[var(--color-muted)]"
              >
                {quickActionLabel}
              </button>
            ) : (
              <Link
                to={item.href}
                className="w-full translate-y-4 bg-[var(--color-primary)] py-3 text-center font-body text-[10px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-300 group-hover:translate-y-0 hover:bg-[var(--color-accent)]"
              >
                {quickActionLabel}
              </Link>
            )}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <Link to={item.href} className="transition-colors hover:text-[var(--color-accent)]">
          <h3 className="font-display text-[22px] leading-tight text-[var(--color-primary)]">{item.name}</h3>
        </Link>

        <div className="flex items-end justify-between gap-4">
          {descriptor ? (
            <span className="font-body text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">{descriptor}</span>
          ) : (
            <span />
          )}
          <span className="font-display text-[18px] font-semibold text-[var(--color-accent)]">{priceLabel}</span>
        </div>
      </div>
    </article>
  );
};

export const ShopProductCardSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="lux-product-shimmer aspect-[3/4] w-full rounded-[0.5rem]" />
      <div className="space-y-2">
        <div className="lux-product-shimmer h-5 w-2/3 rounded-[0.25rem]" />
        <div className="flex justify-between gap-3">
          <div className="lux-product-shimmer h-3 w-1/3 rounded-[0.25rem]" />
          <div className="lux-product-shimmer h-4 w-1/4 rounded-[0.25rem]" />
        </div>
      </div>
    </div>
  );
};

export default ShopProductCard;
