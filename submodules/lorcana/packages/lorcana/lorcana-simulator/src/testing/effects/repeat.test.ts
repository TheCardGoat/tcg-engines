import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";

describe("Repeat effect - an effect that repeats N times", () => {
  // Effect type(s): repeat
  //
  // Test cases to cover:
  // 1. Effect executes exactly N times (static count)
  // 2. Dynamic count (e.g., "repeat for each card in hand"): correct count used at resolution
  // 3. Repeat 0 times: no effect, no error
  // 4. Repeat with targeting: player must pick a new target for each iteration
  // 5. Repeat with same target: same target can be chosen each iteration
  // 6. Count is determined once at resolution start, not re-evaluated each iteration

  it.todo("It should execute the wrapped effect exactly the specified number of times", () => {});
});
