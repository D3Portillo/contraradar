import "./globals.css"
import type { Metadata } from "next"

import { ClerkProvider } from "@clerk/nextjs"
import { QueryProvider } from "@/components/QueryProvider"
import { Inter } from "next/font/google"

const baseFont = Inter({
  subsets: [],
  display: "fallback",
  adjustFontFallback: true,
  preload: true,
  weight: ["400", "600", "700"],
})

export const metadata: Metadata = {
  title: "Radar — market intelligence for Contra experts.",
  description:
    "Discover in-demand skills, benchmark your rates, and find high-opportunity niches on Contra.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${baseFont.className} antialiased`}>
          <QueryProvider>{children}</QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
