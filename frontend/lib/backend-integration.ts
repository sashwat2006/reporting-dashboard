// Client-side integration layer (no sensitive data)
export class BackendIntegration {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "") // Remove trailing slash
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    // Use Next.js API routes instead of direct backend calls
    const url = `/api/backend${endpoint}`

    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error)
      throw error
    }
  }

  // Map your existing backend endpoints (now through Next.js API routes)
  async getDashboardMetrics() {
    return this.makeRequest("/metrics")
  }

  async getWirelineData() {
    return this.makeRequest("/network/wireline")
  }

  async getWirelessData() {
    return this.makeRequest("/network/wireless")
  }

  async getHRData() {
    return this.makeRequest("/hr/metrics")
  }

  async getSalesData() {
    return this.makeRequest("/sales/dashboard")
  }

  async getFinanceData() {
    return this.makeRequest("/finance/overview")
  }

  async getStrategyData() {
    return this.makeRequest("/strategy/projects")
  }
}

// Initialize without API key (handled server-side)
export const backendAPI = new BackendIntegration(process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000")
