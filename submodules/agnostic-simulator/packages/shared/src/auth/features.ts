import type { AuthUser } from "./types";
import { hasSubscriptionTier, type SubscriptionTier } from "./types";

/**
 * Central registry mapping premium features to their minimum subscription tier.
 *
 * Adding a new gated feature: register it here, then call
 * `hasFeature(user, "yourFeature")` at the call site instead of hand-rolling
 * a `hasSubscriptionTier` check. This keeps tier requirements discoverable
 * and editable from one place.
 */
export const FEATURES = {
  /** Hide ads in-app. Anonymous users and tier1 see ads; tier2+ are ad-free. */
  adFree: { minTier: "tier2" },
  /** Use Enchanted (alternate) art selections in matches. */
  enchantedArt: { minTier: "tier4" },
} as const satisfies Record<string, { minTier: SubscriptionTier }>;

export type FeatureKey = keyof typeof FEATURES;

export function hasFeature(user: AuthUser | null, key: FeatureKey): boolean {
  return hasSubscriptionTier(user, FEATURES[key].minTier);
}

export function getEnabledFeatures(user: AuthUser | null): Set<FeatureKey> {
  const enabled = new Set<FeatureKey>();
  for (const key of Object.keys(FEATURES) as FeatureKey[]) {
    if (hasFeature(user, key)) enabled.add(key);
  }
  return enabled;
}
