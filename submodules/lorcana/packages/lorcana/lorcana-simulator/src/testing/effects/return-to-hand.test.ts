import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";

describe("Return to hand effect - an effect that returns a character from play to its controller's hand", () => {
  // Effect type(s): return-to-hand
  //
  // Test cases to cover:
  // 1. Return chosen character from play to its controller's hand
  // 2. Fires `leave-play` and `return-to-hand` trigger events
  // 3. Cards under the character: go to discard or follow the character (verify expected behavior)
  // 4. Cannot return a character that is not in play
  // 5. Returns to the CONTROLLER's hand (important when bouncing an opponent's character)
  // 6. Character returned to hand loses all damage and modifications
  // 7. Character can be replayed from hand on a subsequent turn

  it.todo("It should return the chosen character from play to its controller's hand", () => {});
});
