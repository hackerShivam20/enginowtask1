import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { PageTransition } from "@/components/ui/page-transition"
import { EnrollmentProvider } from "@/context/EnrollmentContext"
import { ClerkProvider } from '@clerk/nextjs'

// Use only the Inter font from Google Fonts
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Enginow - Learn Fast, Understand Better",
  description: "Educational platform for engineering students and learners of Computer Science/IT-related subjects",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
              <EnrollmentProvider>
                <PageTransition>{children}</PageTransition>
              </EnrollmentProvider>
            </main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  )
}
