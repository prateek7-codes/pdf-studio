"use client";

import { useState, useCallback, useRef, useEffect, useReducer } from "react";

let pdfjsLib = null;

async function loadPdfJS() {
  if (pdfjsLib) return pdfjsLib;

  const lib = await import("pdfjs-dist");

  lib.GlobalWorkerOptions.workerSrc =
    new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();

  pdfjsLib = lib;
  return lib;
}
// ─── THEME ────────────────────────────────────────────────────────────────────
const THEMES = {
  dark: {
    name: "Dark",
    bg: "#080810",
    surface: "#0f0f1a",
    surface2: "#161625",
    surface3: "#1d1d30",
    border: "rgba(255,255,255,0.07)",
    borderHover: "rgba(255,255,255,0.14)",
    text: "#eeeef8",
    muted: "rgba(238,238,248,0.42)",
    accent: "#6366f1",
    accent2: "#8b5cf6",
    accentRgb: "99,102,241",
    success: "#10b981",
    successBg: "rgba(16,185,129,0.08)",
    successBorder: "rgba(16,185,129,0.2)",
    successText: "#6ee7b7",
    error: "#ef4444",
    errorBg: "rgba(239,68,68,0.07)",
    errorBorder: "rgba(239,68,68,0.2)",
    errorText: "#fca5a5",
    warning: "#f59e0b",
    warningBg: "rgba(245,158,11,0.08)",
    cardBg: "rgba(255,255,255,0.02)",
    shadow: "0 20px 60px rgba(0,0,0,0.5)",
    glowGradient: "radial-gradient(ellipse 600px 300px at 50% -60px, rgba(99,102,241,0.12), transparent)",
  },
  light: {
    name: "Light",
    bg: "#f5f5fa",
    surface: "#ffffff",
    surface2: "#f0f0f8",
    surface3: "#e8e8f4",
    border: "rgba(0,0,0,0.08)",
    borderHover: "rgba(0,0,0,0.15)",
    text: "#1a1a2e",
    muted: "rgba(26,26,46,0.5)",
    accent: "#5254d4",
    accent2: "#7c3aed",
    accentRgb: "82,84,212",
    success: "#059669",
    successBg: "rgba(5,150,105,0.07)",
    successBorder: "rgba(5,150,105,0.2)",
    successText: "#065f46",
    error: "#dc2626",
    errorBg: "rgba(220,38,38,0.06)",
    errorBorder: "rgba(220,38,38,0.18)",
    errorText: "#991b1b",
    warning: "#d97706",
    warningBg: "rgba(217,119,6,0.07)",
    cardBg: "rgba(0,0,0,0.01)",
    shadow: "0 20px 60px rgba(0,0,0,0.1)",
    glowGradient: "radial-gradient(ellipse 600px 300px at 50% -60px, rgba(82,84,212,0.07), transparent)",
  },
  midnight: {
    name: "Midnight",
    bg: "#010108",
    surface: "#08080f",
    surface2: "#0d0d18",
    surface3: "#131320",
    border: "rgba(120,120,255,0.08)",
    borderHover: "rgba(120,120,255,0.15)",
    text: "#e0e0ff",
    muted: "rgba(200,200,255,0.38)",
    accent: "#818cf8",
    accent2: "#a78bfa",
    accentRgb: "129,140,248",
    success: "#34d399",
    successBg: "rgba(52,211,153,0.07)",
    successBorder: "rgba(52,211,153,0.18)",
    successText: "#6ee7b7",
    error: "#f87171",
    errorBg: "rgba(248,113,113,0.07)",
    errorBorder: "rgba(248,113,113,0.18)",
    errorText: "#fca5a5",
    warning: "#fbbf24",
    warningBg: "rgba(251,191,36,0.07)",
    cardBg: "rgba(120,120,255,0.02)",
    shadow: "0 20px 80px rgba(0,0,10,0.8)",
    glowGradient: "radial-gradient(ellipse 700px 400px at 50% -100px, rgba(129,140,248,0.1), transparent)",
  },
};

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
// Add these icon components ABOVE your TOOLS array in page.jsx.
// Then update the TOOLS array below to use them instead of Unicode symbols.

function IconMerge({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h4" />
      <path d="M16 6h4a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-4" />
      <path d="M12 2v20" />
      <path d="M9 9l3-3 3 3" />
      <path d="M9 15l3 3 3-3" />
    </svg>
  );
}

function IconSplit({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 3h5v5" />
      <path d="M8 3H3v5" />
      <path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3" />
      <path d="m15 9 6-6" />
      <path d="M3 21l7.5-7.5" />
      <path d="M21 21h-5v-5" />
    </svg>
  );
}

function IconCompress({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M4 7V4a2 2 0 0 1 2-2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3" />
      <path d="M3 12h8" />
      <path d="m7 8-4 4 4 4" />
    </svg>
  );
}

function IconRotate({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2v6h-6" />
      <path d="M21 13a9 9 0 1 1-3-7.7L21 8" />
    </svg>
  );
}

function IconOrganize({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  );
}

function IconWatermark({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M4 7V4a2 2 0 0 1 2-2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3" />
      <path d="M3 15h6" />
      <path d="M3 18h8" />
      <path d="M3 21h6" />
    </svg>
  );
}

function IconPageNumbers({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M4 7V4a2 2 0 0 1 2-2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3" />
      <path d="M3 21v-4" />
      <path d="M3 17h2a1 1 0 0 0 0-2H3" />
      <path d="M7 21v-4l2 2 2-2v4" />
    </svg>
  );
}

function IconImageToPdf({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="11" height="11" rx="2" />
      <path d="m3 11 4-4 3 3" />
      <circle cx="9.5" cy="6.5" r="1" fill={color} stroke="none" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M14 14v-1a2 2 0 0 1 2-2h6v9a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-1" />
    </svg>
  );
}

function IconProtect({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      <circle cx="12" cy="16" r="1" fill={color} stroke="none" />
    </svg>
  );
}

function IconBatch({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2v4a2 2 0 0 0 2 2h4" />
      <path d="M9 18H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9l5 5v5" />
      <path d="M12 22v-6" />
      <path d="M9 19l3 3 3-3" />
      <rect x="12" y="14" width="8" height="6" rx="1" />
    </svg>
  );
}

// ─── TOOLS ARRAY ──────────────────────────────────────────────────────────────
// REPLACE your existing TOOLS array in page.jsx with this one.
// The only change is the icon field — everything else is identical.

const TOOLS = [
  { id: "merge",       icon: <IconMerge />,       label: "Merge PDF",       desc: "Combine multiple PDFs into one",         color: "#6366f1", kbd: "M" },
  { id: "split",       icon: <IconSplit />,        label: "Split PDF",       desc: "Separate pages into individual files",   color: "#8b5cf6", kbd: "S" },
  { id: "compress",    icon: <IconCompress />,     label: "Compress PDF",    desc: "Reduce file size intelligently",         color: "#06b6d4", kbd: "C" },
  { id: "rotate",      icon: <IconRotate />,       label: "Rotate Pages",    desc: "Rotate all pages to any angle",          color: "#10b981", kbd: "R" },
  { id: "organize",    icon: <IconOrganize />,     label: "Organize Pages",  desc: "Drag to reorder, delete, duplicate",     color: "#f97316", kbd: "O" },
  { id: "watermark",   icon: <IconWatermark />,    label: "Add Watermark",   desc: "Stamp text watermarks on all pages",     color: "#f59e0b", kbd: "W" },
  { id: "pagenumbers", icon: <IconPageNumbers />,  label: "Page Numbers",    desc: "Add numbered footers to every page",     color: "#a855f7", kbd: "N" },
  { id: "jpg-to-pdf",  icon: <IconImageToPdf />,   label: "JPG → PDF",       desc: "Convert images to PDF format",           color: "#14b8a6", kbd: "J" },
  { id: "protect",     icon: <IconProtect />,      label: "Protect PDF",     desc: "Password-lock your documents",           color: "#ef4444", kbd: "P" },
  { id: "batch",       icon: <IconBatch />,        label: "Batch Process",   desc: "Process multiple PDFs at once",          color: "#ec4899", kbd: "B" },
];

// ─── UNDO HISTORY ─────────────────────────────────────────────────────────────
function createHistory(initial) {
  return { past: [], present: initial, future: [] };
}
function historyPush(h, next) {
  return { past: [...h.past.slice(-19), h.present], present: next, future: [] };
  }


function historyUndo(h) {
  if (!h.past.length) return h;
  const [prev, ...rest] = [...h.past].reverse();
  return { past: h.past.slice(0, -1), present: prev, future: [h.present, ...h.future] };
}

function historyRedo(h) {
  if (!h.future.length) return h;
  const [next, ...rest] = h.future;
  return { past: [...h.past, h.present], present: next, future: rest };
}


// ─── PDF-LIB LOADER ───────────────────────────────────────────────────────────
// ─── PDF-LIB LOADER ───────────────────────────────────────────────────────────
let _pdfLib = null;

async function loadPdfLib() {
  if (_pdfLib) return _pdfLib;
  _pdfLib = await import("pdf-lib");
  return _pdfLib;
}

function readAsArrayBuffer(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = e => res(e.target.result);
    r.onerror = () => rej(new Error(`Could not read file: ${file.name}`));
    r.readAsArrayBuffer(file);
  });
}

function formatBytes(b) {
  if (!b) return "0 B";
  if (b < 1024) return b + " B";
  if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
  return (b / 1048576).toFixed(2) + " MB";
}

function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ─── PDF OPERATIONS ───────────────────────────────────────────────────────────
async function opMerge(files, opts, onProgress) {
  const { PDFDocument } = await loadPdfLib();
  const merged = await PDFDocument.create();
  for (let i = 0; i < files.length; i++) {
    const buf = await readAsArrayBuffer(files[i]);
    try {
      const src = await PDFDocument.load(buf, { ignoreEncryption: true });
      const pages = await merged.copyPages(src, src.getPageIndices());
      pages.forEach(p => merged.addPage(p));
    } catch (e) {
      throw new Error(`Cannot read "${files[i].name}": may be encrypted or corrupt.`);
    }
    onProgress(Math.round(((i + 1) / files.length) * 88));
  }
  const bytes = await merged.save();
  onProgress(100);
  return [{ blob: new Blob([bytes], { type: "application/pdf" }), name: "merged.pdf" }];
}

async function opSplit(files, opts, onProgress) {
  const { PDFDocument } = await loadPdfLib();
  const buf = await readAsArrayBuffer(files[0]);
  const src = await PDFDocument.load(buf, { ignoreEncryption: true });
  const total = src.getPageCount();
  const results = [];
  const mode = opts.splitMode || "all";
  let indices = [];
  if (mode === "all") indices = src.getPageIndices();
  else if (mode === "range") {
    const s = parseInt(opts.rangeStart || 1) - 1;
    const e = parseInt(opts.rangeEnd || total) - 1;
    for (let i = Math.max(0,s); i <= Math.min(total-1, e); i++) indices.push(i);
  } else if (mode === "odd") indices = src.getPageIndices().filter(i => i % 2 === 0);
  else if (mode === "even") indices = src.getPageIndices().filter(i => i % 2 === 1);
  for (let k = 0; k < indices.length; k++) {
    const doc = await PDFDocument.create();
    const [pg] = await doc.copyPages(src, [indices[k]]);
    doc.addPage(pg);
    const bytes = await doc.save();
    results.push({ blob: new Blob([bytes], { type: "application/pdf" }), name: `page-${indices[k]+1}.pdf` });
    onProgress(Math.round(((k+1)/indices.length)*95));
  }
  onProgress(100);
  return results;
}

