import { NextRequest, NextResponse } from 'next/server'
import { fetchGridData } from '@/lib/api/grid'

export async function POST(request: NextRequest) {
  try {
    const { table, params } = await request.json()
    
    if (!table) {
      return NextResponse.json({ error: 'Table name is required' }, { status: 400 })
    }

    const { data, totalCount } = await fetchGridData(table, params)
    
    return NextResponse.json({ data, totalCount })
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
