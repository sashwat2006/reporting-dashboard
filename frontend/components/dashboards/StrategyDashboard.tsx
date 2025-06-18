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

const renderEnhancedStrategyDashboard = () => (
  <div className="space-y-8">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-4xl font-bold tracking-tight mb-2 text-white">
          Strategic Initiatives
        </h2>
        <p className="text-lg text-slate-300">
          Long-term goals and strategic project tracking
        </p>
      </div>
      <div className="flex items-center gap-4">
        <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border-blue-500/30 px-4 py-2">
          <Target className="h-4 w-4 mr-2" />
          On Track
        </Badge>
        <Button
          variant="outline"
          size="sm"
          className="bg-slate-800/50 border-slate-600 text-slate-200 hover:bg-slate-700"
        >
          <Download className="h-4 w-4 mr-2" />
          Strategy Report
        </Button>
      </div>
    </div>

    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {[
        {
          title: "Active Projects",
          value: "12",
          change: "8 on schedule",
          icon: Target,
          color: "blue",
        },
        {
          title: "Budget Utilization",
          value: "67%",
          change: "$2.1M of $3.2M",
          icon: DollarSign,
          color: "emerald",
        },
        {
          title: "Milestones Achieved",
          value: "34/45",
          change: "76% completion",
          icon: CheckCircle,
          color: "green",
        },
        {
          title: "ROI Projection",
          value: "245%",
          change: "Expected by Q2 2025",
          icon: BarChart3,
          color: "purple",
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
              <span className="text-green-400 flex items-center">
                {metric.change}
              </span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Strategic Projects Status */}
    <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-xl text-white flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-400" />
          Strategic Projects Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {[
          {
            name: "5G Network Expansion",
            progress: 78,
            status: "On Track",
            budget: 1200000,
            spent: 936000,
            timeline: "Q1 2025",
            priority: "High",
          },
          {
            name: "Cloud Infrastructure Migration",
            progress: 45,
            status: "At Risk",
            budget: 800000,
            spent: 360000,
            timeline: "Q2 2025",
            priority: "High",
          },
          {
            name: "Customer Portal Redesign",
            progress: 92,
            status: "Ahead",
            budget: 300000,
            spent: 276000,
            timeline: "Q4 2024",
            priority: "Medium",
          },
          {
            name: "AI-Powered Analytics Platform",
            progress: 34,
            status: "In Progress",
            budget: 500000,
            spent: 170000,
            timeline: "Q3 2025",
            priority: "Medium",
          },
        ].map((project, index) => (
          <div
            key={project.name}
            className="space-y-4 p-6 rounded-lg bg-slate-800/50 border border-slate-700/50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-medium text-white text-lg">
                  {project.name}
                </span>
                <Badge
                  className={`${
                    project.status === "On Track"
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : project.status === "At Risk"
                      ? "bg-red-500/20 text-red-400 border-red-500/30"
                      : project.status === "Ahead"
                      ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                      : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                  }`}
                >
                  {project.status}
                </Badge>
                <Badge
                  className={`${
                    project.priority === "High"
                      ? "bg-red-500/20 text-red-400 border-red-500/30"
                      : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                  }`}
                >
                  {project.priority}
                </Badge>
              </div>
              <span className="text-sm text-slate-300">
                {project.progress}% complete
              </span>
            </div>

            <div className="w-full bg-slate-700/50 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-1000 ${
                  project.status === "On Track"
                    ? "bg-gradient-to-r from-green-500 to-emerald-500"
                    : project.status === "At Risk"
                    ? "bg-gradient-to-r from-red-500 to-orange-500"
                    : project.status === "Ahead"
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                    : "bg-gradient-to-r from-yellow-500 to-orange-500"
                }`}
                style={{ width: `${project.progress}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Budget:</span>
                <div className="font-medium text-white">
                  ${(project.budget / 1000).toFixed(0)}K
                </div>
              </div>
              <div>
                <span className="text-slate-400">Spent:</span>
                <div className="font-medium text-white">
                  ${(project.spent / 1000).toFixed(0)}K (
                  {((project.spent / project.budget) * 100).toFixed(0)}%)
                </div>
              </div>
              <div>
                <span className="text-slate-400">Timeline:</span>
                <div className="font-medium text-white">{project.timeline}</div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>

    {/* Strategic Goals and Resource Allocation */}
    <div className="grid gap-8 md:grid-cols-2">
      <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-400" />
            Strategic Goals 2024-2025
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {[
            { goal: "Market Share Growth", target: 25, current: 22, unit: "%" },
            {
              goal: "Customer Satisfaction",
              target: 4.5,
              current: 4.3,
              unit: "/5",
            },
            { goal: "Revenue Growth", target: 20, current: 18, unit: "%" },
            { goal: "Network Coverage", target: 98, current: 96.5, unit: "%" },
            { goal: "Employee Retention", target: 90, current: 87, unit: "%" },
          ].map((goal, index) => (
            <div key={goal.goal} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-200">
                  {goal.goal}
                </span>
                <span className="text-sm text-slate-300">
                  {goal.current}
                  {goal.unit} / {goal.target}
                  {goal.unit}
                </span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-3">
                <div
                  className="h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                  style={{ width: `${(goal.current / goal.target) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>
                  Progress: {((goal.current / goal.target) * 100).toFixed(0)}%
                </span>
                <span>
                  {goal.target - goal.current > 0
                    ? `${(goal.target - goal.current).toFixed(1)}${goal.unit} to go`
                    : "Target achieved!"}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <PieChart className="h-5 w-5 text-orange-400" />
            Resource Allocation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {[
            {
              category: "Technology & Infrastructure",
              allocated: 1200000,
              percentage: 40,
              color: "from-blue-500 to-cyan-500",
            },
            {
              category: "Market Expansion",
              allocated: 900000,
              percentage: 30,
              color: "from-green-500 to-emerald-500",
            },
            {
              category: "Product Development",
              allocated: 600000,
              percentage: 20,
              color: "from-purple-500 to-pink-500",
            },
            {
              category: "Operations & Support",
              allocated: 300000,
              percentage: 10,
              color: "from-orange-500 to-red-500",
            },
          ].map((resource, index) => (
            <div key={resource.category} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-200">
                  {resource.category}
                </span>
                <span className="text-sm text-slate-300">
                  ${(resource.allocated / 1000000).toFixed(1)}M (
                  {resource.percentage}%)
                </span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-3">
                <div
                  className={`h-3 bg-gradient-to-r ${resource.color} rounded-full transition-all duration-1000`}
                  style={{ width: `${resource.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>

    {/* Risk Assessment and Timeline */}
    <div className="grid gap-8 md:grid-cols-2">
      <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              risk: "Market Competition",
              level: "High",
              impact: "Revenue",
              mitigation: "Accelerate innovation",
              probability: 75,
            },
            {
              risk: "Technology Disruption",
              level: "Medium",
              impact: "Operations",
              mitigation: "Continuous R&D",
              probability: 45,
            },
            {
              risk: "Regulatory Changes",
              level: "High",
              impact: "Compliance",
              mitigation: "Legal monitoring",
              probability: 35,
            },
            {
              risk: "Talent Shortage",
              level: "Low",
              impact: "Growth",
              mitigation: "Enhanced recruitment",
              probability: 25,
            },
          ].map((risk, index) => (
            <div
              key={risk.risk}
              className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-white">{risk.risk}</span>
                <Badge
                  className={`${
                    risk.level === "High"
                      ? "bg-red-500/20 text-red-400 border-red-500/30"
                      : risk.level === "Medium"
                      ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      : "bg-green-500/20 text-green-400 border-green-500/30"
                  }`}
                >
                  {risk.level}
                </Badge>
              </div>
              <div className="text-sm text-slate-400 mb-2">
                Impact: {risk.impact} • Mitigation: {risk.mitigation}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Probability:</span>
                <div className="flex-1 bg-slate-700/50 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      risk.level === "High"
                        ? "bg-gradient-to-r from-red-500 to-orange-500"
                        : risk.level === "Medium"
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                        : "bg-gradient-to-r from-green-500 to-emerald-500"
                    }`}
                    style={{ width: `${risk.probability}%` }}
                  />
                </div>
                <span className="text-xs text-slate-300">
                  {risk.probability}%
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-400" />
            Strategic Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              quarter: "Q4 2024",
              milestone: "Customer Portal Launch",
              status: "In Progress",
              date: "Dec 2024",
            },
            {
              quarter: "Q1 2025",
              milestone: "5G Network Phase 1",
              status: "Planned",
              date: "Mar 2025",
            },
            {
              quarter: "Q2 2025",
              milestone: "Cloud Migration Complete",
              status: "Planned",
              date: "Jun 2025",
            },
            {
              quarter: "Q3 2025",
              milestone: "AI Analytics Platform",
              status: "Planned",
              date: "Sep 2025",
            },
            {
              quarter: "Q4 2025",
              milestone: "Market Expansion",
              status: "Planned",
              date: "Dec 2025",
            },
          ].map((milestone, index) => (
            <div
              key={milestone.quarter}
              className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50"
            >
              <div className="flex flex-col items-center">
                <div
                  className={`w-3 h-3 rounded-full ${
                    milestone.status === "In Progress"
                      ? "bg-blue-400"
                      : "bg-slate-500"
                  }`}
                ></div>
                {index < 4 && <div className="w-px h-8 bg-slate-600 mt-2"></div>}
              </div>
              <div className="flex-1">
                <div className="font-medium text-white">
                  {milestone.milestone}
                </div>
                <div className="text-sm text-slate-400">
                  {milestone.quarter} • {milestone.date}
                </div>
              </div>
              <Badge
                className={`${
                  milestone.status === "In Progress"
                    ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                    : "bg-slate-500/20 text-slate-400 border-slate-500/30"
                }`}
              >
                {milestone.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
);

export default function StrategyDashboard() {
  return renderEnhancedStrategyDashboard();
}