import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryContext from "../context/QueryContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Upera FrontEnd Test",
  description: "made via next v14.0.4",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryContext>{children}</QueryContext>
      </body>
    </html>
  );
}
