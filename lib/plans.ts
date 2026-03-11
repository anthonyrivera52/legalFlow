export type SubscriptionPlan = 'free' | 'starter' | 'professional' | 'enterprise';

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
  stripePriceId?: string;
}

export const subscriptionPlans: Plan[] = [
  {
    id: 'plan_free',
    name: 'Free',
    slug: 'free',
    price: 0,
    limits: { maxLawyers: 1, maxClients: 5, maxCases: 10 },
    features: ['1 Lawyer', '5 Clients', '10 Cases', 'Basic Support']
  },
  {
    id: 'plan_starter',
    name: 'Starter',
    slug: 'starter',
    price: 99,
    limits: { maxLawyers: 5, maxClients: 50, maxCases: 100 },
    features: ['5 Lawyers', '50 Clients', '100 Cases', 'Priority Support', 'Document Storage'],
    stripePriceId: 'price_starter_monthly'
  },
  {
    id: 'plan_professional',
    name: 'Professional',
    slug: 'professional',
    price: 299,
    limits: { maxLawyers: -1, maxClients: -1, maxCases: -1 },
    features: ['Unlimited Lawyers', 'Unlimited Clients', 'Unlimited Cases', '24/7 Support', 'Advanced Analytics', 'Custom Branding'],
    stripePriceId: 'price_professional_monthly'
  },
  {
    id: 'plan_enterprise',
    name: 'Enterprise',
    slug: 'enterprise',
    price: 999,
    limits: { maxLawyers: -1, maxClients: -1, maxCases: -1 },
    features: ['Everything in Professional', 'Dedicated Account Manager', 'Custom Integrations', 'SLA Guarantee', 'On-premise Option'],
    stripePriceId: 'price_enterprise_monthly'
  }
];

export const getPlanBySlug = (slug: SubscriptionPlan): Plan => {
  return subscriptionPlans.find(p => p.slug === slug) || subscriptionPlans[0];
};

export const formatPlanLimits = (limits: PlanLimits): string => {
  const formatLimit = (limit: number) => limit === -1 ? 'Unlimited' : limit.toString();
  return `${formatLimit(limits.maxLawyers)} lawyers, ${formatLimit(limits.maxClients)} clients, ${formatLimit(limits.maxCases)} cases`;
};
