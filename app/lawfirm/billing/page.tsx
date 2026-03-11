"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  CreditCard,
  Check,
  Calendar,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
} from "lucide-react";
import { plans, currentOrganization, clients, invoices, cases, lawyers } from "@/data";
import { formatDate, formatCurrency, getStatusColor, getPlanColor } from "@/lib/utils";

export default function BillingPage() {
  const currentPlan = plans.find((p) => p.slug === currentOrganization.plan) || plans[0];
  const orgInvoices = invoices.filter((i) => i.organizationId === currentOrganization.id);
  
  const usageStats = [
    { name: "Lawyers", current: lawyers.length, limit: currentPlan.limits.maxLawyers === -1 ? "Unlimited" : currentPlan.limits.maxLawyers },
    { name: "Clients", current: clients.length, limit: currentPlan.limits.maxClients === -1 ? "Unlimited" : currentPlan.limits.maxClients },
    { name: "Cases", current: cases.length, limit: currentPlan.limits.maxCases === -1 ? "Unlimited" : currentPlan.limits.maxCases },
  ];

  return (
    <DashboardLayout role="lawfirm">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-navy-900">Billing</h1>
          <p className="text-gray-500">Manage your subscription and invoices</p>
        </div>

        <Tabs defaultValue="subscription" className="space-y-4">
          <TabsList>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="payment">Payment Method</TabsTrigger>
          </TabsList>

          {/* Subscription Tab */}
          <TabsContent value="subscription">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Current Plan */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>Your active subscription</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-navy-100 rounded-lg flex items-center justify-center">
                          <Zap className="w-6 h-6 text-navy-700" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">{currentPlan.name}</h3>
                          <Badge className={getPlanColor(currentPlan.slug)}>{currentPlan.slug}</Badge>
                        </div>
                      </div>
                      <div className="text-4xl font-bold text-navy-900 mb-4">
                        ${currentPlan.price}
                        <span className="text-lg font-normal text-gray-500">/month</span>
                      </div>
                      <ul className="space-y-2">
                        {currentPlan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-gray-600">
                            <Check className="w-4 h-4 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-2">Billing Cycle</p>
                      <p className="font-medium">Monthly</p>
                      <p className="text-sm text-gray-500 mt-4 mb-2">Next Payment</p>
                      <p className="font-medium">{formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <Button className="bg-navy-700 hover:bg-navy-800">Upgrade Plan</Button>
                    <Button variant="outline">Cancel Subscription</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Plan Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle>Available Plans</CardTitle>
                  <CardDescription>Compare features</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {plans.map((plan) => (
                      <div
                        key={plan.slug}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                          plan.slug === currentOrganization.plan
                            ? "border-navy-500 bg-navy-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{plan.name}</p>
                            <p className="text-sm text-gray-500">${plan.price}/mo</p>
                          </div>
                          {plan.slug === currentOrganization.plan && (
                            <CheckCircle className="w-5 h-5 text-navy-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Usage Tab */}
          <TabsContent value="usage">
            <Card>
              <CardHeader>
                <CardTitle>Usage Statistics</CardTitle>
                <CardDescription>Your current usage against plan limits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {usageStats.map((stat) => {
                    const percentage = typeof stat.limit === "number" 
                      ? Math.min((stat.current / stat.limit) * 100, 100) 
                      : 0;
                    return (
                      <div key={stat.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{stat.name}</span>
                          <span className="text-sm text-gray-500">
                            {stat.current} / {stat.limit}
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                        {percentage > 80 && (
                          <p className="text-sm text-orange-600 flex items-center gap-1">
                            <AlertTriangle className="w-4 h-4" />
                            Approaching limit
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <CardTitle>Invoices</CardTitle>
                <CardDescription>Your billing history</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orgInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                        <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                        </TableCell>
                        <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                        <TableCell>{formatDate(invoice.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <Download className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Method Tab */}
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Manage your payment methods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">•••• •••• •••• 4242</p>
                        <p className="text-sm text-gray-500">Expires 12/2025</p>
                      </div>
                    </div>
                    <Badge>Default</Badge>
                  </div>
                  <Button variant="outline">Add Payment Method</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
