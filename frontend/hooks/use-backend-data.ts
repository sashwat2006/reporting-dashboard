"use client"

import { useState, useEffect } from "react"
import { backendAPI } from "@/lib/backend-integration"
import { DataAdapter } from "@/lib/data-adapters"

export function useBackendData(section: string, refreshInterval = 30000) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        let rawData

        // Route to appropriate backend endpoint
        switch (section) {
          case "master":
            rawData = await backendAPI.getDashboardMetrics()
            setData(DataAdapter.adaptMasterDashboard(rawData))
            break
          case "wireline":
            rawData = await backendAPI.getWirelineData()
            setData(DataAdapter.adaptWirelineData(rawData))
            break
          case "sales":
            rawData = await backendAPI.getSalesData()
            setData(DataAdapter.adaptSalesData(rawData))
            break
          // Add more cases for other sections
          default:
            throw new Error(`Unknown section: ${section}`)
        }

        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data")
        console.error(`Error fetching ${section} data:`, err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Set up polling for updates
    const interval = setInterval(fetchData, refreshInterval)

    return () => clearInterval(interval)
  }, [section, refreshInterval])

  return { data, loading, error }
}
