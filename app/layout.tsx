import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
// import { Toaster } from "@/components/ui/toaster"
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { PageTransition } from "@/components/ui/page-transition"
import { EnrollmentProvider } from "@/context/EnrollmentContext"
import { ClerkProvider } from '@clerk/nextjs'
import ClerkSyncUser from "@/components/ClerkSyncUser";

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
        <head>
          {/* ✅ Add Razorpay Checkout Script */}
          <script
            src="https://checkout.razorpay.com/v1/checkout.js"
            async
          ></script>
        </head>
        <body className={inter.className}>
          <ThemeProvider
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">
                <EnrollmentProvider>
                  <PageTransition>
                    <ClerkSyncUser />
                    {children}
                  </PageTransition>
                </EnrollmentProvider>
              </main>
              <Footer />
            </div>
            {/* <Toaster /> */}
                    <Toaster 
          position="bottom-right"   // 👈 show in bottom-right
          toastOptions={{
            duration: 5000,         // 👈 show for 5 seconds
          }}/>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
