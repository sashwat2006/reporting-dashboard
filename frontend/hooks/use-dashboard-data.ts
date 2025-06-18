"use client"

import { useState, useEffect } from "react"

// Custom hook for managing dashboard data
export function useDashboardData(endpoint: string, refreshInterval = 30000) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch(endpoint)
      if (!response.ok) throw new Error("Failed to fetch data")
      const result = await response.json()
      setData(result)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    // Set up automatic refresh
    const interval = setInterval(fetchData, refreshInterval)
    return () => clearInterval(interval)
  }, [endpoint, refreshInterval])

  return { data, loading, error, refetch: fetchData }
}

// Usage example:
// const { data, loading, error } = useDashboardData('/api/dashboard/sales')
