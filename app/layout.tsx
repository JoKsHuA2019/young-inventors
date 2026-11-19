import type { Metadata } from "next";
import "./globals.css";
import "./creative.css";
import WorkshopProvider from "@/components/WorkshopProvider";
import { Nav, Footer } from "@/components/Shared";
export const metadata: Metadata = {
  title: {
    default: "Young Inventors · The Woodland Workshop",
    template: "%s · Young Inventors",
  },
  description:
    "A cozy place to discover how things work. Make little machines, investigate circuits, and follow your curiosity through 30 hands-on projects.",
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WorkshopProvider>
          <Nav />
          {children}
          <Footer />
        </WorkshopProvider>
      </body>
    </html>
  );
}