async function opCompress(files, opts, onProgress) {
  const { PDFDocument } = await loadPdfLib();
  const results = [];
  for (let i = 0; i < files.length; i++) {
    const buf = await readAsArrayBuffer(files[i]);
    const src = await PDFDocument.load(buf, { ignoreEncryption: true });
    const level = opts.level || "balanced";
    const saveOpts = {
  useObjectStreams: true,
  objectsPerTick: 50,
  updateFieldAppearances: false
};
    const bytes = await src.save(saveOpts);
    const blob = new Blob([bytes], { type: "application/pdf" });
    const base = files[i].name.replace(/\.pdf$/i, "");
    results.push({ blob, name: `${base}_compressed.pdf`, originalSize: files[i].size, newSize: blob.size });
    onProgress(Math.round(((i+1)/files.length)*100));
  }
  return results;
}

async function opRotate(files, opts, onProgress) {
  const { PDFDocument, degrees } = await loadPdfLib();
  const results = [];
  for (let i = 0; i < files.length; i++) {
    const buf = await readAsArrayBuffer(files[i]);
    const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
    pdf.getPages().forEach(p => p.setRotation(degrees(parseInt(opts.degrees || 90))));
    const bytes = await pdf.save();
    const base = files[i].name.replace(/\.pdf$/i, "");
    results.push({ blob: new Blob([bytes], { type: "application/pdf" }), name: `${base}_rotated.pdf` });
    onProgress(Math.round(((i+1)/files.length)*100));
  }
  return results;
}

async function opWatermark(files, opts, onProgress) {
  const { PDFDocument, rgb, StandardFonts } = await loadPdfLib();
  const results = [];
  for (let i = 0; i < files.length; i++) {
    const buf = await readAsArrayBuffer(files[i]);
    const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
    const font = await pdf.embedFont(StandardFonts.HelveticaBold);
    const text = opts.watermarkText || "CONFIDENTIAL";
    const opacity = parseFloat(opts.opacity || 0.3);
    const size = parseInt(opts.fontSize || 48);
    pdf.getPages().forEach(p => {
      const { width, height } = p.getSize();
      p.drawText(text, {
        x: width/2 - (text.length * size * 0.3),
        y: height/2,
        size, font,
        color: rgb(0.7, 0.7, 0.7),
        opacity,
        rotate: { type: "degrees", angle: -45 },
      });
    });
    const bytes = await pdf.save();
    const base = files[i].name.replace(/\.pdf$/i, "");
    results.push({ blob: new Blob([bytes], { type: "application/pdf" }), name: `${base}_watermarked.pdf` });
    onProgress(Math.round(((i+1)/files.length)*100));
  }
  return results;
}

async function opPageNumbers(files, opts, onProgress) {
  const { PDFDocument, rgb, StandardFonts } = await loadPdfLib();
  const buf = await readAsArrayBuffer(files[0]);
  const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const pages = pdf.getPages();
  const pos = opts.position || "bottom-center";
  pages.forEach((p, i) => {
    const { width, height } = p.getSize();
    const label = opts.format === "page-only" ? `${i+1}` : `${i+1} / ${pages.length}`;
    const x = pos.includes("center") ? width/2 - 18
      : pos.includes("right") ? width - 60 : 20;
    const y = pos.includes("top") ? height - 30 : 22;
    p.drawText(label, { x, y, size: 10, font, color: rgb(0.45, 0.45, 0.45) });
    onProgress(20 + Math.round(((i+1)/pages.length)*75));
  });
  const bytes = await pdf.save();
  onProgress(100);
  return [{ blob: new Blob([bytes], { type: "application/pdf" }), name: "numbered.pdf" }];
}

async function opJpgToPdf(files, opts, onProgress) {
  const { PDFDocument } = await loadPdfLib();
  const pdf = await PDFDocument.create();
  for (let i = 0; i < files.length; i++) {
    const buf = await readAsArrayBuffer(files[i]);
    let img;
    try {
      if (files[i].type === "image/png") img = await pdf.embedPng(buf);
      else img = await pdf.embedJpg(buf);
    } catch(e) { throw new Error(`Cannot embed "${files[i].name}": unsupported format.`); }
    const page = pdf.addPage([img.width, img.height]);
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
    onProgress(Math.round(((i+1)/files.length)*92));
  }
  const bytes = await pdf.save();
  onProgress(100);
  return [{ blob: new Blob([bytes], { type: "application/pdf" }), name: "converted.pdf" }];
}

