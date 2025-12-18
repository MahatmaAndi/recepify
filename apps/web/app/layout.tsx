import "./globals.css";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { cn } from "@recepify/shared/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6">
          {children}
        </div>
      </body>
    </html>
  );
}
