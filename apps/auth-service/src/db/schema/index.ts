/**
 * Auth Service Database Schema
 *
 * This module exports all database tables and types for the Auth Service.
 * The schema is self-contained within this service.
 */

// Auth tables (Better Auth managed)
export {
  type Account,
  accounts,
  accountsRelations,
  type NewAccount,
  type NewSession,
  type NewUser,
  type NewVerification,
  type Session,
  sessions,
  sessionsRelations,
  type User,
  users,
  usersRelations,
  type Verification,
  verifications,
} from "./auth";

// JWKS table (Better Auth JWT plugin)
export { type Jwk, jwks, type NewJwk } from "./jwks";

// Subscription and digest tables
export {
  type DigestHistoryRecord,
  type DigestPreference,
  digestFrequencyEnum,
  digestHistory,
  digestHistoryRelations,
  digestPreferences,
  digestPreferencesRelations,
  type NewDigestHistoryRecord,
  type NewDigestPreference,
  type NewUserSubscription,
  type UserSubscription,
  userSubscriptions,
  userSubscriptionsRelations,
} from "./subscriptions";
