"use client";

import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, MapPin, Clock } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { calendarEvents, cases, clients } from "@/data";
import { formatDateTime } from "@/lib/utils";

export default function ClientHearingsPage() {
  const { currentUser } = useAuth();
  
  // Get client's organization
  const clientData = clients.find(c => c.email === currentUser?.email);
  const clientId = clientData?.id || "client-1";
  
  // Get cases for this client
  const clientCases = cases.filter(c => c.clientId === clientId);
  const caseIds = clientCases.map(c => c.id);
  
  // Filter hearings for client's cases
  const myHearings = calendarEvents.filter((e) => e.caseId && caseIds.includes(e.caseId));

  return (
    <DashboardLayout role="client">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-navy-900">Hearings</h1>
          <p className="text-gray-500">View upcoming court hearings and meetings</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Hearings</CardTitle>
          </CardHeader>
          <CardContent>
            {myHearings.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No hearings scheduled</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Case</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myHearings.map((event) => {
                    const caseItem = cases.find(c => c.id === event.caseId);
                    return (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{caseItem?.caseNumber}</TableCell>
                        <TableCell>{event.type}</TableCell>
                        <TableCell>{formatDateTime(event.startDate)}</TableCell>
                        <TableCell>{event.location || "TBD"}</TableCell>
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
