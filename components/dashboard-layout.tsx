"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Scale,
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  Settings,
  LogOut,
  Bell,
  ChevronLeft,
  Menu,
  Briefcase,
  User,
  FileText,
  Calendar,
  CheckSquare,
  ClipboardList,
  Shield,
  Activity,
} from "lucide-react";
import { currentUser, currentOrganization, notifications } from "@/data";
import { getInitials } from "@/lib/utils";

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

interface SidebarGroup {
  title: string;
  items: SidebarItem[];
}

const adminSidebar: SidebarGroup[] = [
  {
    title: "Main",
    items: [
      { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { title: "Organizations", href: "/admin/organizations", icon: Building2 },
      { title: "Users", href: "/admin/users", icon: Users },
      { title: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
    ],
  },
  {
    title: "System",
    items: [
      { title: "System Logs", href: "/admin/logs", icon: Activity },
      { title: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

const lawfirmSidebar: SidebarGroup[] = [
  {
    title: "Management",
    items: [
      { title: "Dashboard", href: "/lawfirm", icon: LayoutDashboard },
      { title: "Cases", href: "/lawfirm/cases", icon: Briefcase },
      { title: "Clients", href: "/lawfirm/clients", icon: User },
      { title: "Lawyers", href: "/lawfirm/lawyers", icon: Users },
    ],
  },
  {
    title: "Operations",
    items: [
      { title: "Calendar", href: "/lawfirm/calendar", icon: Calendar },
      { title: "Documents", href: "/lawfirm/documents", icon: FileText },
      { title: "Tasks", href: "/lawfirm/tasks", icon: CheckSquare },
      { title: "Members", href: "/lawfirm/members", icon: ClipboardList },
    ],
  },
  {
    title: "Finance",
    items: [
      { title: "Billing", href: "/lawfirm/billing", icon: CreditCard },
    ],
  },
  {
    title: "Settings",
    items: [
      { title: "Settings", href: "/lawfirm/settings", icon: Settings },
    ],
  },
];

const lawyerSidebar: SidebarGroup[] = [
  {
    title: "Work",
    items: [
      { title: "Dashboard", href: "/lawyer", icon: LayoutDashboard },
      { title: "My Cases", href: "/lawyer/cases", icon: Briefcase },
      { title: "Calendar", href: "/lawyer/calendar", icon: Calendar },
      { title: "Documents", href: "/lawyer/documents", icon: FileText },
      { title: "Tasks", href: "/lawyer/tasks", icon: CheckSquare },
    ],
  },
  {
    title: "Alerts",
    items: [
      { title: "Notifications", href: "/lawyer/notifications", icon: Bell },
    ],
  },
];

const clientSidebar: SidebarGroup[] = [
  {
    title: "Portal",
    items: [
      { title: "Dashboard", href: "/client", icon: LayoutDashboard },
      { title: "My Cases", href: "/client/cases", icon: Briefcase },
      { title: "Documents", href: "/client/documents", icon: FileText },
      { title: "Hearings", href: "/client/hearings", icon: Calendar },
      { title: "Messages", href: "/client/messages", icon: Users },
      { title: "Invoices", href: "/client/invoices", icon: CreditCard },
    ],
  },
];

const sidebarMap: Record<string, SidebarGroup[]> = {
  admin: adminSidebar,
  lawfirm: lawfirmSidebar,
  lawyer: lawyerSidebar,
  client: clientSidebar,
};

interface DashboardLayoutProps {
  children: React.ReactNode;
  role?: "admin" | "lawfirm" | "lawyer" | "client";
}

export default function DashboardLayout({
  children,
  role = "lawfirm",
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const sidebar = sidebarMap[role] || lawfirmSidebar;
  const unreadNotifications = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </Button>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-navy-700 rounded-lg flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <span className="text-xl font-bold text-navy-900">LexFlow</span>
            )}
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.slice(0, 5).map((notif) => (
                <DropdownMenuItem key={notif.id} className="flex flex-col items-start gap-1 p-3">
                  <div className="flex items-center gap-2 w-full">
                    <span className="font-medium">{notif.title}</span>
                    {!notif.isRead && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{notif.message}</span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-blue-600">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline">{currentUser.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{currentUser.name}</span>
                  <span className="text-xs text-gray-500 font-normal">
                    {currentUser.email}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 bottom-0 bg-white border-r transition-all duration-300 z-30",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Organization Info */}
        {!collapsed && (
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-navy-700" />
              </div>
              <div>
                <p className="font-medium text-sm">{currentOrganization.name}</p>
                <Badge variant="secondary" className="text-xs">
                  {currentOrganization.plan}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-2 space-y-4">
          {sidebar.map((group) => (
            <div key={group.title}>
              {!collapsed && (
                <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {group.title}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-navy-50 text-navy-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "pt-16 min-h-screen transition-all duration-300",
          collapsed ? "ml-16" : "ml-64"
        )}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
