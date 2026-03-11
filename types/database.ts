// Database Types for Multi-Tenant Architecture
// All tables include organization_id, created_at, and updated_at

export type UserRole = 'super_admin' | 'lawfirm_admin' | 'lawyer' | 'client';
export type MembershipStatus = 'pending' | 'active' | 'suspended';
export type InvitationStatus = 'pending' | 'accepted' | 'expired';
export type SubscriptionPlan = 'free' | 'starter' | 'professional' | 'enterprise';
export type CaseStatus = 'open' | 'in_progress' | 'pending' | 'closed' | 'archived';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';
export type EventType = 'court_hearing' | 'client_meeting' | 'legal_task';

// Base interface for all multi-tenant tables
export interface BaseEntity {
  id: string;
  organization_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface User extends BaseEntity {
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  password_hash?: string; // Only for demo
  email_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Organization extends BaseEntity {
  name: string;
  plan: SubscriptionPlan;
  owner_id: string; // Reference to user
  stripe_customer_id?: string;
  is_active: boolean;
  settings: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
}

export interface Membership extends BaseEntity {
  user_id: string;
  organization_id: string;
  role: UserRole;
  status: MembershipStatus;
  joined_at: Date;
}

export interface Invitation extends BaseEntity {
  email: string;
  organization_id: string;
  role: UserRole;
  status: InvitationStatus;
  token: string; // Unique invitation token
  message?: string;
  sent_at: Date;
  expires_at: Date;
  accepted_at?: Date;
}

export interface Subscription extends BaseEntity {
  organization_id: string;
  plan: SubscriptionPlan;
  stripe_subscription_id?: string;
  stripe_price_id?: string;
  monthly_price: number;
  billing_cycle: 'monthly' | 'yearly';
  next_payment_date: Date;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  current_period_start: Date;
  current_period_end: Date;
}

export interface PlanLimits {
  maxLawyers: number;
  maxClients: number;
  maxCases: number;
}

export interface Plan {
  id: string;
  name: string;
  slug: SubscriptionPlan;
  price: number;
  limits: PlanLimits;
  features: string[];
  stripe_price_id_monthly?: string;
  stripe_price_id_yearly?: string;
}

export interface Client extends BaseEntity {
  organization_id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  notes?: string;
}

export interface Lawyer extends BaseEntity {
  organization_id: string;
  user_id?: string; // Link to user account
  name: string;
  email: string;
  phone?: string;
  specialization?: string;
  bar_number?: string;
  is_active: boolean;
}

export interface Case extends BaseEntity {
  organization_id: string;
  case_number: string;
  title: string;
  description?: string;
  client_id: string;
  assigned_lawyer_id?: string;
  court?: string;
  status: CaseStatus;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  filed_date?: Date;
  closed_date?: Date;
}

export interface Document extends BaseEntity {
  organization_id: string;
  case_id: string;
  uploaded_by: string;
  name: string;
  type: string;
  size: number;
  storage_path: string; // Supabase Storage path
  url?: string;
}

export interface CalendarEvent extends BaseEntity {
  organization_id: string;
  title: string;
  case_id?: string;
  type: EventType;
  assigned_lawyer_id?: string;
  location?: string;
  description?: string;
  start_date: Date;
  end_date: Date;
  all_day: boolean;
}

export interface Task extends BaseEntity {
  organization_id: string;
  title: string;
  case_id: string;
  assigned_to: string; // User ID
  due_date: Date;
  status: TaskStatus;
  priority?: 'low' | 'medium' | 'high';
  description?: string;
}

export interface Invoice extends BaseEntity {
  organization_id: string;
  invoice_number: string;
  client_id: string;
  case_id?: string;
  amount: number;
  status: InvoiceStatus;
  due_date: Date;
  paid_date?: Date;
  stripe_invoice_id?: string;
  line_items: InvoiceLineItem[];
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Notification extends BaseEntity {
  user_id: string;
  title: string;
  message: string;
  type: 'hearing' | 'document' | 'case' | 'task' | 'system';
  is_read: boolean;
  read_at?: Date;
  action_url?: string;
}

export interface TimelineEvent {
  id: string;
  case_id: string;
  type: 'document' | 'hearing' | 'status_change' | 'note' | 'task' | 'notification';
  title: string;
  description: string;
  user_id: string;
  user_name: string;
  created_at: Date;
}

// Demo data (for development without Supabase)
export interface DemoData {
  currentUser: User;
  currentOrganization: Organization;
}

// Helper types for creating new entities
export type CreateUser = Omit<User, 'id' | 'created_at' | 'updated_at'>;
export type CreateOrganization = Omit<Organization, 'id' | 'created_at' | 'updated_at'>;
export type CreateMembership = Omit<Membership, 'id' | 'created_at' | 'updated_at'>;
export type CreateInvitation = Omit<Invitation, 'id' | 'created_at' | 'updated_at'>;
export type CreateClient = Omit<Client, 'id' | 'created_at' | 'updated_at'>;
export type CreateLawyer = Omit<Lawyer, 'id' | 'created_at' | 'updated_at'>;
export type CreateCase = Omit<Case, 'id' | 'created_at' | 'updated_at'>;
export type CreateDocument = Omit<Document, 'id' | 'created_at' | 'updated_at'>;
export type CreateCalendarEvent = Omit<CalendarEvent, 'id' | 'created_at' | 'updated_at'>;
export type CreateTask = Omit<Task, 'id' | 'created_at' | 'updated_at'>;
export type CreateInvoice = Omit<Invoice, 'id' | 'created_at' | 'updated_at'>;
