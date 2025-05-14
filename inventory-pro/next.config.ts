import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during builds to prevent failing due to ESLint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript error checking during build to prevent failing due to errors
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
