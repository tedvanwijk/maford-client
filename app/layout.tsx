import './globals.css'
import { Inter } from 'next/font/google';

import Navbar from '@/components/navbar';
import { Suspense } from 'react';

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
          <Suspense>
            {children}
          </Suspense>
        </Navbar>
      </body>
    </html>
  )
}