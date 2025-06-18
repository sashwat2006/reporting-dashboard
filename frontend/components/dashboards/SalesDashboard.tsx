import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Activity,
  Building2,
  Target,
  Download,
  ArrowUp,
  ArrowDown,
  DollarSign,
  BarChart3,
  CheckCircle,
  Award,
  Calendar,
  Briefcase,
  Star,
  Globe,
  MapPin,
  PieChart,
  LineChart,
  Phone,
  Mail,
  UserCheck,
  UserX,
  Car,
  Home,
  TrendingUp,
} from "lucide-react";

const renderEnhancedSalesDashboard = () => (
  <div className="space-y-8">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-4xl font-bold tracking-tight mb-2 text-white">
          Sales Dashboard
        </h2>
        <p className="text-lg text-slate-300">
          Sales performance and revenue tracking
        </p>
      </div>
      <div className="flex items-center gap-4">
        <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30 px-4 py-2">
          <Target className="h-4 w-4 mr-2" />
          Target: 112% Achieved
        </Badge>
        <Button
          variant="outline"
          size="sm"
          className="bg-slate-800/50 border-slate-600 text-slate-200 hover:bg-slate-700"
        >
          <Download className="h-4 w-4 mr-2" />
          Sales Report
        </Button>
      </div>
    </div>

    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {[
        { title: "Monthly Revenue", value: "$1.2M", change: "+18.2%", icon: DollarSign, color: "emerald" },
        { title: "New Customers", value: "456", change: "+12%", icon: Users, color: "blue" },
        { title: "Conversion Rate", value: "24.5%", change: "+3.2%", icon: Target, color: "purple" },
        { title: "Pipeline Value", value: "$3.4M", change: "234 opportunities", icon: BarChart3, color: "orange" },
      ].map((metric, index) => (
        <Card
          key={metric.title}
          className="relative overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50 hover:border-slate-600 transition-all duration-300 group"
        >
          <div
            className={`absolute inset-0 bg-gradient-to-r from-${metric.color}-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
          ></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
            <CardTitle className="text-sm font-medium text-slate-200">
              {metric.title}
            </CardTitle>
            <div
              className={`p-3 bg-gradient-to-br from-${metric.color}-500/20 to-${metric.color}-600/20 rounded-xl border border-${metric.color}-500/30`}
            >
              <metric.icon className={`h-5 w-5 text-${metric.color}-400`} />
            </div>
          </CardHeader>
          <CardContent className="pt-2 relative z-10">
            <div className="text-3xl font-bold mb-2 text-white">
              {metric.value}
            </div>
            <p className="text-sm text-slate-300">
              <span className="text-green-400 flex items-center">
                {metric.change.includes("+") && (
                  <ArrowUp className="h-4 w-4 mr-1" />
                )}
                {metric.change}
              </span>
              {metric.change.includes("%") && " from last month"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Sales Team Performance and Pipeline */}
    <div className="grid gap-8 md:grid-cols-2">
      <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-emerald-400" />
            Sales Team Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {[
            {
              name: "Alex Thompson",
              target: 200000,
              achieved: 234000,
              percentage: 118,
              color: "from-emerald-500 to-green-500",
            },
            {
              name: "Sarah Chen",
              target: 180000,
              achieved: 198000,
              percentage: 112,
              color: "from-blue-500 to-emerald-500",
            },
            {
              name: "Mike Rodriguez",
              target: 175000,
              achieved: 187000,
              percentage: 105,
              color: "from-purple-500 to-blue-500",
            },
            {
              name: "Emily Davis",
              target: 160000,
              achieved: 156000,
              percentage: 89,
              color: "from-orange-500 to-purple-500",
            },
          ].map((rep, index) => (
            <div key={rep.name} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-200">{rep.name}</span>
                <span className="text-sm text-slate-300">
                  ${(rep.achieved / 1000).toFixed(0)}K ({rep.percentage}%)
                </span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-3">
                <div
                  className={`h-3 bg-gradient-to-r ${rep.color} rounded-full transition-all duration-1000`}
                  style={{ width: `${Math.min(rep.percentage, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Target: ${(rep.target / 1000).toFixed(0)}K</span>
                <span>Achieved: ${(rep.achieved / 1000).toFixed(0)}K</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Target className="h-5 w-5 text-orange-400" />
            Sales Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { stage: "Prospecting", deals: 45, value: 890000, color: "blue" },
            { stage: "Qualification", deals: 32, value: 1200000, color: "purple" },
            { stage: "Proposal", deals: 18, value: 750000, color: "orange" },
            { stage: "Negotiation", deals: 12, value: 560000, color: "emerald" },
            { stage: "Closing", deals: 8, value: 340000, color: "green" },
          ].map((stage, index) => (
            <div
              key={stage.stage}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 bg-${stage.color}-500/20 rounded-lg border border-${stage.color}-500/30`}
                >
                  <span className={`text-${stage.color}-400 font-medium text-sm`}>
                    {stage.deals}
                  </span>
                </div>
                <span className="text-sm font-medium text-slate-200">
                  {stage.stage}
                </span>
              </div>
              <span className="text-sm text-slate-300">
                ${(stage.value / 1000).toFixed(0)}K
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>

    {/* Product Performance and Customer Acquisition */}
    <div className="grid gap-8 md:grid-cols-3">
      <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-emerald-400" />
            Product Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { product: "Enterprise Solutions", revenue: 456000, growth: 15 },
            { product: "Wireless Plans", revenue: 342000, growth: 8 },
            { product: "Fiber Internet", revenue: 298000, growth: 22 },
            { product: "Cloud Services", revenue: 187000, growth: 35 },
          ].map((product, index) => (
            <div key={product.product} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-200">{product.product}</span>
                <span className="text-sm font-medium text-white">
                  ${(product.revenue / 1000).toFixed(0)}K
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-700/50 rounded-full h-2">
                  <div
                    className="h-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-1000"
                    style={{ width: `${(product.revenue / 456000) * 100}%` }}
                  />
                </div>
                <span
                  className={`text-xs ${
                    product.growth > 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  +{product.growth}%
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            Customer Acquisition
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
            <div className="text-center">
              <LineChart className="h-12 w-12 text-blue-400 mx-auto mb-3" />
              <p className="text-slate-300">Acquisition Trends</p>
              <p className="text-slate-400 text-sm mt-1">
                Monthly growth analysis
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <PieChart className="h-5 w-5 text-purple-400" />
            Revenue Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg flex items-center justify-center border border-purple-500/20">
            <div className="text-center">
              <PieChart className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              <p className="text-slate-300">Revenue Distribution</p>
              <p className="text-slate-400 text-sm mt-1">
                By product category
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Recent Deals and Leaderboard */}
    <div className="grid gap-8 md:grid-cols-2">
      <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            Recent Deals Closed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              company: "TechCorp Industries",
              value: 125000,
              rep: "Alex Thompson",
              product: "Enterprise Solution",
              date: "2 hours ago",
            },
            {
              company: "Global Logistics",
              value: 89000,
              rep: "Sarah Chen",
              product: "Fiber Internet",
              date: "5 hours ago",
            },
            {
              company: "StartupXYZ",
              value: 45000,
              rep: "Mike Rodriguez",
              product: "Cloud Services",
              date: "1 day ago",
            },
            {
              company: "Manufacturing Co",
              value: 67000,
              rep: "Emily Davis",
              product: "Wireless Plans",
              date: "2 days ago",
            },
          ].map((deal, index) => (
            <div
              key={deal.company}
              className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
            >
              <div className="flex-1">
                <div className="font-medium text-white">{deal.company}</div>
                <div className="text-sm text-slate-400">
                  {deal.product} • {deal.rep}
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-emerald-400">
                  ${deal.value.toLocaleString()}
                </div>
                <div className="text-xs text-slate-400">{deal.date}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-400" />
            Monthly Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { rank: 1, name: "Alex Thompson", deals: 12, revenue: 234000, badge: "🥇" },
            { rank: 2, name: "Sarah Chen", deals: 10, revenue: 198000, badge: "🥈" },
            { rank: 3, name: "Mike Rodriguez", deals: 9, revenue: 187000, badge: "🥉" },
            { rank: 4, name: "Emily Davis", deals: 7, revenue: 156000, badge: "" },
          ].map((leader, index) => (
            <div
              key={leader.name}
              className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{leader.badge || `#${leader.rank}`}</span>
                <div>
                  <div className="font-medium text-white">{leader.name}</div>
                  <div className="text-sm text-slate-400">
                    {leader.deals} deals closed
                  </div>
                </div>
              </div>
              <div className="ml-auto text-right">
                <div className="font-medium text-emerald-400">
                  ${(leader.revenue / 1000).toFixed(0)}K
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
);

export default function SalesDashboard() {
  return renderEnhancedSalesDashboard();
}