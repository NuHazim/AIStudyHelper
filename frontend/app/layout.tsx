import './globals.css'
import { Work_Sans } from "next/font/google"

const fontName =Work_Sans({
  weight: "400",
  subsets: ["latin"],
})

export const metadata = {
  title: "AI Study Helper",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      <body className={fontName.className}>
        {children}
      </body>
    </html>
  )
}