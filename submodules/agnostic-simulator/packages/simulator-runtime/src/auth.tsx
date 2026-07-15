import { useEffect, useSyncExternalStore } from "react";

export interface AuthStoreState<AuthData> {
  data: AuthData | null;
  isPending: boolean;
  error: Error | null;
}

export interface AuthClientSessionValue<AuthData> {
  data: AuthData | null;
  isPending?: boolean;
  error?: AuthClientError | null;
}

export interface AuthClientError {
  message?: string;
}

export interface AuthSessionClient<AuthData> {
  useSession: () => AuthClientSessionValue<AuthData>;
  getSession: () => Promise<AuthClientSessionValue<AuthData>>;
}

export interface AuthSessionStore<AuthData> {
  getAuthSnapshot: () => AuthStoreState<AuthData>;
  subscribeAuthStore: (listener: () => void) => () => void;
  useAuthStore: () => AuthStoreState<AuthData>;
  hydrateAuthStoreFromClientSession: (value: AuthClientSessionValue<AuthData>) => void;
  refreshAuthSession: () => Promise<void>;
  primeAuthSession: () => Promise<void>;
  toAuthStoreState: (value: AuthClientSessionValue<AuthData>) => AuthStoreState<AuthData>;
}

export function createAuthSessionStore<AuthData>(
  authClient: Pick<AuthSessionClient<AuthData>, "getSession">,
): AuthSessionStore<AuthData> {
  const initialAuthState: AuthStoreState<AuthData> = {
    data: null,
    isPending: true,
    error: null,
  };

  let currentState: AuthStoreState<AuthData> = initialAuthState;
  let sessionPrime: Promise<void> | null = null;
  const listeners = new Set<() => void>();

  function getAuthSnapshot(): AuthStoreState<AuthData> {
    return currentState;
  }

  function subscribeAuthStore(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function useAuthStore(): AuthStoreState<AuthData> {
    return useSyncExternalStore(subscribeAuthStore, getAuthSnapshot, getAuthSnapshot);
  }

  function hydrateAuthStoreFromClientSession(value: AuthClientSessionValue<AuthData>): void {
    setAuthState(toAuthStoreState(value));
  }

  async function refreshAuthSession(): Promise<void> {
    if (typeof window === "undefined") {
      setAuthState({ data: null, isPending: false, error: null });
      return;
    }

    setAuthState({ ...currentState, isPending: true, error: null });
    try {
      hydrateAuthStoreFromClientSession({
        ...(await authClient.getSession()),
        isPending: false,
      });
    } catch (error) {
      setAuthState({
        data: null,
        isPending: false,
        error: error instanceof Error ? error : new Error("Unable to refresh auth session."),
      });
    }
  }

  function primeAuthSession(): Promise<void> {
    if (typeof window === "undefined") {
      return Promise.resolve();
    }

    sessionPrime ??= refreshAuthSession().finally(() => {
      sessionPrime = null;
    });
    return sessionPrime;
  }

  function toAuthStoreState(value: AuthClientSessionValue<AuthData>): AuthStoreState<AuthData> {
    return {
      data: value.data,
      isPending: value.isPending ?? false,
      error: normalizeClientError(value.error ?? null),
    };
  }

  function setAuthState(nextState: AuthStoreState<AuthData>): void {
    currentState = nextState;
    for (const listener of listeners) {
      listener();
    }
  }

  return {
    getAuthSnapshot,
    subscribeAuthStore,
    useAuthStore,
    hydrateAuthStoreFromClientSession,
    refreshAuthSession,
    primeAuthSession,
    toAuthStoreState,
  };
}

export interface AuthSessionBootstrapProps<AuthData> {
  authClient: Pick<AuthSessionClient<AuthData>, "useSession">;
  hydrateAuthStoreFromClientSession: (value: AuthClientSessionValue<AuthData>) => void;
}

export function AuthSessionBootstrap<AuthData>({
  authClient,
  hydrateAuthStoreFromClientSession,
}: AuthSessionBootstrapProps<AuthData>) {
  const session = authClient.useSession();

  useEffect(() => {
    hydrateAuthStoreFromClientSession(session);
  }, [hydrateAuthStoreFromClientSession, session]);

  return null;
}

export function normalizeAuthBaseUrl(apiUrl: string | undefined, fallback: string): string {
  const trimmed = apiUrl?.trim();
  if (!trimmed) {
    return fallback;
  }

  return trimmed.replace(/\/v1\/?$/i, "").replace(/\/$/, "");
}

function normalizeClientError(error: AuthClientError | null): Error | null {
  return error ? new Error(error.message ?? "Auth session request failed.") : null;
}
