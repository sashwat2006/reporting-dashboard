// Adapters to transform your backend data to dashboard format
export interface DashboardData {
  metrics: {
    totalRevenue: number
    activeCustomers: number
    networkUptime: number
    employeeCount: number
  }
  trends: {
    revenueGrowth: number
    customerGrowth: number
  }
}

// Adapter for your existing data structure
export class DataAdapter {
  static adaptMasterDashboard(backendData: any): DashboardData {
    // Transform your backend data structure to match dashboard needs
    return {
      metrics: {
        totalRevenue: backendData.revenue?.total || 0,
        activeCustomers: backendData.customers?.active_count || 0,
        networkUptime: backendData.network?.uptime_percentage || 0,
        employeeCount: backendData.hr?.total_employees || 0,
      },
      trends: {
        revenueGrowth: backendData.revenue?.growth_percentage || 0,
        customerGrowth: backendData.customers?.growth_percentage || 0,
      },
    }
  }

  static adaptWirelineData(backendData: any) {
    return {
      activeLines: backendData.lines?.active || 0,
      uptime: backendData.network?.uptime || 0,
      revenue: backendData.revenue?.wireline || 0,
      serviceTickets: backendData.support?.open_tickets || 0,
    }
  }

  static adaptSalesData(backendData: any) {
    return {
      monthlyRevenue: backendData.sales?.monthly_total || 0,
      newCustomers: backendData.customers?.new_this_month || 0,
      conversionRate: backendData.sales?.conversion_rate || 0,
      pipelineValue: backendData.sales?.pipeline_total || 0,
      teamPerformance: backendData.sales?.team_metrics || [],
    }
  }

  // Add more adapters for other dashboard sections
}
