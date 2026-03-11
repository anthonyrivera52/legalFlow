"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Briefcase, MoreVertical, Plus, Search, Edit, Trash2, Eye, Filter } from "lucide-react";
import { cases, clients, lawyers } from "@/data";
import { formatDate, getStatusColor } from "@/lib/utils";
import Link from "next/link";

export default function CasesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [lawyerFilter, setLawyerFilter] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredCases = cases.filter((caseItem) => {
    const matchesSearch =
      caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.caseNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || caseItem.status === statusFilter;
    const matchesLawyer = lawyerFilter === "all" || caseItem.assignedLawyerId === lawyerFilter;
    return matchesSearch && matchesStatus && matchesLawyer;
  });

  const getClientName = (clientId: string) => clients.find((c) => c.id === clientId)?.name || "Unknown";
  const getLawyerName = (lawyerId: string) => lawyers.find((l) => l.id === lawyerId)?.name || "Unknown";

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "pending", label: "Pending" },
    { value: "closed", label: "Closed" },
    { value: "archived", label: "Archived" },
  ];

  return (
    <DashboardLayout role="lawfirm">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-navy-900">Cases</h1>
            <p className="text-gray-500">Manage all legal cases</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-navy-700 hover:bg-navy-800">
                <Plus className="w-4 h-4 mr-2" />
                Create Case
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Case</DialogTitle>
                <DialogDescription>Add a new case to the system</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Case Title</label>
                  <Input placeholder="Enter case title" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Court</label>
                  <Input placeholder="Enter court name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Client</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Assigned Lawyer</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select lawyer" />
                    </SelectTrigger>
                    <SelectContent>
                      {lawyers.map((lawyer) => (
                        <SelectItem key={lawyer.id} value={lawyer.id}>{lawyer.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea className="w-full h-24 px-3 py-2 border rounded-md text-sm" placeholder="Enter case description" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button className="bg-navy-700 hover:bg-navy-800">Create Case</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search cases..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={lawyerFilter} onValueChange={setLawyerFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Lawyer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Lawyers</SelectItem>
                  {lawyers.map((lawyer) => (
                    <SelectItem key={lawyer.id} value={lawyer.id}>{lawyer.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Cases</CardTitle>
            <CardDescription>{filteredCases.length} cases found</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case Number</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Lawyer</TableHead>
                  <TableHead>Court</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCases.map((caseItem) => (
                  <TableRow key={caseItem.id}>
                    <TableCell className="font-medium">{caseItem.caseNumber}</TableCell>
                    <TableCell>
                      <Link href={`/lawfirm/cases/${caseItem.id}`} className="hover:text-navy-700">
                        {caseItem.title}
                      </Link>
                    </TableCell>
                    <TableCell>{getClientName(caseItem.clientId)}</TableCell>
                    <TableCell>{getLawyerName(caseItem.assignedLawyerId)}</TableCell>
                    <TableCell>{caseItem.court || "-"}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(caseItem.status)}>
                        {caseItem.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(caseItem.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Link href={`/lawfirm/cases/${caseItem.id}`} className="flex items-center">
                              <Eye className="w-4 h-4 mr-2" />View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem><Edit className="w-4 h-4 mr-2" />Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600"><Trash2 className="w-4 h-4 mr-2" />Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
