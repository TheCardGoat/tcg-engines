import { describe, it } from "bun:test";

describe("Count Effect - Counts cards matching criteria and feeds result to downstream effects", () => {
  // Effect type(s): count-effect
  //
  // Test cases to cover:
  // 1. Counts cards in a zone matching a filter (e.g., characters in play)
  // 2. Count of zero produces zero downstream effect (e.g., deal 0 damage)
  // 3. Multiplier applies correctly to the count
  // 4. Count with empty zone returns 0

  it.todo("should count cards matching the filter in the specified zone", () => {});

  it.todo("should produce zero downstream effect when count is zero", () => {});

  it.todo("should apply the multiplier to the counted result", () => {});

  it.todo("should return 0 when the zone is empty", () => {});
});
