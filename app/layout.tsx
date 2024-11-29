import "./globals.css";
import Link from "next/link";
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
      <body className={`${inter.className}`}>
        {" "}
        <h1 className="w-full fixed top-0 z-10 px-7 py-2 sm:py-4 bg-cyan-600 text-center text-lg md:text-xl font-medium text-white">
          clinical practice dashboard{" "}
          <Link
            href="https://daryldeogracias.com"
            className="font-normal text-sm"
          >
            daryldeogracias©2024
          </Link>
        </h1>
        <main className="mx-auto max-w-[1900px]">{children}</main>
      </body>
    </html>
  );
}
