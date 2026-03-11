"use client";

import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { calendarEvents, cases } from "@/data";
import { formatDateTime } from "@/lib/utils";

export default function LawyerCalendarPage() {
  const { currentUser, currentOrganization } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  // Filter by organization
  const orgEvents = calendarEvents.filter(e => e.organizationId === currentOrganization?.id);
  
  // Get events for selected date
  const selectedDateEvents = orgEvents.filter(e => 
    new Date(e.startDate).toDateString() === new Date(selectedDate).toDateString()
  );

  // Get upcoming events (next 7 days)
  const upcomingEvents = orgEvents.filter(e => {
    const eventDate = new Date(e.startDate);
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return eventDate >= now && eventDate <= weekFromNow;
  });

  // Generate dates for the week
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  return (
    <DashboardLayout role="lawyer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-navy-900">Calendar</h1>
          <p className="text-gray-500">Manage your schedule</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Week Dates */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {weekDates.map((date) => {
                  const dateObj = new Date(date);
                  const isSelected = date === selectedDate;
                  const hasEvents = orgEvents.some(e => 
                    new Date(e.startDate).toDateString() === dateObj.toDateString()
                  );
                  return (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`w-full p-3 rounded-lg text-left flex items-center justify-between ${
                        isSelected ? "bg-navy-600 text-white" : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div>
                        <p className="font-medium">{dateObj.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                        <p className="text-sm opacity-75">{dateObj.toLocaleDateString()}</p>
                      </div>
                      {hasEvents && (
                        <Badge variant={isSelected ? "secondary" : "default"} className="ml-2">
                          {orgEvents.filter(e => new Date(e.startDate).toDateString() === dateObj.toDateString()).length}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Events List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>
                Events for {new Date(selectedDate).toLocaleDateString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateEvents.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <p>No events scheduled</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedDateEvents.map((event) => {
                    const caseItem = cases.find(c => c.id === event.caseId);
                    return (
                      <div key={event.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{event.title}</p>
                            <p className="text-sm text-gray-500">{caseItem?.caseNumber}</p>
                          </div>
                          <Badge variant="outline">{event.type}</Badge>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          <p>🕐 {formatDateTime(event.startDate)}</p>
                          {event.location && <p>📍 {event.location}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming This Week */}
        <Card>
          <CardHeader>
            <CardTitle>All Upcoming This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingEvents.slice(0, 10).map((event) => {
                const caseItem = cases.find(c => c.id === event.caseId);
                return (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-gray-500">{caseItem?.caseNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{formatDateTime(event.startDate)}</p>
                      <Badge variant="outline" className="text-xs">{event.type}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
