import './globals.css'
import { Inter } from 'next/font/google';

import Navbar from '@/components/navbar';
import { Suspense } from 'react';
import Loading from './loading';

const inter = Inter({ subsets: ['latin'] });

function RootLayout({
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

export default function Page({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={<Loading />}>
      <RootLayout>
        {children}
      </RootLayout>
    </Suspense>
  )
}