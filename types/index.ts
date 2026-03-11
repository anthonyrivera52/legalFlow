export type UserRole = 'super_admin' | 'lawfirm_admin' | 'lawyer' | 'client';
export type MembershipStatus = 'pending' | 'active' | 'suspended';
export type InvitationStatus = 'pending' | 'accepted' | 'expired';
export type SubscriptionPlan = 'free' | 'starter' | 'professional' | 'enterprise';
export type CaseStatus = 'open' | 'in_progress' | 'pending' | 'closed' | 'archived';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';
export type EventType = 'court_hearing' | 'client_meeting' | 'legal_task';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  createdAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  plan: SubscriptionPlan;
  ownerId: string;
  createdAt: Date;
  isActive: boolean;
}

export interface Membership {
  id: string;
  userId: string;
  organizationId: string;
  role: UserRole;
  status: MembershipStatus;
  joinedAt: Date;
}

export interface Invitation {
  id: string;
  email: string;
  organizationId: string;
  role: UserRole;
  status: InvitationStatus;
  message?: string;
  sentAt: Date;
  expiresAt: Date;
}

export interface Subscription {
  id: string;
  organizationId: string;
  plan: SubscriptionPlan;
  monthlyPrice: number;
  billingCycle: 'monthly' | 'yearly';
  nextPaymentDate: Date;
  status: 'active' | 'cancelled' | 'past_due';
}

export interface PlanLimits {
  maxLawyers: number;
  maxClients: number;
  maxCases: number;
}

export interface Plan {
  name: string;
  slug: SubscriptionPlan;
  price: number;
  limits: PlanLimits;
  features: string[];
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  organizationId: string;
  createdAt: Date;
}

export interface Lawyer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  organizationId: string;
  specialization?: string;
  createdAt: Date;
}

export interface Case {
  id: string;
  caseNumber: string;
  title: string;
  clientId: string;
  assignedLawyerId: string;
  organizationId: string;
  court?: string;
  status: CaseStatus;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  name: string;
  caseId: string;
  uploadedById: string;
  organizationId: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

export interface CalendarEvent {
  id: string;
  title: string;
  caseId?: string;
  organizationId: string;
  type: EventType;
  assignedLawyerId?: string;
  location?: string;
  description?: string;
  startDate: Date;
  endDate: Date;
}

export interface Task {
  id: string;
  title: string;
  caseId: string;
  assignedToId: string;
  organizationId: string;
  status: TaskStatus;
  dueDate: Date;
  createdAt: Date;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  caseId: string;
  organizationId: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: Date;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'hearing' | 'document' | 'case' | 'task' | 'system';
  isRead: boolean;
  createdAt: Date;
}

export interface TimelineEvent {
  id: string;
  caseId: string;
  type: 'document' | 'hearing' | 'status_change' | 'note' | 'task' | 'notification';
  title: string;
  description: string;
  userId: string;
  userName: string;
  createdAt: Date;
}
