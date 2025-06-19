import React, { useRef, useState, useEffect } from "react";
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
  UserCheck,
  Star,
  Shield,
  Award,
  UserX,
  Mail,
  Phone,
  Clock,
  Briefcase,
  Calendar,
  Home,
  Car,
} from "lucide-react";

// Color class mappings for Tailwind (static, not dynamic)
const colorClassMap = {
  blue: {
    from: "from-blue-500/20",
    to: "to-blue-600/20",
    border: "border-blue-500/30",
    text: "text-blue-400",
  },
  green: {
    from: "from-green-500/20",
    to: "to-green-600/20",
    border: "border-green-500/30",
    text: "text-green-400",
  },
  orange: {
    from: "from-orange-500/20",
    to: "to-orange-600/20",
    border: "border-orange-500/30",
    text: "text-orange-400",
  },
  purple: {
    from: "from-purple-500/20",
    to: "to-purple-600/20",
    border: "border-purple-500/30",
    text: "text-purple-400",
  },
};

type Metric = {
  title: string;
  value: string | number;
  change: string;
  icon: React.ElementType;
  color: keyof typeof colorClassMap;
};

const renderEnhancedHRDashboard = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [hrData, setHrData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/hr")
      .then((res) => res.json())
      .then((data) => {
        setHrData(data || []);
        setLoading(false);
      });
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadMessage("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/dashboard/hr/upload`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setUploadMessage("Upload successful!");
      } else {
        const data = await res.json();
        setUploadMessage(data.error || "Upload failed");
      }
    } catch (err) {
      setUploadMessage("Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) (fileInputRef.current as HTMLInputElement).value = "";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold tracking-tight mb-2 text-white">
            HR & Administration
          </h2>
          <p className="text-lg text-slate-300">
            Human resources and administrative operations
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30 px-4 py-2">
            <Users className="h-4 w-4 mr-2" />
            All Teams Active
          </Badge>
          <Button
            variant="outline"
            size="sm"
            className="bg-slate-800/50 border-slate-600 text-slate-200 hover:bg-slate-700"
            onClick={() => fileInputRef.current && (fileInputRef.current as HTMLInputElement).click()}
            disabled={uploading}
          >
            <Download className="h-4 w-4 mr-2" />
            Upload HR Excel
          </Button>
          <input
            type="file"
            accept=".xlsx,.xls"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
      </div>
      {uploadMessage && (
        <div className={`text-sm ${uploadMessage.includes("success") ? "text-green-400" : "text-red-400"}`}>{uploadMessage}</div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <div>Loading...</div>
        ) : (
          [
            {
              title: "Total Employees",
              value: hrData.length.toLocaleString(),
              change: `+${hrData.length} total`,
              icon: Users,
              color: "blue" as const,
            },
            {
              title: "Attendance Rate",
              value: "94.2%",
              change: "Above average",
              icon: Activity,
              color: "green" as const,
            },
            {
              title: "Open Positions",
              value: "34",
              change: "12 in progress",
              icon: Building2,
              color: "orange" as const,
            },
            {
              title: "Employee Satisfaction",
              value: "4.3/5",
              change: "+0.2",
              icon: Target,
              color: "purple" as const,
            },
          ].map((metric, index) => {
            const color = colorClassMap[metric.color];
            const Icon = metric.icon;
            return (
              <Card
                key={metric.title}
                className="relative overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50 hover:border-slate-600 transition-all duration-300 group"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${color.from} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                ></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
                  <CardTitle className="text-sm font-medium text-slate-200">
                    {metric.title}
                  </CardTitle>
                  <div
                    className={`p-3 bg-gradient-to-br ${color.from} ${color.to} rounded-xl border ${color.border}`}
                  >
                    <Icon className={`h-5 w-5 ${color.text}`} />
                  </div>
                </CardHeader>
                <CardContent className="pt-2 relative z-10">
                  <div className="text-3xl font-bold mb-2 text-white">
                    {metric.value}
                  </div>
                  <p className="text-sm text-slate-300">
                    <span className="text-green-400 flex items-center">
                      {metric.change.includes("+") && <ArrowUp className="h-4 w-4 mr-1" />}
                      {metric.change}
                    </span>
                    {metric.title === "Total Employees" && " this quarter"}
                  </p>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Department Breakdown and Employee Activities */}
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-400" />
              Department Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              {
                name: "Engineering",
                count: 342,
                percentage: 27,
                color: "from-blue-500 to-cyan-500",
              },
              {
                name: "Sales & Marketing",
                count: 298,
                percentage: 24,
                color: "from-green-500 to-emerald-500",
              },
              {
                name: "Customer Service",
                count: 234,
                percentage: 19,
                color: "from-purple-500 to-pink-500",
              },
              {
                name: "Operations",
                count: 189,
                percentage: 15,
                color: "from-orange-500 to-red-500",
              },
              {
                name: "Administration",
                count: 184,
                percentage: 15,
                color: "from-yellow-500 to-orange-500",
              },
            ].map((dept, index) => (
              <div key={dept.name} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-200">
                    {dept.name}
                  </span>
                  <span className="text-sm text-slate-300">
                    {dept.count} employees ({dept.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-3">
                  <div
                    className={`h-3 bg-gradient-to-r ${dept.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${dept.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-400" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                type: "hire",
                name: "Sarah Johnson",
                dept: "Engineering",
                time: "2 hours ago",
                icon: UserCheck,
              },
              {
                type: "review",
                name: "Q4 2024 reviews",
                dept: "All Departments",
                time: "4 hours ago",
                icon: Star,
              },
              {
                type: "training",
                name: "Cybersecurity training",
                dept: "IT Security",
                time: "6 hours ago",
                icon: Shield,
              },
              {
                type: "benefits",
                name: "Benefits enrollment",
                dept: "HR",
                time: "8 hours ago",
                icon: Award,
              },
              {
                type: "departure",
                name: "John Smith",
                dept: "Sales",
                time: "1 day ago",
                icon: UserX,
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50"
              >
                <div
                  className={`p-2 rounded-lg ${
                    activity.type === "hire"
                      ? "bg-green-500/20 border border-green-500/30"
                      : activity.type === "departure"
                      ? "bg-red-500/20 border border-red-500/30"
                      : "bg-blue-500/20 border border-blue-500/30"
                  }`}
                >
                  <activity.icon
                    className={`h-4 w-4 ${
                      activity.type === "hire"
                        ? "text-green-400"
                        : activity.type === "departure"
                        ? "text-red-400"
                        : "text-blue-400"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{activity.name}</span>
                    {activity.type === "hire" && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                        New Hire
                      </Badge>
                    )}
                    {activity.type === "departure" && (
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                        Departure
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span>{activity.dept}</span>
                    <span>•</span>
                    <span>{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Employee Directory and Attendance Tracking */}
      <div className="grid gap-8 md:grid-cols-3">
        <Card className="col-span-2 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-400" />
              Employee Directory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  name: "Alex Thompson",
                  role: "Senior Engineer",
                  dept: "Engineering",
                  status: "online",
                  avatar: "AT",
                },
                {
                  name: "Sarah Chen",
                  role: "Sales Manager",
                  dept: "Sales",
                  status: "away",
                  avatar: "SC",
                },
                {
                  name: "Mike Rodriguez",
                  role: "Product Manager",
                  dept: "Product",
                  status: "online",
                  avatar: "MR",
                },
                {
                  name: "Emily Davis",
                  role: "HR Specialist",
                  dept: "HR",
                  status: "offline",
                  avatar: "ED",
                },
                {
                  name: "David Wilson",
                  role: "DevOps Engineer",
                  dept: "Engineering",
                  status: "online",
                  avatar: "DW",
                },
              ].map((employee, index) => (
                <div
                  key={employee.name}
                  className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-colors"
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {employee.avatar}
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-800 ${
                        employee.status === "online"
                          ? "bg-green-400"
                          : employee.status === "away"
                          ? "bg-yellow-400"
                          : "bg-slate-500"
                      }`}
                    ></div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-white">{employee.name}</div>
                    <div className="text-sm text-slate-400">
                      {employee.role} • {employee.dept}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-white"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-white"
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-400" />
              Attendance Today
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">94.2%</div>
              <div className="text-sm text-slate-400">Overall Attendance</div>
            </div>
            <div className="space-y-3">
              {[
                { status: "Present", count: 1175, color: "green" },
                { status: "Remote", count: 45, color: "blue" },
                { status: "Sick Leave", count: 18, color: "yellow" },
                { status: "Vacation", count: 9, color: "purple" },
              ].map((item, index) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-${item.color}-400`}></div>
                    <span className="text-sm text-slate-200">{item.status}</span>
                  </div>
                  <span className="text-sm font-medium text-white">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Training and Benefits */}
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-400" />
              Training Programs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                program: "Cybersecurity Awareness",
                completion: 87,
                participants: 234,
                color: "from-red-500 to-orange-500",
              },
              {
                program: "Leadership Development",
                completion: 65,
                participants: 45,
                color: "from-blue-500 to-purple-500",
              },
              {
                program: "Technical Skills",
                completion: 92,
                participants: 156,
                color: "from-green-500 to-emerald-500",
              },
              {
                program: "Customer Service",
                completion: 78,
                participants: 89,
                color: "from-purple-500 to-pink-500",
              },
            ].map((training, index) => (
              <div key={training.program} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-200">
                    {training.program}
                  </span>
                  <span className="text-sm text-slate-300">
                    {training.completion}% ({training.participants} enrolled)
                  </span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-2">
                  <div
                    className={`h-2 bg-gradient-to-r ${training.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${training.completion}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-orange-400" />
              Benefits Utilization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { benefit: "Health Insurance", usage: 98, icon: Shield },
              { benefit: "Retirement Plan", usage: 85, icon: Target },
              { benefit: "Flexible PTO", usage: 76, icon: Calendar },
              { benefit: "Remote Work", usage: 45, icon: Home },
              { benefit: "Gym Membership", usage: 32, icon: Activity },
              { benefit: "Transportation", usage: 28, icon: Car },
            ].map((benefit, index) => (
              <div key={benefit.benefit} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/20 rounded-lg border border-orange-500/30">
                    <benefit.icon className="h-4 w-4 text-orange-400" />
                  </div>
                  <span className="text-sm text-slate-200">{benefit.benefit}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-slate-700/50 rounded-full h-2">
                    <div
                      className="h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-1000"
                      style={{ width: `${benefit.usage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-white w-8">
                    {benefit.usage}%
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default function HRDashboard() {
  return renderEnhancedHRDashboard();
}