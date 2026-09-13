import { createContext, createElement, useContext, useMemo, type ReactNode } from "react";
import type { MatchState, PlayerPrompt } from "@tcg/cyberpunk-engine";
import { INTERACTION_PROTOCOL_VERSION, type EngineInteractionView } from "@tcg/protocol";
import type { EngineContextValue } from "./EngineProvider";
import type { Side } from "./sides";

export const EngineContext = createContext<EngineContextValue | null>(null);
const EnginePresentationStateContext = createContext<MatchState | null>(null);

export function EnginePresentationStateProvider({
  state,
  children,
}: {
  readonly state: MatchState;
  readonly children: ReactNode;
}) {
  return createElement(EnginePresentationStateContext.Provider, { value: state }, children);
}

export function useEngine(): EngineContextValue {
  const ctx = useContext(EngineContext);
  const presentationState = useContext(EnginePresentationStateContext);
  const resolved = useMemo(
    () => (ctx && presentationState ? { ...ctx, matchState: presentationState } : ctx),
    [ctx, presentationState],
  );
  if (!resolved) {
    throw new Error("useEngine must be used inside EngineProvider");
  }
  return resolved;
}

/**
 * Non-throwing variant for components that may render outside an EngineProvider
 * (e.g. inside dnd-kit's DragOverlay portal). Returns `null` instead of throwing.
 */
export function useEngineOptional(): EngineContextValue | null {
  const ctx = useContext(EngineContext);
  const presentationState = useContext(EnginePresentationStateContext);
  return useMemo(
    () => (ctx && presentationState ? { ...ctx, matchState: presentationState } : ctx),
    [ctx, presentationState],
  );
}

const IDLE_PROMPT: PlayerPrompt = {
  status: "idle",
  availableMoves: [],
  choice: null,
};

const IDLE_INTERACTION_VIEW: EngineInteractionView = {
  protocolVersion: INTERACTION_PROTOCOL_VERSION,
  gameSlug: "cyberpunk",
  actorId: "idle",
  stateVersion: 0,
  status: "idle",
  actions: [],
};

// Presentation-only escape hatch for prompt components that still need
// native prompt copy/details not represented in the interaction protocol.
export function useNativePromptPresentation(side: Side): PlayerPrompt {
  const ctx = useContext(EngineContext);
  return ctx ? ctx.prompts[side] : IDLE_PROMPT;
}

export function useEngineInteractionView(side: Side): EngineInteractionView {
  const ctx = useContext(EngineContext);
  return ctx ? ctx.interactionViews[side] : IDLE_INTERACTION_VIEW;
}
