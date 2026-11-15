import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  images: { remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }, { protocol: 'https', hostname: '**.ufs.sh', pathname: '/f/**' }, { protocol: 'https', hostname: 'utfs.io', pathname: '/f/**' }] },
  experimental: { viewTransition: true },
};
export default nextConfig;
