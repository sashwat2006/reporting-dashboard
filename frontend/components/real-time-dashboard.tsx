"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRealTimeData } from "@/hooks/use-real-time-data"
import { Activity } from "lucide-react"

export function RealTimeDashboard() {
  const { data, loading, error, lastUpdated } = useRealTimeData(10000) // Update every 10 seconds

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading real-time data...</div>
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold tracking-tight mb-2">Live Dashboard</h2>
          <p className="text-lg text-muted-foreground">
            Real-time data updates • Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-4 py-2">
          <Activity className="w-4 h-4 mr-2 animate-pulse" />
          Live
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium">Live Revenue</CardTitle>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-bold mb-2">${data?.metrics?.revenue?.toLocaleString() || "0"}</div>
            <p className="text-sm text-muted-foreground">Updates every 10 seconds</p>
          </CardContent>
        </Card>

        {/* Add more real-time cards */}
      </div>
    </div>
  )
}
