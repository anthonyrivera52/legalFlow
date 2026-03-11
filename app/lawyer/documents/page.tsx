"use client";

import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, Eye, Trash2, Upload } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { documents, cases, lawyers } from "@/data";
import { formatDate } from "@/lib/utils";

export default function LawyerDocumentsPage() {
  const { currentUser, currentOrganization } = useAuth();
  
  // Get lawyer's data based on current user
  const lawyerData = lawyers.find(l => l.email === currentUser?.email);
  const lawyerId = lawyerData?.id || "lawyer-1";
  
  // Filter by organization
  const orgCases = cases.filter(c => c.organizationId === currentOrganization?.id);
  const caseIds = orgCases.map(c => c.id);
  
  // Filter documents for organization's cases
  const orgDocuments = documents.filter((d) => d.caseId && caseIds.includes(d.caseId));

  return (
    <DashboardLayout role="lawyer">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-navy-900">Documents</h1>
            <p className="text-gray-500">Manage legal documents</p>
          </div>
          <Button className="bg-navy-600 hover:bg-navy-700">
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{orgDocuments.length}</div>
              <p className="text-sm text-gray-500">Total Documents</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {orgDocuments.filter(d => d.type === "PDF").length}
              </div>
              <p className="text-sm text-gray-500">PDFs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {orgDocuments.filter(d => d.type === "DOC").length}
              </div>
              <p className="text-sm text-gray-500">Word Documents</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Documents</CardTitle>
          </CardHeader>
          <CardContent>
            {orgDocuments.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No documents found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Case</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orgDocuments.map((doc) => {
                    const caseItem = cases.find(c => c.id === doc.caseId);
                    return (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.name}</TableCell>
                        <TableCell>{caseItem?.caseNumber || "N/A"}</TableCell>
                        <TableCell>{doc.type}</TableCell>
                        <TableCell>{formatDate(doc.uploadedAt)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-500">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
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
