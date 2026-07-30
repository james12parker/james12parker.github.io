import type { MetadataRoute } from "next";

import { isProductionRelease } from "@/config/launch-data";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  if (!isProductionRelease) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
    host: siteConfig.siteUrl,
  };
}
