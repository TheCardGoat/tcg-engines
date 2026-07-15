import { useContext, useMemo, type ReactNode } from "react";
import type { MatchRuntime, MatchStaticResources } from "@tcg/gundam-engine";

import { createEngineAdapter } from "./adapter.ts";
import { createGameStore } from "./store.ts";
import { createPendingController } from "./pending.ts";
import type { ViewerId } from "./types.ts";

// Exported context lives in a sibling file so the live-match
// LiveGundamGameProvider can inject its own value (with a
// remote-submit adapter) without duplicating the context object —
// distinct contexts would silently break every `useGundamGame`
// hook inside the live-match tree.
import { GundamGameContext, type GundamGameContextValue } from "./context-internals.ts";

interface GundamGameProviderProps {
  readonly runtime: MatchRuntime;
  readonly staticResources: MatchStaticResources;
  readonly viewerId: ViewerId;
  readonly children: ReactNode;
}

export function GundamGameProvider({
  runtime,
  staticResources,
  viewerId,
  children,
}: GundamGameProviderProps) {
  // No explicit disposal effect: the store owns a long-lived subscription to
  // the runtime, and React's StrictMode would (correctly) simulate an
  // unmount/remount that runs cleanup twice — disposing the store in
  // between and leaving the re-mounted tree listening to a dead store. The
  // store, adapter, pending controller, and runtime all share the provider's
  // lifetime and are GC'd together when the provider truly unmounts.
  const value = useMemo<GundamGameContextValue>(() => {
    const adapter = createEngineAdapter({ runtime, staticResources, viewerId });
    const store = createGameStore(adapter);
    const pending = createPendingController(adapter);
    return { adapter, store, pending, viewerId };
  }, [runtime, staticResources, viewerId]);

  return <GundamGameContext.Provider value={value}>{children}</GundamGameContext.Provider>;
}

export function useGundamGame(): GundamGameContextValue {
  const ctx = useContext(GundamGameContext);
  if (!ctx) throw new Error("useGundamGame must be used inside <GundamGameProvider>");
  return ctx;
}

/**
 * Non-throwing accessor for the game context. Returns `null` when the
 * caller is rendered outside a `<GundamGameProvider>` — useful for
 * pure-UI selectors (e.g. card legality) that need to degrade
 * gracefully in standalone unit-test renders without each test having
 * to spin up a full engine + provider stack.
 */
export function useOptionalGundamGame(): GundamGameContextValue | null {
  return useContext(GundamGameContext);
}
