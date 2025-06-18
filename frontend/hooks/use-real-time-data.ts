"use client"

import { useState, useEffect, useCallback } from "react"
import { subscribeToMetrics, type DashboardMetrics } from "@/lib/supabase-client"

export function useRealTimeData(refreshInterval = 30000) {
  const [data, setData] = useState<DashboardMetrics[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)

      // Fetch from multiple sources
      const [metricsData, networkData, salesData] = await Promise.all([
        fetch("/api/dashboard/metrics").then((res) => res.json()),
        fetch("/api/dashboard/network").then((res) => res.json()),
        fetch("/api/dashboard/sales").then((res) => res.json()),
      ])

      setData({
        metrics: metricsData,
        network: networkData,
        sales: salesData,
      })
      setLastUpdated(new Date())
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Initial data fetch
    fetchData()

    // Set up real-time subscription (Supabase)
    const subscription = subscribeToMetrics((newData) => {
      setData((prevData) => ({
        ...prevData,
        metrics: newData,
      }))
      setLastUpdated(new Date())
    })

    // Set up polling fallback
    const interval = setInterval(fetchData, refreshInterval)

    // Set up WebSocket connection for real-time updates
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001")

    ws.onmessage = (event) => {
      const update = JSON.parse(event.data)
      if (update.type === "dashboard_update") {
        setData((prevData) => ({
          ...prevData,
          [update.section]: update.data,
        }))
        setLastUpdated(new Date())
      }
    }

    ws.onerror = (error) => {
      console.error("WebSocket error:", error)
      // Fallback to polling if WebSocket fails
    }

    return () => {
      subscription.unsubscribe()
      clearInterval(interval)
      ws.close()
    }
  }, [fetchData, refreshInterval])

  return { data, loading, error, lastUpdated, refetch: fetchData }
}

// Hook for specific dashboard sections
export function useDashboardSection(section: string) {
  const [sectionData, setSectionData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSectionData() {
      try {
        const response = await fetch(`/api/dashboard/${section}`)
        const data = await response.json()
        setSectionData(data)
      } catch (error) {
        console.error(`Error fetching ${section} data:`, error)
      } finally {
        setLoading(false)
      }
    }

    fetchSectionData()

    // Set up real-time updates for this section
    const eventSource = new EventSource(`/api/dashboard/${section}/stream`)

    eventSource.onmessage = (event) => {
      const newData = JSON.parse(event.data)
      setSectionData(newData)
    }

    return () => eventSource.close()
  }, [section])

  return { data: sectionData, loading }
}
