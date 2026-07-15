import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { theThunderquack } from "@tcg/lorcana-cards/cards/011";

describe("VIGILANTE JUSTICE - The Thunderquack - All opposing characters gain the Villain classification.", () => {
  // Test cases to cover:
  // 1. All opposing characters in play gain the Villain classification while Thunderquack is in play
  // 2. Characters that enter play AFTER Thunderquack also immediately gain Villain
  // 3. YOUR characters are NOT affected (only opposing characters)
  // 4. When Thunderquack is banished, opposing characters lose the added Villain classification
  // 5. Villain-targeting effects can now target all opposing characters
  // 6. An opposing character that already had the Villain classification is unaffected (no issues)

  it.todo("It should give all opposing characters the Villain classification", () => {});
});
