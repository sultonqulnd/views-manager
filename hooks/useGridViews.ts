'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'
import { GridView, GridConfig } from '@/types/grid'
import toast from 'react-hot-toast'

export function useGridViews(gridId: string) {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const { data: views = [], isLoading } = useQuery({
    queryKey: ['views', gridId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const { data, error } = await supabase
        .from('grid_views')
        .select('*')
        .eq('grid_id', gridId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data as GridView[]
    },
  })

  const saveViewMutation = useMutation({
    mutationFn: async ({ name, config, id }: { name: string; config: GridConfig; id?: string }) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      if (id && id !== 'default') {
        const { error } = await supabase
          .from('grid_views')
          .update({ config })
          .eq('id', id)
        if (error) throw error
      } else {
        const { data, error } = await supabase
          .from('grid_views')
          .insert({
            user_id: user.id,
            grid_id: gridId,
            name,
            config,
            is_default: false
          })
          .select()
          .single()
        if (error) throw error
        return data
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['views', gridId] })
      toast.success('View saved successfully')
    },
    onError: (error: any) => {
      toast.error(`Failed to save view: ${error.message}`)
    }
  })

  const deleteViewMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('grid_views')
        .delete()
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['views', gridId] })
      toast.success('View deleted')
    },
    onError: (error: any) => {
      toast.error(`Failed to delete view: ${error.message}`)
    }
  })

  return {
    views,
    isLoading,
    saveView: saveViewMutation.mutateAsync,
    isSaving: saveViewMutation.isPending,
    deleteView: deleteViewMutation.mutateAsync,
    isDeleting: deleteViewMutation.isPending
  }
}
