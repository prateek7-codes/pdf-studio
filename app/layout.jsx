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

// ─── Site config ──────────────────────────────────────────────────────────────
const SITE_URL = "https://pdf-studio-nu.vercel.app";
const SITE_NAME = "PDF Studio";
const SITE_TITLE = "PDF Studio — Free PDF Tools That Never Leave Your Browser";
const SITE_DESCRIPTION =
  "Merge, split, compress, rotate, watermark and convert PDFs — 100% free, 100% private. All processing happens locally in your browser. No uploads, no accounts, no limits.";

// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s — PDF Studio",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "pdf tools", "merge pdf", "split pdf", "compress pdf",
    "jpg to pdf", "rotate pdf", "watermark pdf", "free pdf editor",
    "pdf without upload", "private pdf tool", "local pdf processing",
  ],
  authors: [{ name: "PDF Studio" }],
  creator: "PDF Studio",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "PDF Studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: SITE_URL,
  },
};

// ─── Viewport ─────────────────────────────────────────────────────────────────
export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#09090f" },
    { media: "(prefers-color-scheme: light)", color: "#f4f4fa" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// ─── JSON-LD Structured Data ──────────────────────────────────────────────────
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PDF Studio",
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  featureList: [
    "Merge PDF files", "Split PDF pages", "Compress PDF",
    "Rotate PDF pages", "Add watermark to PDF", "Convert JPG to PDF",
    "100% local processing", "No file uploads", "Works offline",
  ],
};

// ─── Root Layout ──────────────────────────────────────────────────────────────
export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />
      </head>
      <body>{children}</body>
    </html>
  );
}
