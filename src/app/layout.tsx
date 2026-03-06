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
  title: "RADAR — Market intelligence for Contra Experts",
  description:
    "Radar shows freelancers and experts which skills and services are driving demand on Contra so they can position themselves to get hired.",
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
