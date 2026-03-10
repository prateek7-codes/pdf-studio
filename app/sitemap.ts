import { MetadataRoute } from "next";

const SITE_URL = "https://pdf-studio-nu.vercel.app";
// ↑ Update this when you get a custom domain

// All tool pages — each gets its own sitemap entry so Google
// indexes /merge, /split, /compress etc. as individual pages
const TOOL_ROUTES = [
  { path: "/merge",        priority: 0.9, changeFreq: "monthly" as const },
  { path: "/split",        priority: 0.9, changeFreq: "monthly" as const },
  { path: "/compress",     priority: 0.9, changeFreq: "monthly" as const },
  { path: "/rotate",       priority: 0.8, changeFreq: "monthly" as const },
  { path: "/organize",     priority: 0.8, changeFreq: "monthly" as const },
  { path: "/watermark",    priority: 0.8, changeFreq: "monthly" as const },
  { path: "/page-numbers", priority: 0.7, changeFreq: "monthly" as const },
  { path: "/jpg-to-pdf",   priority: 0.9, changeFreq: "monthly" as const },
  { path: "/protect",      priority: 0.8, changeFreq: "monthly" as const },
  { path: "/batch",        priority: 0.7, changeFreq: "monthly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Home page — highest priority
  const home: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];

  // Tool pages
  const toolPages: MetadataRoute.Sitemap = TOOL_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFreq,
    priority: route.priority,
  }));

  return [...home, ...toolPages];
}
