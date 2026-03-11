'use client'

import React, { useState, useCallback, useMemo, useRef } from 'react'
import AGGridTable from './AGGridTable'
import ViewManager from './ViewManager'
import { ColDef } from 'ag-grid-community'
import { GridConfig, GridFetchParams, GridView } from '@/types/grid'

interface GridWrapperProps<T> {
  gridId: string
  title: string
  columnDefs: ColDef<T>[]
  fetchData: (params: GridFetchParams) => Promise<{ data: T[]; totalCount: number }>
}

export default function GridWrapper<T>({
  gridId,
  title,
  columnDefs,
  fetchData
}: GridWrapperProps<T>) {
  const [currentConfig, setCurrentConfig] = useState<GridConfig | null>(null)
  const [initialConfig, setInitialConfig] = useState<GridConfig | undefined>(undefined)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [gridKey, setGridKey] = useState(0)

  // Memoize columnDefs to prevent unnecessary re-renders in AG-Grid
  const memoizedColumnDefs = useMemo(() => columnDefs, [columnDefs])

  const handleConfigChange = useCallback((config: GridConfig) => {
    setCurrentConfig(config)
    
    // Improved comparison
    if (initialConfig) {
      const isChanged = JSON.stringify(config.columnState) !== JSON.stringify(initialConfig.columnState) ||
                        JSON.stringify(config.filterModel) !== JSON.stringify(initialConfig.filterModel)
      setHasUnsavedChanges(isChanged)
    } else {
      // If no initial config, compare against current to see if it's "dirty"
      // In a real app, we might compare against a hardcoded default
      setHasUnsavedChanges(true)
    }
  }, [initialConfig])

  const handleViewSelect = useCallback((view: GridView) => {
    setInitialConfig(view.config)
    setCurrentConfig(view.config)
    setHasUnsavedChanges(false)
    setGridKey(prev => prev + 1) // Remount to apply fresh config
  }, [])

  const handleReset = useCallback(() => {
    setInitialConfig(undefined)
    setCurrentConfig(null)
    setHasUnsavedChanges(false)
    setGridKey(prev => prev + 1)
  }, [])

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800/50 backdrop-blur-sm">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-100">{title}</h2>
          <p className="text-zinc-500 text-sm mt-1">Manage and persist your custom grid views.</p>
        </div>
        <ViewManager
          gridId={gridId}
          currentConfig={currentConfig}
          onViewSelect={handleViewSelect}
          onReset={handleReset}
          hasUnsavedChanges={hasUnsavedChanges}
        />
      </div>
      
      <div className="relative group">
        <div className="absolute -inset-1 bg-linear-to-r from-indigo-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative">
          <AGGridTable<T>
            key={gridKey}
            gridId={gridId}
            columnDefs={memoizedColumnDefs}
            fetchData={fetchData}
            initialConfig={initialConfig}
            onConfigChange={handleConfigChange}
          />
        </div>
      </div>
    </div>
  )
}
