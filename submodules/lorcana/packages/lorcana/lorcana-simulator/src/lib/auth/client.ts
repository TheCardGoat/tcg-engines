/**
 * Better Auth client for the Lorcana Simulator.
 * Provides Discord OAuth authentication integration.
 */

import { createAuthClient } from "better-auth/svelte";
import { getApiOrigin } from "$lib/config/public-url-config.js";
import { adminClient, genericOAuthClient } from "better-auth/client/plugins";
import { stripeClient } from "@better-auth/stripe/client";

type AuthClientError = {
  message?: string;
  status?: number;
  statusText?: string;
};

type AuthClientResult<TData = object> = Promise<{
  data?: TData | null;
  error?: AuthClientError | null;
}>;

type LorcanaAuthClient = {
  getSession: () => AuthClientResult<{ user: object; session: object }>;
  signIn: {
    social: (input: {
      provider: "discord";
      callbackURL: string;
      errorCallbackURL: string;
      scopes?: string[];
    }) => AuthClientResult;
    oauth2: (input: {
      providerId: string;
      callbackURL: string;
      errorCallbackURL: string;
    }) => AuthClientResult;
    email: (input: { email: string; password: string }) => AuthClientResult;
  };
  signUp: {
    email: (input: { email: string; password: string; name: string }) => AuthClientResult;
  };
  signOut: () => AuthClientResult;
};

/**
 * Base URL for the API server.
 * Resolved through the shared public URL config module.
 */
const baseURL = getApiOrigin();

/**
 * Better Auth client instance configured for the General API auth endpoints.
 */
export const authClient: LorcanaAuthClient = createAuthClient({
  baseURL,
  fetchOptions: {
    credentials: "include",
  },
  plugins: [adminClient(), genericOAuthClient(), stripeClient({ subscription: true })],
});
