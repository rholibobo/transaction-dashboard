import type React from "react"
import "@/app/globals.css"
import { Poppins } from "next/font/google"
import { ReactQueryProvider } from "@/components/providers/react-query-provider"
import { Toaster } from 'sonner';


const poppins = Poppins({ subsets: ["latin"], weight: "400" })

export const metadata = {
  title: "Transaction Dashboard",
  description: "A modern transaction dashboard for managing financial transactions",
  
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <ReactQueryProvider>
          {children}
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  )
}



