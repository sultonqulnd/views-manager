'use client'

import React, { useCallback } from 'react'
import GridWrapper from '@/components/grid/GridWrapper'
import { GridFetchParams } from '@/types/grid'
import { INVOICE_COLUMNS } from '@/constants/grid'

import { useGridData } from '@/hooks/useGridData'

export const dynamic = 'force-dynamic'

export default function InvoicesPage() {
  const { fetchData } = useGridData('invoices')

  return (
    <div className="p-8 max-w-(--breakpoint-2xl) mx-auto">
      <GridWrapper
        gridId="invoices"
        title="Invoices"
        columnDefs={INVOICE_COLUMNS}
        fetchData={fetchData}
      />
    </div>
  )
}
