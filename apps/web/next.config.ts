import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Required for React Three Fiber
  transpilePackages: ['three', '@scriptorium/ui', '@scriptorium/api', '@scriptorium/db'],

  // Webpack configuration for Three.js
  webpack: config => {
    /* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */
    const existingExternals = Array.isArray(config.externals) ? (config.externals as Record<string, string>[]) : [];
    config.externals = [...existingExternals, { canvas: 'canvas' }];
    return config;
    /* eslint-enable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */
  },
};

export default nextConfig;
