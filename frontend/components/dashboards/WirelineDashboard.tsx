import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Network, Signal, Zap, Activity, DollarSign, AlertTriangle, ArrowUp, ArrowDown, MapPin, Globe, FileText, Download, Clock } from "lucide-react";

export default function WirelineDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold tracking-tight mb-2 text-white">Wireline Services</h2>
          <p className="text-lg text-slate-300">Fixed-line telecommunications infrastructure and services</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30 px-4 py-2">
            <Signal className="h-4 w-4 mr-2" />
            Network Stable
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
          { title: "Active Lines", value: "45,678", change: "+2.1%", icon: Zap, color: "cyan" },
          { title: "Network Uptime", value: "99.8%", change: "Above target", icon: Activity, color: "green" },
          { title: "Revenue", value: "$890K", change: "+5.4%", icon: DollarSign, color: "emerald" },
          { title: "Service Tickets", value: "127", change: "-15%", icon: AlertTriangle, color: "orange" },
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
                  className={`${metric.change.includes("+") ? "text-green-400" : metric.change.includes("-") ? "text-red-400" : "text-blue-400"} flex items-center`}
                >
                  {metric.change.includes("+") && <ArrowUp className="h-4 w-4 mr-1" />}
                  {metric.change.includes("-") && <ArrowDown className="h-4 w-4 mr-1" />}
                  {metric.change}
                </span>
                {metric.change.includes("%") && " from last month"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Infrastructure Health */}
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Network className="h-5 w-5 text-cyan-400" />
              Infrastructure Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {[
              { name: "Fiber Network", value: 98, color: "from-cyan-500 to-blue-500", status: "Excellent" },
              { name: "Copper Lines", value: 94, color: "from-emerald-500 to-green-500", status: "Good" },
              { name: "Data Centers", value: 100, color: "from-green-500 to-emerald-500", status: "Perfect" },
              { name: "Switching Equipment", value: 89, color: "from-yellow-500 to-orange-500", status: "Monitoring" },
            ].map((item, index) => (
              <div key={item.name} className="space-y-3 group">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-200">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-300">{item.value}%</span>
                    <Badge variant="outline" className="text-xs">
                      {item.status}
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

        <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-400" />
              Service Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {[
              { label: "Average Response Time", value: "2.3 hours", status: "good" },
              { label: "First Call Resolution", value: "87%", status: "excellent" },
              { label: "Customer Satisfaction", value: "4.2/5", status: "good" },
              { label: "SLA Compliance", value: "96%", status: "excellent" },
            ].map((metric, index) => (
              <div
                key={metric.label}
                className="flex items-center justify-between py-3 px-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-colors"
              >
                <span className="text-sm text-slate-200">{metric.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">{metric.value}</span>
                  <div
                    className={`w-2 h-2 rounded-full ${metric.status === "excellent" ? "bg-green-400" : "bg-blue-400"}`}
                  ></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Network Coverage Map */}
      <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <MapPin className="h-5 w-5 text-cyan-400" />
            Network Coverage Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg flex items-center justify-center border border-cyan-500/20">
            <div className="text-center">
              <Globe className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
              <p className="text-slate-300 text-lg">Interactive Network Coverage Map</p>
              <p className="text-slate-400 text-sm mt-2">Real-time fiber and copper line coverage visualization</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Tickets Table */}
      <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-orange-400" />
            Recent Service Tickets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                id: "WL-2024-001",
                customer: "Enterprise Corp",
                issue: "Fiber outage",
                priority: "High",
                status: "In Progress",
                time: "2 hours ago",
              },
              {
                id: "WL-2024-002",
                customer: "Local Business",
                issue: "Slow connection",
                priority: "Medium",
                status: "Assigned",
                time: "4 hours ago",
              },
              {
                id: "WL-2024-003",
                customer: "Residential",
                issue: "No dial tone",
                priority: "Low",
                status: "Resolved",
                time: "6 hours ago",
              },
              {
                id: "WL-2024-004",
                customer: "Government Office",
                issue: "Line interference",
                priority: "High",
                status: "Escalated",
                time: "8 hours ago",
              },
            ].map((ticket, index) => (
              <div
                key={ticket.id}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-white">{ticket.id}</span>
                    <span className="text-sm text-slate-400">{ticket.customer}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-slate-200">{ticket.issue}</span>
                    <span className="text-xs text-slate-400">{ticket.time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    className={`${ticket.priority === "High" ? "bg-red-500/20 text-red-400 border-red-500/30" : ticket.priority === "Medium" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" : "bg-green-500/20 text-green-400 border-green-500/30"}`}
                  >
                    {ticket.priority}
                  </Badge>
                  <Badge
                    className={`${ticket.status === "Resolved" ? "bg-green-500/20 text-green-400 border-green-500/30" : ticket.status === "Escalated" ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-blue-500/20 text-blue-400 border-blue-500/30"}`}
                  >
                    {ticket.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}