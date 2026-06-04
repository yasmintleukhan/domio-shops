import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Domio Shops",
  description: "SaaS platform for Instagram sellers in Kazakhstan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased">{children}</body>
    </html>
  );
}
