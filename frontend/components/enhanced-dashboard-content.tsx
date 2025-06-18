"use client"

import { TooltipProvider } from "@/components/ui/tooltip"
import MasterDashboard from "@/components/dashboards/MasterDashboard"
import WirelineDashboard from "@/components/dashboards/WirelineDashboard"
import WirelessDashboard from "@/components/dashboards/WirelessDashboard"
import HRDashboard from "@/components/dashboards/HRDashboard"
import SalesDashboard from "@/components/dashboards/SalesDashboard"
import StrategyDashboard from "@/components/dashboards/StrategyDashboard"
import FinanceDashboard from "@/components/dashboards/FinanceDashboard"

interface EnhancedDashboardContentProps {
  activeTab: string
}

export function EnhancedDashboardContent({ activeTab }: EnhancedDashboardContentProps) {
  const dashboards: Record<string, React.FC> = {
    master: MasterDashboard,
    wireline: WirelineDashboard,
    wireless: WirelessDashboard,
    "hr-admin": HRDashboard,
    sales: SalesDashboard,
    strategy: StrategyDashboard,
    finance: FinanceDashboard,
  }

  const DashboardComponent = dashboards[activeTab] || MasterDashboard

  return (
    <TooltipProvider>
      <DashboardComponent />
    </TooltipProvider>
  )
}
