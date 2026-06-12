import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";

describe("Create replacement effect - an effect that replaces one game event with another", () => {
  // Effect type(s): create-replacement-effect, replacement (alias)
  //
  // Test cases to cover:
  // 1. create-replacement-effect: when the replaced event would occur, the replacement fires instead
  // 2. replacement alias behaves identically
  // 3. The original event does NOT occur when replaced (it is fully replaced)
  // 4. Only one replacement applies per event (first one wins or last one — verify precedence)
  // 5. Replacement expires at the defined duration
  // 6. Replacement applies to the correct player/card/event type
  // 7. Nested replacements: replacement B replaces replacement A's event

  it.todo("It should replace the specified game event with an alternative event", () => {});
});
