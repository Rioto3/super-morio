import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
<<<<<<< HEAD
  title: 'Super Morio',
  description: 'Classic platformer game reimagined for mobile browsers',
=======
  title: "Super Morio",
  description: "Classic platformer game reimagined for mobile browsers",
>>>>>>> 74364d2fa707eebdc905030cc68ba919fbe90c21
  manifest: '/manifest.json',
  themeColor: '#000000',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  icons: {
<<<<<<< HEAD
    icon: '/icons/icon-512x512.png',
    apple: '/icons/icon-192x192.png',
=======
    apple: [
      { url: '/icons/icon-192x192.png' },
    ],
>>>>>>> 74364d2fa707eebdc905030cc68ba919fbe90c21
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Super Morio',
  },
<<<<<<< HEAD
}
=======
};
>>>>>>> 74364d2fa707eebdc905030cc68ba919fbe90c21

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
<<<<<<< HEAD
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
=======
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased select-none`}
        style={{
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          KhtmlUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          userSelect: 'none',
        }}
      >
>>>>>>> 74364d2fa707eebdc905030cc68ba919fbe90c21
        {children}
      </body>
    </html>
  )
}