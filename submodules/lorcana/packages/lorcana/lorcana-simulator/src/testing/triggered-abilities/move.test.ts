import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { taffytaMuttonfudgeSourSpeedster } from "@tcg/lorcana-cards/cards/005";

describe("SUGAR RUSH - Taffyta Muttonfudge, Sour Speedster - Once per turn, when this character moves to a location, gain 2 lore.", () => {
  // Test cases to cover:
  // 1. Triggers when this character moves to a location
  // 2. Does NOT trigger when opponent's character moves to a location
  // 3. Once-per-turn restriction respected — moving to a second location in the same turn does not trigger again
  // 4. Lore is gained by the controlling player
  // 5. Does NOT trigger when the character is placed into play directly at a location (play, not move)
  // 6. Trigger fires regardless of which location is moved to
  // 7. Trigger fires even if the character was already at a location (moving between locations)

  it.todo("It should trigger when this character moves to a location", () => {});
});
