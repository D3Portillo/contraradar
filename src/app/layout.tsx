import "./globals.css"
import type { Metadata } from "next"

import { ClerkProvider } from "@clerk/nextjs"
import { QueryProvider } from "@/components/QueryProvider"
import { Inter, JetBrains_Mono } from "next/font/google"

const baseFont = Inter({
  subsets: [],
  display: "fallback",
  adjustFontFallback: true,
  preload: true,
  weight: ["400", "600", "700"],
})

export const metadata: Metadata = {
  title: "Radar — market intelligence for Contra experts.",
  description: "Professional SaaS platform with powerful features",
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
