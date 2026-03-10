export const metadata = {
  title: "Split PDF",
  description: "Split a PDF into individual pages or custom page ranges — free and private. Extract specific pages without uploading to a server.",
  keywords: ["split pdf", "extract pdf pages", "pdf splitter", "separate pdf pages"],
  openGraph: { title: "Split PDF — PDF Studio", description: "Extract pages from any PDF. 100% local processing." },
};
import DeepLinkEntry from "@/components/DeepLinkEntry";
export default function SplitPage() { return <DeepLinkEntry toolId="split" />; }
