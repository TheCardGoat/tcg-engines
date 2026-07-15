import { AuthSessionBootstrap as SharedAuthSessionBootstrap } from "@tcg/simulator-runtime/auth";
import { hydrateAuthStoreFromClientSession, platformAuthClient } from "./auth-store";

export function AuthSessionBootstrap() {
  return (
    <SharedAuthSessionBootstrap
      authClient={platformAuthClient}
      hydrateAuthStoreFromClientSession={hydrateAuthStoreFromClientSession}
    />
  );
}
