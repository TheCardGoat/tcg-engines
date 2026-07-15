import { registerAgent, type GameAgent } from "@tcg/agent-core";
import { serializeCyberpunkState } from "./state-view";
import { CYBERPUNK_SYSTEM_PROMPT } from "./system-prompt";
import { analyzeLines } from "./tools/analyze-lines";
import { executeMove } from "./tools/execute-move";
import { fallbackToHeuristic } from "./tools/fallback-to-heuristic";

export const CYBERPUNK_AGENT_SLUG = "cyberpunk" as const;

export const cyberpunkAgent: GameAgent = {
  slug: CYBERPUNK_AGENT_SLUG,
  systemPrompt: CYBERPUNK_SYSTEM_PROMPT,
  serializeState: serializeCyberpunkState,
  tools: {
    analyzeLines,
    executeMove,
    fallbackToHeuristic,
  },
};

export function registerCyberpunkAgent(): void {
  registerAgent(cyberpunkAgent);
}
