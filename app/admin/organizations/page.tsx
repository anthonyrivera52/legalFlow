"use client";

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
import { Building2, MoreVertical, Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { organizations, users, plans } from "@/data";
import { formatDate, getPlanColor } from "@/lib/utils";
import { useState } from "react";

export default function OrganizationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredOrganizations = organizations.filter((org) => {
    const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = planFilter === "all" || org.plan === planFilter;
    return matchesSearch && matchesPlan;
  });

  const getOwnerName = (ownerId: string) => {
    const owner = users.find((u) => u.id === ownerId);
    return owner?.name || "Unknown";
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-navy-900">Organizations</h1>
            <p className="text-gray-500">Manage all law firms on the platform</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-navy-700 hover:bg-navy-800">
                <Plus className="w-4 h-4 mr-2" />
                Create Organization
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Organization</DialogTitle>
                <DialogDescription>Add a new law firm to the platform</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Organization Name</label>
                  <Input placeholder="Enter organization name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Plan</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {plans.map((plan) => (
                        <SelectItem key={plan.slug} value={plan.slug}>
                          {plan.name} - ${plan.price}/mo
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Owner Email</label>
                  <Input type="email" placeholder="owner@lawfirm.com" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button className="bg-navy-700 hover:bg-navy-800">Create Organization</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Search organizations..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  {plans.map((plan) => (
                    <SelectItem key={plan.slug} value={plan.slug}>{plan.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Organizations</CardTitle>
            <CardDescription>{filteredOrganizations.length} organizations found</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrganizations.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-navy-700" />
                        </div>
                        <span className="font-medium">{org.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getOwnerName(org.ownerId)}</TableCell>
                    <TableCell><Badge className={getPlanColor(org.plan)}>{org.plan}</Badge></TableCell>
                    <TableCell>{formatDate(org.createdAt)}</TableCell>
                    <TableCell><Badge variant={org.isActive ? "success" : "destructive"}>{org.isActive ? "Active" : "Inactive"}</Badge></TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem><Eye className="w-4 h-4 mr-2" />View Details</DropdownMenuItem>
                          <DropdownMenuItem><Edit className="w-4 h-4 mr-2" />Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600"><Trash2 className="w-4 h-4 mr-2" />Deactivate</DropdownMenuItem>
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
