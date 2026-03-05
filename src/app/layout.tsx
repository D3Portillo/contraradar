import "./globals.css"
import type { Metadata } from "next"

import { ClerkProvider } from "@clerk/nextjs"
import { QueryProvider } from "@/components/QueryProvider"
import { Inter, JetBrains_Mono } from "next/font/google"

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontSerif = Inter({
  subsets: ["latin"],
  variable: "--font-serif",
})

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Contraradar - Build Better",
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
        <body
          className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased`}
        >
          <QueryProvider>{children}</QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
