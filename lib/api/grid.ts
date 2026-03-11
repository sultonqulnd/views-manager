import { createClient } from '@/utils/supabase/server'
import { GridFetchParams } from '@/types/grid'

export async function fetchGridData(table: string, params: GridFetchParams) {
  const supabase = await createClient()
  const { startRow, endRow, sortModel, filterModel } = params

  let query = supabase
    .from(table)
    .select('*', { count: 'exact' })

  // Apply Sorting
  if (sortModel && sortModel.length > 0) {
    sortModel.forEach((sort: any) => {
      query = query.order(sort.colId, { ascending: sort.sort === 'asc' })
    })
  } else {
    // Default order
    query = query.order('created_at', { ascending: false })
  }

  // Apply Filtering
  if (filterModel) {
    Object.keys(filterModel).forEach((colId) => {
      const filter = filterModel[colId]
      applyFilter(query, colId, filter)
    })
  }

  // Apply Pagination
  query = query.range(startRow, endRow - 1)

  const { data, count, error } = await query

  if (error) {
    console.error(`Error fetching ${table} data:`, error)
    throw error
  }

  return {
    data: data || [],
    totalCount: count || 0,
  }
}

function applyFilter(query: any, colId: string, filter: any) {
  // Support for multiple filters on the same column (operator: 'OR' | 'AND')
  if (filter.operator) {
    // Note: Supabase complex OR/AND logic can be tricky with the fluent API.
    // For simplicity, we'll handle basic cases or single filters first.
    // In a real enterprise app, we'd use a more robust builder.
    if (filter.condition1) {
      applySingleFilter(query, colId, filter.condition1)
      applySingleFilter(query, colId, filter.condition2)
    }
    return
  }

  applySingleFilter(query, colId, filter)
}

function applySingleFilter(query: any, colId: string, filter: any) {
  const { filterType, type, filter: filterValue } = filter

  switch (filterType) {
    case 'text':
      switch (type) {
        case 'contains':
          query.ilike(colId, `%${filterValue}%`)
          break
        case 'notContains':
          query.not('ilike', colId, `%${filterValue}%`)
          break
        case 'equals':
          query.eq(colId, filterValue)
          break
        case 'notEqual':
          query.neq(colId, filterValue)
          break
        case 'startsWith':
          query.ilike(colId, `${filterValue}%`)
          break
        case 'endsWith':
          query.ilike(colId, `%${filterValue}`)
          break
      }
      break
    case 'number':
      const val = parseFloat(filterValue)
      const valTo = parseFloat(filter.filterTo)
      switch (type) {
        case 'equals':
          query.eq(colId, val)
          break
        case 'notEqual':
          query.neq(colId, val)
          break
        case 'greaterThan':
          query.gt(colId, val)
          break
        case 'greaterThanOrEqual':
          query.gte(colId, val)
          break
        case 'lessThan':
          query.lt(colId, val)
          break
        case 'lessThanOrEqual':
          query.lte(colId, val)
          break
        case 'inRange':
          query.gte(colId, val).lte(colId, valTo)
          break
      }
      break
    case 'date':
      // Simplified date filtering
      const date = filter.dateFrom
      const dateTo = filter.dateTo
      switch (type) {
        case 'equals':
          query.eq(colId, date)
          break
        case 'greaterThan':
          query.gt(colId, date)
          break
        case 'lessThan':
          query.lt(colId, date)
          break
        case 'inRange':
          query.gte(colId, date).lte(colId, dateTo)
          break
      }
      break
  }
}
