import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  output: "standalone",
  experimental: { agentUpgrade: "security" },
};

export default nextConfig;
