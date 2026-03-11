"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  User,
} from "lucide-react";
import { calendarEvents, cases, lawyers, clients } from "@/data";
import { formatDate, formatDateTime, getEventTypeColor } from "@/lib/utils";

type ViewMode = "month" | "week" | "day";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 2, 1)); // March 2024
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days: (Date | null)[] = [];
    
    // Previous month days
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getWeekDays = (date: Date) => {
    const days: Date[] = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  const navigateCalendar = (direction: number) => {
    const newDate = new Date(currentDate);
    if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() + direction);
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + direction * 7);
    } else {
      newDate.setDate(newDate.getDate() + direction);
    }
    setCurrentDate(newDate);
  };

  const getEventsForDay = (date: Date) => {
    return calendarEvents.filter((event) => {
      const eventDate = new Date(event.startDate);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = getWeekDays(currentDate);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const today = new Date();
  const isToday = (date: Date) => 
    date.toDateString() === today.toDateString();

  return (
    <DashboardLayout role="lawfirm">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-navy-900">Calendar</h1>
            <p className="text-gray-500">Manage hearings, meetings, and deadlines</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-navy-700 hover:bg-navy-800">
                <Plus className="w-4 h-4 mr-2" />
                Schedule Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule New Event</DialogTitle>
                <DialogDescription>Create a new calendar event</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Event Title</Label>
                  <Input placeholder="Enter event title" />
                </div>
                <div className="space-y-2">
                  <Label>Event Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="court_hearing">Court Hearing</SelectItem>
                      <SelectItem value="client_meeting">Client Meeting</SelectItem>
                      <SelectItem value="legal_task">Legal Task</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Input type="time" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input placeholder="Enter location" />
                </div>
                <div className="space-y-2">
                  <Label>Case</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select case" />
                    </SelectTrigger>
                    <SelectContent>
                      {cases.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button className="bg-navy-700 hover:bg-navy-800">Create Event</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* View Controls */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => navigateCalendar(-1)}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h2 className="text-xl font-semibold">
                  {viewMode === "month" 
                    ? `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                    : viewMode === "week"
                    ? `${monthNames[weekDays[0].getMonth()]} ${weekDays[0].getDate()} - ${monthNames[weekDays[6].getMonth()]} ${weekDays[6].getDate()}`
                    : formatDate(currentDate)
                  }
                </h2>
                <Button variant="outline" size="icon" onClick={() => navigateCalendar(1)}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" onClick={() => setCurrentDate(new Date())}>Today</Button>
              </div>
              <div className="flex items-center gap-2">
                <Select value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="day">Day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Grid */}
        <Card>
          <CardContent className="p-0">
            {viewMode === "month" && (
              <div className="grid grid-cols-7">
                {/* Day Headers */}
                {dayNames.map((day) => (
                  <div key={day} className="p-3 text-center font-semibold text-gray-500 border-b">
                    {day}
                  </div>
                ))}
                {/* Calendar Days */}
                {days.map((day, index) => {
                  const events = day ? getEventsForDay(day) : [];
                  return (
                    <div 
                      key={index} 
                      className={`min-h-24 p-2 border-b border-r ${!day ? 'bg-gray-50' : ''}`}
                    >
                      {day && (
                        <>
                          <div className={`text-sm font-medium mb-1 ${isToday(day) ? 'bg-navy-700 text-white w-6 h-6 rounded-full flex items-center justify-center' : ''}`}>
                            {day.getDate()}
                          </div>
                          <div className="space-y-1">
                            {events.slice(0, 3).map((event) => (
                              <div
                                key={event.id}
                                className={`text-xs p-1 rounded truncate cursor-pointer ${getEventTypeColor(event.type)}`}
                                title={event.title}
                              >
                                {event.title}
                              </div>
                            ))}
                            {events.length > 3 && (
                              <div className="text-xs text-gray-500">+{events.length - 3} more</div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {viewMode === "week" && (
              <div className="grid grid-cols-8">
                <div className="border-r p-2"></div>
                {weekDays.map((day, index) => (
                  <div key={index} className="border-r p-2 text-center">
                    <div className="text-sm text-gray-500">{dayNames[day.getDay()]}</div>
                    <div className={`text-lg font-semibold ${isToday(day) ? 'bg-navy-700 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto' : ''}`}>
                      {day.getDate()}
                    </div>
                  </div>
                ))}
                {/* Time slots */}
                {Array.from({ length: 12 }, (_, i) => (
                  <React.Fragment key={i}>
                    <div className="border-r p-2 text-xs text-gray-500">
                      {i + 8}:00
                    </div>
                    {weekDays.map((day, dayIndex) => {
                      const dayEvents = getEventsForDay(day).filter((e) => {
                        const hour = new Date(e.startDate).getHours();
                        return hour === i + 8;
                      });
                      return (
                        <div key={dayIndex} className="border-r min-h-16 p-1">
                          {dayEvents.map((event) => (
                            <div
                              key={event.id}
                              className={`text-xs p-1 rounded mb-1 ${getEventTypeColor(event.type)}`}
                            >
                              {event.title}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            )}

            {viewMode === "day" && (
              <div className="p-4">
                <div className="text-2xl font-semibold mb-4">
                  {formatDate(currentDate)}
                </div>
                <div className="space-y-4">
                  {getEventsForDay(currentDate).length > 0 ? (
                    getEventsForDay(currentDate).map((event) => (
                      <div key={event.id} className="flex gap-4 p-4 border rounded-lg">
                        <div className={`w-1 rounded-full ${event.type === 'court_hearing' ? 'bg-orange-500' : event.type === 'client_meeting' ? 'bg-blue-500' : 'bg-purple-500'}`} />
                        <div className="flex-1">
                          <h3 className="font-semibold">{event.title}</h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatDateTime(event.startDate)}
                            </span>
                            {event.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {event.location}
                              </span>
                            )}
                          </div>
                          {event.description && (
                            <p className="mt-2 text-sm text-gray-600">{event.description}</p>
                          )}
                        </div>
                        <Badge variant="outline">{event.type.replace("_", " ")}</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">No events scheduled for this day</p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Your scheduled events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {calendarEvents
                .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                .slice(0, 5)
                .map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        event.type === 'court_hearing' ? 'bg-orange-100' : 
                        event.type === 'client_meeting' ? 'bg-blue-100' : 'bg-purple-100'
                      }`}>
                        <CalendarIcon className={`w-5 h-5 ${
                          event.type === 'court_hearing' ? 'text-orange-600' : 
                          event.type === 'client_meeting' ? 'text-blue-600' : 'text-purple-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-gray-500">{formatDateTime(event.startDate)}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{event.type.replace("_", " ")}</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
