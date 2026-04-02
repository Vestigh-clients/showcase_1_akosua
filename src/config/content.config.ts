import authPanelImage from "@/assets/hero-bg.jpg";

export interface ContentLinkConfig {
  label: string;
  href: string;
}

export interface ContentImageLinkConfig extends ContentLinkConfig {
  imageUrl: string;
  imageAlt: string;
}

export interface HomeProductCardConfig extends ContentImageLinkConfig {
  name: string;
  priceLabel: string;
  badge?: string;
}

export interface HomeCategoryCardConfig extends ContentImageLinkConfig {
  ctaLabel: string;
}

export interface HomeHeroConfig {
  collectionLabel: string;
  heading: string;
  subtext: string;
  imageUrl: string;
  imageAlt: string;
  primaryCta: ContentLinkConfig;
  secondaryCta: ContentLinkConfig;
}

export type ShopSortOptionValue = "newest" | "price-asc" | "price-desc" | "featured";

export interface ProductDetailAccordionConfig {
  title: string;
  body: string;
}

export interface ProductReviewConfig {
  name: string;
  initials: string;
  location: string;
  dateLabel: string;
  headline: string;
  body: string;
  tags: string[];
  avatarTone?: "primary" | "accent";
}

export interface ProductCompleteLookItemConfig extends ContentImageLinkConfig {
  eyebrow: string;
  name: string;
  priceLabel: string;
}

export interface ContentConfig {
  navigation: {
    announcementText: string;
    searchPlaceholder: string;
    links: ContentLinkConfig[];
  };
  home: {
    hero: HomeHeroConfig;
    newArrivals: {
      eyebrow: string;
      title: string;
      cta: ContentLinkConfig;
      items: HomeProductCardConfig[];
    };
    categoryShowcase: {
      title: string;
      description: string;
      items: HomeCategoryCardConfig[];
    };
    newsletterBanner: {
      title: string;
      description: string;
      inputPlaceholder: string;
      buttonLabel: string;
    };
    editorsPick: {
      eyebrow: string;
      title: string;
      featured: {
        label: string;
        title: string;
        cta: ContentLinkConfig;
        imageUrl: string;
        imageAlt: string;
      };
      quote: string;
      detailCards: ContentImageLinkConfig[];
    };
    bestsellers: {
      eyebrow: string;
      title: string;
      items: HomeProductCardConfig[];
    };
    brandStory: {
      eyebrow: string;
      title: string;
      body: string;
      cta: ContentLinkConfig;
      imageUrl: string;
      imageAlt: string;
    };
    instagram: {
      handle: string;
      label: string;
      items: ContentImageLinkConfig[];
    };
  };
  shop: {
    defaultTitle: string;
    titlePrefix: string;
    breadcrumb: {
      homeLabel: string;
      shopLabel: string;
    };
    sidebar: {
      categoryTitle: string;
      priceTitle: string;
      promotion: {
        eyebrow: string;
        title: string;
        cta: ContentLinkConfig;
      };
    };
    sortOptions: Array<{
      label: string;
      value: ShopSortOptionValue;
    }>;
  };
  product: {
    installmentProvidersLabel: string;
    stockSupportLabel: string;
    sizeGuideLabel: string;
    addToBagLabel: string;
    virtualTryOnLabel: string;
    accordions: ProductDetailAccordionConfig[];
    reviews: {
      title: string;
      rating: number;
      scaleLabel: string;
      totalReviewsLabel: string;
      distribution: Array<{
        label: string;
        percentage: number;
      }>;
      writeReviewLabel: string;
      viewAllLabel: string;
      items: ProductReviewConfig[];
    };
    completeTheLook: {
      title: string;
      items: ProductCompleteLookItemConfig[];
    };
    fallbackGallery: Array<{
      url: string;
      alt: string;
    }>;
  };
  footer: {
    description: string;
    columns: Array<{
      title: string;
      links: ContentLinkConfig[];
    }>;
    newsletter: {
      title: string;
      description: string;
      inputPlaceholder: string;
      buttonLabel: string;
    };
    bottomNote: string;
    locations: string[];
  };
  auth: {
    panelImageUrl: string;
    panelImageAlt: string;
  };
  about: {
    body: string;
    intro: string;
    stats: Array<{ value: string; label: string }>;
  };
}

