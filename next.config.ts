import type { NextConfig } from "next";

const nextConfig: NextConfig & {
  turbo: {
    rules: Record<string, { as: string }>;
  };
} = {
  turbo: {
    rules: {
      '*.md': {
        as: 'asset/source'
      }
    }
  }
};

export default nextConfig;