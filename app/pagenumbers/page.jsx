export const metadata = {
  title: "Add Page Numbers to PDF",
  description: "Add page numbers to any PDF — choose position and format. Free, private, works instantly in your browser.",
  keywords: ["add page numbers to pdf", "pdf page numbers", "number pdf pages", "paginate pdf"],
  openGraph: { title: "Add Page Numbers to PDF — PDF Studio", description: "Number your PDF pages locally, no uploads." },
};
import DeepLinkEntry from "@/components/DeepLinkEntry";
export default function PageNumbersPage() { return <DeepLinkEntry toolId="pagenumbers" />; }
