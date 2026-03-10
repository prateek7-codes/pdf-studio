export const metadata = {
  title: "JPG to PDF",
  description: "Convert JPG, PNG, and WebP images to PDF — supports multiple images. Free, private, done entirely in your browser.",
  keywords: ["jpg to pdf", "image to pdf", "convert jpg to pdf", "png to pdf", "photo to pdf"],
  openGraph: { title: "JPG to PDF — PDF Studio", description: "Convert images to PDF locally, no uploads needed." },
};
import DeepLinkEntry from "@/components/DeepLinkEntry";
export default function JpgToPdfPage() { return <DeepLinkEntry toolId="jpg-to-pdf" />; }
