import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KrishiNexus AI",
  description: "B2B Agritech Supply-Chains and Neural Yield Diagnostics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}