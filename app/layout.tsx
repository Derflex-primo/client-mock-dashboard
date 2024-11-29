import "./globals.css";
import { Metadata } from "next";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "clinical practice dashboard",
  description:
    "Disclaimer: This chart represents fictional data generated for demonstration and testing purposes. Any resemblance to real individuals, events, or entities is purely coincidental.",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>{children}</body>
    </html>
  );
}
