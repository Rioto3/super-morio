/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';

const nextConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  experimental: {
    appDir: true,
  },
  devIndicators: {
    buildActivity: false,
    // buildActivityPosition: 'bottom-right',
  },
});

export default nextConfig;