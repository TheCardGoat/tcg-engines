import { registerAgent, type GameAgent } from "@tcg/agent-core";
import { serializeLorcanaState } from "./state-view";
import { LORCANA_SYSTEM_PROMPT } from "./system-prompt";
import { analyzeLines } from "./tools/analyze-lines";
import { executeMove } from "./tools/execute-move";
import { fallbackToHeuristic } from "./tools/fallback-to-heuristic";

export const LORCANA_AGENT_SLUG = "lorcana" as const;

export const lorcanaAgent: GameAgent = {
  slug: LORCANA_AGENT_SLUG,
  systemPrompt: LORCANA_SYSTEM_PROMPT,
  serializeState: serializeLorcanaState,
  tools: {
    analyzeLines,
    executeMove,
    fallbackToHeuristic,
  },
};

/**
 * Register the Lorcana agent into the global agent registry. Idempotent.
 * Host apps (e.g. game-server) call this at startup alongside their other
 * adapter registrations.
 */
export function registerLorcanaAgent(): void {
  registerAgent(lorcanaAgent);
}
