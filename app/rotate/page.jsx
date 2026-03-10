export const metadata = {
  title: "Rotate PDF",
  description: "Rotate PDF pages 90°, 180°, or 270° — fix upside-down or sideways scans instantly. Free, private, no uploads.",
  keywords: ["rotate pdf", "rotate pdf pages", "flip pdf", "fix pdf orientation"],
  openGraph: { title: "Rotate PDF — PDF Studio", description: "Fix PDF page orientation locally in your browser." },
};
import DeepLinkEntry from "@/components/DeepLinkEntry";
export default function RotatePage() { return <DeepLinkEntry toolId="rotate" />; }
