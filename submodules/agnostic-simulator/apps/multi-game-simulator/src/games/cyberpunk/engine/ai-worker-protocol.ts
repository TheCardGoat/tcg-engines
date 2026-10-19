import type { AIPlayerDecision, MatchState, PlayerId } from "@tcg/cyberpunk-engine";
import type { CardDefinition } from "@tcg/cyberpunk-types";
import type { WorkerStrategy } from "./ai-worker-strategy";

export interface AiWorkerRequest {
  id: number;
  state: MatchState;
  definitions: CardDefinition[];
  playerId: PlayerId;
  strategy: WorkerStrategy;
  rngSeed: string;
  combatProgression: "automatic" | "manual";
}

export type AiWorkerResponse =
  | { id: number; selection: AIPlayerDecision }
  | { id: number; error: string };
