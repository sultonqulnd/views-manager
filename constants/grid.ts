import { ColDef } from 'ag-grid-community'

export const INVOICE_COLUMNS: ColDef[] = [
  { field: 'invoice_id', headerName: 'Invoice ID', flex: 1, filter: 'agTextColumnFilter' },
  { field: 'customer_name', headerName: 'Customer Name', flex: 1.5, filter: 'agTextColumnFilter' },
  { field: 'invoice_date', headerName: 'Invoice Date', flex: 1, filter: 'agDateColumnFilter' },
  { field: 'due_date', headerName: 'Due Date', flex: 1, filter: 'agDateColumnFilter' },
  { 
    field: 'total', 
    headerName: 'Total', 
    flex: 1,
    filter: 'agNumberColumnFilter',
    valueFormatter: (params) => {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(params.value)
    }
  },
  { 
    field: 'status', 
    headerName: 'Status', 
    flex: 1,
    filter: 'agTextColumnFilter',
    cellRenderer: (params: any) => {
      const colors: Record<string, string> = {
        paid: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        overdue: 'bg-red-500/10 text-red-400 border-red-500/20',
        sent: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        draft: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
      }
      const colorClass = colors[params.value] || 'bg-zinc-800 text-zinc-300'
      return `<span class="px-2 py-1 rounded-full text-xs font-semibold border ${colorClass}">${params.value}</span>`
    }
  },
  { field: 'payment_method', headerName: 'Method', flex: 1, filter: 'agTextColumnFilter' },
  { field: 'notes', headerName: 'Notes', flex: 1.5, filter: 'agTextColumnFilter', hide: true }
]

export const ORDER_COLUMNS: ColDef[] = [
  { field: 'order_id', headerName: 'Order ID', flex: 1, filter: 'agTextColumnFilter' },
  { field: 'customer_name', headerName: 'Customer Name', flex: 1.5, filter: 'agTextColumnFilter' },
  { field: 'order_date', headerName: 'Order Date', flex: 1, filter: 'agDateColumnFilter' },
  { field: 'items_count', headerName: 'Items', flex: 0.8, filter: 'agNumberColumnFilter' },
  { 
    field: 'total', 
    headerName: 'Total', 
    flex: 1,
    filter: 'agNumberColumnFilter',
    valueFormatter: (params) => {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(params.value)
    }
  },
  { field: 'status', headerName: 'Status', flex: 1, filter: 'agTextColumnFilter' },
  { field: 'tracking_number', headerName: 'Tracking Number', flex: 1.5, filter: 'agTextColumnFilter' },
  { field: 'shipping_address', headerName: 'Address', flex: 2, filter: 'agTextColumnFilter', hide: true}
]
