import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Company Financial Health Calculator — Indian Context",
  description:
    "Upload any financial document — Balance Sheet, P&L, Cash Flow — and get an AI-powered, interactive financial health dashboard built for Indian businesses.",
  keywords:
    "financial health, balance sheet analysis, P&L analysis, Indian SME, DSCR, GST compliance, TDS, working capital",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
