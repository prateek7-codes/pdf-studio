"use client";

// src/components/DeepLinkEntry.jsx
//
// This component is imported by every tool route page (e.g. /merge, /split).
// It renders your full PDFStudio app but passes an initialTool prop so the
// app opens directly to the right tool instead of showing the home grid.
//
// HOW IT WORKS:
// 1. User visits /merge
// 2. Next.js renders src/app/merge/page.jsx
// 3. That page renders <DeepLinkEntry toolId="merge" />
// 4. DeepLinkEntry renders <PDFStudio initialToolId="merge" />
// 5. PDFStudio checks initialToolId on mount and opens that tool
//
// You need ONE small change to your existing page.jsx — see the comment
// at the bottom of this file.

import PDFStudio from "@/app/page";

export default function DeepLinkEntry({ toolId }) {
  return <PDFStudio initialToolId={toolId} />;
}


// ─── CHANGE NEEDED IN YOUR page.jsx ──────────────────────────────────────────
//
// Find this line near the bottom of page.jsx:
//
//   export default function PDFStudio() {
//
// Change it to:
//
//   export default function PDFStudio({ initialToolId = null }) {
//
// Then find this block (the useState lines near the top of PDFStudio):
//
//   const [view, setView] = useState("home");
//   const [activeTool, setActiveTool] = useState(null);
//
// Change it to:
//
//   const initialTool = initialToolId ? TOOLS.find(t => t.id === initialToolId) : null;
//   const [view, setView] = useState(initialTool ? "tool" : "home");
//   const [activeTool, setActiveTool] = useState(initialTool);
//
// That's the entire change. 2 lines modified, 1 line added.
// Everything else in page.jsx stays exactly the same.
