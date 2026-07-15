import { useMemo, type ReactNode } from "react";
import type { MatchRuntime, MatchStaticResources } from "@tcg/gundam-engine";

import { createGameStore } from "../../game/store.ts";
import { createPendingController } from "../../game/pending.ts";
import { GundamGameContext } from "../../game/context-internals.ts";
import type { ViewerId } from "../../game/types.ts";
import { createSpectatorEngineAdapter } from "./spectatorAdapter.ts";

interface SpectatorGundamGameProviderProps {
  readonly runtime: MatchRuntime;
  readonly staticResources: MatchStaticResources;
  readonly viewerId: ViewerId;
  readonly children: ReactNode;
}

/**
 * Drop-in for `GundamGameProvider` that wires a spectator-only
 * adapter. Shares the same `GundamGameContext` as the local + live
 * providers so every consumer component (PlayerSeatContainer,
 * PromptContainer, etc.) works unchanged — they read `adapter` via
 * context and any accidental click on a control surfaces a
 * `SPECTATOR` submit error toast instead of a state mutation.
 */
export function SpectatorGundamGameProvider({
  runtime,
  staticResources,
  viewerId,
  children,
}: SpectatorGundamGameProviderProps) {
  const value = useMemo(() => {
    const adapter = createSpectatorEngineAdapter({ runtime, staticResources, viewerId });
    const store = createGameStore(adapter);
    const pending = createPendingController(adapter);
    return { adapter, store, pending, viewerId };
  }, [runtime, staticResources, viewerId]);

  return <GundamGameContext.Provider value={value}>{children}</GundamGameContext.Provider>;
}
