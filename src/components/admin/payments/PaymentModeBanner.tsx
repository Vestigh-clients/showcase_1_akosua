import { getPaystackConfig } from "@/services/paystackService";

const PaymentModeBanner = () => {
  const config = getPaystackConfig();

  const title = config.isSubaccountMode ? "Vestigh Managed Payments" : "Your Own Paystack Account";
  const description = config.isSubaccountMode
    ? `Your store processes payments through Vestigh's Paystack account. ${config.platformFeePercent}% platform fee applies per transaction. Settlements go directly to your registered bank account or mobile money.`
    : "Your store processes payments through your own Paystack account. 0% platform fee - you keep 100% of every transaction.";
  const plan = config.isSubaccountMode ? "Free tier" : "Pro tier";

  return (
    <section className="rounded-[var(--border-radius)] border border-[var(--color-border)] bg-transparent px-6 py-7 lg:px-10">
      <div className="flex items-start gap-3">
        <div className="mt-3 inline-flex h-2 w-2 shrink-0 rounded-full bg-[var(--color-success)]" />
        <div className="min-w-0">
          <h2 className="font-display text-[28px] italic text-[var(--color-primary)]">{title}</h2>
          <p className="mt-3 max-w-3xl font-body text-[12px] leading-6 text-[var(--color-muted)]">{description}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)] pt-5">
        <p className="font-body text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted-soft)]">Plan</p>
        <span className="inline-block rounded-[var(--border-radius)] border border-[var(--color-accent)] px-3 py-1 font-body text-[9px] uppercase tracking-[0.12em] text-[var(--color-accent)]">
          {plan}
        </span>
      </div>
    </section>
  );
};

export default PaymentModeBanner;
