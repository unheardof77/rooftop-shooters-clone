import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rooftop Shooters - Urban Sniper Game",
  description: "Navigate the urban landscape, take precise shots, and become the ultimate rooftop sniper in this exciting 2D shooting game.",
  keywords: "rooftop shooters, sniper game, 2D game, shooting game, urban game",
  authors: [{ name: "Rooftop Shooters Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
