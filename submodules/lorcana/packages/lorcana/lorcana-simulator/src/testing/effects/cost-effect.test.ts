import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";

describe("Cost effect - an effect where a player pays a cost to apply an effect", () => {
  // Effect type(s): cost-effect, pay-cost (alias)
  //
  // Test cases to cover:
  // 1. cost-effect: player must pay a specified cost for the effect to resolve
  // 2. If player cannot pay the cost, the entire cost-effect is skipped
  // 3. Cost types: discard a card, banish a character, exert a character, pay ink
  // 4. Paying the cost is mandatory if the player chooses to trigger the effect
  // 5. pay-cost alias behaves identically to cost-effect
  // 6. Cost is paid before the effect resolves (cost is not refunded if effect fizzles)
  // 7. Optional cost-effect: player chooses whether to pay; declining skips both cost and effect

  it.todo("It should require the player to pay the specified cost before the effect resolves", () => {});
});
