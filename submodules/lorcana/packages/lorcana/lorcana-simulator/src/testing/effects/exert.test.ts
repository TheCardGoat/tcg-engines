import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";

describe("Exert effect - an effect that exerts a chosen character", () => {
  // Effect type(s): exert
  //
  // Test cases to cover:
  // 1. Exert the chosen character (character transitions to exerted state)
  // 2. A character that is already exerted: no-op or error (verify behavior)
  // 3. Fires the `exert` trigger event
  // 4. Does NOT grant quest lore (exert-via-effect ≠ quest action)
  // 5. Exerting via effect counts as a "forced exert", not a quest/challenge/sing
  // 6. Exerted character cannot quest, challenge, or sing until readied
  // 7. controller filter: exert applies to the correct target (your own or opponent's character)

  it.todo("It should put the chosen character into the exerted state", () => {});
});
