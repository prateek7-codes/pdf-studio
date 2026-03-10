export const metadata = {
  title: "Batch Process PDFs",
  description: "Process multiple PDF files at once — compress, rotate, or watermark an entire folder of PDFs in one go. All local.",
  keywords: ["batch pdf", "bulk pdf processing", "process multiple pdfs", "batch compress pdf"],
  openGraph: { title: "Batch Process PDFs — PDF Studio", description: "Process multiple PDFs at once, all locally." },
};
import DeepLinkEntry from "@/components/DeepLinkEntry";
export default function BatchPage() { return <DeepLinkEntry toolId="batch" />; }
