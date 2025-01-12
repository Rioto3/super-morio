/** @type {import('next').NextConfig} */
import NextPWA from 'next-pwa';

const withPWA = NextPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: false
});

export default withPWA({});
