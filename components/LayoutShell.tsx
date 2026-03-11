'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Navbar from './layout/Navbar'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {!isLoginPage && <Navbar />}
      <main className={!isLoginPage ? "pl-64 min-h-screen" : "min-h-screen"}>
        {children}
      </main>
    </div>
  )
}
