"use client"
import { BarChart3, Calculator, ChevronUp, Home, Target, Users, Wifi, Zap } from "lucide-react"
// Remove the Image import at the top
// Remove: import Image from "next/image"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const data = {
  user: {
    name: "Cloud Extel Admin",
    email: "admin@cloudextel.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  navMain: [
    {
      title: "Master",
      url: "#",
      icon: Home,
      id: "master",
    },
    {
      title: "Wireline",
      url: "#",
      icon: Zap,
      id: "wireline",
    },
    {
      title: "Wireless",
      url: "#",
      icon: Wifi,
      id: "wireless",
    },
    {
      title: "HR & Admin",
      url: "#",
      icon: Users,
      id: "hr-admin",
    },
    {
      title: "Sales",
      url: "#",
      icon: BarChart3,
      id: "sales",
    },
    {
      title: "Strategy",
      url: "#",
      icon: Target,
      id: "strategy",
    },
    {
      title: "Finance",
      url: "#",
      icon: Calculator,
      id: "finance",
    },
  ],
}

interface AppSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function AppSidebar({ activeTab, setActiveTab }: AppSidebarProps) {
  return (
    <Sidebar variant="inset" className="bg-cloudextel-navy-dark border-r border-cloudextel-navy-light">
      <SidebarHeader className="bg-cloudextel-navy-dark border-b border-cloudextel-navy-light">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-cloudextel-navy-light">
              {/* Replace the Image component in the SidebarHeader with: */}
              <div className="flex items-center gap-3 p-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-cloudextel-navy flex items-center justify-center">
                    <Home className="h-5 w-5 text-white" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-white">Cloud Extel</span>
                    <span className="truncate text-xs text-slate-300">Insights Hub</span>
                  </div>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-cloudextel-navy-dark">
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-300 text-xs uppercase tracking-wider font-semibold">
            Dashboards
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    onClick={() => setActiveTab(item.id)}
                    isActive={activeTab === item.id}
                    className={`
                      text-slate-200 hover:bg-cloudextel-navy-light hover:text-white transition-all duration-200
                      ${
                        activeTab === item.id ? "bg-cloudextel-navy text-white shadow-lg shadow-cloudextel-navy/20" : ""
                      }
                    `}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-cloudextel-navy-dark border-t border-cloudextel-navy-light">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-cloudextel-navy-light hover:bg-cloudextel-navy-light text-slate-200"
                >
                  <Avatar className="h-8 w-8 rounded-lg border-2 border-cloudextel-navy">
                    <AvatarImage src={data.user.avatar || "/placeholder.svg"} alt={data.user.name} />
                    <AvatarFallback className="rounded-lg bg-cloudextel-navy text-white">CE</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-white">{data.user.name}</span>
                    <span className="truncate text-xs text-slate-300">{data.user.email}</span>
                  </div>
                  <ChevronUp className="ml-auto size-4 text-slate-300" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-cloudextel-navy-dark border-cloudextel-navy-light"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem className="text-slate-200 hover:bg-cloudextel-navy-light hover:text-white">
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-slate-200 hover:bg-cloudextel-navy-light hover:text-white">
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-slate-200 hover:bg-cloudextel-navy-light hover:text-white">
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
