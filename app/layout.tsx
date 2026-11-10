import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "Interactive Workflow Playground · Kristian",
  description:
    "A bilingual interactive CV workflow demo built with Next.js, n8n, AI, Google Sheets, and Telegram.",
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#060815",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
