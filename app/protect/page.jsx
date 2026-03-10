export const metadata = {
  title: "Protect PDF",
  description: "Password-protect your PDF documents locally — no file uploads. Add encryption to sensitive documents privately.",
  keywords: ["protect pdf", "password protect pdf", "encrypt pdf", "lock pdf", "secure pdf"],
  openGraph: { title: "Protect PDF — PDF Studio", description: "Password-lock PDF files locally. Files never leave your device." },
};
import DeepLinkEntry from "@/components/DeepLinkEntry";
export default function ProtectPage() { return <DeepLinkEntry toolId="protect" />; }
