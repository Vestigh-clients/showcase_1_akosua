INSERT INTO public.site_settings (key, value)
VALUES ('site_theme_preset', 'heritage')
ON CONFLICT (key) DO NOTHING;

DROP POLICY IF EXISTS "public read storefront branding settings" ON public.site_settings;
CREATE POLICY "public read storefront branding settings"
ON public.site_settings FOR SELECT
USING (
  key = ANY (
    ARRAY[
      'site_name',
      'site_tagline',
      'support_email',
      'support_phone',
      'whatsapp_number',
      'site_theme_preset'
    ]
  )
);