async function opOrganize(files, opts, onProgress) {
  const { PDFDocument } = await loadPdfLib();
  const buf = await readAsArrayBuffer(files[0]);
  const src = await PDFDocument.load(buf, { ignoreEncryption: true });
  onProgress(30);
  const order = opts.pageOrder || src.getPageIndices();
  const out = await PDFDocument.create();
  const copied = await out.copyPages(src, order);
  copied.forEach(p => out.addPage(p));
  onProgress(85);
  const bytes = await out.save();
  onProgress(100);
  return [{ blob: new Blob([bytes], { type: "application/pdf" }), name: "organized.pdf" }];
}

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
const getCSS = (t) => `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }

:root {
  --bg: ${t.bg};
  --surface: ${t.surface};
  --surface2: ${t.surface2};
  --surface3: ${t.surface3};
  --border: ${t.border};
  --border-hover: ${t.borderHover};
  --text: ${t.text};
  --muted: ${t.muted};
  --accent: ${t.accent};
  --accent2: ${t.accent2};
  --accent-rgb: ${t.accentRgb};
  --success: ${t.success};
  --success-bg: ${t.successBg};
  --success-border: ${t.successBorder};
  --success-text: ${t.successText};
  --error: ${t.error};
  --error-bg: ${t.errorBg};
  --error-border: ${t.errorBorder};
  --error-text: ${t.errorText};
  --shadow: ${t.shadow};
  --card-bg: ${t.cardBg};
}

body { background: var(--bg); color: var(--text); font-family: 'Inter', sans-serif; line-height: 1.5; -webkit-font-smoothing: antialiased; }

/* ── SCROLLBAR ── */
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(var(--accent-rgb),0.25); border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: rgba(var(--accent-rgb),0.45); }

/* ── LAYOUT ── */
.studio { min-height: 100vh; background: var(--bg); position: relative; overflow-x: hidden; }
.studio::before {
  content: '';
  position: fixed; top: 0; left: 0; right: 0; height: 60vh;
  background: ${t.glowGradient};
  pointer-events: none; z-index: 0;
}

/* ── NAV ── */
.nav {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 32px; height: 58px;
  border-bottom: 1px solid var(--border);
  position: sticky; top: 0; z-index: 200;
  background: rgba(${t.bg.replace('#','').match(/.{2}/g).map(h=>parseInt(h,16)).join(',')},0.88);
  backdrop-filter: blur(24px) saturate(1.4);
}
.nav-left { display: flex; align-items: center; gap: 10px; }
.nav-logo {
  font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 1.1rem;
  letter-spacing: -0.025em; cursor: pointer;
  background: linear-gradient(135deg, var(--text) 20%, var(--accent2));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  transition: opacity 0.2s;
}
.nav-logo:hover { opacity: 0.8; }
.nav-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--success); box-shadow: 0 0 8px var(--success);
  animation: pulse-dot 2.5s ease-in-out infinite;
}
@keyframes pulse-dot { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.6; transform:scale(0.85); } }

.nav-right { display: flex; align-items: center; gap: 10px; }
.kbd-hint { 
  font-size: 0.68rem; color: var(--muted); padding: 3px 8px;
  border: 1px solid var(--border); border-radius: 6px;
  font-family: 'Plus Jakarta Sans', sans-serif; letter-spacing: 0.04em;
  cursor: pointer; transition: all 0.2s;
}
.kbd-hint:hover { border-color: var(--border-hover); color: var(--text); }

/* ── THEME SWITCHER ── */
.theme-switcher { display: flex; gap: 4px; }
.theme-btn {
  width: 28px; height: 28px; border-radius: 8px; border: 1px solid var(--border);
  background: var(--surface2); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.75rem; transition: all 0.2s;
  position: relative; overflow: hidden;
}
.theme-btn.active { border-color: rgba(var(--accent-rgb),0.5); background: rgba(var(--accent-rgb),0.1); }
.theme-btn:hover { border-color: var(--border-hover); }

/* ── PRIVACY BANNER ── */
.privacy-banner {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 8px 24px;
  background: var(--success-bg);
  border-bottom: 1px solid var(--success-border);
  font-size: 0.75rem; color: var(--success-text);
  font-weight: 500;
}
.privacy-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--success); flex-shrink: 0; }

/* ── HERO ── */
.hero {
  padding: 80px 40px 64px;
  text-align: center; position: relative; z-index: 1;
}
.hero-eyebrow {
  display: inline-flex; align-items: center; gap: 7px;
  font-size: 0.72rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
  color: rgba(var(--accent-rgb),0.9);
  background: rgba(var(--accent-rgb),0.07);
  border: 1px solid rgba(var(--accent-rgb),0.18);
  padding: 6px 14px; border-radius: 100px; margin-bottom: 24px;
}
.hero-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 700;
  font-size: clamp(2.2rem, 5.5vw, 4rem);
  line-height: 1.04;
  letter-spacing: -0.02em;
  margin-bottom: 18px;
  color: var(--text);
}
.hero-title .grad {
  background: linear-gradient(135deg, var(--accent) 10%, var(--accent2) 90%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.hero-sub {
  color: var(--muted); font-size: 1.05rem; max-width: 440px;
  margin: 0 auto 36px; font-weight: 300; line-height: 1.65;
}
.hero-cta-row { display: flex; gap: 10px; justify-content: center; align-items: center; flex-wrap: wrap; }
.privacy-pill {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 9px 18px; border-radius: 100px;
  background: var(--success-bg); border: 1px solid var(--success-border);
  color: var(--success-text); font-size: 0.8rem; font-weight: 500;
}

/* ── SEARCH BAR ── */
.search-wrap { max-width: 440px; margin: 0 auto 48px; position: relative; z-index: 1; }
.search-input {
  width: 100%; padding: 12px 44px 12px 44px;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 14px; color: var(--text); font-size: 0.875rem;
  font-family: 'Instrument Sans', sans-serif;
  outline: none; transition: all 0.25s;
}
.search-input:focus { border-color: rgba(var(--accent-rgb),0.4); box-shadow: 0 0 0 3px rgba(var(--accent-rgb),0.07); }
.search-input::placeholder { color: var(--muted); }
.search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--muted); font-size: 1rem; pointer-events: none; }
.search-clear { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--muted); cursor: pointer; font-size: 0.9rem; transition: color 0.2s; }
.search-clear:hover { color: var(--text); }

/* ── SECTION ── */
.section { padding: 0 40px 64px; max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; }
.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
.section-label {
  font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.68rem; font-weight: 700;
  letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted);
}
.section-count {
  font-size: 0.72rem; color: var(--muted);
  background: var(--surface2); border: 1px solid var(--border);
  padding: 3px 9px; border-radius: 100px;
}

/* ── TOOLS GRID ── */
.tools-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
.tool-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 22px;
  cursor: pointer;
  transition: all 0.22s cubic-bezier(0.4,0,0.2,1);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 0;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}
.tool-card::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(135deg, var(--card-accent-color,transparent) 0%, transparent 55%);
  opacity: 0; transition: opacity 0.3s; border-radius: inherit;
}
.tool-card:hover { border-color: var(--border-hover); transform: translateY(-3px); box-shadow: var(--shadow); }
.tool-card:hover::after { opacity: 0.05; }
.tool-card:active { transform: translateY(-1px); }
.tool-card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 14px; }
.tool-icon {
  font-size: 1.4rem; width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 10px; background: var(--surface2);
  border: 1px solid var(--border);
  transition: transform 0.2s;
}
.tool-card:hover {
  border-color: var(--border-hover);
  transform: translateY(-4px);
  box-shadow: 0 12px 35px rgba(0,0,0,0.25);
}

.tool-card:hover .tool-icon {
  transform: scale(1.08);
}
.tool-kbd {
  font-size: 0.62rem; font-weight: 600;
  background: var(--surface3); border: 1px solid var(--border);
  padding: 2px 7px; border-radius: 5px; color: var(--muted);
  font-family: 'Plus Jakarta Sans', sans-serif;
}
.tool-name { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 0.9rem; margin-bottom: 5px; }
.tool-desc { font-size: 0.77rem; color: var(--muted); line-height: 1.45; }
.tool-arrow {
  position: absolute; right: 18px; bottom: 18px;
  font-size: 0.9rem; color: var(--muted);
  opacity: 0; transition: all 0.2s;
  transform: translateX(-6px);
}
.tool-card:hover .tool-arrow { opacity: 1; transform: translateX(0); }

/* ── TOOL PAGE ── */
.tool-page { max-width: 900px; margin: 0 auto; padding: 44px 32px; position: relative; z-index: 1; }
.tool-page-header { margin-bottom: 36px; }
.back-btn {
  display: inline-flex; align-items: center; gap: 7px;
  color: var(--muted); font-size: 0.82rem; cursor: pointer;
  background: none; border: none; margin-bottom: 28px;
  padding: 7px 12px; border-radius: 8px;
  transition: all 0.18s;
}
.back-btn:hover { background: var(--surface2); color: var(--text); }
.tool-page-title {
  display: flex; align-items: center; gap: 14px; margin-bottom: 8px;
}
.tool-page-icon {
  width: 48px; height: 48px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.6rem; flex-shrink: 0;
  background: var(--surface2); border: 1px solid var(--border);
}
.tool-page-title h1 {
  font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800;
  font-size: 1.8rem; letter-spacing: -0.02em;
}
.tool-page-sub { color: var(--muted); font-size: 0.88rem; margin-left: 62px; }
.tool-privacy-badge {
  display: inline-flex; align-items: center; gap: 6px;
  margin-top: 16px; margin-left: 62px;
  padding: 5px 12px; border-radius: 100px;
  background: var(--success-bg); border: 1px solid var(--success-border);
  color: var(--success-text); font-size: 0.72rem; font-weight: 500;
}

/* ── UNDO BAR ── */
.undo-bar {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 18px;
}
.undo-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 14px; border-radius: 8px;
  background: var(--surface2); border: 1px solid var(--border);
  color: var(--muted); font-size: 0.78rem; cursor: pointer;
  font-family: 'Instrument Sans', sans-serif;
  transition: all 0.18s;
}
.undo-btn:hover:not(:disabled) { border-color: var(--border-hover); color: var(--text); }
.undo-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.history-count { font-size: 0.72rem; color: var(--muted); }

/* ── DROPZONE ── */
.dropzone {
  border: 2px dashed var(--border);
  border-radius: 20px; padding: 52px 40px;
  text-align: center; cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
  background: var(--surface); position: relative; overflow: hidden;
}
.dropzone.over {
  border-color: rgba(var(--accent-rgb),0.6);
  background: rgba(var(--accent-rgb),0.04);
  box-shadow: 0 0 0 5px rgba(var(--accent-rgb),0.05), inset 0 0 40px rgba(var(--accent-rgb),0.03);
}
.dropzone:hover { border-color: rgba(var(--accent-rgb),0.35); background: rgba(var(--accent-rgb),0.02); }
.dropzone-ripple {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(circle at var(--rx,50%) var(--ry,50%), rgba(var(--accent-rgb),0.08) 0%, transparent 60%);
  opacity: 0; transition: opacity 0.4s;
}
.dropzone.over .dropzone-ripple { opacity: 1; }
.dropzone-icon { font-size: 2.2rem; margin-bottom: 14px; display: block; transition: transform 0.3s; }
.dropzone:hover .dropzone-icon { transform: scale(1.05) translateY(-2px); }
.dropzone.over .dropzone-icon { transform: scale(1.12) translateY(-4px); }
.dropzone h3 { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 1rem; margin-bottom: 6px; }
.dropzone p { color: var(--muted); font-size: 0.8rem; }
.dropzone-sup {
  margin-top: 12px; font-size: 0.7rem; color: var(--muted);
  display: flex; align-items: center; justify-content: center; gap: 8px;
}
.dropzone-sup span {
  padding: 2px 8px; border-radius: 4px;
  background: var(--surface2); border: 1px solid var(--border);
}

/* ── FILE LIST ── */
.file-list { margin-top: 16px; display: flex; flex-direction: column; gap: 7px; }
.file-item {
  display: flex; align-items: center; gap: 11px;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px; padding: 10px 14px;
  transition: all 0.18s;
  animation: slideIn 0.22s cubic-bezier(0.4,0,0.2,1);
}
@keyframes slideIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
.file-item:hover { border-color: var(--border-hover); }
.file-item-icon {
  width: 34px; height: 34px; flex-shrink: 0;
  background: rgba(var(--accent-rgb),0.08);
  border-radius: 8px; display: flex; align-items: center;
  justify-content: center; font-size: 0.95rem;
}
.file-item-info { flex: 1; min-width: 0; }
.file-item-name { font-size: 0.83rem; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.file-item-meta { display: flex; gap: 10px; margin-top: 2px; align-items: center; }
.file-item-size {
  font-size: 0.7rem; color: var(--muted);
  background: var(--surface2); padding: 1px 7px; border-radius: 4px;
  border: 1px solid var(--border);
}
.file-item-type { font-size: 0.7rem; color: var(--muted); }
.file-item-remove {
  background: none; border: none; cursor: pointer;
  color: var(--muted); font-size: 0.9rem;
  width: 26px; height: 26px; border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s; flex-shrink: 0;
}
.file-item-remove:hover { background: var(--error-bg); color: var(--error); }
.file-count-badge {
  font-size: 0.72rem; color: var(--muted);
  margin: 10px 0 4px; display: flex; align-items: center; justify-content: space-between;
}
.file-count-total {
  font-size: 0.72rem; font-weight: 600;
  padding: 2px 9px; border-radius: 100px;
  background: rgba(var(--accent-rgb),0.08);
  border: 1px solid rgba(var(--accent-rgb),0.15);
  color: rgba(var(--accent-rgb),0.9);
}

/* ── OPTIONS PANEL ── */
.options-panel {
  margin-top: 20px;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 16px; padding: 22px 24px;
}
.options-panel-header {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 18px;
}
.options-panel-label {
  font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700;
  font-size: 0.7rem; text-transform: uppercase;
  letter-spacing: 0.12em; color: var(--muted);
}
.option-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
.option-field { display: flex; flex-direction: column; gap: 7px; }
.option-field-label { font-size: 0.77rem; color: var(--muted); font-weight: 500; }
.option-input {
  background: var(--surface2); border: 1px solid var(--border);
  border-radius: 9px; color: var(--text);
  padding: 9px 13px; font-size: 0.83rem;
  font-family: 'Instrument Sans', sans-serif;
  outline: none; transition: border-color 0.2s, box-shadow 0.2s;
  width: 100%;
}
.option-input:focus { border-color: rgba(var(--accent-rgb),0.45); box-shadow: 0 0 0 3px rgba(var(--accent-rgb),0.07); }
.seg-btns { display: flex; gap: 5px; flex-wrap: wrap; }
.seg-btn {
  padding: 7px 14px; border-radius: 8px;
  border: 1px solid var(--border); background: var(--surface2);
  color: var(--muted); font-size: 0.78rem; cursor: pointer;
  transition: all 0.15s; font-family: 'Instrument Sans', sans-serif;
}
.seg-btn.active {
  background: rgba(var(--accent-rgb),0.12);
  border-color: rgba(var(--accent-rgb),0.35);
  color: var(--accent);
}
.seg-btn:hover:not(.active) { border-color: var(--border-hover); color: var(--text); }

/* ── COMPRESS LEVEL ── */
.compress-levels { display: flex; gap: 8px; }
.compress-level-card {
  flex: 1; padding: 14px 12px; border-radius: 12px;
  border: 1px solid var(--border); background: var(--surface2);
  cursor: pointer; transition: all 0.18s; text-align: center;
}
.compress-level-card.active {
  border-color: rgba(var(--accent-rgb),0.4);
  background: rgba(var(--accent-rgb),0.07);
}
.compress-level-card:hover:not(.active) { border-color: var(--border-hover); }
.compress-level-icon { font-size: 1.3rem; margin-bottom: 6px; }
.compress-level-name { font-size: 0.78rem; font-weight: 600; font-family: 'Plus Jakarta Sans', sans-serif; margin-bottom: 3px; }
.compress-level-desc { font-size: 0.68rem; color: var(--muted); }

/* ── ACTIONS ── */
.actions { margin-top: 24px; display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.btn-primary {
  padding: 12px 26px;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  border: none; border-radius: 12px; color: #fff;
  font-size: 0.875rem; font-weight: 600; cursor: pointer;
  font-family: 'Plus Jakarta Sans', sans-serif; letter-spacing: 0.01em;
  transition: all 0.2s; box-shadow: 0 4px 18px rgba(var(--accent-rgb),0.28);
  display: flex; align-items: center; gap: 7px;
}
.btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 26px rgba(var(--accent-rgb),0.38); }
.btn-primary:active:not(:disabled) { transform: translateY(0); }
.btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }
.btn-ghost {
  padding: 12px 18px; background: var(--surface2);
  border: 1px solid var(--border); border-radius: 12px;
  color: var(--muted); font-size: 0.83rem; cursor: pointer;
  font-family: 'Instrument Sans', sans-serif; transition: all 0.18s;
  display: flex; align-items: center; gap: 6px;
}
.btn-ghost:hover { border-color: var(--border-hover); color: var(--text); }
.btn-download {
  padding: 12px 22px;
  background: var(--success-bg); border: 1px solid var(--success-border);
  border-radius: 12px; color: var(--success-text);
  font-size: 0.875rem; font-weight: 600; cursor: pointer;
  font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s;
  display: flex; align-items: center; gap: 7px;
}
.btn-download:hover { filter: brightness(1.08); transform: translateY(-1px); }

/* ── PROGRESS ── */
.progress-wrap { margin-top: 20px; }
.progress-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.progress-label { font-size: 0.78rem; color: var(--muted); display: flex; align-items: center; gap: 7px; }
.progress-spinner {
  width: 12px; height: 12px; border-radius: 50%;
  border: 2px solid rgba(var(--accent-rgb),0.2);
  border-top-color: var(--accent);
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.progress-pct { font-size: 0.78rem; font-weight: 600; color: var(--accent); }
.progress-track {
  background: var(--surface2); border-radius: 100px; height: 5px; overflow: hidden;
}
.progress-fill {
  height: 100%; border-radius: 100px;
  background: linear-gradient(90deg, var(--accent), var(--accent2));
  transition: width 0.35s cubic-bezier(0.4,0,0.2,1);
  box-shadow: 0 0 10px rgba(var(--accent-rgb),0.4);
}

/* ── RESULTS ── */
.result-success {
  margin-top: 20px; border-radius: 16px; overflow: hidden;
  border: 1px solid var(--success-border);
  animation: fadeUp 0.3s cubic-bezier(0.4,0,0.2,1);
}
.result-success-header {
  background: var(--success-bg); padding: 16px 20px;
  display: flex; align-items: center; gap: 12px;
}
.result-success-icon { font-size: 1.4rem; }
.result-success-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.95rem; font-weight: 700; color: var(--success-text); }
.result-success-sub { font-size: 0.75rem; color: var(--muted); margin-top: 2px; }
.result-items { background: var(--surface); }
.result-item {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 20px; border-top: 1px solid var(--border);
  transition: background 0.15s;
}
.result-item:hover { background: var(--surface2); }
.result-item-icon { font-size: 1rem; }
.result-item-info { flex: 1; min-width: 0; }
.result-item-name { font-size: 0.83rem; font-weight: 500; }
.result-item-meta { font-size: 0.7rem; color: var(--muted); margin-top: 2px; display: flex; gap: 8px; }
.result-item-savings {
  font-size: 0.68rem; padding: 2px 7px; border-radius: 4px;
  background: var(--success-bg); color: var(--success-text);
  border: 1px solid var(--success-border);
}
.result-item-dl {
  background: none; border: 1px solid var(--border); border-radius: 8px;
  color: var(--muted); padding: 6px 12px; font-size: 0.75rem;
  cursor: pointer; transition: all 0.15s; font-family: 'Instrument Sans', sans-serif;
}
.result-item-dl:hover { border-color: var(--success-border); color: var(--success-text); }

/* ── ERROR ── */
.error-box {
  margin-top: 16px; padding: 14px 18px; border-radius: 12px;
  background: var(--error-bg); border: 1px solid var(--error-border);
  color: var(--error-text); font-size: 0.83rem;
  display: flex; align-items: flex-start; gap: 10px;
  animation: fadeUp 0.25s ease;
}
.error-icon { flex-shrink: 0; font-size: 1rem; margin-top: 1px; }
.error-dismiss {
  background: none; border: none; cursor: pointer;
  color: var(--error-text); margin-left: auto; font-size: 0.85rem;
  opacity: 0.7; transition: opacity 0.15s; padding: 0 4px;
}
.error-dismiss:hover { opacity: 1; }

/* ── ORGANIZE ── */
.organize-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 10px; margin-top: 16px;
}
.page-thumb {
  background: var(--surface);
  border: 2px solid var(--border);
  border-radius: 12px; padding: 10px;
  cursor: grab; transition: all 0.18s;
  user-select: none; position: relative;
  text-align: center;
}
.page-thumb.dragging { opacity: 0.4; border-color: rgba(var(--accent-rgb),0.5); transform: scale(0.96); }
.page-thumb.drag-over { border-color: var(--accent); background: rgba(var(--accent-rgb),0.06); transform: scale(1.03); }
.page-thumb:hover { border-color: var(--border-hover); box-shadow: 0 4px 16px rgba(0,0,0,0.2); }
.page-thumb-canvas { width: 100%; aspect-ratio: 3/4; background: var(--surface2); border-radius: 6px; margin-bottom: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; }
.page-thumb-num { font-size: 0.7rem; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; color: var(--muted); }
.page-thumb-del {
  position: absolute; top: 5px; right: 5px;
  width: 20px; height: 20px; border-radius: 50%;
  background: var(--error-bg); border: 1px solid var(--error-border);
  color: var(--error-text); font-size: 0.65rem;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; opacity: 0; transition: opacity 0.15s;
}
.page-thumb:hover .page-thumb-del { opacity: 1; }

/* ── BATCH ── */
.batch-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; margin-bottom: 16px; }
.batch-file-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px; padding: 14px;
  display: flex; flex-direction: column; gap: 8px;
  position: relative; transition: all 0.18s;
}
.batch-file-card:hover { border-color: var(--border-hover); }
.batch-file-name { font-size: 0.8rem; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.batch-file-size { font-size: 0.7rem; color: var(--muted); }
.batch-file-status { font-size: 0.7rem; }
.batch-status-done { color: var(--success-text); }
.batch-status-error { color: var(--error-text); }
.batch-status-pending { color: var(--muted); }
.batch-status-running { color: var(--accent); }
.batch-mini-progress {
  height: 3px; background: var(--surface2); border-radius: 100px; overflow: hidden;
}
.batch-mini-fill { height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent2)); border-radius: 100px; transition: width 0.3s; }

/* ── KEYBOARD SHORTCUTS ── */
.shortcuts-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(0,0,0,0.7); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  animation: fadeIn 0.2s ease;
}
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
.shortcuts-modal {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 24px; padding: 32px;
  max-width: 480px; width: 90%;
  box-shadow: var(--shadow);
  animation: scaleIn 0.25s cubic-bezier(0.4,0,0.2,1);
}
@keyframes scaleIn { from { opacity:0; transform:scale(0.94); } to { opacity:1; transform:scale(1); } }
.shortcuts-title {
  font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800;
  font-size: 1.2rem; margin-bottom: 20px;
}
.shortcut-row { display: flex; align-items: center; justify-content: space-between; padding: 9px 0; border-bottom: 1px solid var(--border); }
.shortcut-row:last-child { border-bottom: none; }
.shortcut-desc { font-size: 0.83rem; color: var(--muted); }
.shortcut-keys { display: flex; gap: 4px; }
.shortcut-key {
  font-size: 0.7rem; font-weight: 700;
  padding: 3px 9px; border-radius: 6px;
  background: var(--surface2); border: 1px solid var(--border);
  font-family: 'Plus Jakarta Sans', sans-serif; color: var(--text);
}

/* ── TOAST ── */
.toast-area { position: fixed; bottom: 24px; right: 24px; z-index: 9998; display: flex; flex-direction: column; gap: 8px; }
.toast {
  padding: 12px 18px; border-radius: 12px;
  background: var(--surface); border: 1px solid var(--border);
  box-shadow: var(--shadow);
  font-size: 0.82rem; max-width: 320px;
  display: flex; align-items: center; gap: 10px;
  animation: toastIn 0.3s cubic-bezier(0.4,0,0.2,1);
}
@keyframes toastIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
.toast.success { border-color: var(--success-border); }
.toast.error { border-color: var(--error-border); }

/* ── ANIMATIONS ── */
@keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
.fade-up { animation: fadeUp 0.4s cubic-bezier(0.4,0,0.2,1) both; }
.fade-up-1 { animation-delay: 0.06s; }
.fade-up-2 { animation-delay: 0.12s; }
.fade-up-3 { animation-delay: 0.2s; }

/* ── FOOTER ── */
.footer {
  border-top: 1px solid var(--border); padding: 40px;
  text-align: center; color: var(--muted);
  font-size: 0.75rem; margin-top: 64px; position: relative; z-index: 1;
}
.footer-logo { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 1rem; color: var(--text); margin-bottom: 10px; }
.footer-features { display: flex; gap: 20px; justify-content: center; margin-top: 16px; flex-wrap: wrap; }
.footer-feature { display: flex; align-items: center; gap: 5px; color: var(--success-text); font-size: 0.72rem; }

/* ── RESPONSIVE ── */
@media (max-width: 680px) {
  .nav { padding: 0 16px; }
  .hero { padding: 52px 20px 40px; }
  .section { padding: 0 16px 48px; }
  .tool-page { padding: 28px 16px; }
  .tools-grid { grid-template-columns: 1fr 1fr; gap: 9px; }
  .tool-card { padding: 16px; }
  .tool-desc { display: none; }
  .compress-levels { flex-direction: column; }
  .shortcut-row .shortcut-desc { font-size: 0.78rem; }
  .kbd-hint { display: none; }
}
`;

