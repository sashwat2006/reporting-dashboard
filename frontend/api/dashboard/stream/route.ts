// Server-Sent Events for Real-time Updates
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder()

  const customReadable = new ReadableStream({
    start(controller) {
      // Send initial data
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "connected", timestamp: new Date() })}\n\n`))

      // Set up interval to send updates
      const interval = setInterval(async () => {
        try {
          // Fetch latest data from your database
          const latestData = await fetchLatestDashboardData()

          controller.enqueue(encoder.encode(`data: ${JSON.stringify(latestData)}\n\n`))
        } catch (error) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: "Failed to fetch data" })}\n\n`))
        }
      }, 5000) // Update every 5 seconds

      // Cleanup on close
      request.signal.addEventListener("abort", () => {
        clearInterval(interval)
        controller.close()
      })
    },
  })

  return new Response(customReadable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}

async function fetchLatestDashboardData() {
  // Replace with your actual data fetching logic
  return {
    timestamp: new Date(),
    metrics: {
      revenue: Math.floor(Math.random() * 1000000) + 2000000,
      customers: Math.floor(Math.random() * 1000) + 15000,
      uptime: 99.9,
      employees: 1247,
    },
  }
}
