"use client";

import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Download, FileText, Calendar, User } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { cases, clients, lawyers, documents, calendarEvents, timelineEvents } from "@/data";
import { formatDate, formatDateTime, getStatusColor } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ClientCaseDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { currentUser } = useAuth();
  
  // Get client's organization
  const clientData = clients.find(c => c.email === currentUser?.email);
  const clientId = clientData?.id || "client-1";
  
  // Filter cases for this client
  const clientCases = cases.filter(c => c.clientId === clientId);
  const caseItem = clientCases.find((c) => c.id === id);

  if (!caseItem) {
    return (
      <DashboardLayout role="client">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-500">Case not found</h2>
          <Link href="/client/cases">
            <Button className="mt-4">Back to Cases</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const lawyer = lawyers.find((l) => l.id === caseItem.assignedLawyerId);
  const caseDocuments = documents.filter((d) => d.caseId === caseItem.id);
  const caseEvents = calendarEvents.filter((e) => e.caseId === caseItem.id);
  const caseTimeline = timelineEvents.filter((t) => t.caseId === caseItem.id);

  return (
    <DashboardLayout role="client">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/client/cases">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-navy-900">{caseItem.caseNumber}</h1>
              <Badge className={getStatusColor(caseItem.status)}>
                {caseItem.status.replace("_", " ")}
              </Badge>
            </div>
            <p className="text-gray-500">{caseItem.title}</p>
          </div>
        </div>

        {/* Case Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-navy-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Assigned Lawyer</p>
                  <p className="font-medium">{lawyer?.name || "Not assigned"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-navy-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Court</p>
                  <p className="font-medium">{caseItem.court || "TBD"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-navy-700" />
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
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="hearings">Hearings</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Case Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-gray-600">{caseItem.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
              </CardHeader>
              <CardContent>
                {caseDocuments.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No documents available</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Upload Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {caseDocuments.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium">{doc.name}</TableCell>
                          <TableCell>{doc.type}</TableCell>
                          <TableCell>{formatDate(doc.uploadedAt)}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hearings">
            <Card>
              <CardHeader>
                <CardTitle>Hearings</CardTitle>
              </CardHeader>
              <CardContent>
                {caseEvents.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No hearings scheduled</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Location</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {caseEvents.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell className="font-medium">{event.title}</TableCell>
                          <TableCell>{event.type}</TableCell>
                          <TableCell>{formatDateTime(event.startDate)}</TableCell>
                          <TableCell>{event.location || "TBD"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {caseTimeline.map((event) => (
                    <div key={event.id} className="flex gap-4">
                      <div className="w-2 h-2 bg-navy-600 rounded-full mt-2" />
                      <div className="flex-1">
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-gray-500">{event.description}</p>
                        <p className="text-xs text-gray-400">{formatDateTime(event.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                  {caseTimeline.length === 0 && (
                    <p className="text-gray-500 text-center py-10">No activity yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
