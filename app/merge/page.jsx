import DeepLinkEntry from "../../components/DeepLinkEntry";

export const metadata = {
  title: "Merge PDF",
  description:
    "Combine multiple PDF files into one — free, instant, and 100% private. No uploads, no file size limits. Merge PDFs directly in your browser.",
  keywords: ["merge pdf", "combine pdf", "join pdf files", "pdf merger free", "merge pdf online"],
  openGraph: {
    title: "Merge PDF — PDF Studio",
    description: "Combine multiple PDFs into one file. 100% local — files never leave your device.",
  },
};

export default function MergePage() {
  return <DeepLinkEntry toolId="merge" />;
}
