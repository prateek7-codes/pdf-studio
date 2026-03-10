/** @type {import('next').NextConfig} */

// Security headers applied to every response
// These protect users and boost trust signals for SEO
const securityHeaders = [
  // Prevent clickjacking — stops PDF Studio being embedded in iframes
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // Prevent MIME type sniffing
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Only send referrer on same origin
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Allow SharedArrayBuffer for Web Workers (needed for pdf-lib in workers)
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "Cross-Origin-Embedder-Policy",
    value: "require-corp",
  },
  // Permissions policy — disable features we don't use
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  // Content Security Policy
  // Allows: our own scripts, Google Fonts, cdnjs for pdf-lib/pdf.js
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Scripts: our app + CDN for pdf-lib and pdf.js
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com",
      // Styles: our app + Google Fonts
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fonts
      "font-src 'self' https://fonts.gstatic.com",
      // Images: our app + data URIs (for canvas thumbnails)
      "img-src 'self' data: blob:",
      // Workers (Web Workers for PDF processing)
      "worker-src 'self' blob: https://cdnjs.cloudflare.com",
      // Connect (fetch/XHR) — only our own origin + cdnjs for loading libs
      "connect-src 'self' https://cdnjs.cloudflare.com",
      // No plugins, no frames from other origins
      "object-src 'none'",
      "frame-ancestors 'none'",
      // Blob URLs for file downloads
      "media-src 'self' blob:",
    ].join("; "),
  },
];

const nextConfig = {
  // ── Security headers on all routes ───────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  // ── Redirects for common misspellings / old URLs ─────────────────────────
  async redirects() {
    return [
      // If someone navigates to /pdf-merge etc., redirect gracefully
      { source: "/pdf-merge",    destination: "/merge",    permanent: true },
      { source: "/pdf-split",    destination: "/split",    permanent: true },
      { source: "/pdf-compress", destination: "/compress", permanent: true },
      { source: "/jpg-pdf",      destination: "/jpg-to-pdf", permanent: true },
    ];
  },

  // ── Image optimization ────────────────────────────────────────────────────
  images: {
    formats: ["image/avif", "image/webp"],
    // No external image domains needed (all images are local)
  },

  // ── Compiler options ──────────────────────────────────────────────────────
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === "production"
      ? { exclude: ["error", "warn"] }
      : false,
  },

  // ── Experimental features ─────────────────────────────────────────────────
  experimental: {
    // Optimize package imports for tree-shaking
    optimizePackageImports: ["lucide-react"],
  },

  // ── PWA / Service Worker ──────────────────────────────────────────────────
  // Uncomment after installing next-pwa:  npm install next-pwa
  // ...require("next-pwa")({
  //   dest: "public",
  //   register: true,
  //   skipWaiting: true,
  //   disable: process.env.NODE_ENV === "development",
  // }),
};

module.exports = nextConfig;
