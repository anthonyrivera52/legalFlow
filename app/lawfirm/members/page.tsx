"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import {
  Users,
  MoreVertical,
  Plus,
  Mail,
  UserPlus,
  Edit,
  Trash2,
  MoreHorizontal,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { users, memberships, organizations } from "@/data";
import { formatDate, getStatusColor, getInitials } from "@/lib/utils";

export default function MembersPage() {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const currentOrgMembers = memberships.filter((m) => m.organizationId === "org-1");
  
  const getMemberUser = (userId: string) => users.find((u) => u.id === userId);
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "lawfirm_admin": return "default";
      case "lawyer": return "secondary";
      case "client": return "outline";
      default: return "secondary";
    }
  };

  const invitations = [
    { id: "inv-1", email: "newuser@example.com", role: "lawyer", status: "pending", sentAt: new Date("2024-03-10") },
    { id: "inv-2", email: "client@example.com", role: "client", status: "accepted", sentAt: new Date("2024-03-05") },
  ];

  return (
    <DashboardLayout role="lawfirm">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-navy-900">Members</h1>
            <p className="text-gray-500">Manage team members and invitations</p>
          </div>
          <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
            <DialogTrigger asChild>
              <Button className="bg-navy-700 hover:bg-navy-800">
                <UserPlus className="w-4 h-4 mr-2" />
                Invite User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite User</DialogTitle>
                <DialogDescription>Send an invitation to join your organization</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input type="email" placeholder="user@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lawyer">Lawyer</SelectItem>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="lawfirm_admin">Law Firm Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Personal Message (Optional)</label>
                  <textarea className="w-full h-20 px-3 py-2 border rounded-md text-sm" placeholder="Add a welcome message..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsInviteOpen(false)}>Cancel</Button>
                <Button className="bg-navy-700 hover:bg-navy-800">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Invitation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Members List */}
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>{currentOrgMembers.length} members in your organization</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentOrgMembers.map((member) => {
                  const user = getMemberUser(member.userId);
                  return (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-navy-100 text-navy-700">
                              {user ? getInitials(user.name) : "?"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user?.name || "Unknown"}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user?.email}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(member.role)}>
                          {member.role.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(member.status)}>
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(member.joinedAt)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><Edit className="w-4 h-4 mr-2" />Change Role</DropdownMenuItem>
                            <DropdownMenuItem><Mail className="w-4 h-4 mr-2" />Resend Invite</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600"><Trash2 className="w-4 h-4 mr-2" />Remove</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pending Invitations */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Invitations</CardTitle>
            <CardDescription>Invitations sent but not yet accepted</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((invite) => (
                  <TableRow key={invite.id}>
                    <TableCell className="font-medium">{invite.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{invite.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(invite.status)}>
                        {invite.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                        {invite.status === "accepted" && <CheckCircle className="w-3 h-3 mr-1" />}
                        {invite.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(invite.sentAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem><Mail className="w-4 h-4 mr-2" />Resend</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600"><XCircle className="w-4 h-4 mr-2" />Cancel</DropdownMenuItem>
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
