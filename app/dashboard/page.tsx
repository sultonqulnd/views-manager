'use client'

import React from 'react'
import Link from 'next/link'
import { FileText, ShoppingCart, Table, ArrowRight, Activity, TrendingUp, Users } from 'lucide-react'

export const dynamic = 'force-dynamic'

const StatCard = ({ name, value, icon: Icon, color, trend }: any) => (
  <div className="group relative p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl overflow-hidden hover:border-zinc-700 transition-all duration-300">
    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
      <Icon className="h-24 w-24" />
    </div>
    <div className="relative space-y-4">
      <div className={`p-3 rounded-2xl bg-zinc-950 w-fit border border-zinc-800 shadow-inner`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest">{name}</p>
        <div className="flex items-baseline gap-3">
          <p className="text-4xl font-black mt-1 tracking-tight text-zinc-100">{value}</p>
          {trend && (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
              <TrendingUp className="h-3 w-3" />
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
)

const ActionCard = ({ title, description, href, icon: Icon, color, gradient }: any) => (
  <Link href={href} className="group block">
    <div className={`relative p-8 rounded-4xl h-full overflow-hidden border border-zinc-800/50 bg-zinc-900 shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-indigo-500/10`}>
      <div className={`absolute inset-0 bg-linear-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
      
      <div className="relative space-y-6">
        <div className={`p-4 rounded-2xl bg-zinc-950 w-fit border border-zinc-800 shadow-xl group-hover:scale-110 transition-transform duration-500`}>
          <Icon className={`h-8 w-8 ${color}`} />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-zinc-100">{title}</h3>
          <p className="text-zinc-500 leading-relaxed">{description}</p>
        </div>
        
        <div className="inline-flex items-center gap-2 text-sm font-bold text-zinc-100 group-hover:gap-4 transition-all duration-300">
          Explore Grid
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  </Link>
)

export default function DashboardPage() {
  return (
    <div className="p-8 lg:p-12 space-y-16 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col gap-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold tracking-widest uppercase w-fit">
          <Activity className="h-3 w-3" />
          Live Platform Overview
        </div>
        <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-white">
          Manage with <span className="bg-linear-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">Precision.</span>
        </h1>
        <p className="text-xl text-zinc-500 max-w-2xl leading-relaxed">
          High-performance AG-Grid views management. Seamlessly filter, sort, and persist your business data configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard name="Invoices" value="1,280" icon={FileText} color="text-blue-500" trend="+12.5%" />
        <StatCard name="Active Orders" value="482" icon={ShoppingCart} color="text-emerald-500" trend="+8.2%" />
        <StatCard name="Custom Views" value="24" icon={Table} color="text-indigo-500" trend="+4" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <ActionCard 
          title="Invoices Management"
          description="Detailed financial tracking with custom column states and advanced filtering for all your billing data."
          href="/invoices"
          icon={FileText}
          color="text-blue-500"
          gradient="from-blue-600 to-cyan-500"
        />
        <ActionCard 
          title="Orders Tracking"
          description="Monitor shipping, delivery status, and order volumes with a highly optimized data grid experience."
          href="/orders"
          icon={ShoppingCart}
          color="text-emerald-500"
          gradient="from-emerald-600 to-teal-500"
        />
      </div>

      <div className="p-12 rounded-[3rem] bg-zinc-900/30 border border-zinc-800 flex flex-col items-center text-center space-y-6">
        <div className="p-4 rounded-full bg-zinc-950 border border-zinc-800">
           <Users className="h-8 w-8 text-zinc-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Collaborative Insight</h2>
          <p className="text-zinc-500 max-w-lg">Your custom views are synced across devices and sessions. Share precise data configurations with your team effortlessly.</p>
        </div>
      </div>
    </div>
  )
}
