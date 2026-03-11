'use client'

import { useCallback } from 'react'
import { GridFetchParams } from '@/types/grid'

export function useGridData(table: string) {
  const fetchData = useCallback(async (params: GridFetchParams) => {
    try {
      const response = await fetch('/api/grid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table, params })
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${table} data`)
      }
      
      return await response.json()
    } catch (error) {
      console.error(`Error in useGridData(${table}):`, error)
      throw error
    }
  }, [table])

  return { fetchData }
}
