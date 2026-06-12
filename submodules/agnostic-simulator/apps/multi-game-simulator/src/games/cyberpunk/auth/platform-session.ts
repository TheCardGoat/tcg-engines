export type UserRole = "user" | "donor" | "moderator" | "admin";

export type SubscriptionTier = "free" | "tier1" | "tier2" | "tier3" | "tier4" | "tier5" | "tier6";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  username?: string | null;
  displayUsername?: string | null;
  emailVerified: boolean;
  role: UserRole;
  subscriptionTier: SubscriptionTier;
  subscriptionExpiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSession {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionResult {
  user: AuthUser | null;
  session: AuthSession | null;
}
