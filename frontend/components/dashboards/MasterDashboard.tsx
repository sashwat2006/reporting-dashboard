import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Activity, ArrowUp, ArrowDown, DollarSign, Users, Building2, BarChart3, Zap, Wifi, Target, Bell, Database, CheckCircle, Eye, Filter, RefreshCw, Server, Settings, Network, Cpu, Shield, FileText, Globe, MapPin, Clock,
  Download
} from "lucide-react";

export default function MasterDashboard() {
  const [isRealTime, setIsRealTime] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [animatedValues, setAnimatedValues] = useState({
    revenue: 2400000,
    customers: 15234,
    uptime: 99.9,
    employees: 1247,
  });

  useEffect(() => {
    if (!isRealTime) return;
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      setAnimatedValues((prev) => ({
        revenue: prev.revenue + Math.floor(Math.random() * 1000) - 500,
        customers: prev.customers + Math.floor(Math.random() * 10) - 5,
        uptime: Math.max(99.0, Math.min(100, prev.uptime + (Math.random() - 0.5) * 0.1)),
        employees: prev.employees + (Math.random() > 0.95 ? 1 : 0),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, [isRealTime]);

  const renderEnhancedMasterDashboard = () => (
    <div className="space-y-8">
      {/* Enhanced Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold tracking-tight mb-2 text-white">
            Master Dashboard
            <span className="ml-3 text-lg font-normal text-slate-400">
              {isRealTime && (
                <span className="inline-flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  Live
                </span>
              )}
            </span>
          </h2>
          <p className="text-lg text-slate-300">
            Comprehensive overview • Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-2">
                  <Switch checked={isRealTime} onCheckedChange={setIsRealTime} />
                  <span className="text-sm text-slate-300">Real-time</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle real-time data updates</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            variant="outline"
            size="sm"
            className="bg-slate-800/50 border-slate-600 text-slate-200 hover:bg-slate-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-slate-800/50 border-slate-600 text-slate-200 hover:bg-slate-700"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-slate-800/50 border-slate-600 text-slate-200 hover:bg-slate-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Enhanced KPI Cards with Animations */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
            <CardTitle className="text-sm font-medium text-slate-200">Total Revenue</CardTitle>
            <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-xl border border-emerald-500/30">
              <DollarSign className="h-5 w-5 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-2 relative z-10">
            <div className="text-3xl font-bold mb-2 text-white">${(animatedValues.revenue / 1000000).toFixed(1)}M</div>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-2 py-1">
                <ArrowUp className="h-3 w-3 mr-1" />
                +12.5%
              </Badge>
              <span className="text-xs text-slate-400">vs last month</span>
            </div>
            <Progress value={85} className="mt-3 h-2 bg-slate-700" />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
            <CardTitle className="text-sm font-medium text-slate-200">Active Customers</CardTitle>
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl border border-blue-500/30">
              <Users className="h-5 w-5 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-2 relative z-10">
            <div className="text-3xl font-bold mb-2 text-white">{animatedValues.customers.toLocaleString()}</div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-2 py-1">
                <ArrowUp className="h-3 w-3 mr-1" />
                +8.2%
              </Badge>
              <span className="text-xs text-slate-400">vs last month</span>
            </div>
            <Progress value={78} className="mt-3 h-2 bg-slate-700" />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50 hover:border-green-500/50 transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
            <CardTitle className="text-sm font-medium text-slate-200">Network Uptime</CardTitle>
            <div className="p-3 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl border border-green-500/30">
              <Activity className="h-5 w-5 text-green-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-2 relative z-10">
            <div className="text-3xl font-bold mb-2 text-white">{animatedValues.uptime.toFixed(1)}%</div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-2 py-1">
                <CheckCircle className="h-3 w-3 mr-1" />
                Excellent
              </Badge>
              <span className="text-xs text-slate-400">performance</span>
            </div>
            <Progress value={99.9} className="mt-3 h-2 bg-slate-700" />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
            <CardTitle className="text-sm font-medium text-slate-200">Employee Count</CardTitle>
            <div className="p-3 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl border border-purple-500/30">
              <Building2 className="h-5 w-5 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-2 relative z-10">
            <div className="text-3xl font-bold mb-2 text-white">{animatedValues.employees.toLocaleString()}</div>
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-2 py-1">
                <ArrowUp className="h-3 w-3 mr-1" />
                +23 new
              </Badge>
              <span className="text-xs text-slate-400">this quarter</span>
            </div>
            <Progress value={92} className="mt-3 h-2 bg-slate-700" />
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Business Unit Performance */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-white">Business Unit Performance</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {[
              { name: "Wireline Services", value: 85, color: "from-cyan-500 to-blue-500", icon: Zap },
              { name: "Wireless Services", value: 92, color: "from-emerald-500 to-green-500", icon: Wifi },
              { name: "Sales Performance", value: 78, color: "from-orange-500 to-red-500", icon: BarChart3 },
              { name: "Strategic Initiatives", value: 67, color: "from-purple-500 to-pink-500", icon: Target },
            ].map((item, index) => (
              <div key={item.name} className="space-y-3 group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 bg-gradient-to-r ${item.color} rounded-lg opacity-80`}>
                      <item.icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-200">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-300">{item.value}%</span>
                    <Badge variant="outline" className="text-xs">
                      {item.value > 80 ? "Excellent" : item.value > 60 ? "Good" : "Needs Attention"}
                    </Badge>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000 ease-out shadow-lg`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Enhanced Quick Actions */}
        <Card className="col-span-3 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl text-white">Quick Actions</CardTitle>
            <CardDescription className="text-base text-slate-300">
              Frequently accessed reports and tools
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="grid gap-3">
              {[
                { icon: BarChart3, label: "Monthly Revenue Report", color: "emerald" },
                { icon: Users, label: "Customer Analytics", color: "blue" },
                { icon: Activity, label: "Network Status", color: "green" },
                { icon: Target, label: "Strategic Goals", color: "purple" },
                { icon: Bell, label: "System Alerts", color: "orange", badge: "3" },
                { icon: Database, label: "Data Export", color: "cyan" },
              ].map((action, index) => (
                <button
                  key={action.label}
                  className="group relative flex items-center justify-start gap-3 rounded-xl border border-slate-700/50 bg-slate-800/30 p-4 text-left text-sm hover:bg-slate-700/50 hover:border-slate-600 transition-all duration-200 text-slate-200 hover:text-white overflow-hidden"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-${action.color}-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  ></div>
                  <div
                    className={`p-2 bg-${action.color}-500/20 rounded-lg border border-${action.color}-500/30 relative z-10`}
                  >
                    <action.icon className={`h-4 w-4 text-${action.color}-400`} />
                  </div>
                  <span className="relative z-10 flex-1">{action.label}</span>
                  {action.badge && (
                    <Badge
                      className={`bg-${action.color}-500/20 text-${action.color}-400 border-${action.color}-500/30 relative z-10`}
                    >
                      {action.badge}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced System Status */}
      <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Server className="h-5 w-5 text-blue-400" />
            System Status & Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Network Infrastructure",
                status: "operational",
                icon: Network,
                details: "All systems running smoothly",
                color: "green",
              },
              {
                title: "Data Processing",
                status: "warning",
                icon: Cpu,
                details: "High CPU usage detected",
                color: "yellow",
              },
              {
                title: "Security Systems",
                status: "operational",
                icon: Shield,
                details: "All security protocols active",
                color: "green",
              },
            ].map((system, index) => (
              <div
                key={system.title}
                className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
              >
                <div className={`p-2 bg-${system.color}-500/20 rounded-lg border border-${system.color}-500/30`}>
                  <system.icon className={`h-5 w-5 text-${system.color}-400`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{system.title}</span>
                    <div
                      className={`w-2 h-2 rounded-full bg-${system.color}-400 ${system.status === "operational" ? "animate-pulse" : ""}`}
                    ></div>
                  </div>
                  <p className="text-sm text-slate-400">{system.details}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return renderEnhancedMasterDashboard();
}