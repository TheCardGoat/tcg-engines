import type { LocalEngine } from "../transport/local-engine.ts";
import type { PlayerId } from "../types/branded.ts";
import type { DecisionContext } from "./types.ts";

/**
 * Builds the read-only {@link DecisionContext} that strategies and resolvers
 * see. Only public engine surfaces are read — this is the seam that enforces
 * the player-boundary constraint at the call site.
 */
export function buildDecisionContext(
  engine: LocalEngine,
  playerId: PlayerId,
  rng: () => number,
): DecisionContext {
  return {
    view: engine.getFilteredView(playerId),
    playerId,
    prompt: engine.getPrompt(playerId),
    rng,
    engine,
  };
}
