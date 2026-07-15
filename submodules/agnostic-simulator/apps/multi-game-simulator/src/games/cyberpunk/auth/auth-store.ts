import {
  createAuthSessionStore,
  type AuthClientSessionValue,
  type AuthStoreState,
} from "@tcg/simulator-runtime/auth";
import { authClient } from "./auth-client";
import type { SessionResult } from "./platform-session";

export type AuthData = SessionResult;
export type CyberpunkAuthStoreState = AuthStoreState<AuthData>;

export const platformAuthClient = {
  useSession(): AuthClientSessionValue<AuthData> {
    return toPlatformAuthClientValue(authClient.useSession());
  },
  async getSession(): Promise<AuthClientSessionValue<AuthData>> {
    return toPlatformAuthClientValue(await authClient.getSession());
  },
};

export const {
  getAuthSnapshot,
  subscribeAuthStore,
  useAuthStore,
  hydrateAuthStoreFromClientSession,
  refreshAuthSession,
  primeAuthSession,
  toAuthStoreState,
} = createAuthSessionStore<AuthData>(platformAuthClient);

function toPlatformAuthClientValue(
  value: AuthClientSessionValue<unknown>,
): AuthClientSessionValue<AuthData> {
  return {
    data: value.data as AuthData | null,
    isPending: value.isPending,
    error: value.error,
  };
}
