/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'images.example.com'],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    // Enable experimental features here
  },
};

module.exports = nextConfig;
