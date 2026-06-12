import { useEffect, type ReactNode } from "react";
import type { SessionResult } from "./platform-session";
import { hydrateAuthStoreFromClientSession } from "./auth-store";

export interface ServerAuthSessionHydratorProps {
  auth: SessionResult | null;
  children: ReactNode;
}

export function ServerAuthSessionHydrator({ auth, children }: ServerAuthSessionHydratorProps) {
  useEffect(() => {
    hydrateAuthStoreFromClientSession({
      data: auth,
      isPending: false,
      error: null,
    });
  }, [auth]);

  return children;
}
