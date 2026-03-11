# LexFlow - Test Users

Use these credentials to test the different dashboards in the application.

## Login Credentials

Since this is a demo without real authentication, you can modify the `data/index.ts` file to change which user is currently logged in by editing:

```typescript
export const currentUser = users[0]; // Change index to switch users
export const currentOrganization = organizations[0]; // Change to match user's org
```

## Test Accounts

### Super Admin
| Field | Value |
|-------|-------|
| Email | `super@lexflow.com` |
| Role | super_admin |
| Access | `/admin` |
| Organization | Platform (all) |

**URL:** http://localhost:3000/admin

---

### Law Firm Admin (Anderson & Associates)
| Field | Value |
|-------|-------|
| Email | `admin@anderson.com` |
| Name | Sarah Anderson |
| Role | lawfirm_admin |
| Access | `/lawfirm` |
| Organization | Anderson & Associates (Professional plan) |

**URL:** http://localhost:3000/lawfirm

---

### Lawyer (Anderson & Associates)
| Field | Value |
|-------|-------|
| Email | `john@anderson.com` |
| Name | John Smith |
| Role | lawyer |
| Access | `/lawyer` |
| Organization | Anderson & Associates |

**URL:** http://localhost:3000/lawyer

---

### Client
| Field | Value |
|-------|-------|
| Email | `client1@email.com` |
| Name | Robert Brown |
| Role | client |
| Access | `/client` |
| Organization | Anderson & Associates |

**URL:** http://localhost:3000/client

---

## Other Organizations

### Johnson Legal Group (Starter Plan)
- Admin: `admin@johnson.com`
- Lawyer: `david@johnson.com`
- Client: `client2@email.com`

### Williams Law Firm (Free Plan)
- Admin: `admin@williams.com`
- Lawyer: `lisa@williams.com`

### Thompson & Partners (Enterprise Plan)
- Admin: `admin@thompson.com`

---

## How to Switch Users

To test different users, edit `/workspace/project/data/index.ts` and change the `currentUser` and `currentOrganization` exports at the bottom of the file:

```typescript
// For Admin
export const currentUser = users[0]; // Sarah Anderson
export const currentOrganization = organizations[0];

// For Lawyer  
export const currentUser = users[1]; // John Smith
export const currentOrganization = organizations[0];

// For Client
export const currentUser = users[3]; // Robert Brown
export const currentOrganization = organizations[0];

// For Super Admin
export const currentUser = users[10]; // Admin User
export const currentOrganization = organizations[0];
```

Then restart the development server.

---

## Testing Features

### Super Admin (/admin)
- View all organizations
- Create new organizations with admin users
- View platform analytics
- Manage subscriptions
- System logs

### Law Firm Admin (/lawfirm)
- Dashboard with case stats
- Case management
- Client management
- Lawyer management
- Calendar with hearings/meetings
- Document management
- Task management
- Team members & invitations
- Billing & subscriptions
- Organization settings

### Lawyer (/lawyer)
- My assigned cases
- Calendar
- Documents
- Tasks
- Notifications

### Client (/client)
- My cases
- My documents
- My hearings
- Messages
- Invoices
