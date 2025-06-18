import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Wifi,
  Activity,
  Database,
  Building2,
  ArrowUp,
  Signal,
  Download,
  MapPin,
  Globe,
  BarChart,
  LineChart,
  Smartphone,
  Monitor,
  Router,
  HardDrive,
  PieChart,
} from "lucide-react";

export default function WirelessDashboard() {
  const tableauRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run on client
    if (!tableauRef.current) return;
    // Clean up any previous embeds
    tableauRef.current.innerHTML = "";
    // Create the container div
    const container = document.createElement("div");
    container.id = "viz1750257707708";
    container.style.position = "relative";
    container.style.width = "100%";
    container.style.maxWidth = "1200px";
    // Responsive height
    container.style.height = "800px";
    // Add the Tableau object
    container.innerHTML = `
      <noscript>
        <a href="#">
          <img alt="Dashboard 1 (2) " src="https://public.tableau.com/static/images/Ac/AcquisitionSheets/Dashboard12/1_rss.png" style="border: none" />
        </a>
      </noscript>
      <object class="tableauViz" style="display:none;width:100%;height:800px;">
        <param name="host_url" value="https%3A%2F%2Fpublic.tableau.com%2F" />
        <param name="embed_code_version" value="3" />
        <param name="site_root" value="" />
        <param name="name" value="AcquisitionSheets/Dashboard12" />
        <param name="tabs" value="no" />
        <param name="toolbar" value="yes" />
        <param name="static_image" value="https://public.tableau.com/static/images/Ac/AcquisitionSheets/Dashboard12/1.png" />
        <param name="animate_transition" value="yes" />
        <param name="display_static_image" value="yes" />
        <param name="display_spinner" value="yes" />
        <param name="display_overlay" value="yes" />
        <param name="display_count" value="yes" />
        <param name="language" value="en-US" />
      </object>
    `;
    tableauRef.current.appendChild(container);
    // Add the Tableau script
    const script = document.createElement("script");
    script.src = "https://public.tableau.com/javascripts/api/viz_v1.js";
    script.async = true;
    container.appendChild(script);
  }, []);

  const renderEnhancedWirelessDashboard = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold tracking-tight mb-2 text-white">Wireless Services</h2>
          <p className="text-lg text-slate-300">Mobile and wireless telecommunications services</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30 px-4 py-2">
            <Wifi className="h-4 w-4 mr-2" />
            5G Ready
          </Badge>
          <Button
            variant="outline"
            size="sm"
            className="bg-slate-800/50 border-slate-600 text-slate-200 hover:bg-slate-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Active Subscribers", value: "89,432", change: "+7.8%", icon: Wifi, color: "purple" },
          { title: "Network Coverage", value: "96.5%", change: "Excellent", icon: Activity, color: "green" },
          { title: "Data Usage", value: "2.4TB", change: "+23%", icon: Database, color: "blue" },
          { title: "5G Towers", value: "234", change: "+12 new", icon: Building2, color: "emerald" },
        ].map((metric, index) => (
          <Card
            key={metric.title}
            className="relative overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50 hover:border-slate-600 transition-all duration-300 group"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-r from-${metric.color}-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            ></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
              <CardTitle className="text-sm font-medium text-slate-200">{metric.title}</CardTitle>
              <div
                className={`p-3 bg-gradient-to-br from-${metric.color}-500/20 to-${metric.color}-600/20 rounded-xl border border-${metric.color}-500/30`}
              >
                <metric.icon className={`h-5 w-5 text-${metric.color}-400`} />
              </div>
            </CardHeader>
            <CardContent className="pt-2 relative z-10">
              <div className="text-3xl font-bold mb-2 text-white">{metric.value}</div>
              <p className="text-sm text-slate-300">
                <span
                  className={`${metric.change.includes("+") ? "text-green-400" : "text-blue-400"} flex items-center`}
                >
                  {metric.change.includes("+") && <ArrowUp className="h-4 w-4 mr-1" />}
                  {metric.change}
                </span>
                {metric.change.includes("%") && " from last month"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Network Performance Tabs */}
      <Tabs defaultValue="acquisition" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
          <TabsTrigger
            value="acquisition"
            className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400"
          >
            Acquisition
          </TabsTrigger>
          <TabsTrigger
            value="performance"
            className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400"
          >
            Performance
          </TabsTrigger>
          <TabsTrigger
            value="devices"
            className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400"
          >
            Devices
          </TabsTrigger>
          <TabsTrigger
            value="plans"
            className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400"
          >
            Plans
          </TabsTrigger>
        </TabsList>

        <TabsContent value="acquisition" className="space-y-6">
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <Signal className="h-5 w-5 text-purple-400" />
                  Acquisition by Technology
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    tech: "5G",
                    acquired: 1200,
                    color: "from-purple-500 to-pink-500",
                  },
                  {
                    tech: "4G LTE",
                    acquired: 950,
                    color: "from-blue-500 to-purple-500",
                  },
                  {
                    tech: "3G",
                    acquired: 400,
                    color: "from-green-500 to-blue-500",
                  },
                ].map((item, index) => {
                  return (
                    <div key={item.tech} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-200">{item.tech}</span>
                        <div className="flex gap-4 text-xs text-slate-400">
                          <span>Acquired: {item.acquired}</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-2">
                        <div
                          className={`h-2 bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000`}
                          style={{ width: `${(item.acquired / 1200) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-purple-400" />
                  Acquisition by Region
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg flex items-center justify-center border border-purple-500/20">
                  <div className="text-center">
                    <Globe className="h-12 w-12 text-purple-400 mx-auto mb-3" />
                    <p className="text-slate-300">Interactive Acquisition Map</p>
                    <p className="text-slate-400 text-sm mt-1">5G/4G acquisition visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Tableau Dashboard Embed */}
          <div className="w-full flex justify-center mt-8">
            <div ref={tableauRef} style={{ width: '100%', maxWidth: 1200, height: 800 }} />
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-lg text-white">Speed Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Avg Download Speed", value: "45.2 Mbps", trend: "+12%" },
                  { label: "Avg Upload Speed", value: "12.8 Mbps", trend: "+8%" },
                  { label: "Latency", value: "28ms", trend: "-5%" },
                  { label: "Jitter", value: "3.2ms", trend: "-2%" },
                ].map((metric, index) => (
                  <div key={metric.label} className="flex items-center justify-between py-2">
                    <span className="text-sm text-slate-200">{metric.label}</span>
                    <div className="text-right">
                      <div className="text-sm font-medium text-white">{metric.value}</div>
                      <div className={`text-xs ${metric.trend.includes("+") ? "text-green-400" : "text-red-400"}`}>
                        {metric.trend}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-lg text-white">Network Load</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
                  <div className="text-center">
                    <BarChart className="h-12 w-12 text-blue-400 mx-auto mb-3" />
                    <p className="text-slate-300">Real-time Load Chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-lg text-white">Data Usage Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-lg flex items-center justify-center border border-green-500/20">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 text-green-400 mx-auto mb-3" />
                    <p className="text-slate-300">Usage Trend Analysis</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="devices" className="space-y-6">
          <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-purple-400" />
                Connected Devices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                  { type: "Smartphones", count: "67,234", icon: Smartphone, color: "purple" },
                  { type: "Tablets", count: "12,456", icon: Monitor, color: "blue" },
                  { type: "IoT Devices", count: "8,932", icon: Router, color: "green" },
                  { type: "Modems", count: "810", icon: HardDrive, color: "orange" },
                ].map((device, index) => (
                  <div key={device.type} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 bg-${device.color}-500/20 rounded-lg border border-${device.color}-500/30`}>
                        <device.icon className={`h-4 w-4 text-${device.color}-400`} />
                      </div>
                      <span className="text-sm font-medium text-slate-200">{device.type}</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{device.count}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <PieChart className="h-5 w-5 text-purple-400" />
                Plan Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  {[
                    {
                      plan: "Unlimited Premium",
                      subscribers: 34567,
                      percentage: 39,
                      color: "from-purple-500 to-pink-500",
                    },
                    {
                      plan: "Unlimited Standard",
                      subscribers: 28934,
                      percentage: 32,
                      color: "from-blue-500 to-purple-500",
                    },
                    { plan: "5GB Plan", subscribers: 15678, percentage: 18, color: "from-green-500 to-blue-500" },
                    { plan: "2GB Plan", subscribers: 10253, percentage: 11, color: "from-orange-500 to-red-500" },
                  ].map((plan, index) => (
                    <div key={plan.plan} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-200">{plan.plan}</span>
                        <span className="text-sm text-slate-300">
                          {plan.subscribers.toLocaleString()} ({plan.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-2">
                        <div
                          className={`h-2 bg-gradient-to-r ${plan.color} rounded-full transition-all duration-1000`}
                          style={{ width: `${plan.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="h-[250px] bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg flex items-center justify-center border border-purple-500/20">
                  <div className="text-center">
                    <PieChart className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                    <p className="text-slate-300">Plan Distribution Chart</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  return renderEnhancedWirelessDashboard();
}