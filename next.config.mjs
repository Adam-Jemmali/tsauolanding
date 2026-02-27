/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
    // Use unoptimized for the 480 sequence PNGs (they're static assets, no need for Next.js image optimizer overhead)
    // Next.js Image component will still be used for non-sequence images with optimization
    unoptimized: false,
    formats: ["image/webp"],
  },
  // Production optimizations
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
