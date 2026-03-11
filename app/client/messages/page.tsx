"use client";

import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Send, Search } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";

export default function ClientMessagesPage() {
  const { currentUser } = useAuth();
  const [selectedChat, setSelectedChat] = useState<string | null>("chat-1");

  // Mock messages data
  const conversations = [
    {
      id: "chat-1",
      with: "John Smith",
      role: "Lawyer",
      lastMessage: "The hearing has been scheduled for next week.",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: "chat-2",
      with: "Anderson & Co",
      role: "Law Firm",
      lastMessage: "Thank you for your patience.",
      time: "Yesterday",
      unread: false,
    },
  ];

  const messages = [
    { id: "1", from: "John Smith", text: "Hello, I wanted to update you on your case.", time: "10:00 AM" },
    { id: "2", from: "You", text: "Thank you, what is the update?", time: "10:15 AM" },
    { id: "3", from: "John Smith", text: "The hearing has been scheduled for next week. Please make sure to be available.", time: "10:30 AM" },
  ];

  return (
    <DashboardLayout role="client">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-navy-900">Messages</h1>
          <p className="text-gray-500">Communicate with your legal team</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Conversations</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {conversations.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => setSelectedChat(chat.id)}
                    className={`w-full p-4 text-left hover:bg-gray-50 flex items-start gap-3 ${
                      selectedChat === chat.id ? "bg-navy-50" : ""
                    }`}
                  >
                    <Avatar>
                      <AvatarFallback>{chat.with.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{chat.with}</p>
                        <span className="text-xs text-gray-500">{chat.time}</span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                    </div>
                    {chat.unread && (
                      <Badge className="bg-navy-600">New</Badge>
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2 flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="text-lg">
                {conversations.find(c => c.id === selectedChat)?.with}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.from === "You" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      msg.from === "You"
                        ? "bg-navy-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.from === "You" ? "text-navy-200" : "text-gray-500"}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
            <div className="p-4 border-t flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500"
              />
              <Button className="bg-navy-600 hover:bg-navy-700">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
