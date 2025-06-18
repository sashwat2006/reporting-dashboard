"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useBackendData } from "@/hooks/use-backend-data"
import { DollarSign, Users, Activity, Building2, ArrowUp } from "lucide-react"

interface IntegratedDashboardProps {
  section: string
}

export function IntegratedDashboard({ section }: IntegratedDashboardProps) {
  const { data, loading, error } = useBackendData(section)

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-2">
              <CardHeader className="pb-4">
                <div className="h-4 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded animate-pulse mb-2" />
                <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error loading data</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  // Render based on your actual data structure
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold tracking-tight mb-2">
            {section.charAt(0).toUpperCase() + section.slice(1)} Dashboard
          </h2>
          <p className="text-lg text-muted-foreground">
            Connected to your backend • Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-4 py-2">
          Live Data
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {data?.metrics && (
          <>
            <Card className="p-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-3xl font-bold mb-2">${data.metrics.totalRevenue?.toLocaleString() || "0"}</div>
                <p className="text-sm text-muted-foreground">
                  <span className="text-green-600 flex items-center">
                    <ArrowUp className="h-4 w-4 mr-1" />+{data.trends?.revenueGrowth || 0}%
                  </span>
                  from last month
                </p>
              </CardContent>
            </Card>

            <Card className="p-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                <Users className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-3xl font-bold mb-2">{data.metrics.activeCustomers?.toLocaleString() || "0"}</div>
                <p className="text-sm text-muted-foreground">
                  <span className="text-green-600 flex items-center">
                    <ArrowUp className="h-4 w-4 mr-1" />+{data.trends?.customerGrowth || 0}%
                  </span>
                  from last month
                </p>
              </CardContent>
            </Card>

            <Card className="p-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-medium">Network Uptime</CardTitle>
                <Activity className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-3xl font-bold mb-2">{data.metrics.networkUptime || 0}%</div>
                <p className="text-sm text-muted-foreground">
                  <span className="text-green-600">Excellent</span>
                  performance
                </p>
              </CardContent>
            </Card>

            <Card className="p-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-medium">Employee Count</CardTitle>
                <Building2 className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-3xl font-bold mb-2">{data.metrics.employeeCount?.toLocaleString() || "0"}</div>
                <p className="text-sm text-muted-foreground">
                  <span className="text-blue-600">Active employees</span>
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
