import { Link } from "react-router-dom";
import StoreLogo from "@/components/StoreLogo";
import { contentConfig, type ContentLinkConfig } from "@/config/content.config";
import { useStorefrontConfig } from "@/contexts/StorefrontConfigContext";
import { buildWhatsAppContactLink } from "@/lib/contact";

const isExternalHref = (href: string) => /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href);

const FooterLink = ({ item }: { item: ContentLinkConfig }) => {
  const className =
    "font-body text-[11px] uppercase tracking-[0.18em] text-white/65 transition-colors hover:text-[var(--color-accent)]";

  if (isExternalHref(item.href)) {
    return (
      <a href={item.href} target="_blank" rel="noreferrer" className={className}>
        {item.label}
      </a>
    );
  }

  return (
    <Link to={item.href} className={className}>
      {item.label}
    </Link>
  );
};

const Footer = () => {
  const { storefrontConfig } = useStorefrontConfig();

  const quickContactLinks = [
    storefrontConfig.contact.email
      ? {
          label: storefrontConfig.contact.email,
          href: `mailto:${storefrontConfig.contact.email}`,
        }
      : null,
    storefrontConfig.contact.whatsapp
      ? {
          label: `WhatsApp ${storefrontConfig.contact.whatsapp}`,
          href: buildWhatsAppContactLink(storefrontConfig.storeName, storefrontConfig.contact.whatsapp),
        }
      : null,
    storefrontConfig.socials.instagram
      ? {
          label: "Instagram",
          href: storefrontConfig.socials.instagram,
        }
      : null,
  ].filter((item): item is ContentLinkConfig => Boolean(item));

  return (
    <footer className="bg-[var(--color-primary)] text-white">
      <div className="mx-auto max-w-screen-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.25fr_0.8fr_0.8fr_1fr]">
          <div>
            <StoreLogo
              className="h-10 w-auto"
              textClassName="font-display text-[28px] font-bold italic tracking-[-0.03em] text-white"
            />
            <p className="mt-3 font-body text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
              {storefrontConfig.storeTagline}
            </p>
            <p className="mt-5 max-w-xs font-body text-sm leading-7 text-white/70">{contentConfig.footer.description}</p>

            {quickContactLinks.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-3">
                {quickContactLinks.map((item, index) => (
                  <FooterLink key={`${item.label}-${item.href}-${index}`} item={item} />
                ))}
              </div>
            ) : null}
          </div>

          {contentConfig.footer.columns.map((column) => (
            <div key={column.title}>
              <h4 className="font-body text-[10px] font-semibold uppercase tracking-[0.24em] text-white">{column.title}</h4>
              <div className="mt-6 flex flex-col gap-4">
                {column.links.map((item, index) => (
                  <FooterLink key={`${column.title}-${item.label}-${item.href}-${index}`} item={item} />
                ))}
              </div>
            </div>
          ))}

          <div>
            <h4 className="font-body text-[10px] font-semibold uppercase tracking-[0.24em] text-white">
              {contentConfig.footer.newsletter.title}
            </h4>
            <p className="mt-6 max-w-xs font-body text-sm leading-7 text-white/70">{contentConfig.footer.newsletter.description}</p>

            <form
              onSubmit={(event) => event.preventDefault()}
              className="mt-6 flex items-center gap-0 rounded-[0.25rem] bg-white/8 p-1"
            >
              <input
                type="email"
                placeholder={contentConfig.footer.newsletter.inputPlaceholder}
                className="min-w-0 flex-1 bg-transparent px-3 py-3 font-body text-[12px] text-white outline-none placeholder:text-white/45"
                aria-label={contentConfig.footer.newsletter.inputPlaceholder}
              />
              <button
                type="submit"
                className="rounded-[0.125rem] bg-[var(--color-accent)] px-4 py-3 font-body text-[10px] font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#8A6E00]"
              >
                {contentConfig.footer.newsletter.buttonLabel}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-14 rounded-[0.5rem] bg-black/10 px-4 py-5 sm:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="font-body text-[10px] uppercase tracking-[0.2em] text-white/55">
              Copyright {new Date().getFullYear()} {storefrontConfig.storeName}. {contentConfig.footer.bottomNote}
            </p>

            <div className="flex flex-wrap gap-5">
              {contentConfig.footer.locations.map((location) => (
                <span key={location} className="font-body text-[10px] uppercase tracking-[0.2em] text-white/45">
                  {location}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
