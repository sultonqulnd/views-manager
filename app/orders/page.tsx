'use client'

import React, { useCallback } from 'react'
import GridWrapper from '@/components/grid/GridWrapper'
import { GridFetchParams } from '@/types/grid'
import { ORDER_COLUMNS } from '@/constants/grid'

import { useGridData } from '@/hooks/useGridData'

export const dynamic = 'force-dynamic'

export default function OrdersPage() {
  const { fetchData } = useGridData('orders')

  return (
    <div className="p-8 max-w-(--breakpoint-2xl) mx-auto">
      <GridWrapper
        gridId="orders"
        title="Orders"
        columnDefs={ORDER_COLUMNS}
        fetchData={fetchData}
      />
    </div>
  )
}
