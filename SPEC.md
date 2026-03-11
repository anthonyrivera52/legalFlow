# LexFlow – Legal Operations Platform

## Overview

LexFlow is a comprehensive Legal Case Management SaaS platform with multi-tenant architecture designed for law firms.

---

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **shadcn/ui** components
- **Supabase** (Auth, Database, Storage)
- **Stripe** (Billing & Subscriptions)

---

## 1. Supabase Setup

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Storage Buckets
- `case-documents` - Legal documents organized by organization/case

### Database Schema Requirements
All tables include:
```sql
id              UUID PRIMARY KEY
organization_id UUID NOT NULL REFERENCES organizations(id)
created_at      TIMESTAMP DEFAULT NOW()
updated_at      TIMESTAMP DEFAULT NOW()
```

### Row Level Security (RLS)
- All queries must enforce organization isolation
- Users can only access resources within their organization

---

## 2. Authentication Flow

### Public Signup (Invitation-Only)
The public signup is **invitation-only**. Users cannot create organizations directly.

1. User visits `/signup`
2. Enters invitation code provided by their law firm
3. System verifies invitation (validates email, role, organization)
4. User creates password
5. User joins organization with assigned role

### Login Flow
1. User visits `/login`
2. Enters email and password
3. System validates credentials
4. User redirected to role-based dashboard

### Invitation Flow
1. **Law Firm Admin** invites user from `/lawfirm/members`
2. System creates invitation record with unique token
3. Invitation email sent with link to `/invite/[token]`
4. User visits invitation page
5. User creates password to accept invitation
6. System creates:
   - User account in Supabase Auth
   - Membership for user in organization
7. User redirected to dashboard

---

## 3. Super Admin Access

### Creation
- **Super admins are NOT created through public signup**
- Created only through **manual database entry** for security
- Assigned directly in the database by platform operator

### Organization Provisioning Workflow
The Super Admin is responsible for creating new organizations and their administrators:

1. **Super Admin** logs into `/admin`
2. **Super Admin** navigates to `/admin/organizations`
3. **Super Admin** clicks "Create Organization"
4. **Super Admin** fills in:
   - Organization Name
   - Subscription Plan
   - Administrator First Name
   - Administrator Last Name
   - Administrator Email
5. **System** creates:
   - New organization in database
   - New user account for admin
   - Membership linking user to org as `lawfirm_admin`
6. **System** sends login credentials to admin email (or admin sets password via reset link)

### Super Admin Responsibilities
- Create and manage law firm organizations
- Create initial **lawfirm_admin** accounts
- Assign administrators to organizations
- Manage platform-level settings
- Monitor organizations and system usage

### Admin Routes
```
/admin                     → Dashboard
/admin/organizations      → Organization management
/admin/users             → User management
/admin/subscriptions     → Subscription management
/admin/logs             → System logs
/admin/settings         → Platform settings
```

---

## 4. Roles & Permissions

| Role | Dashboard | Permissions |
|------|-----------|-------------|
| Super Admin | `/admin` | Full platform access |
| Law Firm Admin | `/lawfirm` | Full org access |
| Lawyer | `/lawyer` | Assigned cases only |
| Client | `/client` | Own cases only |

### Law Firm Workflow
1. **Admin** registers clients
2. **Admin** creates legal cases
3. **Admin** assigns cases to lawyers
4. **Lawyers** handle legal process
5. **Clients** view their case information

---

## 5. Subscription Plans

| Plan | Price | Lawyers | Clients | Cases |
|------|-------|---------|---------|-------|
| Free | $0 | 1 | 5 | 10 |
| Starter | $99/mo | 5 | 50 | 100 |
| Professional | $299/mo | Unlimited | Unlimited | Unlimited |
| Enterprise | $999/mo | Unlimited | Unlimited | Unlimited |

### Billing Integration (Stripe)

**Model:** Organization → Subscription → Plan

**API Endpoints:**
- `POST /api/checkout` - Create Stripe checkout session
- `POST /api/webhooks/stripe` - Handle Stripe webhooks

**Webhook Events:**
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

---

## 6. Document Storage