const akosuaEditorialImages = {
  hero:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAlaRP2PCVbLFVYCjabSa4xVCGw1NPEp-J1A37xxICDV1JmHqRyvTGrdlzeblFAd95XUd82oyhB00upyJbN91wwf7e6cCB8TFs6OLdIxBNrszLeGhcLpRM9kKfUwb2tSu9J5cL2H2puk4tAP--n705ZrpwT7a9qzF7X20tltM8APHI3UvVVqpOHhQkmDxNGqI4TUUulNcEsXOp0V8mcDKQPu4oTSO9bPlFFqwQD2Z1qR_I7oGXChBXsf-eFcaI8TWQfEgIlDxZXARU",
  goldLeafSet:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAaxXJFNTkLVZTL-2CHK4BO6bCLI7OzrkwYdQ06jVzg-6IlPNdEI1PYLxShrHgt3HtUuXDOTB9eaagBSTfcZfpR1Uy-IHMuxV-hCKpENlKFL_1HUCueOHmKcRKO9C1St5rzMdX1d25oULqlHzKhylIUooxVQJgh4UoA8fS1gFW8oGCyZY61jL3sBOegScrGyoFBsXXL6S9cwFOfJNZS0x5hUukDNWNa8poc1lCe5lCDNA7kfDthS0Slk71O82FccItESbmqt3V6peU",
  kenteBlazer:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCQTNi0AafzXkSxzX44IVEd4No6rOaKmKDRZYqyWVc_UlaFE_Km8TQwICUYZtCQCgd_MK_-_qCtz7MI9WUhmwsx6CYYoj8cXe6vHZepIRJVfNII4e1IU7NaLZ22Z8QQ_uaVChXzZmHz029X7mIcia5Ur3HHcDiNUvN75jO4EIofcnv04dkpsf5WY2wSYIPFqEOGjyflAPN2ClrnmfUeLdiSCt6cv4vWsd4g2So55tU_oLFJQPfqHzbCh4mlI47sNNtLScgUSIbSyrY",
  silkTunic:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB0UVIiouOAAXbNIZ_-MZyVTeGXP7flkaZGAK0A-JYY4o-EkX9rV7gaNW5MpHFp7IQF-62EDK2-IiyMgDX7reZxX6PpgaQ8-odyY7fsYPrrIc9gBToCmTwgc8vbhZACcaFe1z16V9kbCsck3KQcCZuL8Js5J7v9J3htwKAJjdmvS7JIlWfzKvCXmHbwyIYyNjReAWNDhoz1oOAhqAC_uRHwZePZVxhYSt3f-pau8CEkEsQKGLUmZzOzEh4mILLAcn5zYRbot7rniHw",
  zolaSkirt:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDNotLnTjrQsL6cTUjBefsTU2bEt0qzfA1bm5uY5RgZ6zW3xlh6HbTgXoHGOzg1AHeTDGx0BVcP9A9oWXKdwcIaybI6LpHL-e1FtVXYyNpsP4Geg_EBYUuqbaGy20AeFA6xxcbZzmDtzknAE-pfD3AIjxQkk7igz5VgDyCRWPhMX9x2EnKCneBDfPbxOi-gz_AbKhKuNG0gmX3xHGdy-WNdqZ7jOxhj4pATGV9pGoDUMcN8bL5Thkze7nwv55AhARO-y1XZfxbF1fM",
  dresses:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAUeGBZNZAYdg8787-zLCMeeSDfWdpVIgGGZXaiHPRVXdoQBgJEB05z4N5MbFUob2UZ1r0pDXuVanOQGHAK8dWbsdLUUXtbn2LueT68qXkzk551Fd9A-iL9-J7WMO7MFrE8vmLBH2N9znxAA-nJhQxy8okT-v_NIalnxUKnE1W0zO4ix06RyNfys05z4Hke3md3oI0UH3zJUScuBtTD6lCn-prJbcxazFnGh8oUw5FmogtiL-HVRxTc1ykkTd03fQS-BYOK_U58m7k",
  outerwear:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC8FU5koj2D5XruIv1F1TKNP_gQkpwxzgFZSzz9WniKx8qMZuivsmw_MxVpDQgjbQbhLO3Q5hiKlITleVpbVBlTjiqXY1JcKidqOOBXE4VU_oRSj07jrOMsPmQT9XYLeNKu5MFW4_MGgEjVlcrI1GKO8u3XPeCu5IgyurTyrplmYPVTIBBJgQktMtFZoN1oha17li2WrNCKcLgV_0hocXIaQcdMwSATn2YsEfizaTR54Niocefmy5OXDFNLuLkgczup6ikWJfsFnFo",
  adinaWrap:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA5uEtMMO5NSw34JXXNbdbuizgHg8iA52NY1nOzwUH9-XcMxUIjFn8yLFgkqXBgFajP0EUExpp2zc6DXHyc0skm-R0nIYZE5k7uqjlMjN8dhjKx6ghPY48d1FDO0y6mKlXzOE8IXO8C2t04UBBXsjy-6Irp0CpVqCdswvGmU_b7L_2S-glzyswGiNUVTrkCjexb2VC9dT5pHFUlEO_Mm9InTKsPEE4Xfyz_hKQJ8Xq19y7sU4dqnnBRlRHCSSkvbzlbH3vZ6BvYJ-8",
  indigoCraft:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDCcRkSU1Vq56a2p7CynTw-DN4-Nqn6NXQlCskJKmFvHzsBOogfczBZdpiSlC7wrvlnlhVqT_UW9gp3X5IgJ2YmRz_ArVgtehYQhR-Q6GoHcOjYI_pmCooJrBvgLeUOwOALDvB8B4nfwfiRWqccK-GvzpQuG2bkwtV4vqm0OOy-_sLiKJUtc4ECY1DdnB1517xoDqIWuyc3XD1Z-7DmlVtEndIxX-ipWaIBIA1iPvdPUqv1kMzBvzhD5Xk9pCO5XqjIVTqJiZnPI30",
  goldAccents:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD2M9x6aHoGWlJNHTa2nlPb2GK9Vu93MAPy3LzLFAA-gqqM6iqyW21_ztIte99PL5f9cgILuC854MmsqrHYcxxEEdNa9lx8UHbPhH9HTt5IMKE5CjCObvWPy-2BHreYQVoUYDrbmc4Ti7c4_h_TwP6cLb3O0vJGph4fz4t4A1ejQc9bjxHAE0lNlQB8l5Lrb6Pl_OkhKDU562Rl9-zBI3C63gDyQqLnq2_J8Xmp81CmwiQfvQjUIuWxAaZ-SdG8h_G5kUw_ibCEzbs",
  adisaWrapDress:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAImnS5YqoVRJr5N9I96rjC_MqGDjee9oGrHD3oryX1YY3SZ-xRr0JMPALuKsph4qPPMZnt6fdbaFsaup2eHOmLIFQ0reiLb5kxzKIV33QuoE5strEUujxn7Q37HUivcNcRTHKr-az9E7XUgWTO2IsHtukLRkWTX3uUpqiS-8Ci3Fin-TIgpAZk85-yb74EcUtpDzT9-8yHYf1osWKD4CQc6Y4DZHMgarqyfJMFoGS3UkWd72c6WVg75Xpags2uoZzq1TMPNOYH2ek",
  zolaEditorialMidi:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBshz_Pl8uoOw4d8GZJIJ7rirDpDy4fxwKd2pTjPLeaoN5GWj3VNrFUW4DcdPCR9z0Qf5AWLQ2LyZ-Y8wQjtDUmyhdqxkLHbsj3LMP3NREKnSXlY30p66A02iQ3Xw2a0n5vdi3Yeo9_TibiLZPvnObJV3TjQR3_Fcsep3SLBVMtami-LohlfqM9hNKmTvnNcsS8kyvL-ttzblhDTqMvKoLie49LbymZCUIFzdBAnRqKr7yV6rlT-oeWEgEWPFpBaAMAFi-Lc2qnNwg",
  esheFloorLength:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC9WFjmJRrUK335a_MVIsHFpE6IzGbN4xDr6H85jRIltmIz2LpC47nZZQEJxPyExFcRRS2vP6meWleoC40rp7xeRYs31pU38vHY246jNSDq8Ezvrwstr_ELEvymKeiCncZX9QXpkDJiJd3apEMtV13eP63tU6nuQ5XqRdQcu-aj5aaWCo1n1-RQetE7XzoEsIucW000yExKETzIABzoU4yr7YHXHvbHHiQri1ZfdF1G54HYTz0lDO_A2qeVQn7LmfIOp8yKoXpJtnI",
  nalaShiftDress:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA4FDbfrMsRxtJpamCBVbXgffAud5eBvy_36vfwyeZ1L6eLUAfZKDVVHcW2wLIspRy5YQl_1yRWYK0e-s-ixPnMqu5khaDvePmvWN5s0yh-D5zjLeVkfR1E5LNgAeYb4Iid-DDWNIYUN5KfOXn786FgG22Rj8JuO6pSaZCxPWtH1NYUiG3GLjdzuVZaWmKA5OJWqlrBb_Ltt0eq2FajZBoxnYFHjARx7H1ZyM5MBVditLmcr3TfxovJ8mQKyuyeE7rMbqV6egmC9Fo",
  mansaRoyalGown:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA-1CyWh8bjlgtyPBUfm8WbiT4-OtFYWFGRba7n1AmpDngmFI16-_CDmL4icPxdkDLNoHganm3ml_1ZWChqD3Mgt1E4N13HsB37ovb5ffwnUq_iTVrNEUNnlWNTlh_nW4XqUGll9WG9bPivwk0KKa7NOVOgRi44_0kTu0z5NsvuCkFmT7nFBzLmlVGztiSnzpAQ3oGh5r1LvvEy_wi1iUWU-04gF2znKOAd3ImK2mfR7EKFvuBfDeOuGAFqyPu1xM4nu6i7M6xX3Rk",
  amaraSunDress:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDPI-uzJHRrSzfPoK1_c_YlBH6rsLWrenJ19_PVZnvdZIv0FxvEXQ1b1Y4FMlZZRSfHvt_Az88JLJHTsPyPWTSDsiZ3bME3c5xpOcN2rnYbtqZwhJp6dw03TrTnAvNW3KEjH4UzHUBV7Sv9n8vR71e4rk05JHIUJTulyacOnJlZrA6COpzgxMwkx-TnjmyoRnVueUBO7s-ju2rZbLY9U7y0AW5XoVewnWpepI2u6z8A2aqVtUzehivU6_8MGD0avp_L3spP7yS4InM",
  insta1:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA16wYGaDOOjCF1_KWBXrd0whHkSwEdAlD6noQWV6aR9gUI4Wk9tiO0duzz_fyf2SoOJQCtkQRZKvSZP3xzj0_5l0kmHxhsukrRFNfVJDY6a0cltqz1ItFX9zI7pWkexQsSDtZXDctqhtheXvE7GuBVk-frm49GVEnlmMw_pgOA08z6lw6zYBYzrGfFdPqYO3ZpP2kfxcZY9xkYt94lXjo0SQPrWJEnoGABzyyhMQh7xIL8Av6sUSuzP3eO2yWJDkqfKw3OlGIrEzs",
  insta2:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBnXWzxaaCBgQ6v3rtFjB9EBX0rfLRExtNG9qmV60zw2Q8FoT8CxEfRcK48eOJf_5BzY_U4eFC_G_vSW2CpHEKPke9v62w3AtPyNBQTcOJ1vajTbQvkS2G8Nt0REUoBO_SgjyoCqeXAwPKxOYWaUKVXTPUwt_6mHmvhACH01Tl1wL5EXYRSmB_cRKNBdAnLyr16Oz8aqzxVnKagI4MCnLuH-itCseihFoX9bBwz8kwGnjbhhUC7N_RCDLdypc2AKgJbxVEdui0Iv4A",
  insta3:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAp5cw4r2HMupeYp2Kh4AbR5jnobo4E3wD3YKHpWrspH1Hso1XUbHLPKOZiJm7Gety88OTVKYUFbQqF8e36RhREHD8pEeWg6gLVF5AhXoHgzg9sFJUPt6faSZdFdap9dmAhpVCxxMM1elaY8kFTx6ZqoFfSspqmhykXcFUJ6B1kf14dgJKFCffL1-qV2fX0VczZipR25ZBfmQQr_HQhB-Wfn1amfUVcKp3jUtDE_M36QbnrWzRyCDLMOHTC_I4RYpUbFwDBKrEL9tU",
  insta4:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuADfPBWrxt_qK9ifUz3NwMoq7kfTvuaScVQKyeb4dprqJ5ZN9426jdpMrPkE9kUHjeOOaiXdWW1RnYi6tf1dlJv8HKQk8Fa8LabtFaOYB8hCFpNcxfsML2LMtf7i5auC1k5nPBrMuePvlj2Onp3TyRKtXg5nVs168vtMWzCxQIVZFi5eSMGSCRPrwyq4_Mw3wbgsxqbz6kz05F6TqavlTGwHtlZE5uhyE7L2cqTwg7Q1cEGPXDR9BJmZZbn2kw3kTJyGSgp7Z4ucHo",
  insta5:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD2M9x6aHoGWlJNHTa2nlPb2GK9Vu93MAPy3LzLFAA-gqqM6iqyW21_ztIte99PL5f9cgILuC854MmsqrHYcxxEEdNa9lx8UHbPhH9HTt5IMKE5CjCObvWPy-2BHreYQVoUYDrbmc4Ti7c4_h_TwP6cLb3O0vJGph4fz4t4A1ejQc9bjxHAE0lNlQB8l5Lrb6Pl_OkhKDU562Rl9-zBI3C63gDyQqLnq2_J8Xmp81CmwiQfvQjUIuWxAaZ-SdG8h_G5kUw_ibCEzbs",
  insta6:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBzI-73RCTw-A4bRT4swc3YWBzr9pi2XWOxX398ID-WJnU4-msyNIhueARCvmTKLvh7N_rgCmYLsNhFWZ3W-2Io4jBsWBIgbkvvMCLm__m98tsdfxUb_ErClMU_CWBn9HbduUSv3Ao-DOp48Pssr9wONOZqY_QzKeANRM41F2STTsJMNaboCTllbleqxVfl77LyeY3dZ1oKadcXqYLKrrRqKKxOp1ns9I8tP9w0VVd4Zgph0isC1-gnkhkJwrV0aRgKfgYVnCZUzg4",
  productDetailThumbCloseup:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBQCpTS5nB9EdwtAC02-IJdLWSbBF8JK0K0pewX5aaf1jVjxZ3UT-UfIeKDBb6RwkyDSKimGCepeQ_uW7Ir5qinPemHNWXGSjanBB2zqmr7sV7pVi2A2SUT0Uw4xOu1T1rV8wQZWiB6H7SyOXdcoz_qmrC6I5u2k6dOjioJ1uwUL1Bad_-ocxnWl3HT1XyE8MpZK-iI2p2AjLqJyzkujcEmWP7G5m_3rTWLhEEx1l5DaEZHVl1qJss-2-dyGIs7ePlGr8NcKeZRbqo",
  productDetailThumbBack:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCB-KKIkVqwMigb-rKAAxwjW0kQ5sHBAYENvxYNqT1mTfDPM_PTRBAqUd_wYUCtQSxhGRq8hwZlv8J2IjBYcugin9Be4rNYvEpvBNKICAtT1ftkvSlf2tOLnDjrDQddtKIJGRFksoRdwJApDdMUxxljgsjegVE91-8rt9j9zGDozv2qdpThzWAdYZtZt-RAAxwx3eWKUEYNykwoyCn61dhE-6y1HELc_MAiUiUxi3ITIlGRP-MvVmQRpJzPkGL6F-GR0x2QFmTxSGE",
  productDetailThumbSide:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAYjg9MV_xDQIHE937PWtcat32SJp80zpyPhGH-eIXACxCrLl0V2K7SQqIGuUiiROy-L9E7Xqz3DOy2EKBT75j1zuTzATT5UtyoH4-Kjdb-K9DnqM7EvMMajcNeY__F8bvyMsm5DNp_NLXLwkWUFS-7yZmw9muj6_zuQRCt9M9i0WoW_L-6BxDF3AXmdQWPvypOrvSNaiLYRGbAyGxIKUo3QQI4OC-4MBeNHuqORtt004d1QrPYJQilReUwEq-HGNsmCC4_ON5Qwr4",
  productDetailMain:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBAvkNJfULqks3sNSNk1s5t_888syVQvwKKpF98sUVIM73KztWgY94_ESPg6YIf3MBQzCYzlA0ukzDcHNh3kXyVXXwxWAxrF80dAlfysdc5uuix7RZqDbeKcrogD9Bu5191OixvRtIuiem1gi4hXBbKy0EOa1lKXdAuhmLazCPDXZgwsMZAFuLR_XCUzfqTs7I1bfrmXEsEn-uyUApJiMmmASZkX-v5FoEXSIlJFDOrlnB9QsQ8qxv0NuVZcsQ524hsp07FfWStVnI",
  osseiGoldHoops:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA52b_khb2cVLCFZW_jxFYUslJthOjo4LihTRQZ53SqzmrpfqH5imEq8dEqY5jZ6O6a797jZT75HyjnU5cMAQk8Js5IEDFkRVdqVFV1owwiyPSLLkcmZsd4gBulFTAirfS4oOUQoqq9BmZLQ6Sm75VVjeCmfuHJMXBokGQv9ot_0jzjFRZ8C1QWIvN2-502hABWpSsUAaTxRV8XQJlzRnjlQceW0n_m8WJtdxwJZy0KwAecQw2A8NDoGosI43-7HQvtZXdfKLYTfYg",
  heritageWrapClutch:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCCFumiZW0ioJeh6zQPuE0n2FLRPBDJUdswqhHNJDg6Uh4_Ym29CfqATxTRP0bLk1EEkA6EcfYx-o7fWCNHBkeFtBTjHvPWxEatp_bewB2oLLcLezwMkkTsFgtbZXQz-UX9vBeosTIg27RuSIE1BBT94Gb0Mh9nP1JHSxr11RphpCyQABAWjgUyeqDZbIMMTc8oZZ4OCu_CM679T6ncThjJ4sR6jP3WKKl9Kzuu7PNRLXVl6zFL6POE4DjUUJq4RE2SghPgh-r62kg",
  nyameCuff:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB69qRnouQzOhU9DmDn87bJWz49OyCChf4UtVSvXBoxzthcy21tsakAkcj2vFDPRVcFxZNw9531CPZaimsVJH2jOCoiNocS0TxsJXJeNQ7N9M4pynyD1-cbcg6EGfVKNV2fJ30D_4i9aivSACO8StilHvCfxJznE0sAR_fHozI6RiRxSpQejAjz6ONUiHy0ra2OHy6YmCx11vbZNjDy2WPtyiz7K74qJb_78dHs-OSh7UlNPFWzsiDam0RnzSMu85QwwatVPZZU25w",
  accraStiletto:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC9THH8angrGV2GubKoIGtMa2aSI6Pmki399_oD9P8_9kj75CT67H2e2mhhHOEeYZCPxnNePb-owfG6GsklgmgUMDl8k2T-jUHrMa668gIBw6MZEYe7vbK8qQgghZ9OdAJD2Tb2S1PkjT4nWpm9NunJ1sghuKFCiBWF97oagn80aRYhcK0f0q5cGoaqzAi-pG4tj4UkiwTRugsQZi7_FS2lMCU8jEbucPCdoV9Wt5MKs-dxHNAvC7DhXUZnEstKVbVUKMc95N0gD7U",
} as const;

