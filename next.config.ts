import type { NextConfig } from "next";

import launchData from "./data/launch/launch-data.json";

const configuredReleaseMode =
  process.env.NEXT_PUBLIC_SITE_RELEASE_MODE ??
  launchData.deployment.releaseMode;
const isProductionRelease = configuredReleaseMode === "production";
const catalogCorrections = launchData.catalogCorrections as Array<{
  status: string;
  newSlug: string;
  previousSlugs: string[];
}>;
const catalogRedirects = catalogCorrections.flatMap((correction) => {
  if (
    correction.status !== "verified" ||
    !correction.newSlug ||
    correction.previousSlugs.length === 0
  ) {
    return [];
  }
  return correction.previousSlugs.map((previousSlug) => ({
    source: `/products/${previousSlug}`,
    destination: `/products/${correction.newSlug}`,
    permanent: true,
  }));
});

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  `script-src 'self' 'unsafe-inline'${isProductionRelease ? "" : " 'unsafe-eval'"}`,
  `connect-src 'self'${isProductionRelease ? "" : " ws: wss:"}`,
  ...(isProductionRelease ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  ...(isProductionRelease
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return catalogRedirects;
  },
};

export default nextConfig;
