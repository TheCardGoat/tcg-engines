import { registerAgent, type GameAgent } from "@tcg/agent-core";
import { serializeGundamState } from "./state-view";
import { GUNDAM_SYSTEM_PROMPT } from "./system-prompt";
import { analyzeLines } from "./tools/analyze-lines";
import { executeMove } from "./tools/execute-move";
import { fallbackToHeuristic } from "./tools/fallback-to-heuristic";

export const GUNDAM_AGENT_SLUG = "gundam" as const;

export const gundamAgent: GameAgent = {
  slug: GUNDAM_AGENT_SLUG,
  systemPrompt: GUNDAM_SYSTEM_PROMPT,
  serializeState: serializeGundamState,
  tools: {
    analyzeLines,
    executeMove,
    fallbackToHeuristic,
  },
};

export function registerGundamAgent(): void {
  registerAgent(gundamAgent);
}
