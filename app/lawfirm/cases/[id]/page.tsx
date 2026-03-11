"use client";

import { use } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Briefcase,
  User,
  Calendar,
  FileText,
  CheckSquare,
  CreditCard,
  Clock,
  MapPin,
  ArrowLeft,
  Download,
  Upload,
  Trash2,
  Plus,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { cases, clients, lawyers, documents, calendarEvents, tasks, invoices, timelineEvents } from "@/data";
import { formatDate, formatDateTime, formatCurrency, getStatusColor, getInitials } from "@/lib/utils";
import Link from "next/link";

export default function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { currentOrganization } = useAuth();
  
  // Filter cases by organization
  const orgCases = cases.filter(c => c.organizationId === currentOrganization?.id);
  const caseItem = orgCases.find((c) => c.id === id);
  
  if (!caseItem) {
    return (
      <DashboardLayout role="lawfirm">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-500">Case not found</h2>
          <Link href="/lawfirm/cases">
            <Button className="mt-4">Back to Cases</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const client = clients.find((c) => c.id === caseItem.clientId);
  const lawyer = lawyers.find((l) => l.id === caseItem.assignedLawyerId);
  const caseDocuments = documents.filter((d) => d.caseId === caseItem.id);
  const caseEvents = calendarEvents.filter((e) => e.caseId === caseItem.id);
  const caseTasks = tasks.filter((t) => t.caseId === caseItem.id);
  const caseInvoices = invoices.filter((i) => i.caseId === caseItem.id);
  const caseTimeline = timelineEvents.filter((t) => t.caseId === caseItem.id);

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case "document": return <FileText className="w-4 h-4 text-blue-600" />;
      case "hearing": return <Calendar className="w-4 h-4 text-orange-600" />;
      case "status_change": return <Briefcase className="w-4 h-4 text-purple-600" />;
      case "note": return <Clock className="w-4 h-4 text-gray-600" />;
      case "task": return <CheckSquare className="w-4 h-4 text-green-600" />;
      case "notification": return <User className="w-4 h-4 text-green-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTimelineColor = (type: string) => {
    switch (type) {
      case "document": return "border-blue-200 bg-blue-50";
      case "hearing": return "border-orange-200 bg-orange-50";
      case "status_change": return "border-purple-200 bg-purple-50";
      case "note": return "border-gray-200 bg-gray-50";
      case "task": return "border-green-200 bg-green-50";
      case "notification": return "border-green-200 bg-green-50";
      default: return "border-gray-200 bg-gray-50";
    }
  };

  return (
    <DashboardLayout role="lawfirm">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Link href="/lawfirm/cases">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-navy-900">{caseItem.caseNumber}</h1>
                <Badge className={getStatusColor(caseItem.status)}>{caseItem.status.replace("_", " ")}</Badge>
              </div>
              <p className="text-xl text-gray-600">{caseItem.title}</p>
            </div>
          </div>
          <Button className="bg-navy-700 hover:bg-navy-800">Edit Case</Button>
        </div>

        {/* Case Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Client</p>
                  <p className="font-medium">{client?.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Assigned Lawyer</p>
                  <p className="font-medium">{lawyer?.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Court</p>
                  <p className="font-medium">{caseItem.court || "Not assigned"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium">{formatDate(caseItem.createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="hearings">Hearings</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Case Overview</CardTitle>
                <CardDescription>Detailed information about this case</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-500 mb-2">Description</h4>
                    <p className="text-gray-900">{caseItem.description || "No description provided."}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-500 mb-2">Status</h4>
                      <Badge className={getStatusColor(caseItem.status)}>{caseItem.status.replace("_", " ")}</Badge>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-500 mb-2">Last Updated</h4>
                      <p className="text-gray-900">{formatDateTime(caseItem.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
                <CardDescription>Chronological history of case events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {caseTimeline.map((event, index) => (
                    <div key={event.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getTimelineColor(event.type)}`}>
                          {getTimelineIcon(event.type)}
                        </div>
                        {index < caseTimeline.length - 1 && <div className="w-0.5 h-full bg-gray-200 my-2" />}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{event.title}</span>
                          <span className="text-sm text-gray-500">{formatDateTime(event.createdAt)}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        <p className="text-xs text-gray-400 mt-1">By {event.userName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>All documents related to this case</CardDescription>
                </div>
                <Button className="bg-navy-700 hover:bg-navy-800">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Uploaded By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {caseDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.name}</TableCell>
                        <TableCell>{doc.type}</TableCell>
                        <TableCell>{(doc.size / 1000).toFixed(1)} KB</TableCell>
                        <TableCell>User {doc.uploadedById}</TableCell>
                        <TableCell>{formatDate(doc.uploadedAt)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {caseDocuments.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                          No documents uploaded yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hearings Tab */}
          <TabsContent value="hearings">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Hearings</CardTitle>
                  <CardDescription>Scheduled hearings for this case</CardDescription>
                </div>
                <Button className="bg-navy-700 hover:bg-navy-800">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Hearing
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {caseEvents.filter((e) => e.type === "court_hearing").map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-gray-500">{formatDateTime(event.startDate)}</p>
                          {event.location && <p className="text-sm text-gray-500">{event.location}</p>}
                        </div>
                      </div>
                      <Badge variant="outline">{event.type}</Badge>
                    </div>
                  ))}
                  {caseEvents.filter((e) => e.type === "court_hearing").length === 0 && (
                    <p className="text-gray-500 text-center py-8">No hearings scheduled</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Tasks</CardTitle>
                  <CardDescription>Tasks associated with this case</CardDescription>
                </div>
                <Button className="bg-navy-700 hover:bg-navy-800">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Task
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {caseTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.title}</TableCell>
                        <TableCell>User {task.assignedToId}</TableCell>
                        <TableCell>{formatDate(task.dueDate)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {caseTasks.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                          No tasks created yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Invoices</CardTitle>
                  <CardDescription>Billing history for this case</CardDescription>
                </div>
                <Button className="bg-navy-700 hover:bg-navy-800">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Create Invoice
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {caseInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                        <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                        <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                        </TableCell>
                        <TableCell>{formatDate(invoice.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                    {caseInvoices.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                          No invoices created yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
