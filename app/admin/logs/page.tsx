"use client";

import React from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Clock, Info, AlertTriangle, Bug, Filter } from "lucide-react";

export default function LogsPage() {
  const logs = [
    { id: 1, level: "info", message: "User logged in", user: "admin@lexflow.com", timestamp: "2024-03-11 10:30:00" },
    { id: 2, level: "info", message: "Organization created", user: "super_admin", timestamp: "2024-03-11 10:25:00" },
    { id: 3, level: "warning", message: "Failed login attempt", user: "unknown", timestamp: "2024-03-11 10:20:00" },
    { id: 4, level: "info", message: "Subscription upgraded", user: "admin@anderson.com", timestamp: "2024-03-11 10:15:00" },
    { id: 5, level: "error", message: "Payment failed", user: "system", timestamp: "2024-03-11 10:10:00" },
    { id: 6, level: "info", message: "New user registered", user: "user@example.com", timestamp: "2024-03-11 10:05:00" },
    { id: 7, level: "info", message: "Case created", user: "lawyer@anderson.com", timestamp: "2024-03-11 10:00:00" },
    { id: 8, level: "debug", message: "API request received", user: "system", timestamp: "2024-03-11 09:55:00" },
  ];

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "info": return <Badge className="bg-blue-100 text-blue-800"><Info className="w-3 h-3 mr-1" />Info</Badge>;
      case "warning": return <Badge className="bg-yellow-100 text-yellow-800"><AlertTriangle className="w-3 h-3 mr-1" />Warning</Badge>;
      case "error": return <Badge className="bg-red-100 text-red-800"><Bug className="w-3 h-3 mr-1" />Error</Badge>;
      case "debug": return <Badge className="bg-gray-100 text-gray-800"><Activity className="w-3 h-3 mr-1" />Debug</Badge>;
      default: return <Badge variant="outline">{level}</Badge>;
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-navy-900">System Logs</h1>
            <p className="text-gray-500">Monitor platform activity</p>
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="warning">Warning</TabsTrigger>
            <TabsTrigger value="error">Error</TabsTrigger>
          </TabsList>

          <Card>
            <CardContent className="p-4">
              <Input placeholder="Search logs..." />
            </CardContent>
          </Card>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>All system events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getLevelBadge(log.level)}
                        <span>{log.message}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{log.user}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {log.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
