import { registerAgent, type GameAgent } from "@tcg/agent-core";
import { serializeOnePieceState } from "./state-view";
import { ONE_PIECE_SYSTEM_PROMPT } from "./system-prompt";
import { analyzeLines } from "./tools/analyze-lines";
import { executeMove } from "./tools/execute-move";
import { fallbackToHeuristic } from "./tools/fallback-to-heuristic";

export const ONE_PIECE_AGENT_SLUG = "one-piece" as const;

export const onePieceAgent: GameAgent = {
  slug: ONE_PIECE_AGENT_SLUG,
  systemPrompt: ONE_PIECE_SYSTEM_PROMPT,
  serializeState: serializeOnePieceState,
  tools: {
    analyzeLines,
    executeMove,
    fallbackToHeuristic,
  },
};

export function registerOnePieceAgent(): void {
  registerAgent(onePieceAgent);
}
