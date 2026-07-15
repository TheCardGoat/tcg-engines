import { hasFeature } from "../auth/features";
import type { AuthUser } from "../auth/types";

export type AdFreeUserState = {
  /** true = user should see ads; false = ad-free; undefined = not yet loaded */
  showAds: boolean | undefined;
  /** true once auth state has been resolved on the client */
  isLoaded: boolean;
};

/**
 * Pure helper: derive ad-free state from the Better Auth user object.
 *
 * SSR: during server render there is no `window`; we return `isLoaded: false`
 * so ad scripts never attempt to mount. The client layout should compute this
 * via `$derived` from the hydrated `authSession`, keeping subscription state
 * consistent between SSR and CSR.
 *
 * Anonymous users and tier1 see ads. tier2+ are ad-free (see FEATURES.adFree).
 */
export function computeAdFreeState(user: AuthUser | null, isLoading: boolean): AdFreeUserState {
  if (typeof window === "undefined") {
    return { showAds: undefined, isLoaded: false };
  }

  if (isLoading) {
    return { showAds: undefined, isLoaded: false };
  }

  return { showAds: !hasFeature(user, "adFree"), isLoaded: true };
}
