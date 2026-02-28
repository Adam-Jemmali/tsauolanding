/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
    unoptimized: false,
    formats: ["image/webp"],
    // Smaller device breakpoints → smaller images served by Next.js
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Reduce quality slightly — barely visible, huge savings on 480 PNGs
    minimumCacheTTL: 31536000, // 1 year — images never change
  },

  // Production hardening
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // Aggressive caching & security headers for Vercel edge
  async headers() {
    return [
      // ─── Sequence images — immutable forever ───────────────────────
      {
        source: "/sequence/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "CDN-Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "Vercel-CDN-Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/sequence2s/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "CDN-Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "Vercel-CDN-Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },

      // ─── Team / event images — long cache, revalidate weekly ──────
      {
        source: "/team/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=604800" },
          { key: "CDN-Cache-Control", value: "public, max-age=2592000" },
        ],
      },
      {
        source: "/events/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=604800" },
          { key: "CDN-Cache-Control", value: "public, max-age=2592000" },
        ],
      },

      // ─── All other static assets (logo, fonts, etc.) ──────────────
      {
        source: "/:path*.png",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" },
        ],
      },
      {
        source: "/:path*.woff",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:path*.woff2",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },

      // ─── Next.js optimised images (/_next/image) ──────────────────
      {
        source: "/_next/image/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "CDN-Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },

      // ─── Static JS/CSS chunks — immutable hashed filenames ────────
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },

      // ─── Global security & perf headers on every page ─────────────
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Keep-Alive for HTTP/1.1 connections
          { key: "Connection", value: "keep-alive" },
        ],
      },
    ];
  },
};

export default nextConfig;