export const contentConfig: ContentConfig = {
  navigation: {
    announcementText: "Free shipping on orders over GHS 500 | Global Heritage, Modern Style",
    searchPlaceholder: "Search...",
    links: [
      { label: "Shop", href: "/shop" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  home: {
    hero: {
      collectionLabel: "The Renaissance Collection",
      heading: "Wear Your Culture",
      subtext: "A cinematic first edit of statement silhouettes, heritage tailoring, and modern Ghanaian printwork.",
      imageUrl: akosuaEditorialImages.hero,
      imageAlt: "Woman in vibrant Ankara dress posing outdoors",
      primaryCta: { label: "Shop Collection", href: "/shop" },
      secondaryCta: { label: "Lookbook", href: "/#editors-picks" },
    },
    newArrivals: {
      eyebrow: "Just In",
      title: "New Arrivals",
      cta: { label: "See All Arrivals", href: "/shop" },
      items: [
        {
          label: "Gold Leaf Co-ord Set",
          href: "/shop",
          imageUrl: akosuaEditorialImages.goldLeafSet,
          imageAlt: "Gold Leaf Co-ord Set",
          name: "Gold Leaf Co-ord Set",
          priceLabel: "$210.00",
          badge: "Limited",
        },
        {
          label: "Kente Pattern Blazer",
          href: "/shop",
          imageUrl: akosuaEditorialImages.kenteBlazer,
          imageAlt: "Kente Pattern Blazer",
          name: "Kente Pattern Blazer",
          priceLabel: "$285.00",
        },
        {
          label: "Sunset Silk Tunic",
          href: "/shop",
          imageUrl: akosuaEditorialImages.silkTunic,
          imageAlt: "Sunset Silk Tunic",
          name: "Sunset Silk Tunic",
          priceLabel: "$175.00",
        },
        {
          label: "Indigo Flow Skirt",
          href: "/shop",
          imageUrl: akosuaEditorialImages.zolaSkirt,
          imageAlt: "Indigo Flow Skirt",
          name: "Indigo Flow Skirt",
          priceLabel: "$140.00",
        },
      ],
    },
    categoryShowcase: {
      title: "Shop by Category",
      description: "Discover curated selections of heritage craftsmanship.",
      items: [
        {
          label: "Dresses",
          href: "/shop",
          imageUrl: akosuaEditorialImages.dresses,
          imageAlt: "Dresses collection",
          ctaLabel: "Explore",
        },
        {
          label: "Co-ords",
          href: "/shop",
          imageUrl: akosuaEditorialImages.goldLeafSet,
          imageAlt: "Co-ords collection",
          ctaLabel: "Explore",
        },
        {
          label: "Outerwear",
          href: "/shop",
          imageUrl: akosuaEditorialImages.outerwear,
          imageAlt: "Outerwear collection",
          ctaLabel: "Explore",
        },
      ],
    },
    newsletterBanner: {
      title: "Join the Heritage Club",
      description: "Receive 15% off your first purchase and early access to drops.",
      inputPlaceholder: "Email Address",
      buttonLabel: "Sign Up",
    },
    editorsPick: {
      eyebrow: "Curated by Akosua",
      title: "Editor's Picks",
      featured: {
        label: "Must Have Piece",
        title: "The Adina Signature Wrap",
        cta: { label: "Shop This Look", href: "/shop" },
        imageUrl: akosuaEditorialImages.adinaWrap,
        imageAlt: "The Adina Signature Wrap",
      },
      quote:
        "This season is about structure meets fluid tradition. We have focused on pieces that transition from business luncheons to gala evenings with ease.",
      detailCards: [
        {
          label: "The Indigo Craft",
          href: "/shop",
          imageUrl: akosuaEditorialImages.indigoCraft,
          imageAlt: "The Indigo Craft editorial detail",
        },
        {
          label: "Gold Accents",
          href: "/shop",
          imageUrl: akosuaEditorialImages.goldAccents,
          imageAlt: "Gold Accents editorial detail",
        },
      ],
    },
    bestsellers: {
      eyebrow: "Most Loved",
      title: "Bestselling Pieces",
      items: [
        {
          label: "The Adina Wrap Dress",
          href: "/shop",
          imageUrl: akosuaEditorialImages.adinaWrap,
          imageAlt: "The Adina Wrap Dress",
          name: "The Adina Wrap Dress",
          priceLabel: "$185.00",
        },
        {
          label: "Signature Kente Blazer",
          href: "/shop",
          imageUrl: akosuaEditorialImages.kenteBlazer,
          imageAlt: "Signature Kente Blazer",
          name: "Signature Kente Blazer",
          priceLabel: "$240.00",
        },
        {
          label: "The Zola Midi Skirt",
          href: "/shop",
          imageUrl: akosuaEditorialImages.zolaSkirt,
          imageAlt: "The Zola Midi Skirt",
          name: "The Zola Midi Skirt",
          priceLabel: "$125.00",
        },
        {
          label: "Osei Silk Tunic",
          href: "/shop",
          imageUrl: akosuaEditorialImages.silkTunic,
          imageAlt: "Osei Silk Tunic",
          name: "Osei Silk Tunic",
          priceLabel: "$155.00",
        },
      ],
    },
    brandStory: {
      eyebrow: "Our Legacy",
      title: "Crafting Legacies in Every Stitch",
      body:
        "Founded in the heart of Accra, Akosua Prints was born from a desire to bridge the gap between traditional craftsmanship and contemporary global fashion. We work directly with master weavers to create pieces that respect the soul of the fabric.",
      cta: { label: "Read Our Story", href: "/about" },
      imageUrl: akosuaEditorialImages.indigoCraft,
      imageAlt: "Craftsmanship detail from Akosua Prints",
    },
    instagram: {
      handle: "@AkosuaPrints",
      label: "Follow our journey",
      items: [
        {
          label: "Instagram post 1",
          href: "https://instagram.com/akosuaprints",
          imageUrl: akosuaEditorialImages.insta1,
          imageAlt: "Akosua Prints journal image 1",
        },
        {
          label: "Instagram post 2",
          href: "https://instagram.com/akosuaprints",
          imageUrl: akosuaEditorialImages.insta2,
          imageAlt: "Akosua Prints journal image 2",
        },
        {
          label: "Instagram post 3",
          href: "https://instagram.com/akosuaprints",
          imageUrl: akosuaEditorialImages.insta3,
          imageAlt: "Akosua Prints journal image 3",
        },
        {
          label: "Instagram post 4",
          href: "https://instagram.com/akosuaprints",
          imageUrl: akosuaEditorialImages.insta4,
          imageAlt: "Akosua Prints journal image 4",
        },
        {
          label: "Instagram post 5",
          href: "https://instagram.com/akosuaprints",
          imageUrl: akosuaEditorialImages.insta5,
          imageAlt: "Akosua Prints journal image 5",
        },
        {
          label: "Instagram post 6",
          href: "https://instagram.com/akosuaprints",
          imageUrl: akosuaEditorialImages.insta6,
          imageAlt: "Akosua Prints journal image 6",
        },
      ],
    },
  },
  shop: {
    defaultTitle: "Signature Collection",
    titlePrefix: "Signature",
    breadcrumb: {
      homeLabel: "Home",
      shopLabel: "Shop",
    },
    sidebar: {
      categoryTitle: "Category",
      priceTitle: "Price Range",
      promotion: {
        eyebrow: "Summer Sale",
        title: "Up to 30% Off Seasonal Pieces",
        cta: { label: "Shop Sale", href: "/shop" },
      },
    },
    sortOptions: [
      { label: "Newest First", value: "newest" },
      { label: "Price: Low to High", value: "price-asc" },
      { label: "Price: High to Low", value: "price-desc" },
      { label: "Featured", value: "featured" },
    ],
  },
  product: {
    installmentProvidersLabel: "Klarna / Afterpay",
    stockSupportLabel: "Free returns within 14 days.",
    sizeGuideLabel: "Size Guide",
    addToBagLabel: "Add to Shopping Bag",
    virtualTryOnLabel: "Launch Virtual Try-On",
    accordions: [
      {
        title: "Artisan & Craftsmanship",
        body:
          "Each Kente strip is hand-woven by master weavers in Bonwire, Ghana, taking up to 300 hours to complete. The patterns are not merely designs, but a visual language of proverbs and historical narratives.",
      },
      {
        title: "Shipping & Heritage Care",
        body:
          "Complimentary global white-glove shipping. Includes a custom breathable storage box and a certificate of authenticity signed by the artisan. Dry clean only by heritage textile specialists.",
      },
      {
        title: "Fabric & Sustainability",
        body:
          "100% Ethiopian silk and organic GOTS-certified cotton. Naturally dyed with indigenous indigo and bark-derived pigments. Zero-waste pattern cutting technique.",
      },
    ],
    reviews: {
      title: "Voices of our Heritage",
      rating: 4.9,
      scaleLabel: "out of 5",
      totalReviewsLabel: "Based on 42 reviews",
      distribution: [
        { label: "5 Star", percentage: 92 },
        { label: "4 Star", percentage: 6 },
        { label: "3 Star", percentage: 2 },
      ],
      writeReviewLabel: "Write a Review",
      viewAllLabel: "View All 42 Reviews",
      items: [
        {
          name: "Amara K.",
          initials: "AK",
          location: "Lagos, Nigeria",
          dateLabel: "Oct 14, 2023",
          headline: "The drape is magnificent.",
          body:
            "The weight of the silk is unlike anything I've felt. It feels substantial and royal. I wore it for my sister's wedding and I've never felt more connected to my roots. The craftsmanship is truly world-class.",
          tags: ["True to size"],
          avatarTone: "primary",
        },
        {
          name: "Nia O.",
          initials: "NO",
          location: "Accra, Ghana",
          dateLabel: "Sep 28, 2023",
          headline: "A true heritage piece.",
          body:
            "This isn't just fashion; it's an heirloom. The tailoring is sharp, modern, yet respects the traditional weave. The virtual try-on made the midi length feel precise before I placed the order.",
          tags: ["Excellent drape"],
          avatarTone: "accent",
        },
      ],
    },
    completeTheLook: {
      title: "Complete the Look",
      items: [
        {
          label: "Osei Gold Hoops",
          href: "/shop",
          imageUrl: akosuaEditorialImages.osseiGoldHoops,
          imageAlt: "Osei Gold Hoops",
          eyebrow: "Adinkra Series",
          name: "Osei Gold Hoops",
          priceLabel: "$420.00",
        },
        {
          label: "Heritage Wrap Clutch",
          href: "/shop",
          imageUrl: akosuaEditorialImages.heritageWrapClutch,
          imageAlt: "Heritage Wrap Clutch",
          eyebrow: "Leather Goods",
          name: "Heritage Wrap Clutch",
          priceLabel: "$890.00",
        },
        {
          label: "Nyame Cuff",
          href: "/shop",
          imageUrl: akosuaEditorialImages.nyameCuff,
          imageAlt: "Nyame Cuff",
          eyebrow: "Adinkra Series",
          name: "Nyame Cuff",
          priceLabel: "$350.00",
        },
        {
          label: "Accra Stiletto",
          href: "/shop",
          imageUrl: akosuaEditorialImages.accraStiletto,
          imageAlt: "Accra Stiletto",
          eyebrow: "Footwear",
          name: "Accra Stiletto",
          priceLabel: "$750.00",
        },
      ],
    },
    fallbackGallery: [
      {
        url: akosuaEditorialImages.productDetailThumbCloseup,
        alt: "Detail view of hand-woven kente cloth",
      },
      {
        url: akosuaEditorialImages.productDetailThumbBack,
        alt: "Back view of the dress silhouette",
      },
      {
        url: akosuaEditorialImages.productDetailThumbSide,
        alt: "Side profile showing garment movement",
      },
      {
        url: akosuaEditorialImages.productDetailMain,
        alt: "Editorial product portrait in a sunlit courtyard",
      },
    ],
  },
  footer: {
    description: "Modern interpretations of heritage fabrics. Designing for the bold, the global, and the proud.",
    columns: [
      {
        title: "Shop",
        links: [
          { label: "All Collections", href: "/shop" },
          { label: "New Arrivals", href: "/#new-arrivals" },
          { label: "Accessories", href: "/#collections" },
        ],
      },
      {
        title: "Service",
        links: [
          { label: "Shipping and Returns", href: "/contact" },
          { label: "Size Guide", href: "/contact" },
          { label: "Contact Us", href: "/contact" },
        ],
      },
    ],
    newsletter: {
      title: "Newsletter",
      description: "Join our journal for exclusive drops and stories.",
      inputPlaceholder: "Email address",
      buttonLabel: "Join",
    },
    bottomNote: "Heritage in every thread.",
    locations: ["Accra", "London", "New York"],
  },
  auth: {
    panelImageUrl: authPanelImage,
    panelImageAlt: "Brand visual",
  },
  about: {
    intro: "crafts editorial printwear rooted in Ghanaian heritage and designed for modern wardrobes.",
    body:
      "Our collections balance bold pattern, disciplined tailoring, and tactile finish. Every drop is assembled to feel like a fashion editorial translated into everyday dressing.",
    stats: [
      { value: "48", label: "Editorial looks curated" },
      { value: "12", label: "Signature print stories" },
      { value: "3", label: "Cities in our journal" },
    ],
  },
};
