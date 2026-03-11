"use client";

import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckSquare, Clock, Plus } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { tasks, cases, lawyers } from "@/data";
import { formatDate } from "@/lib/utils";

export default function LawyerTasksPage() {
  const { currentUser, currentOrganization } = useAuth();
  const userId = currentUser?.id || "user-2";
  
  // Filter by organization
  const orgTasks = tasks.filter(t => t.organizationId === currentOrganization?.id);
  // Filter tasks assigned to this lawyer
  const myTasks = orgTasks.filter((t) => t.assignedToId === userId);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout role="lawyer">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-navy-900">Tasks</h1>
            <p className="text-gray-500">Manage your tasks</p>
          </div>
          <Button className="bg-navy-600 hover:bg-navy-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{myTasks.length}</div>
              <p className="text-sm text-gray-500">Total Tasks</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {myTasks.filter(t => t.status === "pending").length}
              </div>
              <p className="text-sm text-gray-500">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {myTasks.filter(t => t.status === "in_progress").length}
              </div>
              <p className="text-sm text-gray-500">In Progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {myTasks.filter(t => t.status === "completed").length}
              </div>
              <p className="text-sm text-gray-500">Completed</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>My Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {myTasks.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <CheckSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No tasks assigned to you</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Case</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myTasks.map((task) => {
                    const caseItem = cases.find(c => c.id === task.caseId);
                    return (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.title}</TableCell>
                        <TableCell>{caseItem?.caseNumber || "N/A"}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(task.status)}>
                            {task.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>{task.dueDate ? formatDate(task.dueDate) : "No due date"}</TableCell>
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
