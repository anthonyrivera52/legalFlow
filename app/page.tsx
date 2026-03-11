import Link from "next/link";
import { Scale, Users, Shield, FileText, Calendar, BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-navy-700 rounded-lg flex items-center justify-center">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-navy-900">LexFlow</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-gray-600 hover:text-navy-700 transition-colors">Features</Link>
            <Link href="#pricing" className="text-gray-600 hover:text-navy-700 transition-colors">Pricing</Link>
            <Link href="/login" className="text-gray-600 hover:text-navy-700 transition-colors">Login</Link>
            <Link href="/admin">
              <Button className="bg-navy-700 hover:bg-navy-800">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-navy-900 mb-6 animate-fade-in">
            Legal Operations<br />
            <span className="text-navy-600">Reimagined</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Streamline your law firm with a comprehensive case management platform designed for modern legal practices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Link href="/admin">
              <Button size="lg" className="bg-navy-700 hover:bg-navy-800 text-lg px-8">
                Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-navy-900 mb-16">
            Everything You Need to Run Your Practice
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Multi-Tenant Architecture</CardTitle>
                <CardDescription>Support multiple law firms with isolated data and customizable settings</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Role-Based Access</CardTitle>
                <CardDescription>Granular permissions for admins, lawyers, and clients</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Case Management</CardTitle>
                <CardDescription>Track cases, documents, and client interactions in one place</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Calendar & Scheduling</CardTitle>
                <CardDescription>Manage hearings, meetings, and deadlines efficiently</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-yellow-600" />
                </div>
                <CardTitle>Analytics & Reporting</CardTitle>
                <CardDescription>Gain insights into firm performance and case metrics</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle>SaaS Billing</CardTitle>
                <CardDescription>Flexible subscription plans with usage-based pricing</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-navy-900 mb-16">
            Simple, Transparent Pricing
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>For solo practitioners</CardDescription>
                <div className="text-4xl font-bold text-navy-900">$0<span className="text-lg font-normal text-gray-500">/mo</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-600">
                  <li>1 Lawyer</li>
                  <li>5 Clients</li>
                  <li>10 Cases</li>
                  <li>Basic Support</li>
                </ul>
                <Button className="w-full mt-6" variant="outline">Get Started</Button>
              </CardContent>
            </Card>
            <Card className="border-2 border-blue-500 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">Popular</div>
              <CardHeader>
                <CardTitle>Starter</CardTitle>
                <CardDescription>For small teams</CardDescription>
                <div className="text-4xl font-bold text-navy-900">$99<span className="text-lg font-normal text-gray-500">/mo</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-600">
                  <li>5 Lawyers</li>
                  <li>50 Clients</li>
                  <li>100 Cases</li>
                  <li>Priority Support</li>
                </ul>
                <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">Get Started</Button>
              </CardContent>
            </Card>
            <Card className="border-2 border-purple-500">
              <CardHeader>
                <CardTitle>Professional</CardTitle>
                <CardDescription>For growing firms</CardDescription>
                <div className="text-4xl font-bold text-navy-900">$299<span className="text-lg font-normal text-gray-500">/mo</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-600">
                  <li>Unlimited Lawyers</li>
                  <li>Unlimited Clients</li>
                  <li>Unlimited Cases</li>
                  <li>24/7 Support</li>
                </ul>
                <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-700">Get Started</Button>
              </CardContent>
            </Card>
            <Card className="border-2 border-yellow-500">
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>For large organizations</CardDescription>
                <div className="text-4xl font-bold text-navy-900">$999<span className="text-lg font-normal text-gray-500">/mo</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-600">
                  <li>Everything in Pro</li>
                  <li>Dedicated Manager</li>
                  <li>Custom Integrations</li>
                  <li>SLA Guarantee</li>
                </ul>
                <Button className="w-full mt-6 bg-yellow-600 hover:bg-yellow-700">Contact Sales</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Practice?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Join thousands of legal professionals using LexFlow to streamline their operations.
          </p>
          <Link href="/admin">
            <Button size="lg" className="bg-white text-navy-900 hover:bg-gray-100 text-lg px-8">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-navy-700 rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">LexFlow</span>
            </div>
            <p>&copy; 2024 LexFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
