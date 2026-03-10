export const metadata = {
  title: "Organize PDF Pages",
  description: "Drag and drop to reorder or delete PDF pages with real thumbnail previews. All page organization happens locally.",
  keywords: ["organize pdf pages", "reorder pdf pages", "rearrange pdf", "delete pdf pages"],
  openGraph: { title: "Organize PDF Pages — PDF Studio", description: "Reorder and delete PDF pages with drag-and-drop." },
};
import DeepLinkEntry from "@/components/DeepLinkEntry";
export default function OrganizePage() { return <DeepLinkEntry toolId="organize" />; }
