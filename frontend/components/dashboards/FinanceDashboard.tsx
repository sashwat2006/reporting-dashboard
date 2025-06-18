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
  AlertTriangle,
} from "lucide-react";

const renderEnhancedFinanceDashboard = () => (
  <div className="space-y-8">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-4xl font-bold tracking-tight mb-2 text-white">
          Financial Overview
        </h2>
        <p className="text-lg text-slate-300">
          Financial performance and budget tracking
        </p>
      </div>
      <div className="flex items-center gap-4">
        <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30 px-4 py-2">
          <DollarSign className="h-4 w-4 mr-2" />
          Profitable
        </Badge>
        <Button
          variant="outline"
          size="sm"
          className="bg-slate-800/50 border-slate-600 text-slate-200 hover:bg-slate-700"
        >
          <Download className="h-4 w-4 mr-2" />
          Financial Report
        </Button>
      </div>
    </div>

    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {[
        {
          title: "Total Revenue",
          value: "$2.4M",
          change: "+12.5%",
          icon: DollarSign,
          color: "emerald",
        },
        {
          title: "Operating Expenses",
          value: "$1.8M",
          change: "+3.2%",
          icon: Calculator,
          color: "orange",
        },
        { title: "Net Profit", value: "$600K", change: "+25%", icon: Target, color: "green" },
        {
          title: "Cash Flow",
          value: "$1.2M",
          change: "Positive",
          icon: Activity,
          color: "blue",
        },
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
              <span
                className={`${
                  metric.change.includes("+")
                    ? "text-green-400"
                    : metric.change.includes("-")
                    ? "text-red-400"
                    : "text-blue-400"
                } flex items-center`}
              >
                {metric.change.includes("+") && (
                  <ArrowUp className="h-4 w-4 mr-1" />
                )}
                {metric.change.includes("-") && (
                  <ArrowDown className="h-4 w-4 mr-1" />
                )}
                {metric.change}
              </span>
              {metric.change.includes("%") && " from last month"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Revenue Breakdown and Budget Analysis */}
    <div className="grid gap-8 md:grid-cols-2">
      <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <PieChart className="h-5 w-5 text-emerald-400" />
            Revenue Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {[
            {
              service: "Wireless Services",
              revenue: 1100000,
              percentage: 46,
              color: "from-emerald-500 to-green-500",
            },
            {
              service: "Wireline Services",
              revenue: 890000,
              percentage: 37,
              color: "from-blue-500 to-cyan-500",
            },
            {
              service: "Enterprise Solutions",
              revenue: 310000,
              percentage: 13,
              color: "from-purple-500 to-pink-500",
            },
            {
              service: "Other Services",
              revenue: 100000,
              percentage: 4,
              color: "from-orange-500 to-red-500",
            },
          ].map((item, index) => (
            <div key={item.service} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-200">
                  {item.service}
                </span>
                <span className="text-sm text-slate-300">
                  ${(item.revenue / 1000).toFixed(0)}K ({item.percentage}%)
                </span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-3">
                <div
                  className={`h-3 bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-400" />
            Budget vs Actual
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {[
            {
              category: "Revenue Target",
              budget: 2200000,
              actual: 2400000,
              variance: 9,
            },
            {
              category: "Operating Expenses",
              budget: 1900000,
              actual: 1800000,
              variance: -5,
            },
            { category: "Marketing Spend", budget: 400000, actual: 380000, variance: -5 },
            { category: "R&D Investment", budget: 300000, actual: 320000, variance: 7 },
          ].map((item, index) => (
            <div key={item.category} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-200">
                  {item.category}
                </span>
                <span
                  className={`text-sm ${
                    item.variance > 0
                      ? "text-green-400"
                      : item.variance < 0
                      ? "text-red-400"
                      : "text-slate-300"
                  }`}
                >
                  {item.variance > 0 ? "+" : ""}
                  {item.variance}%
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Budget: ${(item.budget / 1000).toFixed(0)}K</span>
                  <span>Actual: ${(item.actual / 1000).toFixed(0)}K</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      item.variance > 0
                        ? "bg-gradient-to-r from-green-500 to-emerald-500"
                        : item.variance < 0
                        ? "bg-gradient-to-r from-red-500 to-orange-500"
                        : "bg-gradient-to-r from-blue-500 to-cyan-500"
                    }`}
                    style={{
                      width: `${Math.min((item.actual / item.budget) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>

    {/* Financial Trends and Cash Flow */}
    <div className="grid gap-8 md:grid-cols-3">
      <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            Revenue Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20">
            <div className="text-center">
              <LineChart className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
              <p className="text-slate-300">12-Month Revenue Trend</p>
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
            <Activity className="h-5 w-5 text-blue-400" />
            Cash Flow Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
            <div className="text-center">
              <BarChart className="h-12 w-12 text-blue-400 mx-auto mb-3" />
              <p className="text-slate-300">Cash Flow Projection</p>
              <p className="text-slate-400 text-sm mt-1">6-month forecast</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Calculator className="h-5 w-5 text-purple-400" />
            Expense Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg flex items-center justify-center border border-purple-500/20">
            <div className="text-center">
              <PieChart className="h-12 w-12 text-purple-400 mx-auto mb-3" />
              <p className="text-slate-300">Expense Distribution</p>
              <p className="text-slate-400 text-sm mt-1">By category breakdown</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Financial Ratios and Key Metrics */}
    <div className="grid gap-8 md:grid-cols-2">
      <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Target className="h-5 w-5 text-green-400" />
            Key Financial Ratios
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              ratio: "Gross Profit Margin",
              value: "25%",
              benchmark: "22%",
              status: "above",
            },
            {
              ratio: "Operating Margin",
              value: "15%",
              benchmark: "12%",
              status: "above",
            },
            { ratio: "Current Ratio", value: "2.1", benchmark: "2.0", status: "above" },
            { ratio: "Debt-to-Equity", value: "0.3", benchmark: "0.4", status: "below" },
            {
              ratio: "Return on Assets",
              value: "8.5%",
              benchmark: "7%",
              status: "above",
            },
            { ratio: "Quick Ratio", value: "1.8", benchmark: "1.5", status: "above" },
          ].map((ratio, index) => (
            <div
              key={ratio.ratio}
              className="flex items-center justify-between py-3 px-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-colors"
            >
              <span className="text-sm text-slate-200">{ratio.ratio}</span>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-white">{ratio.value}</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-400">vs {ratio.benchmark}</span>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      ratio.status === "above" ? "bg-green-400" : "bg-red-400"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-400" />
            Monthly Financial Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              month: "December 2024",
              revenue: 2400000,
              expenses: 1800000,
              profit: 600000,
              margin: 25,
            },
            {
              month: "November 2024",
              revenue: 2200000,
              expenses: 1750000,
              profit: 450000,
              margin: 20,
            },
            {
              month: "October 2024",
              revenue: 2100000,
              expenses: 1680000,
              profit: 420000,
              margin: 20,
            },
            {
              month: "September 2024",
              revenue: 1950000,
              expenses: 1560000,
              profit: 390000,
              margin: 20,
            },
          ].map((summary, index) => (
            <div
              key={summary.month}
              className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-white">{summary.month}</span>
                <span className="text-sm text-emerald-400">
                  {summary.margin}% margin
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Revenue</span>
                  <div className="font-medium text-white">
                    ${(summary.revenue / 1000000).toFixed(1)}M
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Expenses</span>
                  <div className="font-medium text-white">
                    ${(summary.expenses / 1000000).toFixed(1)}M
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Profit</span>
                  <div className="font-medium text-emerald-400">
                    ${(summary.profit / 1000).toFixed(0)}K
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
);

export default function FinanceDashboard() {
  return renderEnhancedFinanceDashboard();
}