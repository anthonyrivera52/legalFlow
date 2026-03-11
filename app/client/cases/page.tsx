"use client";

import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Briefcase, FileText, Calendar, Clock, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { cases, clients } from "@/data";
import { formatDate, getStatusColor } from "@/lib/utils";
import Link from "next/link";

export default function ClientCasesPage() {
  const { currentUser } = useAuth();
  
  // Get client's organization
  const clientData = clients.find(c => c.email === currentUser?.email);
  const clientId = clientData?.id || "client-1";
  
  // Filter cases for this client
  const myCases = cases.filter((c) => c.clientId === clientId);

  return (
    <DashboardLayout role="client">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-navy-900">My Cases</h1>
            <p className="text-gray-500">View and track your legal cases</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Active Cases</CardTitle>
          </CardHeader>
          <CardContent>
            {myCases.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No cases found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Case Number</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myCases.map((caseItem) => (
                    <TableRow key={caseItem.id}>
                      <TableCell className="font-medium">{caseItem.caseNumber}</TableCell>
                      <TableCell>{caseItem.title}</TableCell>
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
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
