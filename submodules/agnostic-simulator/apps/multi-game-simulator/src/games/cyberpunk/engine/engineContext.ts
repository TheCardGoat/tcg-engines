import { createContext, useContext } from "react";
import type { EngineInteractionView } from "@tcg/protocol";
import type { PlayerPrompt } from "@tcg/cyberpunk-engine";
import type { EngineContextValue } from "./EngineProvider";
import type { Side } from "./sides";

export const EngineContext = createContext<EngineContextValue | null>(null);

export function useEngine(): EngineContextValue {
  const ctx = useContext(EngineContext);
  if (!ctx) {
    throw new Error("useEngine must be used inside EngineProvider");
  }
  return ctx;
}

/**
 * Non-throwing variant for components that may render outside an EngineProvider
 * (e.g. inside dnd-kit's DragOverlay portal). Returns `null` instead of throwing.
 */
export function useEngineOptional(): EngineContextValue | null {
  return useContext(EngineContext);
}

const IDLE_PROMPT: PlayerPrompt = {
  status: "idle",
  availableMoves: [],
  choice: null,
};

const IDLE_INTERACTION_VIEW: EngineInteractionView = {
  protocolVersion: 1,
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
