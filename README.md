# PDF Studio

**Free PDF tools that never leave your browser.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-pdf--studio--nu.vercel.app-6366f1?style=flat-square)](https://pdf-studio-nu.vercel.app)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/prateek7-codes/pdf-studio)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://typescriptlang.org)

---

## ✨ What is PDF Studio?

PDF Studio is a **privacy-first PDF toolkit** — similar to iLovePDF or Smallpdf, but with one fundamental difference:

> **All file processing happens locally in your browser. Your files never leave your device.**

No uploads. No cloud processing. No server storage. No accounts. No file size limits. No daily caps.

---

## 🛠️ Tools

| Tool | Description | Status |
|------|-------------|--------|
| **Merge PDF** | Combine multiple PDFs into one | ✅ Live |
| **Split PDF** | Extract pages or ranges | ✅ Live |
| **Compress PDF** | Reduce file size | ✅ Live |
| **Rotate Pages** | Fix orientation | ✅ Live |
| **Organize Pages** | Drag-and-drop reorder with thumbnails | ✅ Live |
| **Add Watermark** | Stamp text on all pages | ✅ Live |
| **Page Numbers** | Add footer numbering | ✅ Live |
| **JPG → PDF** | Convert images to PDF | ✅ Live |
| **Protect PDF** | Password-lock documents | 🔜 Coming |
| **Batch Process** | Process multiple files at once | ✅ Live |

---

## 🔒 Privacy Model

PDF Studio processes files using [pdf-lib](https://pdf-lib.js.org/) and [PDF.js](https://mozilla.github.io/pdf.js/) — both run entirely within the browser's JavaScript sandbox.

**To verify this yourself:**
1. Open PDF Studio in Chrome/Firefox
2. Open DevTools → Network tab
3. Drop a PDF file and run any tool
4. Watch: **zero file upload requests are made**

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| PDF Processing | pdf-lib 1.17 |
| PDF Rendering | PDF.js 3.11 |
| Fonts | Syne + DM Sans (Google Fonts) |
| Deployment | Vercel |

---

## 🏗️ Project Structure

```
pdf-studio/
├── app/
│   ├── layout.tsx          # Root layout with metadata, fonts, structured data
│   ├── page.tsx            # Home page — tool grid
│   ├── sitemap.ts          # Auto-generated sitemap
│   ├── opengraph-image.tsx # Auto-generated OG social card
│   ├── merge/
│   │   └── page.tsx        # /merge route
│   ├── split/
│   │   └── page.tsx        # /split route
│   └── [tool]/
│       └── page.tsx        # Pattern for all tools
├── components/
│   ├── ui/                 # Reusable UI (Dropzone, FileList, Progress...)
│   └── tools/              # Tool-specific components
├── lib/
│   ├── pdf/                # PDF operation functions (merge, split, compress...)
│   ├── metadata.ts         # SEO metadata for all tool pages
│   └── workers/            # Web Workers for off-thread processing
├── hooks/
│   ├── useHistory.ts       # Undo/redo state management
│   └── useToolState.ts     # Shared tool state hook
├── public/
│   ├── manifest.json       # PWA manifest
│   ├── robots.txt
│   └── icons/              # PWA icons (all sizes)
└── next.config.js          # Security headers, redirects, optimization
```

---

## 🛠️ Local Development

**Prerequisites:** Node.js 18+, npm 9+

```bash
# 1. Clone the repo
git clone https://github.com/prateek7-codes/pdf-studio.git
cd pdf-studio

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
open http://localhost:3000
```

**That's it.** No environment variables required — everything runs client-side.

---

## 🚢 Deploy to Vercel

The fastest way to deploy your own instance:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/prateek7-codes/pdf-studio)

Or via CLI:

```bash
npm install -g vercel
vercel --prod
```

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. Create a **feature branch**: `git checkout -b feature/my-new-tool`
3. Make your changes
4. Run checks: `npm run type-check && npm run lint`
5. **Push** and open a **Pull Request**

### Adding a New Tool

1. Create `app/[tool-name]/page.tsx`
2. Add metadata to `lib/metadata.ts`
3. Create the tool component in `components/tools/`
4. Add the PDF logic function in `lib/pdf/`
5. Add to the tools grid in `app/page.tsx`

---

## 📋 Roadmap

- [ ] PDF to Word (DOCX) conversion
- [ ] E-signature / draw signature
- [ ] Fill PDF forms
- [ ] Redact/black-out text
- [ ] OCR (text recognition from scanned PDFs)
- [ ] PDF annotation and highlighting
- [ ] True image compression (canvas resampling)
- [ ] PWA offline support
- [ ] Desktop app (Tauri wrapper)

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  Made with ❤️ for privacy-conscious users everywhere<br/>
  <a href="https://pdf-studio-nu.vercel.app">pdf-studio-nu.vercel.app</a>
</p>
