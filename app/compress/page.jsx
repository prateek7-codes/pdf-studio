export const metadata = {
  title: "Compress PDF",
  description: "Reduce PDF file size for free — all compression happens locally in your browser. No uploads, completely private.",
  keywords: ["compress pdf", "reduce pdf size", "pdf compressor", "shrink pdf", "make pdf smaller"],
  openGraph: { title: "Compress PDF — PDF Studio", description: "Reduce PDF file size locally. No uploads required." },
};
import DeepLinkEntry from "@/components/DeepLinkEntry";
export default function CompressPage() { return <DeepLinkEntry toolId="compress" />; }
