'use client'

import React, { useCallback, useMemo, useRef, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import {
  ColDef,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
  GridApi,
  GridOptions,
} from 'ag-grid-community'

import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { GridConfig, GridFetchParams } from '@/types/grid'

interface AGGridTableProps<T> {
  gridId: string
  columnDefs: ColDef<T>[]
  fetchData: (params: GridFetchParams) => Promise<{ data: T[]; totalCount: number }>
  initialConfig?: GridConfig
  onConfigChange?: (config: GridConfig) => void
}

export default function AGGridTable<T>({
  gridId,
  columnDefs,
  fetchData,
  initialConfig,
  onConfigChange,
}: AGGridTableProps<T>) {
  const gridRef = useRef<AgGridReact<T>>(null)
  const [gridApi, setGridApi] = useState<GridApi<T> | null>(null)

  const onGridReady = useCallback((params: GridReadyEvent<T>) => {
    setGridApi(params.api)

    const datasource: IDatasource = {
      getRows: async (getRowsParams: IGetRowsParams) => {
        try {
          const { startRow, endRow, sortModel, filterModel } = getRowsParams
          const response = await fetchData({
            startRow,
            endRow,
            sortModel,
            filterModel,
          })
          getRowsParams.successCallback(response.data, response.totalCount)
        } catch (error) {
          console.error(`[${gridId}] Fetch error:`, error)
          getRowsParams.failCallback()
        }
      },
    }

    params.api.setGridOption('datasource', datasource)

    if (initialConfig) {
      if (initialConfig.columnState) {
        params.api.applyColumnState({
          state: initialConfig.columnState,
          applyOrder: true,
        })
      }
      if (initialConfig.filterModel) {
        params.api.setFilterModel(initialConfig.filterModel)
      }
    }
  }, [fetchData, initialConfig, gridId])

  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 100,
  }), [])

  const gridOptions = useMemo<GridOptions<T>>(() => ({
    rowModelType: 'infinite',
    cacheBlockSize: 50,
    pagination: true,
    paginationPageSize: 50,
    animateRows: true,
    overlayLoadingTemplate: '<span class="ag-overlay-loading-center">Processing data...</span>',
    rowHeight: 48,
    headerHeight: 48,
  }), [])

  const handleStateChange = useCallback(() => {
    if (!gridApi || !onConfigChange) return

    const config: GridConfig = {
      columnState: gridApi.getColumnState(),
      filterModel: gridApi.getFilterModel(),
      sortModel: []
    }
    onConfigChange(config)
  }, [gridApi, onConfigChange])

  return (
    <div className="ag-theme-alpine-dark w-full h-[600px] rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl transition-all duration-300 hover:shadow-indigo-500/5">
      <AgGridReact<T>
        ref={gridRef}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        gridOptions={gridOptions}
        onGridReady={onGridReady}
        onColumnMoved={handleStateChange}
        onColumnResized={handleStateChange}
        onColumnVisible={handleStateChange}
        onSortChanged={handleStateChange}
        onFilterChanged={handleStateChange}
      />
    </div>
  )
}
