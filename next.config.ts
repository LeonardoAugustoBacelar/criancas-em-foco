import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  silent: true,
  // Sem SENTRY_AUTH_TOKEN configurado, o upload de source maps é pulado
  // automaticamente (stack traces minificados no Sentry, mas captura de
  // erro funciona normalmente).
  org: undefined,
  project: undefined,
});
