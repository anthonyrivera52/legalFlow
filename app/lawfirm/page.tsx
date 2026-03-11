import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Briefcase,
  Users,
  Calendar,
  CheckSquare,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  FileText,
  User,
} from "lucide-react";
import { cases, clients, lawyers, tasks, calendarEvents, currentOrganization, currentUser } from "@/data";
import { formatDate, formatDateTime, getStatusColor, getInitials } from "@/lib/utils";
import Link from "next/link";

export default function LawFirmDashboard() {
  const activeCases = cases.filter((c) => c.status === "in_progress" || c.status === "open").length;
  const todayEvents = calendarEvents.filter((e) => {
    const today = new Date();
    const eventDate = new Date(e.startDate);
    return eventDate.toDateString() === today.toDateString();
  });
  const pendingTasks = tasks.filter((t) => t.status !== "completed").length;

  const getClientName = (clientId: string) => clients.find((c) => c.id === clientId)?.name || "Unknown";
  const getLawyerName = (lawyerId: string) => lawyers.find((l) => l.id === lawyerId)?.name || "Unknown";

  const stats = [
    { title: "Active Cases", value: activeCases.toString(), icon: Briefcase, change: "+5", trend: "up" },
    { title: "Total Clients", value: clients.length.toString(), icon: Users, change: "+3", trend: "up" },
    { title: "Hearings Today", value: todayEvents.length.toString(), icon: Calendar, change: "0", trend: "neutral" },
    { title: "Pending Tasks", value: pendingTasks.toString(), icon: CheckSquare, change: "-2", trend: "down" },
  ];

  const caseStatusData = [
    { status: "Open", count: cases.filter((c) => c.status === "open").length, color: "bg-blue-500" },
    { status: "In Progress", count: cases.filter((c) => c.status === "in_progress").length, color: "bg-yellow-500" },
    { status: "Pending", count: cases.filter((c) => c.status === "pending").length, color: "bg-orange-500" },
    { status: "Closed", count: cases.filter((c) => c.status === "closed").length, color: "bg-green-500" },
  ];

  const totalCases = caseStatusData.reduce((acc, item) => acc + item.count, 0);

  return (
    <DashboardLayout role="lawfirm">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-navy-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back, {currentUser.name}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">{stat.title}</CardTitle>
                <stat.icon className="w-4 h-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-navy-900">{stat.value}</div>
                <div className="flex items-center gap-1 text-sm">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                  ) : stat.trend === "down" ? (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  ) : null}
                  <span className={stat.trend === "up" ? "text-green-500" : stat.trend === "down" ? "text-red-500" : "text-gray-500"}>
                    {stat.change}
                  </span>
                  <span className="text-gray-500">from last week</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Case Status Distribution */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Case Status Distribution</CardTitle>
              <CardDescription>Overview of all cases by status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {caseStatusData.map((item) => (
                  <div key={item.status} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.status}</span>
                      <span className="text-gray-500">{item.count} cases</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-500`}
                        style={{ width: `${(item.count / totalCases) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Today's schedule</CardDescription>
              </div>
              <Link href="/lawfirm/calendar">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayEvents.length > 0 ? (
                  todayEvents.slice(0, 4).map((event) => (
                    <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{event.title}</p>
                        <p className="text-xs text-gray-500">{formatDateTime(event.startDate)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm text-center py-4">No events today</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Cases */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Cases</CardTitle>
                <CardDescription>Latest case updates</CardDescription>
              </div>
              <Link href="/lawfirm/cases">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cases.slice(0, 4).map((caseItem) => (
                  <div key={caseItem.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-navy-700" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{caseItem.title}</p>
                        <p className="text-xs text-gray-500">{caseItem.caseNumber}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(caseItem.status)}>{caseItem.status.replace("_", " ")}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Lawyer Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Lawyer Activity</CardTitle>
                <CardDescription>Team performance</CardDescription>
              </div>
              <Link href="/lawfirm/lawyers">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lawyers.slice(0, 4).map((lawyer) => {
                  const caseCount = cases.filter((c) => c.assignedLawyerId === lawyer.id && c.status !== "closed").length;
                  return (
                    <div key={lawyer.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-navy-100 text-navy-700">{getInitials(lawyer.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{lawyer.name}</p>
                          <p className="text-xs text-gray-500">{lawyer.specialization}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">{caseCount}</p>
                        <p className="text-xs text-gray-500">active cases</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
