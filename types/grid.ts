export type GridView = {
  id: string
  user_id: string
  grid_id: string
  name: string
  config: GridConfig
  is_default: boolean
  created_at: string
}

export type GridConfig = {
  columnState: any[]
  filterModel: any
  sortModel: any
  pivotMode?: boolean
}

export type GridDataResponse<T> = {
  data: T[]
  totalCount: number
}

export type GridFetchParams = {
  startRow: number
  endRow: number
  sortModel: any[]
  filterModel: any
}
