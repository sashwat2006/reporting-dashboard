// Supabase Setup for Real-time Data (Recommended)
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Tables Structure
export interface DashboardMetrics {
  id: string
  metric_type: "revenue" | "customers" | "uptime" | "employees"
  value: number
  previous_value: number
  percentage_change: number
  department: string
  timestamp: string
  created_at: string
}

export interface NetworkMetrics {
  id: string
  service_type: "wireline" | "wireless"
  active_lines: number
  uptime_percentage: number
  revenue: number
  service_tickets: number
  timestamp: string
}

export interface SalesData {
  id: string
  salesperson: string
  revenue: number
  target: number
  customers_acquired: number
  conversion_rate: number
  pipeline_value: number
  timestamp: string
}

// Real-time subscription setup
export function subscribeToMetrics(callback: (data: DashboardMetrics[]) => void) {
  return supabase
    .channel("dashboard-metrics")
    .on("postgres_changes", { event: "*", schema: "public", table: "dashboard_metrics" }, (payload) => {
      console.log("Real-time update:", payload)
      // Fetch updated data and call callback
      fetchLatestMetrics().then(callback)
    })
    .subscribe()
}

export async function fetchLatestMetrics(): Promise<DashboardMetrics[]> {
  const { data, error } = await supabase
    .from("dashboard_metrics")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(100)

  if (error) throw error
  return data || []
}
