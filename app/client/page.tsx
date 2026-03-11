"use client";

import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Calendar,
  FileText,
  MessageSquare,
  CreditCard,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { cases, documents, calendarEvents, invoices, clients } from "@/data";
import { formatDate, formatCurrency, getStatusColor } from "@/lib/utils";
import Link from "next/link";

export default function ClientDashboard() {
  const { currentUser } = useAuth();
  
  // Get client's organization
  const clientData = clients.find(c => c.email === currentUser?.email);
  const clientId = clientData?.id || "client-1";
  
  const myCases = cases.filter((c) => c.clientId === clientId);
  const activeCases = myCases.filter((c) => c.status !== "closed");
  const myDocuments = documents.filter((d) => d.caseId && myCases.some((c) => c.id === d.caseId));
  const myInvoices = invoices.filter((i) => i.clientId === clientId);

  const stats = [
    { title: "Active Cases", value: activeCases.length.toString(), icon: Briefcase },
    { title: "Upcoming Hearings", value: calendarEvents.length.toString(), icon: Calendar },
    { title: "Documents", value: myDocuments.length.toString(), icon: FileText },
    { title: "Pending Invoices", value: myInvoices.filter((i) => i.status !== "paid").length.toString(), icon: CreditCard },
  ];

  return (
    <DashboardLayout role="client">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-navy-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back, {currentUser?.name || "Client"}</p>
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
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Cases */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>My Cases</CardTitle>
                <CardDescription>Your active legal matters</CardDescription>
              </div>
              <Link href="/client/cases">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myCases.slice(0, 4).map((caseItem) => (
                  <div key={caseItem.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                    <div>
                      <p className="font-medium text-sm">{caseItem.title}</p>
                      <p className="text-xs text-gray-500">{caseItem.caseNumber}</p>
                    </div>
                    <Badge className={getStatusColor(caseItem.status)}>{caseItem.status.replace("_", " ")}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Documents */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Documents</CardTitle>
                <CardDescription>Latest documents shared with you</CardDescription>
              </div>
              <Link href="/client/documents">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myDocuments.slice(0, 4).map((doc) => (
                  <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{doc.name}</p>
                      <p className="text-xs text-gray-500">{formatDate(doc.uploadedAt)}</p>
                    </div>
                  </div>
                ))}
                {myDocuments.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No documents yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Hearings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Hearings</CardTitle>
              <CardDescription>Scheduled court appearances</CardDescription>
            </div>
            <Link href="/client/hearings">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {calendarEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-gray-500">{formatDate(event.startDate.toString())}</p>
                    {event.location && <p className="text-sm text-gray-500">{event.location}</p>}
                  </div>
                </div>
              ))}
              {calendarEvents.length === 0 && (
                <p className="text-gray-500 text-center py-8">No upcoming hearings</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
