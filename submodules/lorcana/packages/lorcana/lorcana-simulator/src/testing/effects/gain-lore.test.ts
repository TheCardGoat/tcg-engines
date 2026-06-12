import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { brunoMadrigalUndetectedUncle } from "@tcg/lorcana-cards/cards/009";

describe("GIFT OF THE MADRIGALS - Bruno Madrigal, Undetected Uncle - If it's the named card, put it into your hand and gain 1 lore.", () => {
  // Effect type(s): gain-lore
  //
  // Test cases to cover:
  // 1. Gain N lore (increments the active player's lore counter)
  // 2. amount field: fixed number (gain 1) vs dynamic expression (gain X where X = number of chars)
  // 3. Reaching 20 lore during resolution triggers a win condition check
  // 4. Fires the `gain-lore` trigger event
  // 5. controller filter: lore goes to the correct player
  // 6. Lore gained does NOT exceed the win threshold (game ends at exactly 20)
  // 7. Multiple gain-lore effects in one turn stack (all counted)

  it.todo("It should increment the player's lore by the specified amount", () => {});
});
