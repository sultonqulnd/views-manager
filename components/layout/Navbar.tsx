'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, FileText, ShoppingCart, LogOut, User } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Invoices', href: '/invoices', icon: FileText },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (pathname === '/login') return null

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-zinc-950 border-r border-zinc-800 p-6 flex flex-col justify-between z-40">
      <div className="space-y-8">
        <div className="flex items-center gap-3 px-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            AG
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-100">Grid Views</span>
        </div>

        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                pathname === item.href 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
              )}
            >
              <item.icon className={cn("h-5 w-5", pathname === item.href ? "text-white" : "text-zinc-500 group-hover:text-zinc-300")} />
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-zinc-800 space-y-4">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
          <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center">
            <User className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-200 truncate">Account</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/5 transition-all group"
        >
          <LogOut className="h-5 w-5 text-zinc-500 group-hover:text-red-400" />
          Logout
        </button>
      </div>
    </nav>
  )
}
