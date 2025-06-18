"use client"

// Configuration for adding new dashboard tabs
export const dashboardConfig = {
  // Add your custom dashboard tabs here
  tabs: [
    {
      id: "master",
      title: "Master",
      icon: "Home",
      component: "MasterDashboard",
    },
    {
      id: "wireline",
      title: "Wireline",
      icon: "Zap",
      component: "WirelineDashboard",
    },
    // Add your custom tabs:
    {
      id: "custom-analytics",
      title: "Custom Analytics",
      icon: "BarChart3",
      component: "CustomAnalyticsDashboard",
    },
    {
      id: "real-time-monitoring",
      title: "Real-time Monitoring",
      icon: "Activity",
      component: "RealTimeMonitoringDashboard",
    },
  ],

  // Theme configuration
  theme: {
    primary: "blue",
    accent: "purple",
    darkMode: true,
  },

  // Data refresh intervals (in milliseconds)
  refreshIntervals: {
    realTime: 5000, // 5 seconds
    standard: 30000, // 30 seconds
    slow: 300000, // 5 minutes
  },
}
