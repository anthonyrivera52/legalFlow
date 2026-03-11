import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Building2,
  Users,
  CreditCard,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { organizations, users, plans, currentUser } from "@/data";
import { formatDate, formatCurrency, getPlanColor } from "@/lib/utils";
import Link from "next/link";

export default function AdminDashboard() {
  const totalOrganizations = organizations.length;
  const totalUsers = users.length;
  const activeSubscriptions = organizations.filter((o) => o.isActive).length;
  const monthlyRevenue = plans.reduce((acc, plan) => {
    const orgsWithPlan = organizations.filter((o) => o.plan === plan.slug && o.isActive).length;
    return acc + plan.price * orgsWithPlan;
  }, 0);

  const stats = [
    {
      title: "Total Organizations",
      value: totalOrganizations.toString(),
      change: "+12%",
      trend: "up",
      icon: Building2,
    },
    {
      title: "Total Users",
      value: totalUsers.toString(),
      change: "+8%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Active Subscriptions",
      value: activeSubscriptions.toString(),
      change: "+5%",
      trend: "up",
      icon: CreditCard,
    },
    {
      title: "Monthly Revenue",
      value: formatCurrency(monthlyRevenue),
      change: "+23%",
      trend: "up",
      icon: DollarSign,
    },
  ];

  const recentOrganizations = organizations
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-navy-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back, {currentUser.name}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {stat.title}
                </CardTitle>
                <stat.icon className="w-4 h-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-navy-900">{stat.value}</div>
                <div className="flex items-center gap-1 text-sm">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                  <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                    {stat.change}
                  </span>
                  <span className="text-gray-500">from last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization Growth</CardTitle>
              <CardDescription>New organizations over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2 px-4">
                {[65, 45, 75, 50, 80, 60, 90, 70, 85, 95].map((height, i) => (
                  <div key={i} className="w-full bg-navy-200 rounded-t" style={{ height: `${height}%` }}>
                    <div className="w-full bg-navy-600 rounded-t hover:bg-navy-700 transition-colors" style={{ height: `${height}%` }} />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Growth</CardTitle>
              <CardDescription>Monthly revenue trend</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2 px-4">
                {[40, 55, 45, 60, 50, 70, 65, 80, 75, 90].map((height, i) => (
                  <div key={i} className="w-full bg-green-200 rounded-t" style={{ height: `${height}%` }}>
                    <div className="w-full bg-green-500 rounded-t hover:bg-green-600 transition-colors" style={{ height: `${height}%` }} />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Organizations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Organizations</CardTitle>
              <CardDescription>Latest organizations joined the platform</CardDescription>
            </div>
            <Link href="/admin/organizations">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrganizations.map((org) => (
                <div
                  key={org.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-navy-700" />
                    </div>
                    <div>
                      <p className="font-medium text-navy-900">{org.name}</p>
                      <p className="text-sm text-gray-500">
                        Created {formatDate(org.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Badge className={getPlanColor(org.plan)}>{org.plan}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
