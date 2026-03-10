import { Metadata } from "next";

const SITE_URL = "https://pdf-studio-nu.vercel.app";
// ↑ Update when you get a custom domain

// ─── Tool metadata map ────────────────────────────────────────────────────────
// Each tool page imports generateToolMetadata() and calls it with its tool ID.
// This keeps all SEO copy in one place, easy to update.

interface ToolMeta {
  title: string;
  description: string;
  keywords: string[];
  path: string;
}

const TOOL_META: Record<string, ToolMeta> = {
  merge: {
    title: "Merge PDF",
    description:
      "Combine multiple PDF files into a single document — free, instant, and 100% private. No uploads, no file size limits. Merge PDFs directly in your browser.",
    keywords: [
      "merge pdf",
      "combine pdf",
      "join pdf files",
      "pdf merger",
      "merge pdf online",
      "merge pdf free",
      "combine pdf files",
    ],
    path: "/merge",
  },
  split: {
    title: "Split PDF",
    description:
      "Split a PDF into individual pages or custom page ranges — free and private. Extract specific pages from any PDF without uploading to a server.",
    keywords: [
      "split pdf",
      "extract pdf pages",
      "pdf splitter",
      "split pdf online",
      "separate pdf pages",
      "divide pdf",
    ],
    path: "/split",
  },
  compress: {
    title: "Compress PDF",
    description:
      "Reduce PDF file size with honest compression — we show you real before/after sizes. All compression happens locally in your browser, completely private.",
    keywords: [
      "compress pdf",
      "reduce pdf size",
      "pdf compressor",
      "shrink pdf",
      "make pdf smaller",
      "pdf file size reducer",
    ],
    path: "/compress",
  },
  rotate: {
    title: "Rotate PDF",
    description:
      "Rotate PDF pages 90°, 180°, or 270° — fix upside-down or sideways scans instantly. Free, private, and works on any PDF without uploading.",
    keywords: [
      "rotate pdf",
      "rotate pdf pages",
      "flip pdf",
      "pdf rotation",
      "rotate pdf online",
      "fix pdf orientation",
    ],
    path: "/rotate",
  },
  organize: {
    title: "Organize PDF Pages",
    description:
      "Drag and drop to reorder, delete, or rearrange PDF pages with real thumbnail previews. All page organization happens locally — your document never leaves your device.",
    keywords: [
      "organize pdf pages",
      "reorder pdf pages",
      "rearrange pdf",
      "pdf page organizer",
      "delete pdf pages",
      "sort pdf pages",
    ],
    path: "/organize",
  },
  watermark: {
    title: "Add Watermark to PDF",
    description:
      "Stamp custom text watermarks on every page of your PDF. Control text, size, and opacity. Watermarking is done locally — no file uploads needed.",
    keywords: [
      "add watermark to pdf",
      "pdf watermark",
      "watermark pdf online",
      "stamp pdf",
      "confidential pdf",
      "draft watermark",
    ],
    path: "/watermark",
  },
  "page-numbers": {
    title: "Add Page Numbers to PDF",
    description:
      "Add page numbers to any PDF — choose position (bottom center, bottom right, top) and format. Free, private, and works instantly in your browser.",
    keywords: [
      "add page numbers to pdf",
      "pdf page numbers",
      "number pdf pages",
      "pdf footer numbers",
      "paginate pdf",
    ],
    path: "/page-numbers",
  },
  "jpg-to-pdf": {
    title: "JPG to PDF",
    description:
      "Convert JPG, PNG, and WebP images to PDF — supports multiple images, one PDF page per image. Free, private, and done entirely in your browser.",
    keywords: [
      "jpg to pdf",
      "image to pdf",
      "convert jpg to pdf",
      "png to pdf",
      "photo to pdf",
      "pictures to pdf",
    ],
    path: "/jpg-to-pdf",
  },
  protect: {
    title: "Protect PDF",
    description:
      "Password-protect your PDF documents locally — no file uploads. Add encryption to sensitive documents without sending them to any server.",
    keywords: [
      "protect pdf",
      "password protect pdf",
      "encrypt pdf",
      "pdf password",
      "secure pdf",
      "lock pdf",
    ],
    path: "/protect",
  },
  batch: {
    title: "Batch Process PDFs",
    description:
      "Process multiple PDF files at once — compress, rotate, or watermark an entire folder of PDFs in one go. All batch processing is done locally.",
    keywords: [
      "batch pdf processing",
      "bulk pdf",
      "process multiple pdfs",
      "batch compress pdf",
      "batch rotate pdf",
    ],
    path: "/batch",
  },
};

// ─── Generator function ────────────────────────────────────────────────────────
// Usage in any tool page:
//
//   import { generateToolMetadata } from "@/lib/metadata";
//   export const metadata = generateToolMetadata("merge");
//
export function generateToolMetadata(toolId: string): Metadata {
  const tool = TOOL_META[toolId];

  if (!tool) {
    console.warn(`No metadata defined for tool: ${toolId}`);
    return {};
  }

  const fullTitle = `${tool.title} — PDF Studio`;
  const ogImageUrl = `/tools/${toolId}/opengraph-image`; // each tool can have its own OG image
  const canonicalUrl = `${SITE_URL}${tool.path}`;

  return {
    title: tool.title, // layout.tsx template wraps this: "Merge PDF — PDF Studio"
    description: tool.description,
    keywords: [
      ...tool.keywords,
      "pdf tools",
      "free pdf",
      "pdf without upload",
      "private pdf tool",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description: tool.description,
      url: canonicalUrl,
      siteName: "PDF Studio",
      type: "website",
      images: [
        {
          url: "/og-image.png", // fallback to global OG image
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: tool.description,
      images: ["/og-image.png"],
    },
  };
}

// ─── Export all tool metadata (useful for sitemap, nav, etc.) ─────────────────
export { TOOL_META, SITE_URL };