### Supabase Storage Structure
```
case-documents/
   {organization_id}/
      {case_id}/
         document.pdf
```

### Permissions
- Only organization members can access
- Clients can only access their case documents

### API (`lib/storage.ts`)
- `uploadDocument()` - Upload file to storage
- `deleteDocument()` - Delete file from storage
- `getSignedUrl()` - Get temporary signed URL
- `listCaseDocuments()` - List files for a case

---

## 7. Database Schema

### Tables

```sql
-- Organizations (law firms)
CREATE TABLE organizations (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  plan VARCHAR(50) DEFAULT 'free',
  owner_id UUID REFERENCES users(id),
  stripe_customer_id VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar VARCHAR(500),
  role VARCHAR(50) DEFAULT 'client',
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Memberships (user-organization relationship)
CREATE TABLE memberships (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  organization_id UUID REFERENCES organizations(id),
  role VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  joined_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Invitations
CREATE TABLE invitations (
  id UUID PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  organization_id UUID REFERENCES organizations(id),
  role VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  token VARCHAR(255) UNIQUE NOT NULL,
  message TEXT,
  sent_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  accepted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id),
  plan VARCHAR(50) NOT NULL,
  stripe_subscription_id VARCHAR(255),
  stripe_price_id VARCHAR(255),
  monthly_price DECIMAL(10,2),
  billing_cycle VARCHAR(20) DEFAULT 'monthly',
  next_payment_date TIMESTAMP,
  status VARCHAR(50) DEFAULT 'active',
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Cases
CREATE TABLE cases (
  id UUID PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id),
  case_number VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  client_id UUID REFERENCES clients(id),
  assigned_lawyer_id UUID,
  court VARCHAR(255),
  status VARCHAR(50) DEFAULT 'open',
  priority VARCHAR(20),
  filed_date TIMESTAMP,
  closed_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Documents
CREATE TABLE documents (
  id UUID PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id),
  case_id UUID REFERENCES cases(id),
  uploaded_by UUID REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100),
  size INTEGER,
  storage_path VARCHAR(500),
  url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add remaining tables as needed...
```

---

## 8. Routes Structure

```
/                    → Landing page
/login               → Login
/signup             → Signup (with organization creation)
/invite/[token]     → Accept invitation

// Admin
/admin                  → Dashboard
/admin/organizations    → Organizations
/admin/users           → Users
/admin/subscriptions   → Subscriptions
/admin/logs           → System Logs
/admin/settings       → Settings

// Law Firm
/lawfirm               → Dashboard
/lawfirm/cases        → Cases
/lawfirm/cases/[id]  → Case Detail
/lawfirm/clients      → Clients
/lawfirm/lawyers     → Lawyers
/lawfirm/calendar     → Calendar
/lawfirm/documents   → Documents
/lawfirm/tasks       → Tasks
/lawfirm/members     → Members & Invitations
/lawfirm/billing     → Subscription & Invoices
/lawfirm/settings    → Organization Settings

// Lawyer
/lawyer              → Dashboard
/lawyer/cases        → My Cases
/lawyer/calendar     → Calendar
/lawyer/documents    → Documents
/lawyer/tasks       → Tasks
/lawyer/notifications → Notifications

// Client
/client              → Dashboard
/client/cases        → My Cases
/client/documents    → Documents
/client/hearings   → Hearings
/client/messages    → Messages
/client/invoices    → Invoices
```

---

## 9. API Endpoints

```
/api/checkout         → Create Stripe checkout session
/api/webhooks/stripe → Stripe webhook handler
```

---

## 10. Environment Configuration

Create `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_PROFESSIONAL_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 11. Key Files

```
/lib/supabase.ts          → Supabase client
/lib/storage.ts           → Storage utilities
/lib/plans.ts            → Subscription plans
/types/database.ts      → Database types
/app/api/webhooks/stripe/route.ts → Stripe webhook
/app/api/checkout/route.ts       → Checkout session
```

---

## 12. Running the Project

```bash
# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local
# Add your Supabase and Stripe credentials

# Run development server
npm run dev

# Build for production
npm run build
npm start
```
