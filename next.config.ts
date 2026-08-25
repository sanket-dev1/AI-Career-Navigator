import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep heavy Node-only parsers as external modules so Next.js does not try
  // to bundle them into the edge/server chunks (they depend on native bindings
  // and DOM globals that aren't available at build time).
  serverExternalPackages: ["pdf-parse", "mammoth"],
};

export default nextConfig;
