import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    // Case status
    open: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    pending: 'bg-orange-100 text-orange-800',
    closed: 'bg-green-100 text-green-800',
    archived: 'bg-gray-100 text-gray-800',
    // Task status
    completed: 'bg-green-100 text-green-800',
    // Invoice status
    paid: 'bg-green-100 text-green-800',
    sent: 'bg-blue-100 text-blue-800',
    overdue: 'bg-red-100 text-red-800',
    draft: 'bg-gray-100 text-gray-800',
    // Membership status
    active: 'bg-green-100 text-green-800',
    suspended: 'bg-red-100 text-red-800',
    // Invitation status
    accepted: 'bg-green-100 text-green-800',
    expired: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getEventTypeColor(type: string): string {
  const colors: Record<string, string> = {
    court_hearing: 'bg-orange-100 text-orange-800 border-orange-200',
    client_meeting: 'bg-blue-100 text-blue-800 border-blue-200',
    legal_task: 'bg-purple-100 text-purple-800 border-purple-200',
  };
  return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
}

export function getPlanColor(plan: string): string {
  const colors: Record<string, string> = {
    free: 'bg-gray-100 text-gray-800',
    starter: 'bg-blue-100 text-blue-800',
    professional: 'bg-purple-100 text-purple-800',
    enterprise: 'bg-yellow-100 text-yellow-800',
  };
  return colors[plan] || 'bg-gray-100 text-gray-800';
}
