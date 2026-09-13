import { useMemo, type ReactNode } from "react";
import type { MatchRuntime, MatchStaticResources } from "@tcg/gundam-engine";

import { createGameStore } from "../../game/store.ts";
import { GundamGameContext } from "../../game/context-internals.ts";
import type { ViewerId } from "../../game/types.ts";
import type { GundamPresentation } from "@tcg/gundam-server-adapter";
import { createSpectatorEngineAdapter } from "./spectatorAdapter.ts";

interface SpectatorGundamGameProviderProps {
  readonly runtime: MatchRuntime;
  readonly staticResources: MatchStaticResources;
  readonly viewerId: ViewerId;
  readonly presentation?: GundamPresentation;
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
  presentation,
  children,
}: SpectatorGundamGameProviderProps) {
  const value = useMemo(() => {
    const adapter = createSpectatorEngineAdapter({
      runtime,
      staticResources,
      viewerId,
      presentation,
    });
    const store = createGameStore(adapter);
    return { adapter, store, viewerId };
  }, [runtime, staticResources, viewerId, presentation]);

  return <GundamGameContext.Provider value={value}>{children}</GundamGameContext.Provider>;
}
