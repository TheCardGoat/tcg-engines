import type { Player } from "./match-init";

/**
 * Payload for matchmaker matched webhook
 */
export type MatchmakerMatchedPayload = {
  type: "MatchmakingMatched";
  nakamaMatchId: string;
  instantGameId: string;
  queue: string;
  players: Array<Player>;
  mode: "best-of-one" | "best-of-two" | "best-of-three";
};
