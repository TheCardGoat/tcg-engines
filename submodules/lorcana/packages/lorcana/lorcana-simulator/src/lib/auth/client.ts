/**
 * Better Auth client for the Lorcana Simulator.
 * Provides Discord OAuth authentication integration.
 */

import { createAuthClient } from "better-auth/svelte";
import { getApiOrigin } from "$lib/config/public-url-config.js";
import { adminClient, genericOAuthClient } from "better-auth/client/plugins";
import { sentinelClient } from "@better-auth/infra/client";
import { stripeClient } from "@better-auth/stripe/client";
/**
 * Base URL for the API server.
 * Resolved through the shared public URL config module.
 */
const baseURL = getApiOrigin();

/**
 * Better Auth client instance configured for the General API auth endpoints.
 *
 * The return type is intentionally inferred (not annotated with
 * `ReturnType<typeof createAuthClient>`) so plugin-contributed methods
 * like `signIn.oauth2` and the admin/sentinel helpers stay type-safe.
 */
export const authClient = createAuthClient({
  baseURL,
  fetchOptions: {
    credentials: "include",
  },
  plugins: [
    adminClient(),
    sentinelClient(),
    genericOAuthClient(),
    stripeClient({ subscription: true }),
  ],
});
