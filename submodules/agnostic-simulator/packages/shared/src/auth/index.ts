/**
 * Auth module exports
 */
export type {
  AuthSession,
  AuthUser,
  CanonicalAuthContext,
  LorcanitoUserSettings,
  SessionResult,
  SubscriptionTier,
  UserRole,
} from "./types";
export { hasSubscriptionTier, isAdmin, isDonor, isModerator } from "./types";
export { FEATURES, getEnabledFeatures, hasFeature, type FeatureKey } from "./features";
