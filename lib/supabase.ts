import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Profile = {
  id: string
  username: string
  tokens: number
}

export type Ad = {
  id: number
  user_id: string
  title: string
  description: string
  link: string
  tokens_spent: number
  created_at: string
  profiles?: Profile
}

export type AdInteraction = {
  id: number
  ad_id: number
  user_id: string
  type: 'view' | 'click'
  created_at: string
}
