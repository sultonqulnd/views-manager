'use client'

import React, { useState } from 'react'
import { 
  ChevronDown, 
  Save, 
  Plus, 
  RotateCcw, 
  Trash2, 
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { useGridViews } from '@/hooks/useGridViews'
import { GridView, GridConfig } from '@/types/grid'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface ViewManagerProps {
  gridId: string
  currentConfig: GridConfig | null
  onViewSelect: (view: GridView) => void
  onReset: () => void
  hasUnsavedChanges: boolean
}

export default function ViewManager({
  gridId,
  currentConfig,
  onViewSelect,
  onReset,
  hasUnsavedChanges
}: ViewManagerProps) {
  const { views, isLoading, saveView, isSaving, deleteView, isDeleting } = useGridViews(gridId)
  const [selectedViewId, setSelectedViewId] = useState<string>('default')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [newViewName, setNewViewName] = useState('')
  const [showSaveAs, setShowSaveAs] = useState(false)

  const handleSaveViewAction = async () => {
    if (!currentConfig) return

    const name = showSaveAs ? (newViewName || `View ${views.length + 1}`) : ''
    const id = showSaveAs ? undefined : selectedViewId

    await saveView({ name, config: currentConfig, id })
    
    setShowSaveAs(false)
    setNewViewName('')
    setIsMenuOpen(false)
  }

  const handleDeleteViewAction = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    await deleteView(id)
    if (selectedViewId === id) {
      setSelectedViewId('default')
      onReset()
    }
  }

  const handleViewChange = (viewId: string) => {
    setSelectedViewId(viewId)
    setIsMenuOpen(false)
    if (viewId === 'default') {
      onReset()
    } else {
      const view = views.find(v => v.id === viewId)
      if (view) onViewSelect(view)
    }
  }

  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
          ) : (
            <span>{selectedViewId === 'default' ? 'Default View' : views.find(v => v.id === selectedViewId)?.name}</span>
          )}
          <ChevronDown className={cn("h-4 w-4 transition-transform", isMenuOpen && "rotate-180")} />
        </button>

        {isMenuOpen && (
          <div className="absolute left-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <button
              onClick={() => handleViewChange('default')}
              className={cn(
                "w-full text-left px-4 py-2 text-sm hover:bg-zinc-800 transition-colors flex items-center justify-between",
                selectedViewId === 'default' && "text-indigo-400 bg-indigo-500/5"
              )}
            >
              Default View
              {selectedViewId === 'default' && <Check className="h-4 w-4" />}
            </button>
            {views.map(view => (
              <button
                key={view.id}
                onClick={() => handleViewChange(view.id)}
                className={cn(
                  "w-full text-left px-4 py-2 text-sm hover:bg-zinc-800 transition-colors flex items-center justify-between group",
                  selectedViewId === view.id && "text-indigo-400 bg-indigo-500/5"
                )}
              >
                <span className="truncate">{view.name}</span>
                <div className="flex items-center gap-2">
                  {selectedViewId === view.id && <Check className="h-4 w-4" />}
                  <Trash2 
                    className="h-3.5 w-3.5 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" 
                    onClick={(e) => handleDeleteViewAction(view.id, e)}
                  />
                </div>
              </button>
            ))}
            <div className="border-t border-zinc-800 mt-2 pt-2 px-2">
              <button
                onClick={() => {
                  setShowSaveAs(true)
                  setIsMenuOpen(false)
                }}
                className="w-full flex items-center gap-2 px-2 py-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200 uppercase tracking-wider"
              >
                <Plus className="h-3 w-3" />
                Save As New View
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          disabled={!hasUnsavedChanges || isSaving}
          onClick={handleSaveViewAction}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 disabled:bg-zinc-800 disabled:text-zinc-500 rounded-lg text-sm font-semibold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/10"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save View
        </button>

        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>

      {hasUnsavedChanges && (
        <div className="flex items-center gap-2 text-amber-500 text-sm font-medium animate-pulse">
          <AlertCircle className="h-4 w-4" />
          <span>Unsaved changes</span>
        </div>
      )}

      {showSaveAs && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold mb-4">Save New View</h3>
            <input
              type="text"
              placeholder="View name"
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={newViewName}
              onChange={(e) => setNewViewName(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowSaveAs(false)}
                className="px-4 py-2 text-sm font-medium hover:text-zinc-400 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={isSaving}
                onClick={handleSaveViewAction}
                className="px-6 py-2 bg-indigo-600 rounded-lg text-sm font-semibold hover:bg-indigo-500 transition-all flex items-center gap-2"
              >
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
