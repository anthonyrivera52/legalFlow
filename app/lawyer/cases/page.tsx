"use client";

import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Briefcase, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { cases, lawyers, clients } from "@/data";
import { formatDate, getStatusColor } from "@/lib/utils";

export default function LawyerCasesPage() {
  const { currentUser, currentOrganization } = useAuth();
  
  // Get lawyer's data based on current user
  const lawyerData = lawyers.find(l => l.email === currentUser?.email);
  const lawyerId = lawyerData?.id || "lawyer-1";
  
  // Filter by organization
  const orgCases = cases.filter(c => c.organizationId === currentOrganization?.id);
  // Filter cases assigned to this lawyer
  const myCases = orgCases.filter((c) => c.assignedLawyerId === lawyerId);

  return (
    <DashboardLayout role="lawyer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-navy-900">My Cases</h1>
          <p className="text-gray-500">Manage your assigned cases</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{myCases.length}</div>
              <p className="text-sm text-gray-500">Total Cases</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {myCases.filter(c => c.status === "in_progress").length}
              </div>
              <p className="text-sm text-gray-500">In Progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {myCases.filter(c => c.status === "open").length}
              </div>
              <p className="text-sm text-gray-500">Open</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {myCases.filter(c => c.status === "closed").length}
              </div>
              <p className="text-sm text-gray-500">Closed</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Assigned Cases</CardTitle>
          </CardHeader>
          <CardContent>
            {myCases.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No cases assigned to you</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Case Number</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myCases.map((caseItem) => {
                    const client = clients.find(c => c.id === caseItem.clientId);
                    return (
                      <TableRow key={caseItem.id}>
                        <TableCell className="font-medium">{caseItem.caseNumber}</TableCell>
                        <TableCell>{caseItem.title}</TableCell>
                        <TableCell>{client?.name || "Unknown"}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(caseItem.status)}>
                            {caseItem.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(caseItem.createdAt)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
