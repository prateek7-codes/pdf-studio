import type { Metadata, Viewport } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";

// ─── Fonts ────────────────────────────────────────────────────────────────────
const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

// ─── Site config (update when you get a custom domain) ───────────────────────
const SITE_URL = "https://pdf-studio-nu.vercel.app";
const SITE_NAME = "PDF Studio";
const SITE_TITLE = "PDF Studio — Free PDF Tools That Never Leave Your Browser";
const SITE_DESCRIPTION =
  "Merge, split, compress, rotate, watermark and convert PDFs — 100% free, 100% private. All processing happens locally in your browser. No uploads, no accounts, no limits.";
const SITE_KEYWORDS = [
  "pdf tools",
  "merge pdf",
  "split pdf",
  "compress pdf",
  "pdf to jpg",
  "jpg to pdf",
  "rotate pdf",
  "watermark pdf",
  "free pdf editor",
  "pdf tools online",
  "pdf without upload",
  "private pdf tool",
  "local pdf processing",
  "browser pdf tool",
  "pdf organizer",
  "pdf page numbers",
];

// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  // ── Core ──────────────────────────────────────────────────────────────────
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    // Each tool page overrides this:  "Merge PDF — PDF Studio"
    template: "%s — PDF Studio",
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: "PDF Studio" }],
  creator: "PDF Studio",
  publisher: "PDF Studio",

  // ── Open Graph (Facebook, LinkedIn, Slack, Discord previews) ──────────────
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",   // we create this below
        width: 1200,
        height: 630,
        alt: "PDF Studio — Free private PDF tools",
      },
    ],
  },

  // ── Twitter / X card ──────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
    // creator: "@yourhandle",  // add when you have a Twitter account
  },

  // ── Robots & indexing ─────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── PWA / icons ───────────────────────────────────────────────────────────
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#6366f1" },
    ],
  },

  // ── Verification (add when connected) ─────────────────────────────────────
  // verification: {
  //   google: "YOUR_GOOGLE_SEARCH_CONSOLE_TOKEN",
  // },

  // ── Canonical ─────────────────────────────────────────────────────────────
  alternates: {
    canonical: SITE_URL,
  },
};

// ─── Viewport (separate export as per Next.js 14) ─────────────────────────────
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#09090f" },
    { media: "(prefers-color-scheme: light)", color: "#f4f4fa" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// ─── JSON-LD Structured Data ──────────────────────────────────────────────────
// This tells Google exactly what your app is and what it offers.
// Appears in rich search results.
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}/#webapp`,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "Merge PDF files",
        "Split PDF pages",
        "Compress PDF",
        "Rotate PDF pages",
        "Add watermark to PDF",
        "Add page numbers to PDF",
        "Convert JPG to PDF",
        "Organize PDF pages",
        "100% local processing",
        "No file uploads",
        "No account required",
        "Works offline",
      ],
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/og-image.png`,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

// ─── Root Layout ──────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Structured data for Google rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* Preconnect to Google Fonts CDN (already used by next/font but belt-and-suspenders) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* DNS prefetch for cdnjs if still using CDN for pdf-lib */}
        <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
