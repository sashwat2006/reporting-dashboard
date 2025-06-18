// API Route for Dashboard Metrics
import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client"

export async function GET() {
  try {
    // Fetch from your database
    const { data: metrics, error } = await supabase
      .from("dashboard_metrics")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(1)

    if (error) throw error

    // You can also fetch from multiple sources
    const externalData = await Promise.all([fetchFromCRM(), fetchFromBilling(), fetchFromNetworkMonitoring()])

    return NextResponse.json({
      internal: metrics[0],
      external: externalData,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 })
  }
}

// Example external API integrations
async function fetchFromCRM() {
  const response = await fetch(`${process.env.CRM_API_URL}/customers/count`, {
    headers: {
      Authorization: `Bearer ${process.env.CRM_API_TOKEN}`,
      "Content-Type": "application/json",
    },
  })
  return response.json()
}

async function fetchFromBilling() {
  const response = await fetch(`${process.env.BILLING_API_URL}/revenue/current`, {
    headers: {
      Authorization: `Bearer ${process.env.BILLING_API_TOKEN}`,
    },
  })
  return response.json()
}

async function fetchFromNetworkMonitoring() {
  const response = await fetch(`${process.env.NETWORK_API_URL}/status`, {
    headers: {
      "X-API-Key": process.env.NETWORK_API_KEY,
    },
  })
  return response.json()
}
