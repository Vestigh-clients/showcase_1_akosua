import { supabase } from "@/integrations/supabase/client";

export interface PaymentSettings {
  id: string;
  cash_on_delivery_enabled: boolean;
  online_payment_enabled: boolean;
  updated_at: string;
}

export async function getPaymentSettings(): Promise<PaymentSettings> {
  const { data, error } = await supabase
    .from("payment_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  // Seed default settings if table is empty
  if (!data) {
    const { data: newData, error: insertError } = await supabase
      .from("payment_settings")
      .insert({
        cash_on_delivery_enabled: false,
        online_payment_enabled: true,
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }
    return newData as PaymentSettings;
  }

  return data as PaymentSettings;
}

export async function updatePaymentSettings(settings: Partial<PaymentSettings>): Promise<void> {
  // Fetch the singleton ID first to ensure we update the correct row
  const { data: existing } = await supabase
    .from("payment_settings")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (!existing) {
    // Fallback: attempts to re-seed or throw if functionality implies it should exist
    await getPaymentSettings(); 
    throw new Error("Settings not found, please try again.");
  }

  const { error } = await supabase
    .from("payment_settings")
    .update({
      ...settings,
      updated_at: new Date().toISOString(),
    })
    .eq("id", existing.id);

  if (error) {
    throw error;
  }
}
