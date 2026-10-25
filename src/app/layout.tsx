import type { Metadata } from "next";
import localFont from "next/font/local";
import { site } from "@/lib/site";
import { publicAssetPath } from "@/lib/paths";
import "./globals.css";

const garamond = localFont({
  src: [
    { path: "../assets/fonts/eb-garamond-regular.ttf", weight: "400", style: "normal" },
    { path: "../assets/fonts/eb-garamond-semibold.ttf", weight: "600", style: "normal" },
    { path: "../assets/fonts/eb-garamond-italic.ttf", weight: "400", style: "italic" },
  ],
  variable: "--font-garamond",
  display: "swap",
});

const inter = localFont({
  src: [
    { path: "../assets/fonts/inter-regular.ttf", weight: "400", style: "normal" },
    { path: "../assets/fonts/inter-semibold.ttf", weight: "600", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: site.name,
  description: site.description,
  icons: { icon: publicAssetPath("/coffee-icon.svg") },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${garamond.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
