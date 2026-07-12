import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  turbopack: {
    rules: {
      '*.md': {
        type: 'asset',
      },
    },
  },
};

export default nextConfig;