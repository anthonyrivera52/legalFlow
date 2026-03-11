"use client";

import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Calendar,
  CheckSquare,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { cases, tasks, calendarEvents, clients, lawyers } from "@/data";
import { formatDate, formatDateTime, getStatusColor } from "@/lib/utils";
import Link from "next/link";

export default function LawyerDashboard() {
  const { currentUser, currentOrganization } = useAuth();
  
  // Get lawyer's data based on current user
  const lawyerData = lawyers.find(l => l.email === currentUser?.email);
  const lawyerId = lawyerData?.id || "lawyer-1";
  const userId = currentUser?.id || "user-2";
  
  // Filter by organization
  const orgCases = cases.filter(c => c.organizationId === currentOrganization?.id);
  const orgTasks = tasks.filter(t => t.organizationId === currentOrganization?.id);
  const orgEvents = calendarEvents.filter(e => e.organizationId === currentOrganization?.id);
  
  const myCases = orgCases.filter((c) => c.assignedLawyerId === lawyerId);
  const activeCases = myCases.filter((c) => c.status === "in_progress" || c.status === "open");
  const pendingTasks = orgTasks.filter((t) => t.assignedToId === userId && t.status !== "completed");
  const todayEvents = orgEvents.filter((e) => {
    const today = new Date();
    const eventDate = new Date(e.startDate);
    return eventDate.toDateString() === today.toDateString();
  });

  const getClientName = (clientId: string) => clients.find((c) => c.id === clientId)?.name || "Unknown";

  const stats = [
    { title: "My Active Cases", value: activeCases.length.toString(), icon: Briefcase, change: "+2", trend: "up" },
    { title: "Pending Tasks", value: pendingTasks.length.toString(), icon: CheckSquare, change: "-3", trend: "down" },
    { title: "Hearings Today", value: todayEvents.length.toString(), icon: Calendar, change: "0", trend: "neutral" },
    { title: "Total Cases", value: myCases.length.toString(), icon: Briefcase, change: "+1", trend: "up" },
  ];

  return (
    <DashboardLayout role="lawyer">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-navy-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back, {currentUser?.name || "Lawyer"}</p>
        </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Active Cases */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>My Active Cases</CardTitle>
                <CardDescription>Cases assigned to you</CardDescription>
              </div>
              <Link href="/lawyer/cases">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeCases.slice(0, 4).map((caseItem) => (
                  <div key={caseItem.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                    <div>
                      <p className="font-medium text-sm">{caseItem.title}</p>
                      <p className="text-xs text-gray-500">{caseItem.caseNumber} • {getClientName(caseItem.clientId)}</p>
                    </div>
                    <Badge className={getStatusColor(caseItem.status)}>{caseItem.status.replace("_", " ")}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Pending Tasks</CardTitle>
                <CardDescription>Your task list</CardDescription>
              </div>
              <Link href="/lawyer/tasks">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingTasks.slice(0, 4).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                    <div>
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-gray-500">Due {formatDate(task.dueDate)}</p>
                    </div>
                    <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Your calendar for today</CardDescription>
            </div>
            <Link href="/lawyer/calendar">
              <Button variant="outline" size="sm">View Calendar</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayEvents.length > 0 ? (
                todayEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-gray-500">{formatDateTime(event.startDate)}</p>
                      {event.location && <p className="text-sm text-gray-500">{event.location}</p>}
                    </div>
                    <Badge variant="outline">{event.type.replace("_", " ")}</Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No events scheduled for today</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
