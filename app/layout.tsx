import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageToggle } from "@/components/LanguageToggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Paula's Choice",
  description: "Discover your personalized skincare routine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <LanguageToggle />
        {children}
      </body>
    </html>
  );
}