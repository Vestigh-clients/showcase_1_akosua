import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Menu, Search, ShoppingBag, X } from "lucide-react";
import SignOutConfirmModal from "@/components/auth/SignOutConfirmModal";
import StoreLogo from "@/components/StoreLogo";
import { contentConfig, type ContentLinkConfig } from "@/config/content.config";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useStorefrontConfig } from "@/contexts/StorefrontConfigContext";
import { useSignOutWithCartWarning } from "@/hooks/useSignOutWithCartWarning";

const isExternalHref = (href: string) => /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href);

interface ProfileMenuProps {
  isOpen: boolean;
  userInitial: string;
  userName: string;
  userEmail: string;
  menuId: string;
  containerRef: RefObject<HTMLDivElement>;
  onToggle: () => void;
  onClose: () => void;
  onSignOut: () => void;
}

const ProfileMenu = ({
  isOpen,
  userInitial,
  userName,
  userEmail,
  menuId,
  containerRef,
  onToggle,
  onClose,
  onSignOut,
}: ProfileMenuProps) => {
  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-label="Open account menu"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={menuId}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary)] font-body text-[12px] font-medium text-white transition-colors hover:bg-[var(--color-accent)]"
      >
        {userInitial}
      </button>

      {isOpen ? (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 top-full z-[95] mt-3 min-w-[250px] overflow-hidden rounded-[0.5rem] bg-white shadow-[var(--shadow-soft)]"
        >
          <div className="bg-[var(--color-surface-alt)] px-5 py-4">
            <p className="font-display text-[20px] font-semibold italic text-[var(--color-primary)]">{userName}</p>
            <p className="font-body text-[11px] text-[var(--color-muted)]">{userEmail}</p>
          </div>

          <div className="px-2 py-2">
            {[
              { to: "/account", label: "Overview" },
              { to: "/account/orders", label: "My Orders" },
              { to: "/account/addresses", label: "Addresses" },
              { to: "/account/profile", label: "Personal Details" },
              { to: "/account/password", label: "Change Password" },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={onClose}
                role="menuitem"
                className="block rounded-[0.25rem] px-3 py-2.5 font-body text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-accent)]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="px-2 pb-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onSignOut();
              }}
              role="menuitem"
              className="w-full rounded-[0.25rem] px-3 py-2.5 text-left font-body text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-danger)]"
            >
              Sign Out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

interface NavigationLinkProps {
  item: ContentLinkConfig;
  isActive: boolean;
  onNavigate?: () => void;
  className?: string;
}

const NavigationLink = ({ item, isActive, onNavigate, className }: NavigationLinkProps) => {
  const linkClassName = `${className ?? ""} ${isActive ? "text-[var(--color-accent)]" : "text-[var(--color-primary)] hover:text-[var(--color-accent)]"}`;

  if (isExternalHref(item.href)) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noreferrer"
        onClick={onNavigate}
        className={linkClassName}
      >
        {item.label}
      </a>
    );
  }

  return (
    <Link to={item.href} onClick={onNavigate} className={linkClassName}>
      {item.label}
    </Link>
  );
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [badgeScaleClass, setBadgeScaleClass] = useState("scale-100");
  const [isDesktopUserMenuOpen, setIsDesktopUserMenuOpen] = useState(false);

  const desktopUserMenuRef = useRef<HTMLDivElement | null>(null);
  const previousTotalItemsRef = useRef(0);
  const badgeResetTimeoutRef = useRef<number | null>(null);

  const { storefrontConfig } = useStorefrontConfig();
  const { totalItems, openCart } = useCart();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { isConfirmOpen, isSubmitting, requestSignOut, confirmSignOut, cancelSignOut } = useSignOutWithCartWarning();
  const location = useLocation();

  useEffect(() => {
    if (totalItems > previousTotalItemsRef.current) {
      setBadgeScaleClass("scale-[1.2]");

      if (badgeResetTimeoutRef.current) {
        window.clearTimeout(badgeResetTimeoutRef.current);
      }

      badgeResetTimeoutRef.current = window.setTimeout(() => {
        setBadgeScaleClass("scale-100");
      }, 180);
    }

    previousTotalItemsRef.current = totalItems;
  }, [totalItems]);

  useEffect(() => {
    return () => {
      if (badgeResetTimeoutRef.current) {
        window.clearTimeout(badgeResetTimeoutRef.current);
      }
    };
  }, []);

  const closeNavigation = useCallback(() => {
    setOpen(false);
    setIsDesktopUserMenuOpen(false);
  }, []);

  useEffect(() => {
    closeNavigation();
  }, [closeNavigation, location.hash, location.pathname]);

  useEffect(() => {
    if (!isDesktopUserMenuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const targetNode = event.target as Node;
      const clickedMenu = desktopUserMenuRef.current?.contains(targetNode) ?? false;

      if (!clickedMenu) {
        setIsDesktopUserMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDesktopUserMenuOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isDesktopUserMenuOpen]);

  const isLinkActive = useCallback(
    (href: string) => {
      if (href === "/shop") {
        return location.pathname === "/shop" || location.pathname.startsWith("/shop/") || location.pathname.startsWith("/category/");
      }

      if (href.includes("#")) {
        const [pathPart, hashPart] = href.split("#");
        const expectedPath = pathPart || "/";
        return location.pathname === expectedPath && location.hash === `#${hashPart}`;
      }

      return location.pathname === href;
    },
    [location.hash, location.pathname],
  );

  const metadata = (user?.user_metadata ?? {}) as Record<string, unknown>;
  const metadataFirstName = typeof metadata.first_name === "string" ? metadata.first_name.trim() : "";
  const metadataLastName = typeof metadata.last_name === "string" ? metadata.last_name.trim() : "";
  const fallbackName = (user?.email ?? "").split("@")[0];
  const userName = [metadataFirstName, metadataLastName].filter(Boolean).join(" ") || fallbackName || "My Account";
  const userEmail = user?.email ?? "";
  const userInitial = (metadataFirstName || userEmail || "U").slice(0, 1).toUpperCase();

  const cartButton = (
    <button
      type="button"
      aria-label="Open cart"
      onClick={() => {
        setOpen(false);
        openCart();
      }}
      className="relative text-[var(--color-primary)] transition-colors hover:text-[var(--color-accent)]"
    >
      <ShoppingBag size={20} strokeWidth={1.5} />
      {totalItems > 0 ? (
        <span
          className={`absolute -right-[8px] -top-[8px] inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--color-accent)] px-[4px] font-body text-[9px] font-semibold leading-none text-white transition-transform duration-200 ${badgeScaleClass}`}
        >
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      ) : null}
    </button>
  );

  const adminAction = isAuthenticated && isAdmin ? (
    <Link
      to="/admin"
      aria-label="Open admin panel"
      title="Admin Panel"
      className="text-[var(--color-primary)] transition-colors hover:text-[var(--color-accent)]"
      onClick={() => setOpen(false)}
    >
      <LayoutDashboard size={18} strokeWidth={1.5} />
    </Link>
  ) : null;

  const desktopNavLinkClass =
    "font-display text-[15px] tracking-[-0.01em] transition-colors";

  const mobileNavLinkClass =
    "font-display text-[18px] tracking-[-0.01em] transition-colors";

  return (
    <>
      <nav className="sticky top-0 z-50 shadow-[0_1px_0_rgba(28,28,26,0.05)]">
        <div className="bg-[var(--color-primary)] px-4 py-2 text-center font-body text-[10px] uppercase tracking-[0.24em] text-white sm:px-6 lg:px-8">
          {contentConfig.navigation.announcementText}
        </div>

        <div className="bg-[rgba(252,249,245,0.92)] backdrop-blur-xl">
          <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-8 xl:gap-12">
              <Link to="/" aria-label={`${storefrontConfig.storeName} home`} className="inline-flex items-center">
                <StoreLogo
                  className="h-10 w-auto"
                  textClassName="font-display text-[24px] font-bold italic tracking-[-0.03em] text-[var(--color-primary)]"
                />
              </Link>

              <div className="hidden items-center gap-8 md:flex">
                {contentConfig.navigation.links.map((item) => (
                  <NavigationLink
                    key={item.href}
                    item={item}
                    isActive={isLinkActive(item.href)}
                    className={desktopNavLinkClass}
                  />
                ))}
              </div>
            </div>

            <div className="hidden items-center gap-4 lg:flex">
              <label className="flex items-center gap-2 rounded-[0.125rem] bg-[var(--color-surface-alt)] px-4 py-2 text-[var(--color-muted)]">
                <Search size={14} strokeWidth={1.6} />
                <input
                  type="search"
                  placeholder={contentConfig.navigation.searchPlaceholder}
                  className="w-44 bg-transparent font-body text-[12px] text-[var(--color-primary)] outline-none placeholder:text-[var(--color-muted)]"
                  aria-label={contentConfig.navigation.searchPlaceholder}
                />
              </label>

              {adminAction}
              {cartButton}

              {isAuthenticated ? (
                <ProfileMenu
                  isOpen={isDesktopUserMenuOpen}
                  userInitial={userInitial}
                  userName={userName}
                  userEmail={userEmail}
                  menuId="desktop-account-menu"
                  containerRef={desktopUserMenuRef}
                  onToggle={() => setIsDesktopUserMenuOpen((previous) => !previous)}
                  onClose={() => setIsDesktopUserMenuOpen(false)}
                  onSignOut={requestSignOut}
                />
              ) : (
                <Link
                  to="/auth/login"
                  className="font-body text-[11px] uppercase tracking-[0.18em] text-[var(--color-primary)] transition-colors hover:text-[var(--color-accent)]"
                >
                  Sign In
                </Link>
              )}
            </div>

            <div className="flex items-center gap-3 lg:hidden">
              {cartButton}
              <button
                type="button"
                className="text-[var(--color-primary)]"
                onClick={() => setOpen((previous) => !previous)}
                aria-label={open ? "Close menu" : "Open menu"}
              >
                {open ? <X size={22} strokeWidth={1.6} /> : <Menu size={22} strokeWidth={1.6} />}
              </button>
            </div>
          </div>

          {open ? (
            <div className="border-t border-[rgba(28,28,26,0.04)] bg-[rgba(252,249,245,0.98)] px-4 pb-5 pt-4 shadow-[0_18px_40px_rgba(28,28,26,0.05)] animate-fade-in lg:hidden sm:px-6">
              <label className="mb-5 flex items-center gap-2 rounded-[0.125rem] bg-white px-4 py-3 text-[var(--color-muted)] shadow-[0_10px_24px_rgba(28,28,26,0.04)]">
                <Search size={15} strokeWidth={1.6} />
                <input
                  type="search"
                  placeholder={contentConfig.navigation.searchPlaceholder}
                  className="w-full bg-transparent font-body text-[12px] text-[var(--color-primary)] outline-none placeholder:text-[var(--color-muted)]"
                  aria-label={contentConfig.navigation.searchPlaceholder}
                />
              </label>

              <div className="flex flex-col gap-3">
                {contentConfig.navigation.links.map((item) => (
                  <NavigationLink
                    key={item.href}
                    item={item}
                    isActive={isLinkActive(item.href)}
                    onNavigate={() => setOpen(false)}
                    className={mobileNavLinkClass}
                  />
                ))}
              </div>

              <div className="mt-6 flex items-center gap-4">
                {adminAction}
                {!isAuthenticated ? (
                  <Link
                    to="/auth/login"
                    onClick={() => setOpen(false)}
                    className="font-body text-[11px] uppercase tracking-[0.18em] text-[var(--color-primary)] transition-colors hover:text-[var(--color-accent)]"
                  >
                    Sign In
                  </Link>
                ) : null}
              </div>

              {isAuthenticated ? (
                <div className="mt-6 rounded-[0.5rem] bg-white p-4 shadow-[0_18px_40px_rgba(28,28,26,0.05)]">
                  <p className="font-display text-[20px] font-semibold italic text-[var(--color-primary)]">{userName}</p>
                  <p className="mt-1 font-body text-[11px] text-[var(--color-muted)]">{userEmail}</p>

                  <div className="mt-4 flex flex-col gap-2">
                    {[
                      { to: "/account", label: "Overview" },
                      { to: "/account/orders", label: "My Orders" },
                      { to: "/account/addresses", label: "Addresses" },
                      { to: "/account/profile", label: "Personal Details" },
                    ].map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setOpen(false)}
                        className="font-body text-[11px] uppercase tracking-[0.14em] text-[var(--color-primary)] transition-colors hover:text-[var(--color-accent)]"
                      >
                        {link.label}
                      </Link>
                    ))}

                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        requestSignOut();
                      }}
                      className="mt-2 w-fit font-body text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-danger)]"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </nav>

      <SignOutConfirmModal
        isOpen={isConfirmOpen}
        isSubmitting={isSubmitting}
        onConfirm={confirmSignOut}
        onCancel={cancelSignOut}
      />
    </>
  );
};

export default Navbar;
