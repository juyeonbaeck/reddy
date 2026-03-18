import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Reddy',
  description: '취준 생산성 대시보드',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-surface antialiased">{children}</body>
    </html>
  )
}
