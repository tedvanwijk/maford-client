import './globals.css'
import { Inter } from 'next/font/google';

import Navbar from '@/components/navbar';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="light">
      <body className={inter.className}>
        <Navbar>
          {children}
        </Navbar>
      </body>
    </html>
  )
}