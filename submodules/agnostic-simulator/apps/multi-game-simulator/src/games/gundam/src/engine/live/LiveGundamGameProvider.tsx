import { useMemo, type ReactNode } from "react";
import type { MatchRuntime, MatchStaticResources } from "@tcg/gundam-engine";
import type { EngineInteractionView } from "@tcg/protocol";

import { createGameStore } from "../../game/store.ts";
import { createPendingController } from "../../game/pending.ts";
import { GundamGameContext } from "../../game/context-internals.ts";
import { createRemoteEngineAdapter, type RemoteSubmitFn } from "./remoteAdapter.ts";
import type { ViewerId } from "../../game/types.ts";

interface LiveGundamGameProviderProps {
  readonly runtime: MatchRuntime;
  readonly staticResources: MatchStaticResources;
  readonly viewerId: ViewerId;
  readonly remoteSubmit: RemoteSubmitFn;
  readonly getInteractionView: () => EngineInteractionView | undefined;
  readonly children: ReactNode;
}

/**
 * Drop-in for {@link GundamGameProvider} that swaps the engine
 * adapter for one whose `submit` ships moves through the live
 * gateway instead of executing them locally.
 *
 * Shares the same {@link GundamGameContext} as the local provider so
 * all existing consumer components (PlayerSeatContainer,
 * PromptContainer, etc.) work unchanged — they pull `adapter` from
 * context and call `submit` as usual; the override is transparent.
 */
export function LiveGundamGameProvider({
  runtime,
  staticResources,
  viewerId,
  remoteSubmit,
  getInteractionView,
  children,
}: LiveGundamGameProviderProps) {
  const value = useMemo(() => {
    const adapter = createRemoteEngineAdapter(
      { runtime, staticResources, viewerId },
      remoteSubmit,
      getInteractionView,
    );
    const store = createGameStore(adapter);
    const pending = createPendingController(adapter);
    return { adapter, store, pending, viewerId };
  }, [runtime, staticResources, viewerId, remoteSubmit, getInteractionView]);

  return <GundamGameContext.Provider value={value}>{children}</GundamGameContext.Provider>;
}
