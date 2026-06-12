import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { queenOfHeartsSensingWeakness } from "@tcg/lorcana-cards/cards/002";

describe("QUEEN OF HEARTS - Sensing Weakness - Whenever one of your characters challenges, you may draw a card.", () => {
  // Effect type(s): draw, draw-until, draw-until-hand-size
  //
  // Test cases to cover:
  // 1. Draw N cards from the top of your deck
  // 2. Drawing from an empty deck: no error, draws as many as available (0)
  // 3. Drawing from a partially filled deck: draws only available cards
  // 4. draw-until: keeps drawing until condition is met or deck is empty
  // 5. draw-until-hand-size: draws up to target hand size (stops if already at/above)
  // 6. amount field: fixed number (draw 2) vs dynamic expression (draw X where X = number of chars)
  // 7. Fires the `draw` trigger event for each card drawn
  // 8. controller filter: drawing goes to the correct player's hand

  it.todo("It should draw the specified number of cards from the top of the deck", () => {});
});
