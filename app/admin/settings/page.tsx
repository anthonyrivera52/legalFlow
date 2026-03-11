"use client";

import React from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Shield, Database, CreditCard, Bell } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-navy-900">Settings</h1>
          <p className="text-gray-500">Platform settings</p>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Platform Settings
                </CardTitle>
                <CardDescription>General platform configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Platform Name</Label>
                  <Input defaultValue="LexFlow" />
                </div>
                <div className="space-y-2">
                  <Label>Support Email</Label>
                  <Input defaultValue="support@lexflow.com" />
                </div>
                <div className="space-y-2">
                  <Label>Default Plan</Label>
                  <Input defaultValue="Free" disabled />
                </div>
                <Button className="bg-navy-700 hover:bg-navy-800">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Supabase Configuration
                </CardTitle>
                <CardDescription>Database connection settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Supabase URL</Label>
                  <Input type="password" placeholder="https://xxxxx.supabase.co" />
                </div>
                <div className="space-y-2">
                  <Label>Supabase Anon Key</Label>
                  <Input type="password" placeholder="eyJhbGciOiJIUzI1NiIs..." />
                </div>
                <div className="space-y-2">
                  <Label>Service Role Key</Label>
                  <Input type="password" placeholder="eyJhbGciOiJIUzI1NiIs..." />
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    These values will be read from NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY environment variables.
                  </p>
                </div>
                <Button className="bg-navy-700 hover:bg-navy-800">
                  <Save className="w-4 h-4 mr-2" />
                  Save Configuration
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Stripe Configuration
                </CardTitle>
                <CardDescription>Payment processing settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Stripe Publishable Key</Label>
                  <Input type="password" placeholder="pk_test_..." />
                </div>
                <div className="space-y-2">
                  <Label>Stripe Secret Key</Label>
                  <Input type="password" placeholder="sk_test_..." />
                </div>
                <div className="space-y-2">
                  <Label>Stripe Webhook Secret</Label>
                  <Input type="password" placeholder="whsec_..." />
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Configure Stripe API keys for subscription management. Webhook endpoint: /api/webhooks/stripe
                  </p>
                </div>
                <Button className="bg-navy-700 hover:bg-navy-800">
                  <Save className="w-4 h-4 mr-2" />
                  Save Configuration
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>Platform security configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Row Level Security (RLS)</h4>
                      <p className="text-sm text-gray-500">Enable RLS for all tables</p>
                    </div>
                    <Button variant="outline">Enabled</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Multi-factor Authentication</h4>
                      <p className="text-sm text-gray-500">Require 2FA for all admins</p>
                    </div>
                    <Button variant="outline">Enabled</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Session Timeout</h4>
                      <p className="text-sm text-gray-500">Auto logout after inactivity</p>
                    </div>
                    <Button variant="outline">24 hours</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>Platform notification configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">New Signups</h4>
                    <p className="text-sm text-gray-500">Notify on new organization</p>
                  </div>
                  <Button variant="outline">Enabled</Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Payment Alerts</h4>
                    <p className="text-sm text-gray-500">Notify on payment issues</p>
                  </div>
                  <Button variant="outline">Enabled</Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">System Errors</h4>
                    <p className="text-sm text-gray-500">Critical error notifications</p>
                  </div>
                  <Button variant="outline">Enabled</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
