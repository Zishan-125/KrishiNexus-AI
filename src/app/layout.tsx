import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KrishiNexus AI - Agritech Supply Chain & Yield Optimization Hub",
  description: "B2B2C direct-to-market agritech ecosystem featuring intelligent crop disease diagnostics and multi-signature payment escrows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
