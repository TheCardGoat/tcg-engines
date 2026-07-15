import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { lefouBumbler } from "@tcg/lorcana-cards/cards/001";

describe("LOYAL - LeFou, Bumbler - If you have a character named Gaston in play, you pay 1 {I} less to play this character.", () => {
  // Test cases to cover:
  // 1. Costs 1 less ink to play from hand when you have Gaston in play
  // 2. Full cost is paid when Gaston is NOT in play
  // 3. Only YOUR Gaston counts (controller: "you") — opponent's Gaston does not apply
  // 4. If Gaston is banished before LeFou is played, the discount is lost
  // 5. Cost cannot be reduced below 0 (minimum 0 ink)
  // 6. Applies only when playing from hand (sourceZones: ["hand"])

  it.todo("It should cost 1 less to play when you have a character named Gaston in play", () => {});
});
