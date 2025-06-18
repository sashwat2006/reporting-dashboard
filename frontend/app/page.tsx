"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { EnhancedDashboardContent } from "@/components/enhanced-dashboard-content"
import { useState, useEffect } from "react"

export default function Page() {
  const [activeTab, setActiveTab] = useState("master")

  useEffect(() => {
    // Force dark mode
    document.documentElement.classList.add("dark")
  }, [])

  return (
    <div className="dark">
      <SidebarProvider>
        <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur border-b border-slate-700/50 shadow-lg">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1 text-slate-200 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200" />
              <Separator orientation="vertical" className="mr-2 h-4 bg-slate-600" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#" className="text-slate-300 hover:text-cyan-400 transition-colors">
                      Cloud Extel
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block text-slate-500" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="capitalize text-white font-medium">{activeTab} Dashboard</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-8 p-8 pt-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 25% 25%, #1e3a5f 0%, transparent 50%), 
                                 radial-gradient(circle at 75% 75%, #2a4a6b 0%, transparent 50%)`,
                }}
              ></div>
            </div>
            <div className="relative z-10">
              <EnhancedDashboardContent activeTab={activeTab} />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
