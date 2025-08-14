import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 数据库类型定义
export interface Profile {
  id: string
  phone?: string
  full_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  name: string
  description?: string
  duration: number // 分钟
  price: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  user_id?: string
  service_id: string
  appointment_date: string
  appointment_time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  notes?: string
  customer_name?: string
  customer_phone?: string
  created_at: string
  updated_at: string
  service?: Service
}