// ─── TOAST ────────────────────────────────────────────────────────────────────
function ToastArea({ toasts }) {
  return (
    <div className="toast-area" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`} role="status">
          <span>{t.type === "success" ? "✓" : t.type === "error" ? "⚠" : "ℹ"}</span>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

// ─── KEYBOARD SHORTCUTS MODAL ─────────────────────────────────────────────────
function ShortcutsModal({ onClose }) {
  const shortcuts = [
    { desc: "Go home", keys: ["Esc"] },
    { desc: "Open Merge tool", keys: ["M"] },
    { desc: "Open Split tool", keys: ["S"] },
    { desc: "Open Compress tool", keys: ["C"] },
    { desc: "Open Rotate tool", keys: ["R"] },
    { desc: "Open Organize tool", keys: ["O"] },
    { desc: "Open Batch Process", keys: ["B"] },
    { desc: "Undo last action", keys: ["⌘", "Z"] },
    { desc: "Show shortcuts", keys: ["?"] },
    { desc: "Clear all files", keys: ["⌘", "⌫"] },
  ];
  return (
    <div className="shortcuts-overlay" onClick={onClose} role="dialog" aria-modal aria-label="Keyboard shortcuts">
      <div className="shortcuts-modal" onClick={e => e.stopPropagation()}>
        <div className="shortcuts-title">⌨ Keyboard Shortcuts</div>
        {shortcuts.map((s, i) => (
          <div className="shortcut-row" key={i}>
            <span className="shortcut-desc">{s.desc}</span>
            <div className="shortcut-keys">{s.keys.map((k, j) => <span className="shortcut-key" key={j}>{k}</span>)}</div>
          </div>
        ))}
        <div className="actions" style={{ marginTop: 20 }}>
          <button className="btn-ghost" onClick={onClose} style={{ width: "100%", justifyContent: "center" }}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ─── THEME SWITCHER ───────────────────────────────────────────────────────────
function ThemeSwitcher({ currentTheme, onChange }) {
  const icons = { dark: "🌑", light: "☀️", midnight: "🌌" };
  return (
    <div className="theme-switcher" role="group" aria-label="Choose theme">
      {Object.keys(THEMES).map(key => (
        <button
          key={key}
          className={`theme-btn${currentTheme === key ? " active" : ""}`}
          onClick={() => onChange(key)}
          title={THEMES[key].name}
          aria-label={`${THEMES[key].name} theme${currentTheme === key ? " (active)" : ""}`}
          aria-pressed={currentTheme === key}
        >
          {icons[key]}
        </button>
      ))}
    </div>
  );
}

// ─── DROPZONE ─────────────────────────────────────────────────────────────────
function Dropzone({ onFiles, accept = "pdf", multiple = false, label = "Drop PDFs here", hint = "" }) {
  const [over, setOver] = useState(false);
  const [ripple, setRipple] = useState({ x: 50, y: 50 });
  const inputRef = useRef();
  const acceptStr = accept === "pdf" ? ".pdf,application/pdf" : "image/*,.jpg,.jpeg,.png,.webp";

  const handle = (fileList) => {
    const arr = Array.from(fileList).filter(f => {
      if (accept === "pdf") return f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf");
      return f.type.startsWith("image/");
    });
    if (arr.length) onFiles(arr);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({ x: ((e.clientX - rect.left) / rect.width * 100), y: ((e.clientY - rect.top) / rect.height * 100) });
    setOver(true);
  };

  return (
    <div
      className={`dropzone${over ? " over" : ""}`}
      onClick={() => inputRef.current.click()}
      onDragOver={onDragOver}
      onDragLeave={() => setOver(false)}
      onDrop={e => { e.preventDefault(); setOver(false); handle(e.dataTransfer.files); }}
      role="button"
      tabIndex={0}
      aria-label={`Upload area: ${label}`}
      onKeyDown={e => e.key === "Enter" && inputRef.current.click()}
      style={{ "--rx": ripple.x + "%", "--ry": ripple.y + "%" }}
    >
      <div className="dropzone-ripple" />
      <span className="dropzone-icon" aria-hidden>📄</span>
      <h3>{label}</h3>
      <p>Click to browse, or drag & drop your files here</p>
      {hint && (
        <div className="dropzone-sup">
          <span>{hint}</span>
          {multiple && <span>Multiple files supported</span>}
        </div>
      )}
      <input ref={inputRef} type="file" accept={acceptStr} multiple={multiple} onChange={e => handle(e.target.files)} aria-hidden="true" />
    </div>
  );
}

// ─── FILE LIST ────────────────────────────────────────────────────────────────
function FileList({ files, onRemove, onClear }) {
  if (!files.length) return null;
  const totalSize = files.reduce((a, f) => a + f.size, 0);
  return (
    <div>
      <div className="file-count-badge">
        <span>{files.length} file{files.length > 1 ? "s" : ""} selected</span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span className="file-count-total">{formatBytes(totalSize)} total</span>
          {onClear && <button className="btn-ghost" style={{ padding: "2px 10px", fontSize: "0.7rem" }} onClick={onClear}>Clear all</button>}
        </div>
      </div>
      <div className="file-list" role="list" aria-label="Selected files">
        {files.map((f, i) => (
          <div className="file-item" key={i} role="listitem">
            <div className="file-item-icon" aria-hidden>📄</div>
            <div className="file-item-info">
              <div className="file-item-name" title={f.name}>{f.name}</div>
              <div className="file-item-meta">
                <span className="file-item-size">{formatBytes(f.size)}</span>
                <span className="file-item-type">{f.type || "application/pdf"}</span>
              </div>
            </div>
            <button className="file-item-remove" onClick={() => onRemove(i)} aria-label={`Remove ${f.name}`}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PROGRESS ─────────────────────────────────────────────────────────────────
function ProgressBar({ value, label = "Processing" }) {
  return (
    <div className="progress-wrap" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className="progress-header">
        <div className="progress-label">
          <div className="progress-spinner" aria-hidden />
          {label}…
        </div>
        <span className="progress-pct">{value}%</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: value + "%" }} />
      </div>
    </div>
  );
}

// ─── RESULTS ──────────────────────────────────────────────────────────────────
function ResultBox({ results, addToast }) {
  if (!results?.length) return null;
  const isMulti = results.length > 1;

  const downloadAll = () => {
    results.forEach(r => downloadBlob(r.blob, r.name));
    addToast("success", `Downloaded ${results.length} file${results.length > 1 ? "s" : ""}`);
  };

  return (
    <div className="result-success" role="alert" aria-live="polite">
      <div className="result-success-header">
        <span className="result-success-icon">✅</span>
        <div>
          <div className="result-success-title">
            {isMulti ? `${results.length} files ready` : "File ready to download"}
          </div>
          <div className="result-success-sub">
            {results.reduce((a, r) => a + r.blob.size, 0) > 0 && formatBytes(results.reduce((a, r) => a + r.blob.size, 0)) + " total"}
          </div>
        </div>
        {isMulti && (
          <button className="btn-download" style={{ marginLeft: "auto" }} onClick={downloadAll}>⬇ Download All</button>
        )}
      </div>
      <div className="result-items">
        {results.map((r, i) => (
          <div className="result-item" key={i}>
            <span className="result-item-icon">📄</span>
            <div className="result-item-info">
              <div className="result-item-name">{r.name}</div>
              <div className="result-item-meta">
                <span>{formatBytes(r.blob.size)}</span>
                {r.originalSize && r.blob.size < r.originalSize && (
                  <span className="result-item-savings">
                    ↓ {Math.round((1 - r.blob.size / r.originalSize) * 100)}% saved
                  </span>
                )}
              </div>
            </div>
            <button className="result-item-dl" onClick={() => { downloadBlob(r.blob, r.name); addToast("success", `Downloading ${r.name}`); }}>
              ⬇ Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ERROR BOX ────────────────────────────────────────────────────────────────
function ErrorBox({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div className="error-box" role="alert">
      <span className="error-icon" aria-hidden>⚠️</span>
      <span>{message}</span>
      <button className="error-dismiss" onClick={onDismiss} aria-label="Dismiss error">✕</button>
    </div>
  );
}

// ─── GENERIC TOOL WRAPPER ─────────────────────────────────────────────────────
function useToolState(isBatch = false) {
  const [filesHistory, setFilesHistory] = useState(createHistory([]));
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState({});

  const files = filesHistory.present;

  const setFiles = useCallback((fn) => {
    setFilesHistory(h => historyPush(h, typeof fn === "function" ? fn(h.present) : fn));
  }, []);

  const undo = useCallback(() => setFilesHistory(h => historyUndo(h)), []);
  const redo = useCallback(() => setFilesHistory(h => historyRedo(h)), []);
  const canUndo = filesHistory.past.length > 0;
  const canRedo = filesHistory.future.length > 0;

  const clearAll = () => { setFiles([]); setResults(null); setError(null); setProgress(0); };
  const addFile = (newFiles) => setFiles(prev => isBatch ? [...prev, ...newFiles] : newFiles.slice(0, 1));
  const addFiles = (newFiles) => setFiles(prev => [...prev, ...newFiles]);
  const removeFile = (i) => setFiles(prev => prev.filter((_, idx) => idx !== i));

  const run = async (opFn) => {
    if (!files.length) { setError("Please add at least one file."); return; }
    setError(null); setProcessing(true); setProgress(0); setResults(null);
    try {
      const res = await opFn(files, options, setProgress);
      setResults(res);
    } catch (e) {
      setError(e.message || "An unexpected error occurred. Please try again.");
    }
    setProcessing(false);
  };

  return {
  files,
  setFiles,
  addFile,
  addFiles,
  removeFile,
  clearAll,
  processing,
  setProcessing,
  progress,
  setProgress,
  results,
  setResults,
  error,
  setError,
  options,
  setOptions,
  run,
  undo,
  redo,
  canUndo,
  canRedo
};
}

// ─── ORGANIZE TOOL (drag reorder) ─────────────────────────────────────────────
function OrganizeTool({ addToast }) {
  const s = useToolState(false);
  const [pages, setPages] = useState([]);
  const [pagesHistory, setPagesHistory] = useState(createHistory([]));
  const dragIdx = useRef(null);

  const pageList = pagesHistory.present;

  const handleFile = async (newFiles) => {
    s.addFile(newFiles);
    const { PDFDocument } = await loadPdfLib().catch(() => null) || {};
    if (!PDFDocument) return;
    try {
      const buf = await readAsArrayBuffer(newFiles[0]);
      const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
      const count = pdf.getPageCount();
      const initial = Array.from({ length: count }, (_, i) => ({ id: i, label: `Page ${i + 1}`, origIdx: i }));
      setPagesHistory(createHistory(initial));
    } catch (e) { s.setError("Could not read PDF pages: " + e.message); }
  };

  const setPageList = (fn) => {
    setPagesHistory(h => historyPush(h, typeof fn === "function" ? fn(h.present) : fn));
  };

  const handleDragStart = (i) => { dragIdx.current = i; };
  const handleDragOver = (e, i) => { e.preventDefault(); };
  const handleDrop = (e, i) => {
    e.preventDefault();
    if (dragIdx.current === null || dragIdx.current === i) return;
    setPageList(prev => {
      const arr = [...prev];
      const [moved] = arr.splice(dragIdx.current, 1);
      arr.splice(i, 0, moved);
      return arr;
    });
    dragIdx.current = null;
  };
  const removePage = (i) => setPageList(prev => prev.filter((_, idx) => idx !== i));

  const doOrganize = async () => {
    if (!s.files.length) { s.setError("Please add a PDF."); return; }
    s.setError(null); s.setProcessing(true); s.setProgress(0);
    try {
      const order = pageList.map(p => p.origIdx);
      const res = await opOrganize(s.files, { pageOrder: order }, s.setProgress);
      s.setResults(res);
      addToast("success", "PDF organized successfully");
    } catch(e) { s.setError(e.message); }
    s.setProcessing(false);
  };

  const undoPages = () => setPagesHistory(h => historyUndo(h));
  const redoPages = () => setPagesHistory(h => historyRedo(h));

  return (
    <div>
      {!s.files.length ? (
        <Dropzone onFiles={handleFile} multiple={false} label="Drop a PDF to organize its pages" hint="Drag pages to reorder" />
      ) : (
        <>
          <div className="undo-bar">
            <button className="undo-btn" onClick={undoPages} disabled={!pagesHistory.past.length} aria-label="Undo page reorder">
              ↩ Undo
            </button>
            <button className="undo-btn" onClick={redoPages} disabled={!pagesHistory.future.length} aria-label="Redo page reorder">
              ↪ Redo
            </button>
            <span className="history-count">{pageList.length} pages</span>
            <button className="btn-ghost" style={{ marginLeft: "auto", padding: "5px 12px", fontSize: "0.75rem" }} onClick={s.clearAll}>
              Remove file
            </button>
          </div>
          <div style={{ fontFamily: "Syne,sans-serif", fontSize: "0.72rem", color: "var(--muted)", marginBottom: "10px" }}>
            Drag pages to reorder · Click ✕ to delete
          </div>
          <div className="organize-grid" role="list" aria-label="PDF pages">
            {pageList.map((pg, i) => (
              <div
                key={pg.id}
                className="page-thumb"
                draggable
                onDragStart={() => handleDragStart(i)}
                onDragOver={e => handleDragOver(e, i)}
                onDrop={e => handleDrop(e, i)}
                role="listitem"
                aria-label={`${pg.label}, position ${i + 1}`}
              >
                <canvas
  ref={(el) => renderThumbnail(el, s.files[0], pg.origIdx)}
  className="page-thumb-canvas"
/>
                <div className="page-thumb-num">{i + 1}</div>
                <button className="page-thumb-del" onClick={() => removePage(i)} aria-label={`Delete page ${i + 1}`}>✕</button>
              </div>
            ))}
          </div>
        </>
      )}
      <ErrorBox message={s.error} onDismiss={() => s.setError(null)} />
      {s.processing && <ProgressBar value={s.progress} label="Organizing pages" />}
      <ResultBox results={s.results} addToast={addToast} />
      <div className="actions">
        <button className="btn-primary" onClick={doOrganize} disabled={s.processing || !pageList.length} aria-label="Apply page organization">
          ⊟ Apply Order
        </button>
        {s.files.length > 0 && <button className="btn-ghost" onClick={s.clearAll}>Clear</button>}
      </div>
    </div>
  );
}

// ─── BATCH TOOL ───────────────────────────────────────────────────────────────
function BatchTool({ addToast }) {
  const [files, setFiles] = useState([]);
  const [op, setOp] = useState("compress");
  const [options, setOptions] = useState({ level: "balanced", degrees: "90" });
  const [statuses, setStatuses] = useState({});
  const [processing, setProcessing] = useState(false);

  const addFiles = (newFiles) => setFiles(prev => [...prev, ...newFiles]);
  const removeFile = (i) => setFiles(prev => prev.filter((_, idx) => idx !== i));

  const runBatch = async () => {
    if (!files.length) return;
    setProcessing(true);
    const fns = { compress: opCompress, rotate: opRotate, watermark: opWatermark };
    const fn = fns[op];
    if (!fn) { setProcessing(false); return; }

    for (let i = 0; i < files.length; i++) {
      setStatuses(s => ({ ...s, [i]: { status: "running", progress: 0 } }));
      try {
        const res = await fn([files[i]], options, (p) => {
          setStatuses(s => ({ ...s, [i]: { status: "running", progress: p } }));
        });
        downloadBlob(res[0].blob, res[0].name);
        setStatuses(s => ({ ...s, [i]: { status: "done" } }));
      } catch(e) {
        setStatuses(s => ({ ...s, [i]: { status: "error", msg: e.message } }));
      }
    }
    addToast("success", `Batch ${op} complete!`);
    setProcessing(false);
  };

  const ops = [
    { id: "compress", label: "Compress" },
    { id: "rotate", label: "Rotate" },
    { id: "watermark", label: "Watermark" },
  ];

  return (
    <div>
      <Dropzone onFiles={addFiles} multiple label="Drop multiple PDFs to batch process" hint=".pdf files" />
      <FileList files={files} onRemove={removeFile} onClear={() => setFiles([])} />

      <div className="options-panel" style={{ marginTop: 20 }}>
        <div className="options-panel-header">
          <span className="options-panel-label">Batch Operation</span>
        </div>
        <div className="seg-btns" style={{ marginBottom: 16 }}>
          {ops.map(o => (
            <button key={o.id} className={`seg-btn${op === o.id ? " active" : ""}`} onClick={() => setOp(o.id)}>{o.label}</button>
          ))}
        </div>
        {op === "watermark" && (
          <div className="option-field">
            <label className="option-field-label">Watermark text</label>
            <input className="option-input" value={options.watermarkText || ""} onChange={e => setOptions(o => ({ ...o, watermarkText: e.target.value }))} placeholder="CONFIDENTIAL" />
          </div>
        )}
        {op === "rotate" && (
          <div className="seg-btns">
            {["90", "180", "270"].map(d => (
              <button key={d} className={`seg-btn${options.degrees === d ? " active" : ""}`} onClick={() => setOptions(o => ({ ...o, degrees: d }))}>{d}°</button>
            ))}
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className="batch-grid" style={{ marginTop: 16 }}>
          {files.map((f, i) => {
            const st = statuses[i];
            return (
              <div className="batch-file-card" key={i}>
                <div className="batch-file-name" title={f.name}>📄 {f.name}</div>
                <div className="batch-file-size">{formatBytes(f.size)}</div>
                {st && (
                  <>
                    <div className={`batch-file-status batch-status-${st.status}`}>
                      {st.status === "done" && "✓ Done"}
                      {st.status === "error" && "✕ Error"}
                      {st.status === "running" && `Processing ${st.progress}%`}
                      {st.status === "pending" && "Pending"}
                    </div>
                    {st.status === "running" && (
                      <div className="batch-mini-progress">
                        <div className="batch-mini-fill" style={{ width: st.progress + "%" }} />
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="actions">
        <button className="btn-primary" onClick={runBatch} disabled={processing || !files.length}>
          {processing ? "⊠ Processing…" : `⊠ Batch ${op.charAt(0).toUpperCase() + op.slice(1)} (${files.length})`}
        </button>
      </div>
    </div>
  );
}

// ─── STANDARD TOOL FACTORY ────────────────────────────────────────────────────
function StandardTool({ toolId, multiple = false, accept = "pdf", label, hint, opFn, progressLabel, children, addToast }) {
  const s = useToolState(multiple);

  const doRun = async () => {
    await s.run(opFn);
    if (s.results) addToast("success", "Done! File ready to download.");
  };

  // We re-check after run
  const [ran, setRan] = useState(false);
  const handleRun = async () => {
    s.setError(null); s.setProcessing(true); s.setProgress(0); s.setResults(null);
    if (!s.files.length) { s.setError("Please add at least one file."); s.setProcessing(false); return; }
    try {
      const res = await opFn(s.files, s.options, s.setProgress);
      s.setResults(res);
      addToast("success", "Done! File ready to download.");
    } catch(e) { s.setError(e.message || "An error occurred."); }
    s.setProcessing(false);
  };

  return (
    <div>
      <div className="undo-bar">
        <button className="undo-btn" onClick={s.undo} disabled={!s.canUndo} aria-label="Undo file change">↩ Undo</button>
        <button className="undo-btn" onClick={s.redo} disabled={!s.canRedo} aria-label="Redo file change">↪ Redo</button>
        {s.files.length > 0 && <span className="history-count">{s.files.length} file{s.files.length > 1 ? "s" : ""}</span>}
      </div>
      <Dropzone onFiles={multiple ? s.addFiles : s.addFile} multiple={multiple} accept={accept} label={label} hint={hint} />
      <FileList files={s.files} onRemove={s.removeFile} onClear={s.clearAll} />
      {children && <div>{children(s)}</div>}
      <ErrorBox message={s.error} onDismiss={() => s.setError(null)} />
      {s.processing && <ProgressBar value={s.progress} label={progressLabel} />}
      <ResultBox results={s.results} addToast={addToast} />
      <div className="actions">
        <button className="btn-primary" onClick={handleRun} disabled={s.processing || !s.files.length}>
          {s.processing ? "Processing…" : "▶ Run"}
        </button>
        {s.files.length > 0 && <button className="btn-ghost" onClick={s.clearAll}>Clear</button>}
      </div>
    </div>
  );
}

// ─── INDIVIDUAL TOOL PAGES ────────────────────────────────────────────────────
function MergeTool({ addToast }) {
  const s = useToolState(true);
  const handleRun = async () => {
    if (s.files.length < 2) { s.setError("Add at least 2 PDFs to merge."); return; }
    s.setError(null); s.setProcessing(true); s.setProgress(0); s.setResults(null);
    try { const r = await opMerge(s.files, s.options, s.setProgress); s.setResults(r); addToast("success", "Merge complete!"); }
    catch(e) { s.setError(e.message); } s.setProcessing(false);
  };
  return (
    <div>
      <div className="undo-bar">
        <button className="undo-btn" onClick={s.undo} disabled={!s.canUndo}>↩ Undo</button>
        <button className="undo-btn" onClick={s.redo} disabled={!s.canRedo}>↪ Redo</button>
        {s.files.length > 0 && <span className="history-count">{s.files.length} files · {formatBytes(s.files.reduce((a,f)=>a+f.size,0))}</span>}
      </div>
      <Dropzone onFiles={s.addFiles} multiple label="Drop PDFs to merge" hint=".pdf files" />
      <FileList files={s.files} onRemove={s.removeFile} onClear={s.clearAll} />
      <ErrorBox message={s.error} onDismiss={() => s.setError(null)} />
      {s.processing && <ProgressBar value={s.progress} label="Merging files" />}
      <ResultBox results={s.results} addToast={addToast} />
      <div className="actions">
        <button className="btn-primary" onClick={handleRun} disabled={s.processing || s.files.length < 2}>
          {s.processing ? "Merging…" : `⊕ Merge ${s.files.length > 0 ? s.files.length + " Files" : "PDFs"}`}
        </button>
        {s.files.length > 0 && <button className="btn-ghost" onClick={s.clearAll}>Clear all</button>}
      </div>
    </div>
  );
}

function SplitTool({ addToast }) {
  const s = useToolState(false);
  const handleRun = async () => {
    if (!s.files.length) { s.setError("Please add a PDF."); return; }
    s.setError(null); s.setProcessing(true); s.setProgress(0); s.setResults(null);
    try { const r = await opSplit(s.files, s.options, s.setProgress); s.setResults(r); addToast("success", `Split into ${r.length} pages`); }
    catch(e) { s.setError(e.message); } s.setProcessing(false);
  };
  const mode = s.options.splitMode || "all";
  return (
    <div>
      <div className="undo-bar">
        <button className="undo-btn" onClick={s.undo} disabled={!s.canUndo}>↩ Undo</button>
        <button className="undo-btn" onClick={s.redo} disabled={!s.canRedo}>↪ Redo</button>
      </div>
      <Dropzone onFiles={s.addFile} label="Drop a PDF to split" hint=".pdf file" />
      <FileList files={s.files} onRemove={s.removeFile} onClear={s.clearAll} />
      <div className="options-panel">
        <div className="options-panel-header"><span className="options-panel-label">Split Mode</span></div>
        <div className="seg-btns">
          {[["all","Every page"],["odd","Odd pages"],["even","Even pages"],["range","Page range"]].map(([v,l]) => (
            <button key={v} className={`seg-btn${mode === v ? " active" : ""}`} onClick={() => s.setOptions(o => ({ ...o, splitMode: v }))}>{l}</button>
          ))}
        </div>
        {mode === "range" && (
          <div style={{ display: "flex", gap: 10, marginTop: 14, alignItems: "center" }}>
            <span className="option-field-label">From</span>
            <input className="option-input" style={{ width: 80 }} type="number" min={1} value={s.options.rangeStart || 1} onChange={e => s.setOptions(o => ({ ...o, rangeStart: e.target.value }))} />
            <span className="option-field-label">to</span>
            <input className="option-input" style={{ width: 80 }} type="number" min={1} value={s.options.rangeEnd || ""} onChange={e => s.setOptions(o => ({ ...o, rangeEnd: e.target.value }))} placeholder="end" />
          </div>
        )}
      </div>
      <ErrorBox message={s.error} onDismiss={() => s.setError(null)} />
      {s.processing && <ProgressBar value={s.progress} label="Splitting PDF" />}
      <ResultBox results={s.results} addToast={addToast} />
      <div className="actions">
        <button className="btn-primary" onClick={handleRun} disabled={s.processing || !s.files.length}>
          {s.processing ? "Splitting…" : "⊘ Split PDF"}
        </button>
        {s.files.length > 0 && <button className="btn-ghost" onClick={s.clearAll}>Clear</button>}
      </div>
    </div>
  );
}

function CompressTool({ addToast }) {
  const s = useToolState(true);
  const level = s.options.level || "balanced";
  const handleRun = async () => {
    if (!s.files.length) { s.setError("Please add a PDF."); return; }
    s.setError(null); s.setProcessing(true); s.setProgress(0); s.setResults(null);
    try { const r = await opCompress(s.files, s.options, s.setProgress); s.setResults(r); addToast("success", "Compression complete!"); }
    catch(e) { s.setError(e.message); } s.setProcessing(false);
  };
  return (
    <div>
      <div className="undo-bar">
        <button className="undo-btn" onClick={s.undo} disabled={!s.canUndo}>↩ Undo</button>
        <button className="undo-btn" onClick={s.redo} disabled={!s.canRedo}>↪ Redo</button>
        {s.files.length > 0 && <span className="history-count">{s.files.length} file{s.files.length>1?"s":""}</span>}
      </div>
      <Dropzone onFiles={s.addFiles} multiple label="Drop PDFs to compress" hint="Multiple files supported" />
      <FileList files={s.files} onRemove={s.removeFile} onClear={s.clearAll} />
      <div className="options-panel">
        <div className="options-panel-header"><span className="options-panel-label">Compression Level</span></div>
        <div className="compress-levels">
          {[
            { id: "light",    icon: "🌿", name: "Light",    desc: "Preserve quality" },
            { id: "balanced", icon: "⚖️", name: "Balanced", desc: "Best tradeoff" },
            { id: "maximum",  icon: "🗜️", name: "Maximum",  desc: "Smallest size" },
          ].map(l => (
            <div key={l.id} className={`compress-level-card${level === l.id ? " active" : ""}`} onClick={() => s.setOptions(o => ({ ...o, level: l.id }))} role="radio" aria-checked={level === l.id} tabIndex={0} onKeyDown={e => e.key === "Enter" && s.setOptions(o => ({ ...o, level: l.id }))}>
              <div className="compress-level-icon">{l.icon}</div>
              <div className="compress-level-name">{l.name}</div>
              <div className="compress-level-desc">{l.desc}</div>
            </div>
          ))}
        </div>
      </div>
      <ErrorBox message={s.error} onDismiss={() => s.setError(null)} />
      {s.processing && <ProgressBar value={s.progress} label="Compressing" />}
      <ResultBox results={s.results} addToast={addToast} />
      <div className="actions">
        <button className="btn-primary" onClick={handleRun} disabled={s.processing || !s.files.length}>
          {s.processing ? "Compressing…" : `◎ Compress ${s.files.length > 0 ? s.files.length + " File" + (s.files.length > 1 ? "s" : "") : "PDF"}`}
        </button>
        {s.files.length > 0 && <button className="btn-ghost" onClick={s.clearAll}>Clear</button>}
      </div>
    </div>
  );
}

function RotateTool({ addToast }) {
  const s = useToolState(true);
  const handleRun = async () => {
    if (!s.files.length) { s.setError("Please add a PDF."); return; }
    s.setError(null); s.setProcessing(true); s.setProgress(0); s.setResults(null);
    try { const r = await opRotate(s.files, s.options, s.setProgress); s.setResults(r); addToast("success", "Rotated!"); }
    catch(e) { s.setError(e.message); } s.setProcessing(false);
  };
  return (
    <div>
      <div className="undo-bar">
        <button className="undo-btn" onClick={s.undo} disabled={!s.canUndo}>↩ Undo</button>
        <button className="undo-btn" onClick={s.redo} disabled={!s.canRedo}>↪ Redo</button>
      </div>
      <Dropzone onFiles={s.addFiles} multiple label="Drop PDFs to rotate" hint="Multiple files supported" />
      <FileList files={s.files} onRemove={s.removeFile} onClear={s.clearAll} />
      <div className="options-panel">
        <div className="options-panel-header"><span className="options-panel-label">Rotation</span></div>
        <div className="seg-btns">
          {["90","180","270"].map(d => (
            <button key={d} className={`seg-btn${(s.options.degrees||"90") === d ? " active" : ""}`} onClick={() => s.setOptions(o => ({ ...o, degrees: d }))}>↻ {d}°</button>
          ))}
        </div>
      </div>
      <ErrorBox message={s.error} onDismiss={() => s.setError(null)} />
      {s.processing && <ProgressBar value={s.progress} label="Rotating pages" />}
      <ResultBox results={s.results} addToast={addToast} />
      <div className="actions">
        <button className="btn-primary" onClick={handleRun} disabled={s.processing || !s.files.length}>
          {s.processing ? "Rotating…" : "↻ Rotate PDF"}
        </button>
        {s.files.length > 0 && <button className="btn-ghost" onClick={s.clearAll}>Clear</button>}
      </div>
    </div>
  );
}

function WatermarkTool({ addToast }) {
  const s = useToolState(true);
  const handleRun = async () => {
    if (!s.files.length) { s.setError("Please add a PDF."); return; }
    if (!s.options.watermarkText?.trim()) { s.setError("Enter watermark text."); return; }
    s.setError(null); s.setProcessing(true); s.setProgress(0); s.setResults(null);
    try { const r = await opWatermark(s.files, s.options, s.setProgress); s.setResults(r); addToast("success", "Watermark added!"); }
    catch(e) { s.setError(e.message); } s.setProcessing(false);
  };
  return (
    <div>
      <div className="undo-bar">
        <button className="undo-btn" onClick={s.undo} disabled={!s.canUndo}>↩ Undo</button>
        <button className="undo-btn" onClick={s.redo} disabled={!s.canRedo}>↪ Redo</button>
      </div>
      <Dropzone onFiles={s.addFiles} multiple label="Drop PDFs to watermark" hint="Multiple files supported" />
      <FileList files={s.files} onRemove={s.removeFile} onClear={s.clearAll} />
      <div className="options-panel">
        <div className="options-panel-header"><span className="options-panel-label">Watermark Settings</span></div>
        <div className="option-grid">
          <div className="option-field">
            <label className="option-field-label" htmlFor="wm-text">Text</label>
            <input id="wm-text" className="option-input" value={s.options.watermarkText || ""} onChange={e => s.setOptions(o => ({ ...o, watermarkText: e.target.value }))} placeholder="CONFIDENTIAL" />
          </div>
          <div className="option-field">
            <label className="option-field-label" htmlFor="wm-size">Font size</label>
            <input id="wm-size" className="option-input" type="number" min={12} max={120} value={s.options.fontSize || 48} onChange={e => s.setOptions(o => ({ ...o, fontSize: e.target.value }))} />
          </div>
          <div className="option-field">
            <label className="option-field-label" htmlFor="wm-opacity">Opacity</label>
            <input id="wm-opacity" className="option-input" type="range" min={0.05} max={0.9} step={0.05} value={s.options.opacity || 0.3} onChange={e => s.setOptions(o => ({ ...o, opacity: e.target.value }))} />
            <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{Math.round((s.options.opacity||0.3)*100)}%</span>
          </div>
        </div>
      </div>
      <ErrorBox message={s.error} onDismiss={() => s.setError(null)} />
      {s.processing && <ProgressBar value={s.progress} label="Adding watermark" />}
      <ResultBox results={s.results} addToast={addToast} />
      <div className="actions">
        <button className="btn-primary" onClick={handleRun} disabled={s.processing || !s.files.length}>
          {s.processing ? "Adding…" : "◈ Add Watermark"}
        </button>
        {s.files.length > 0 && <button className="btn-ghost" onClick={s.clearAll}>Clear</button>}
      </div>
    </div>
  );
}

function PageNumbersTool({ addToast }) {
  const s = useToolState(false);
  const handleRun = async () => {
    if (!s.files.length) { s.setError("Please add a PDF."); return; }
    s.setError(null); s.setProcessing(true); s.setProgress(0); s.setResults(null);
    try { const r = await opPageNumbers(s.files, s.options, s.setProgress); s.setResults(r); addToast("success", "Page numbers added!"); }
    catch(e) { s.setError(e.message); } s.setProcessing(false);
  };
  return (
    <div>
      <div className="undo-bar">
        <button className="undo-btn" onClick={s.undo} disabled={!s.canUndo}>↩ Undo</button>
        <button className="undo-btn" onClick={s.redo} disabled={!s.canRedo}>↪ Redo</button>
      </div>
      <Dropzone onFiles={s.addFile} label="Drop a PDF to add page numbers" hint=".pdf file" />
      <FileList files={s.files} onRemove={s.removeFile} onClear={s.clearAll} />
      <div className="options-panel">
        <div className="options-panel-header"><span className="options-panel-label">Position</span></div>
        <div className="seg-btns" style={{ marginBottom: 12 }}>
          {[["bottom-center","Bottom center"],["bottom-right","Bottom right"],["top-center","Top center"]].map(([v,l]) => (
            <button key={v} className={`seg-btn${(s.options.position||"bottom-center") === v ? " active" : ""}`} onClick={() => s.setOptions(o => ({ ...o, position: v }))}>{l}</button>
          ))}
        </div>
        <div className="options-panel-header" style={{ marginTop: 12 }}><span className="options-panel-label">Format</span></div>
        <div className="seg-btns">
          {[["page-of-total","1 / 10"],["page-only","1"]].map(([v,l]) => (
            <button key={v} className={`seg-btn${(s.options.format||"page-of-total") === v ? " active" : ""}`} onClick={() => s.setOptions(o => ({ ...o, format: v }))}>{l}</button>
          ))}
        </div>
      </div>
      <ErrorBox message={s.error} onDismiss={() => s.setError(null)} />
      {s.processing && <ProgressBar value={s.progress} label="Numbering pages" />}
      <ResultBox results={s.results} addToast={addToast} />
      <div className="actions">
        <button className="btn-primary" onClick={handleRun} disabled={s.processing || !s.files.length}>
          {s.processing ? "Adding…" : "⊞ Add Page Numbers"}
        </button>
        {s.files.length > 0 && <button className="btn-ghost" onClick={s.clearAll}>Clear</button>}
      </div>
    </div>
  );
}

function JpgToPdfTool({ addToast }) {
  const s = useToolState(true);
  const handleRun = async () => {
    if (!s.files.length) { s.setError("Please add image files."); return; }
    s.setError(null); s.setProcessing(true); s.setProgress(0); s.setResults(null);
    try { const r = await opJpgToPdf(s.files, s.options, s.setProgress); s.setResults(r); addToast("success", "Converted to PDF!"); }
    catch(e) { s.setError(e.message); } s.setProcessing(false);
  };
  return (
    <div>
      <div className="undo-bar">
        <button className="undo-btn" onClick={s.undo} disabled={!s.canUndo}>↩ Undo</button>
        <button className="undo-btn" onClick={s.redo} disabled={!s.canRedo}>↪ Redo</button>
        {s.files.length > 0 && <span className="history-count">{s.files.length} images</span>}
      </div>
      <Dropzone onFiles={s.addFiles} multiple accept="image" label="Drop images to convert to PDF" hint="JPG, PNG, WebP" />
      <FileList files={s.files} onRemove={s.removeFile} onClear={s.clearAll} />
      <ErrorBox message={s.error} onDismiss={() => s.setError(null)} />
      {s.processing && <ProgressBar value={s.progress} label="Converting images" />}
      <ResultBox results={s.results} addToast={addToast} />
      <div className="actions">
        <button className="btn-primary" onClick={handleRun} disabled={s.processing || !s.files.length}>
          {s.processing ? "Converting…" : `◰ Convert ${s.files.length > 0 ? s.files.length + " Image" + (s.files.length>1?"s":"") : ""} to PDF`}
        </button>
        {s.files.length > 0 && <button className="btn-ghost" onClick={s.clearAll}>Clear</button>}
      </div>
    </div>
  );
}

async function renderThumbnail(canvas, file, pageIndex) {
  if (!canvas || !file) return;

  // prevent multiple renders on same canvas
  if (canvas.dataset.rendering === "true") return;
  canvas.dataset.rendering = "true";

  try {
    const pdfjs = await loadPdfJS();

    const data = await file.arrayBuffer();

    const pdf = await pdfjs.getDocument({ data }).promise;

    // avoid invalid page errors
    if (pageIndex + 1 > pdf.numPages) {
      canvas.dataset.rendering = "false";
      return;
    }

    const page = await pdf.getPage(pageIndex + 1);

    const viewport = page.getViewport({ scale: 0.35 });

    const context = canvas.getContext("2d");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: context,
      viewport
    }).promise;

  } catch (err) {
    console.warn("Thumbnail render error:", err);
  }

  canvas.dataset.rendering = "false";
}

const TOOL_COMPONENTS = {
  merge:       (p) => <MergeTool {...p} />,
  split:       (p) => <SplitTool {...p} />,
  compress:    (p) => <CompressTool {...p} />,
  rotate:      (p) => <RotateTool {...p} />,
  organize:    (p) => <OrganizeTool {...p} />,
  watermark:   (p) => <WatermarkTool {...p} />,
  pagenumbers: (p) => <PageNumbersTool {...p} />,
  "jpg-to-pdf":(p) => <JpgToPdfTool {...p} />,
  batch:       (p) => <BatchTool {...p} />,
};


// ─── HOME PAGE ────────────────────────────────────────────────────────────────
// REPLACE everything from line 1900 to line 1999 in your page.jsx with this.
// (from "function HomePage" all the way to the closing brace before "// ─── TOOL PAGE WRAPPER")

function HomePage({ onOpenTool, addToast }) {
  return (
    <>
      <div className="hero">
        <div className="hero-eyebrow fade-up">✦ Privacy-First PDF Studio</div>
        <h1 className="hero-title fade-up fade-up-1">
          Powerful PDF Tools.<br /><span className="grad">100% Private.</span>
        </h1>
        <p className="hero-sub fade-up fade-up-2">
          Every operation runs entirely in your browser. Your files never touch a server — complete privacy, zero compromise.
        </p>
        <div className="hero-cta-row fade-up fade-up-3">
          <div className="privacy-pill">
            <span>🟢</span> All processing is local to your device
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <span className="section-label">— All Tools</span>
          <span className="section-count">{TOOLS.length} tools</span>
        </div>

        <div className="tools-grid" role="list" aria-label="PDF tools">
          {TOOLS.map((tool, i) => (
            <div
              key={tool.id}
              className="tool-card fade-up"
              style={{ "--card-accent-color": tool.color, animationDelay: (i * 0.035) + "s" }}
              onClick={() => onOpenTool(tool)}
              role="listitem"
              tabIndex={0}
              aria-label={`${tool.label}: ${tool.desc}`}
              onKeyDown={e => e.key === "Enter" && onOpenTool(tool)}
            >
              <div className="tool-card-top">
                <div className="tool-icon" style={{ color: tool.color }} aria-hidden>{tool.icon}</div>
                <span className="tool-kbd" aria-label={`Keyboard shortcut: ${tool.kbd}`}>{tool.kbd}</span>
              </div>
              <div className="tool-name">{tool.label}</div>
              <div className="tool-desc">{tool.desc}</div>
              <span className="tool-arrow" aria-hidden>→</span>
            </div>
          ))}
        </div>
      </div>

      <div className="section" style={{ paddingTop: 0 }}>
        <div style={{
          background: "linear-gradient(135deg, rgba(var(--accent-rgb),0.06) 0%, transparent 60%)",
          border: "1px solid rgba(var(--accent-rgb),0.12)",
          borderRadius: "24px", padding: "44px 40px", textAlign: "center"
        }}>
          <div style={{ fontSize: "2rem", marginBottom: "14px" }}>🔐</div>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "1.4rem", fontWeight: 800,
            marginBottom: "10px", letterSpacing: "-0.02em"
          }}>
            Your Files Never Leave Your Device
          </h2>
          <p style={{ color: "var(--muted)", maxWidth: "460px", margin: "0 auto", lineHeight: 1.7, fontSize: "0.875rem" }}>
            When you use PDF Studio, your files stay on your computer the entire time.
            Nothing is uploaded to the internet — everything happens right inside your browser,
            just like a desktop app. Close the tab and it's as if nothing ever happened.
          </p>
          <div className="footer-features" style={{ marginTop: "24px" }}>
            {["No uploads","No accounts","No tracking","Works offline","Free forever","Zero servers"].map(f => (
              <div className="footer-feature" key={f}>✓ {f}</div>
            ))}
          </div>
        </div>
      </div>

      <footer className="footer" role="contentinfo">
        <div className="footer-logo">PDF Studio</div>
        <p>Privacy-first PDF toolkit · Powered by pdf-lib · Runs entirely in your browser</p>
        <div style={{ marginTop: 10, opacity: 0.6 }}>Press <kbd style={{ padding: "1px 6px", borderRadius: 4, border: "1px solid var(--border)", background: "var(--surface2)", fontSize: "0.7rem" }}>?</kbd> for keyboard shortcuts</div>
      </footer>
    </>
  );
}

// ─── TOOL PAGE WRAPPER ────────────────────────────────────────────────────────
function ToolPage({ tool, onBack, addToast }) {
  const ToolComp = TOOL_COMPONENTS[tool.id];
  return (
    <main className="tool-page fade-up">
      <button className="back-btn" onClick={onBack} aria-label="Back to all tools">
        ← All tools
      </button>
      <div className="tool-page-header">
        <div className="tool-page-title">
          <div className="tool-page-icon" style={{ color: tool.color }} aria-hidden>{tool.icon}</div>
          <h1>{tool.label}</h1>
        </div>
        <p className="tool-page-sub">{tool.desc}</p>
        <div className="tool-privacy-badge">
          🔒 Files processed locally — never uploaded anywhere
        </div>
      </div>
      {ToolComp ? <ToolComp addToast={addToast} /> : (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted)" }}>
          <div style={{ fontSize: "3rem", marginBottom: "14px" }}>{tool.icon}</div>
          <h3 style={{ fontFamily: "Syne, sans-serif", color: "var(--text)", marginBottom: 8 }}>Coming Soon</h3>
          <p style={{ fontSize: "0.875rem" }}>This tool is in development.</p>
        </div>
      )}
    </main>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function PDFStudio({ initialToolId = null }) {
  const initialTool = initialToolId ? TOOLS.find(t => t.id === initialToolId) : null;
const [view, setView] = useState(initialTool ? "tool" : "home");
const [activeTool, setActiveTool] = useState(initialTool);
  const [themeName, setThemeName] = useState("dark");
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [toasts, setToasts] = useState([]);
  const theme = THEMES[themeName];

  const addToast = useCallback((type, msg) => {
  const id = Date.now();
  setToasts(t => [...t, { id, type, msg }]);
  setTimeout(() => {
    setToasts(t => t.filter(x => x.id !== id));
  }, 3500);
}, []);

  const openTool = useCallback((tool) => { setActiveTool(tool); setView("tool"); }, []);
  const goHome = useCallback(() => { setView("home"); setActiveTool(null); }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const key = e.key.toUpperCase();
      if (e.key === "Escape") { goHome(); setShowShortcuts(false); }
      if (e.key === "?") { setShowShortcuts(s => !s); return; }
      if (view === "home") {
        const t = TOOLS.find(t => t.kbd === key);
        if (t) { openTool(t); addToast("success", `Opened ${t.label}`); }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [view, goHome, openTool, addToast]);

  return (
    <>
      <style>{getCSS(theme)}</style>

      <div className="studio" role="application" aria-label="PDF Studio">
        <div className="privacy-banner" role="banner" aria-label="Privacy notice">
          <div className="privacy-dot" aria-hidden />
          100% Local Processing — Files never leave your device
        </div>

        <nav className="nav" aria-label="Main navigation">
          <div className="nav-left">
            <div className="nav-logo" onClick={goHome} role="button" tabIndex={0} onKeyDown={e => e.key === "Enter" && goHome()} aria-label="PDF Studio home">
              PDF Studio
            </div>
            <div className="nav-dot" aria-hidden title="All processing is local" />
          </div>
          <div className="nav-right">
            <button className="kbd-hint" onClick={() => setShowShortcuts(true)} aria-label="Show keyboard shortcuts">
              ⌨ Shortcuts
            </button>
            <ThemeSwitcher currentTheme={themeName} onChange={setThemeName} />
          </div>
        </nav>

        {view === "home"
          ? <HomePage onOpenTool={openTool} addToast={addToast} />
          : <ToolPage tool={activeTool} onBack={goHome} addToast={addToast} />
        }

        {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}
        <ToastArea toasts={toasts} />
      </div>
    </>
  );
}
