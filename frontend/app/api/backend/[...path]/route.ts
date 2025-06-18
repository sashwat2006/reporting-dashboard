import { type NextRequest, NextResponse } from "next/server"

// Server-side handler with access to sensitive environment variables
async function makeBackendRequest(path: string, options: RequestInit = {}) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:8000"
  const apiKey = process.env.API_KEY // Server-only environment variable

  const url = `${backendUrl}/api/${path}`

  const headers = {
    "Content-Type": "application/json",
    ...(apiKey && { Authorization: `Bearer ${apiKey}` }),
    ...options.headers,
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Backend request failed for ${path}:`, error)
    throw error
  }
}

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const path = params.path.join("/")
    const data = await makeBackendRequest(path)

    return NextResponse.json(data)
  } catch (error) {
    console.error("API route error:", error)
    return NextResponse.json({ error: "Failed to fetch data from backend" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const path = params.path.join("/")
    const body = await request.json()

    const data = await makeBackendRequest(path, {
      method: "POST",
      body: JSON.stringify(body),
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error("API route error:", error)
    return NextResponse.json({ error: "Failed to post data to backend" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const path = params.path.join("/")
    const body = await request.json()

    const data = await makeBackendRequest(path, {
      method: "PUT",
      body: JSON.stringify(body),
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error("API route error:", error)
    return NextResponse.json({ error: "Failed to update data in backend" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const path = params.path.join("/")

    const data = await makeBackendRequest(path, {
      method: "DELETE",
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error("API route error:", error)
    return NextResponse.json({ error: "Failed to delete data from backend" }, { status: 500 })
  }
}
