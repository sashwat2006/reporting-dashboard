"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { fetchMasterDashboardData, type DashboardData } from "@/lib/data-integration"

// Example of how to create your own custom dashboard component
export function CustomDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const dashboardData = await fetchMasterDashboardData()
        setData(dashboardData)
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()

    // Set up real-time updates
    const interval = setInterval(loadData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Your Custom Dashboard</h2>
          <p className="text-muted-foreground">Integrated with your real data sources</p>
        </div>
        <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
          Live Data
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${data?.metrics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-400">+{data?.trends.revenueGrowth}%</span>
              from last month
            </p>
          </CardContent>
        </Card>

        {/* Add more cards with your real data */}
      </div>
    </div>
  )
}
