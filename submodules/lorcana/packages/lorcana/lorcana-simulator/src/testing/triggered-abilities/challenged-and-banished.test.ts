import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { kuzcoTemperamentalEmperor } from "@tcg/lorcana-cards/cards/009";

describe("OH RIGHT, THE POISON - Kuzco, Temperamental Emperor - When this character is challenged and banished, you may banish the challenging character.", () => {
  // Test cases to cover:
  // 1. Triggers when this character is challenged AND banished in the same challenge
  // 2. Does NOT trigger when this character is challenged but survives (takes damage, not banished)
  // 3. Does NOT trigger when this character is banished by a non-challenge effect
  //    (e.g. action card that says "banish chosen character")
  // 4. Trigger fires even if the challenging character would also be banished (mutual kill)
  //    — but then the banish effect has no valid target
  // 5. Trigger is optional ("you may") — player can decline
  // 6. "When" timing means this fires at most once (one-shot, not "whenever")

  it.todo("It should trigger when this character is challenged and banished", () => {});
});
