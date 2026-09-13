import { useMemo, type ReactNode } from "react";
import type { MatchRuntime, MatchStaticResources } from "@tcg/gundam-engine";
import type { EngineInteractionView } from "@tcg/protocol";

import { createGameStore } from "../../game/store.ts";
import { GundamGameContext } from "../../game/context-internals.ts";
import {
  createRemoteEngineAdapter,
  type RemoteSubmitFn,
  type RemoteUndoFn,
} from "./remoteAdapter.ts";
import type { ViewerId } from "../../game/types.ts";
import type { GundamPresentation } from "@tcg/gundam-server-adapter";
import type { LiveAnimationPacket, LiveEngineLogRecord } from "./matchContext.ts";

interface LiveGundamGameProviderProps {
  readonly runtime: MatchRuntime;
  readonly staticResources: MatchStaticResources;
  readonly viewerId: ViewerId;
  readonly remoteSubmit: RemoteSubmitFn;
  readonly remoteUndo: RemoteUndoFn;
  readonly getCanUndo: () => boolean;
  readonly getInteractionView: () => EngineInteractionView | undefined;
  readonly getAnimationPackets: () => readonly LiveAnimationPacket[];
  readonly getEngineLogRecords: () => readonly LiveEngineLogRecord[];
  readonly presentation?: GundamPresentation;
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
  remoteUndo,
  getCanUndo,
  getInteractionView,
  getAnimationPackets,
  getEngineLogRecords,
  presentation,
  children,
}: LiveGundamGameProviderProps) {
  const value = useMemo(() => {
    const adapter = createRemoteEngineAdapter(
      { runtime, staticResources, viewerId, presentation },
      remoteSubmit,
      getInteractionView,
      getAnimationPackets,
      getEngineLogRecords,
      remoteUndo,
      getCanUndo,
    );
    const store = createGameStore(adapter);
    return { adapter, store, viewerId };
  }, [
    runtime,
    staticResources,
    viewerId,
    remoteSubmit,
    remoteUndo,
    getCanUndo,
    getInteractionView,
    getAnimationPackets,
    getEngineLogRecords,
    presentation,
  ]);

  return <GundamGameContext.Provider value={value}>{children}</GundamGameContext.Provider>;
}
