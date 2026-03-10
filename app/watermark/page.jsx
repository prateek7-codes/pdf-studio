export const metadata = {
  title: "Add Watermark to PDF",
  description: "Stamp custom text watermarks on every page of your PDF. Done locally — no file uploads needed.",
  keywords: ["add watermark to pdf", "pdf watermark", "watermark pdf online", "stamp pdf"],
  openGraph: { title: "Add Watermark to PDF — PDF Studio", description: "Add text watermarks to PDF pages locally." },
};
import DeepLinkEntry from "@/components/DeepLinkEntry";
export default function WatermarkPage() { return <DeepLinkEntry toolId="watermark" />; }
