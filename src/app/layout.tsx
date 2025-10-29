import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "x402labs Trading Lab",
  description: "Build and train specialized AI trading agents for cryptocurrency markets. Create custom neural networks, analyze token data, and develop sophisticated trading algorithms.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://i.ibb.co/4Rzpmjwp/content.png" type="image/jpeg" />
        <link rel="shortcut icon" href="https://i.ibb.co/4Rzpmjwp/content.png" type="image/jpeg" />
        <link rel="apple-touch-icon" href="https://i.ibb.co/4Rzpmjwp/content.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="font-mono">{children}</body>
    </html>
  );
}
